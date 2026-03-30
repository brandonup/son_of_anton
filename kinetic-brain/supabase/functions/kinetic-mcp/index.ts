/**
 * Kinetic Remote MCP Server — Supabase Edge Function Entry Point (KIN-433).
 *
 * Hono app implementing MCP Streamable HTTP transport (JSON-RPC 2.0).
 * Fully stateless — new server context per request. No subscriptions.
 *
 * Auth: Bearer mcp_<token> → user_id
 * Tools: 5 tools via tools.ts
 * Prompts: Dynamic per-user via prompts.ts
 *
 * Spec: docs/specs/remote-mcp-server-spec.md, Step 7
 */

import { Hono } from "hono";
import { createClient } from "@supabase/supabase-js";
import { authenticate } from "./auth.ts";
import { TOOL_DEFINITIONS, executeTool } from "./tools.ts";
import { listPrompts, getPrompt } from "./prompts.ts";

// ---------------------------------------------------------------------------
// Supabase client (uses auto-injected env vars)
// ---------------------------------------------------------------------------

function getSupabase() {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
  }
  return createClient(url, key);
}

// ---------------------------------------------------------------------------
// MCP Protocol Constants
// ---------------------------------------------------------------------------

const MCP_PROTOCOL_VERSION = "2025-03-26";
const SERVER_INFO = {
  name: "kinetic-mcp",
  version: "1.0.0",
};

// ---------------------------------------------------------------------------
// JSON-RPC helpers
// ---------------------------------------------------------------------------

interface JsonRpcRequest {
  jsonrpc: "2.0";
  id?: string | number | null;
  method: string;
  params?: Record<string, unknown>;
}

function jsonRpcResponse(id: string | number | null, result: unknown): Response {
  return new Response(
    JSON.stringify({ jsonrpc: "2.0", id, result }),
    { headers: { "Content-Type": "application/json" } }
  );
}

function jsonRpcError(
  id: string | number | null,
  code: number,
  message: string
): Response {
  return new Response(
    JSON.stringify({
      jsonrpc: "2.0",
      id,
      error: { code, message },
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}

// ---------------------------------------------------------------------------
// MCP method handlers
// ---------------------------------------------------------------------------

async function handleMcpMethod(
  method: string,
  params: Record<string, unknown>,
  userId: string,
  supabase: ReturnType<typeof createClient>
): Promise<unknown> {
  switch (method) {
    case "initialize":
      return {
        protocolVersion: MCP_PROTOCOL_VERSION,
        capabilities: {
          tools: {},
          prompts: {},
        },
        serverInfo: SERVER_INFO,
      };

    case "notifications/initialized":
      // Client acknowledgment — no response needed
      return null;

    case "tools/list":
      return { tools: TOOL_DEFINITIONS };

    case "tools/call": {
      const toolName = params.name as string;
      const toolArgs = (params.arguments || {}) as Record<string, unknown>;

      if (!toolName) {
        throw { code: -32602, message: "Missing tool name" };
      }

      try {
        const result = await executeTool(supabase, userId, toolName, toolArgs);
        return {
          content: [{ type: "text", text: result }],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return {
          content: [{ type: "text", text: message }],
          isError: true,
        };
      }
    }

    case "prompts/list": {
      const prompts = await listPrompts(supabase, userId);
      return { prompts };
    }

    case "prompts/get": {
      const promptName = params.name as string;
      if (!promptName) {
        throw { code: -32602, message: "Missing prompt name" };
      }

      const prompt = await getPrompt(supabase, userId, promptName);
      if (!prompt) {
        throw { code: -32602, message: `Prompt '${promptName}' not found` };
      }

      return prompt;
    }

    case "ping":
      return {};

    default:
      throw { code: -32601, message: `Method not found: ${method}` };
  }
}

// ---------------------------------------------------------------------------
// Hono app
// ---------------------------------------------------------------------------

const app = new Hono();

/**
 * POST / — MCP Streamable HTTP transport.
 * Receives JSON-RPC request, authenticates, dispatches to MCP handler.
 */
app.post("/", async (c) => {
  const supabase = getSupabase();

  // Authenticate
  let userId: string;
  try {
    const authResult = await authenticate(c.req.raw, supabase);
    userId = authResult.userId;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Authentication failed";
    return jsonRpcError(null, -32000, message);
  }

  // Parse JSON-RPC request
  let rpcRequest: JsonRpcRequest;
  try {
    rpcRequest = await c.req.json<JsonRpcRequest>();
  } catch {
    return jsonRpcError(null, -32700, "Parse error: invalid JSON");
  }

  if (rpcRequest.jsonrpc !== "2.0" || !rpcRequest.method) {
    return jsonRpcError(
      rpcRequest.id ?? null,
      -32600,
      "Invalid request: missing jsonrpc version or method"
    );
  }

  const id = rpcRequest.id ?? null;
  const params = rpcRequest.params || {};

  // Notifications (no id) get 202 Accepted
  if (id === null || id === undefined) {
    // Still process the method (e.g., notifications/initialized) but don't send result
    try {
      await handleMcpMethod(rpcRequest.method, params, userId, supabase);
    } catch {
      // Notifications don't get error responses
    }
    return new Response(null, { status: 202 });
  }

  // Dispatch to MCP handler
  try {
    const result = await handleMcpMethod(rpcRequest.method, params, userId, supabase);
    return jsonRpcResponse(id, result);
  } catch (err) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      "message" in err
    ) {
      const rpcErr = err as { code: number; message: string };
      return jsonRpcError(id, rpcErr.code, rpcErr.message);
    }
    const message = err instanceof Error ? err.message : "Internal error";
    return jsonRpcError(id, -32603, message);
  }
});

/**
 * GET / — SSE endpoint for server-initiated events.
 * Stateless server — no subscriptions, return 405.
 */
app.get("/", (c) => {
  return c.json(
    {
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: "This server is stateless and does not support SSE subscriptions. Use POST for MCP requests.",
      },
    },
    405
  );
});

/**
 * OPTIONS / — CORS preflight for cross-origin MCP clients.
 */
app.options("/", (c) => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
});

// ---------------------------------------------------------------------------
// Serve
// ---------------------------------------------------------------------------

Deno.serve(app.fetch);
