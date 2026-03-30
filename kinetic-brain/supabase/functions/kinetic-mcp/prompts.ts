/**
 * Dynamic MCP Prompt Registration — KIN-433.
 *
 * Generates per-request MCP prompts from user's agents + public agents.
 * Each agent becomes a discoverable slash command (e.g., /nate, /maya).
 *
 * Spec: docs/specs/remote-mcp-server-spec.md, Step 5
 */

import { SupabaseClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface McpPrompt {
  name: string;
  description: string;
}

export interface McpPromptMessage {
  role: "user";
  content: { type: "text"; text: string };
}

export interface McpPromptResult {
  description: string;
  messages: McpPromptMessage[];
}

// ---------------------------------------------------------------------------
// Prompt body template (from spec Step 5)
// ---------------------------------------------------------------------------

function buildPromptBody(agentName: string, slug: string): string {
  return `Assemble context for ${agentName} by calling these tools in parallel:

Group 1 (no arguments needed):
- Call get_agent_persona with agent: "${slug}" — returns the agent's system prompt
- Call get_active_memory with agent: "${slug}" — returns recent memory entries

Group 2 (pass the user's message as query):
- Call select_framework with agent: "${slug}", query: "<user message>" — returns a matching reasoning framework
- Call search_knowledge_base with agent: "${slug}", query: "<user message>" — returns relevant knowledge base content

Wait for all 4 tools to return, then:
1. Adopt the persona from get_agent_persona completely — reason and respond as this agent.
2. Use active memory as conversation context. Reference prior interactions naturally.
3. If a framework matched, use it as your internal reasoning lens. Do not name or present it to the user.
4. If KB content matched, draw on it to ground your reasoning. Cite source documents naturally.
5. If any layer returned empty, proceed without it — do not mention missing layers.`;
}

// ---------------------------------------------------------------------------
// Agent queries
// ---------------------------------------------------------------------------

interface AgentInfo {
  name: string;
  slug: string;
  description: string | null;
  instructions: string | null;
}

/**
 * Fetch all agents visible to a user: own agents + public agents.
 * Deduplicates by slug (own takes precedence over public).
 */
async function fetchVisibleAgents(
  supabase: SupabaseClient,
  userId: string
): Promise<AgentInfo[]> {
  // User's own agent instances
  const { data: ownInstances } = await supabase
    .from("agent_instances")
    .select("agent_definition_id")
    .eq("user_id", userId);

  const ownDefIds = (ownInstances || []).map(
    (i: { agent_definition_id: string }) => i.agent_definition_id
  );

  let ownAgents: AgentInfo[] = [];
  if (ownDefIds.length > 0) {
    const { data } = await supabase
      .from("agent_definitions")
      .select("name, slug, description, instructions")
      .in("id", ownDefIds);
    ownAgents = (data || []) as AgentInfo[];
  }

  // Public agents
  const { data: publicData } = await supabase
    .from("agent_definitions")
    .select("name, slug, description, instructions")
    .eq("visibility", "public");

  const ownSlugs = new Set(ownAgents.map((a) => a.slug));
  const publicAgents = ((publicData || []) as AgentInfo[]).filter(
    (a) => !ownSlugs.has(a.slug)
  );

  return [...ownAgents, ...publicAgents];
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * List MCP prompts for the authenticated user.
 * Each agent becomes a prompt — name = slug, description from agent.
 */
export async function listPrompts(
  supabase: SupabaseClient,
  userId: string
): Promise<McpPrompt[]> {
  const agents = await fetchVisibleAgents(supabase, userId);

  return agents.map((a) => ({
    name: a.slug,
    description:
      a.description ||
      (a.instructions ? a.instructions.split("\n")[0].slice(0, 200) : `Agent: ${a.name}`),
  }));
}

/**
 * Get a specific prompt by name (slug).
 * Returns the orchestration template that tells the LLM how to use the 4 tools.
 */
export async function getPrompt(
  supabase: SupabaseClient,
  userId: string,
  promptName: string
): Promise<McpPromptResult | null> {
  const agents = await fetchVisibleAgents(supabase, userId);
  const agent = agents.find((a) => a.slug === promptName);

  if (!agent) {
    return null;
  }

  const description =
    agent.description ||
    (agent.instructions ? agent.instructions.split("\n")[0].slice(0, 200) : `Agent: ${agent.name}`);

  return {
    description,
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: buildPromptBody(agent.name, agent.slug),
        },
      },
    ],
  };
}
