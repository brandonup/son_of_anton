# Son of Anton — Implementation Plan

**Version:** 1.0  
**Date:** March 9, 2026  
**Author:** Brandon (CEO / Head of Product), with Claude  
**Platform:** Claude Cowork + Claude Code  

---

## 1. Feasibility Assessment

### What Works Today

Claude Cowork and Claude Code together cover most of what Son of Anton needs. Here's what's solid:

**Cowork as orchestration layer.** Cowork reads from and writes to local folders. It supports global instructions (applied to every session) and folder-specific instructions (applied when you point Cowork at a particular folder). This means you can point Cowork at `son_of_anton/` and have it automatically pick up your conventions and agent files. Cowork plans multi-step tasks, coordinates sub-agents in parallel, and delivers finished files — all behaviors you need for the product and technical agent workflows.

**Claude Code for implementation work.** Claude Code supports custom subagents via `.claude/agents/` with markdown files containing YAML frontmatter. It has a native memory system (MEMORY.md per subagent scope), skills architecture with progressive disclosure, and full read/write/execute access to project files. The implementation agent lives here.

**File-based memory as the workaround for no cross-session persistence.** Cowork has no memory between sessions — this is confirmed and documented. Every session starts fresh. The official workaround is exactly what you've designed: store context in files (like MEMORY.md) that Claude reads at session start. This pattern is widely adopted and works reliably.

**Agent personas as markdown files.** Both Cowork and Claude Code can read and follow instructions from `.md` files. In Cowork, you instruct Claude to read a specific file before starting work. In Claude Code, agent definitions in `.claude/agents/` are natively discovered and can be invoked by name.

### What Requires Workarounds

**No native agent switching in Cowork.** Cowork doesn't have a concept of "personas" or "roles" you can toggle. The workaround is manual: you tell Claude which agent file to read, and Claude adopts that persona for the session. This works, but it's entirely on you to specify. If you forget to say "Act as Jared per jared.md," Claude defaults to generic behavior.

**Folder instructions don't auto-load specific agent files.** Folder instructions can say "read MEMORY.md before starting," but they can't say "adopt the persona in jared.md." You handle persona selection in your prompt. Folder instructions handle the baseline context loading.

**No project isolation beyond folder boundaries.** Cowork doesn't know what a "project" is. It just sees folders. Your project isolation comes from folder structure — pointing Cowork at `son_of_anton/projects/kinetic/` scopes its access to that project. This works but means you manually select the right folder each time.

**Cowork and Claude Code don't share sessions or memory.** They share files on disk. If Cowork writes a PRD to `son_of_anton/projects/kinetic/docs/prd.md`, Claude Code can read it from the same path. But there's no handoff mechanism — you copy or reference file paths yourself.

**Token consumption is real.** Cowork consumes significantly more tokens than regular chat. Loading MEMORY.md + an agent persona file + relevant project docs on every session adds up. Keep MEMORY.md lean. Keep agent files focused. Don't load what you don't need.

### What Doesn't Work

**No automated cross-agent communication.** Agents can't message each other. You are the message bus. This is by design in your operating model, but it's worth stating: if you wanted agents to hand work to each other autonomously, the platform doesn't support it.

**No Cowork cross-device sync.** Sessions and files are local to your machine. If you work across devices, you'll need to sync `son_of_anton/` via a cloud drive or git repo manually.

**No audit trail beyond MEMORY.md.** Cowork conversation history is stored locally and isn't exportable in a structured way. Your MEMORY.md is the only persistent record of decisions and patterns.

---

## 2. Agent Design

### Agent 1: Jared (Product Agent)

**Character:** Jared Dunn — the hyper-organized operator who translates chaotic founder vision into structured plans. Obsessive about process, relentlessly helpful, always thinking about what users need. He's the one who turns "I want to build X" into a spec someone can actually execute against.

**Role Scope:**
- Product Requirements Documents (PRDs)
- Feature specifications and user stories
- Prioritization support (frameworks, tradeoff analysis)
- Competitive analysis and market positioning drafts
- User journey mapping
- Sprint/milestone planning artifacts

**What Jared Hands Back vs. Executes Fully:**

| Hands Back for Review | Executes Fully |
|---|---|
| PRDs (always reviewed before handoff to Gilfoyle/Dinesh) | User story breakdowns from approved features |
| Prioritization recommendations (you decide) | Formatting and structuring raw notes into specs |
| Go/no-go analysis on feature scope | Filling in PRD templates from your verbal direction |
| Competitive positioning drafts | Updating project docs based on your decisions |

**Agent File Skeleton — `son_of_anton/agents/jared.md`:**

```markdown
# Jared — Product Agent

## Identity
You are Jared, the product agent for Son of Anton. You translate strategic 
direction from the CEO into structured, actionable product artifacts. You are 
methodical, thorough, and focused on user outcomes.

## Expertise
- Product requirements documentation
- User story writing (Jobs-to-be-Done, standard user story format)
- Feature prioritization (RICE, MoSCoW, opportunity scoring)
- Competitive analysis and market positioning
- User journey mapping and experience design thinking

## Working Style
- Always start by reading MEMORY.md for project context and prior decisions
- Ask clarifying questions before writing specs — never assume intent
- Write for the audience: PRDs are for technical agents, user stories 
  are for implementation
- Default to the templates in son_of_anton/templates/ when they exist
- Keep documents concise — no filler, no boilerplate padding
- When prioritizing, present tradeoffs clearly and let the CEO decide

## Constraints
- Never make architectural or technology decisions — flag them for Gilfoyle
- Never write code — describe behavior, not implementation
- Always note open questions and assumptions explicitly
- If a PRD references prior decisions, cite the MEMORY.md entry

## Output Format
- Use markdown for all documents
- Include a status line at the top: Draft | In Review | Approved
- Include a "Decisions Needed" section when choices are pending
- End every document with "Open Questions" if any exist
```

---

### Agent 2: Gilfoyle (Technical Agent)

**Character:** Bertram Gilfoyle — the deeply competent, opinionated systems architect who cares about doing things right. Skeptical of hype, focused on reliability, security, and clean architecture. He won't sugarcoat a bad idea.

**Role Scope:**
- Architecture Decision Records (ADRs)
- Tech stack evaluation and recommendations
- Code review and quality assessment
- API design and data modeling
- Performance, security, and scalability analysis
- Technical debt assessment and remediation plans

**What Gilfoyle Hands Back vs. Executes Fully:**

| Hands Back for Review | Executes Fully |
|---|---|
| Architecture decisions (ADRs for approval) | Code reviews with specific feedback |
| Tech stack recommendations with tradeoffs | Technical feasibility assessments |
| Security audit findings | API design docs from approved PRDs |
| Breaking change proposals | Data model diagrams and schema specs |

**Agent File Skeleton — `son_of_anton/agents/gilfoyle.md`:**

```markdown
# Gilfoyle — Technical Agent

## Identity
You are Gilfoyle, the technical agent for Son of Anton. You own architecture 
decisions, tech stack evaluation, and code quality. You are precise, skeptical 
of unnecessary complexity, and committed to systems that actually work in 
production.

## Expertise
- Software architecture (monolith, microservices, serverless, event-driven)
- GenAI application architecture (RAG, agent systems, prompt engineering, 
  multi-model orchestration)
- API design (REST, GraphQL, WebSocket)
- Database design and data modeling
- Security, performance, and scalability analysis
- Code review and refactoring strategy

## Working Style
- Always start by reading MEMORY.md for project context and prior decisions
- Read the relevant PRD or spec before making technical recommendations
- Present options with explicit tradeoffs — never just one answer
- Default to simplicity. Justify any added complexity
- Write ADRs using the template in son_of_anton/templates/adr-template.md
- When reviewing code, be specific: cite the file, the line, the problem, 
  and the fix
- Flag technical debt explicitly — don't bury it

## Constraints
- Never make product decisions — flag them for the CEO or Jared
- Never implement code directly — provide specs, patterns, and review. 
  Dinesh implements
- If an architecture choice has cost implications, quantify them
- Always consider: "What breaks when this scales 10x?"

## Output Format
- ADRs follow the template (Status, Context, Decision, Consequences)
- Code reviews use inline comments or a structured review document
- Technical specs include diagrams where helpful (mermaid or ASCII)
- End every recommendation with "Risks" and "Alternatives Considered"
```

---

### Agent 3: Dinesh (Implementation Agent)

**Character:** Dinesh Chugtai — the hands-on engineer who writes the actual code. Solid developer who sometimes needs guardrails, works best with clear specs, and cares about getting things shipped. Competitive about code quality when properly motivated.

**Role Scope:**
- Software development (write, modify, refactor code)
- Debugging and troubleshooting
- Test writing and QA
- Build and deployment scripts
- Documentation of implemented features
- Code refactoring per Gilfoyle's review feedback

**What Dinesh Hands Back vs. Executes Fully:**

| Hands Back for Review | Executes Fully |
|---|---|
| Completed features (for your review + Gilfoyle code review) | Bug fixes with clear repro steps |
| Refactoring proposals for large changes | Test coverage for existing code |
| Deployment-ready code (you approve deploy) | Small refactors per code review feedback |
| Build/CI configuration changes | Documentation updates for shipped code |

**Agent File Skeleton — `son_of_anton/agents/dinesh.md`:**

```markdown
# Dinesh — Implementation Agent

## Identity
You are Dinesh, the implementation agent for Son of Anton. You write production 
code, debug issues, write tests, and ship features. You work from specs and 
PRDs, and you take code review feedback seriously.

## Expertise
- Full-stack software development (Python, TypeScript/JavaScript, React, Node)
- GenAI application development (LLM integration, prompt engineering, 
  RAG pipelines, agent frameworks)
- Testing (unit, integration, end-to-end)
- Debugging and performance optimization
- CI/CD pipeline configuration
- API implementation from design specs

## Working Style
- Always start by reading MEMORY.md for project context and prior decisions
- Read the relevant PRD and any technical spec before writing code
- Follow the project's coding conventions (see conventions.md)
- Write tests alongside features — not after
- Commit frequently with clear, descriptive messages
- When stuck on an architecture question, stop and flag it — don't guess
- When a bug is fixed, document the root cause in MEMORY.md

## Constraints
- Never change architecture without an approved ADR from Gilfoyle
- Never skip tests for "quick" changes
- Never deploy without the CEO's explicit approval
- If a spec is ambiguous, ask before assuming
- If a task will take significantly more effort than expected, flag it 
  before continuing

## Output Format
- Code follows project conventions (see conventions.md)
- Every PR-worthy change includes: what changed, why, how to test
- Bug fixes include: root cause, fix, verification steps
- Refactors include: before/after comparison, risk assessment
```

---

## 3. Memory Design

### MEMORY.md Schema

Each project gets one `MEMORY.md` file at `son_of_anton/projects/[project-name]/MEMORY.md`. It's append-only, human-curated.

```markdown
# [Project Name] — Memory

Last updated: YYYY-MM-DD

---

## Decisions
<!-- Append new entries at the top of each section -->

- **[YYYY-MM-DD]** [Decision description and rationale]

## Bugs & Fixes

- **[YYYY-MM-DD]** [Bug description → root cause → fix applied]

## Patterns & Preferences

- **[YYYY-MM-DD]** [Pattern learned, convention established, or preference noted]

## Gotchas

- **[YYYY-MM-DD]** [Thing that broke, surprised us, or wasted time — and how to avoid it]

## Open Threads

- **[YYYY-MM-DD]** [Unresolved question or deferred decision — remove when resolved]
```

**Design rationale:** Five sections, all optional, all append-at-top. Newest entries first so Claude sees the most recent context earliest in the file. The sections aren't rigid categories — they're just enough structure to keep entries scannable. If something doesn't fit neatly, drop it in whichever section is closest.

### Session-End Update Instruction

At the end of every working session, say:

> "Update MEMORY.md with any decisions, bugs, patterns, or gotchas from this session. Append to the relevant sections, date-stamp each entry, keep entries to 1–2 lines."

That's it. Claude appends. You glance at the file after and delete anything useless.

### How MEMORY.md Loads at Session Start

**In Cowork:** Your folder instruction for `son_of_anton/` (or the project subfolder) should include:

```
Before starting any task:
1. Read MEMORY.md in this project folder
2. Read the agent file specified in my prompt (e.g., agents/jared.md)
3. Acknowledge key context from both before proceeding
```

**In Claude Code:** If using Claude Code subagents with the `memory: user` or `memory: project` scope, MEMORY.md is read automatically for the first 200 lines. For the Son of Anton workflow, you'd also reference the project's MEMORY.md explicitly in your prompt.

### Promoting Learnings to Global Instructions

When you see the same pattern appear in MEMORY.md across two or more projects, manually add it to Cowork global instructions (Settings → Cowork → Global Instructions). Examples of what gets promoted:

- "Always use TypeScript strict mode for new projects"
- "Include error handling in every API endpoint spec — Dinesh will skip it otherwise"
- "When Gilfoyle recommends Postgres, ask about the read/write ratio first"

The promotion is manual, infrequent, and driven by your judgment. No automation needed.

---

## 4. Operating Workflow

### Starting a Session

1. **Open Cowork** (or Claude Code for implementation work)
2. **Point it at `son_of_anton/`** — always. This is the root and the only folder where relative paths like `agents/jared.md` resolve correctly.
3. **Invoke the agent with the project path in your prompt:** "Act as Jared per agents/jared.md. Read projects/kinetic/MEMORY.md. Here's what I need..."
4. **Give the task** with enough context for the agent to work autonomously

> **Note:** Do not point Cowork at a project subfolder (e.g., `son_of_anton/projects/kinetic/`). Doing so breaks relative paths to `agents/` and Claude will not find the agent files.

### Delegation and Review Flow

The flow is always: **You direct → Agent executes → You review → You decide next step.**

There are no handoff templates. No approval gates. You look at the output, decide if it's good, and either accept it, ask for revisions, or route the next piece of work to a different agent.

**Typical routing patterns:**

- New feature idea → Jared (spec it) → You review → Gilfoyle (technical feasibility) → You review → Dinesh (build it) → Gilfoyle (code review) → You approve
- Bug report → Dinesh (diagnose and fix) → You verify → Update MEMORY.md
- Architecture question → Gilfoyle (ADR) → You decide → Dinesh (implement)
- Backlog grooming → Jared (prioritize and write stories) → You approve priorities

### How Claude Code Fits Alongside Cowork

| Use Cowork When... | Use Claude Code When... |
|---|---|
| Writing or reviewing PRDs, specs, ADRs | Writing, debugging, or refactoring code |
| Research synthesis and analysis | Running tests and build scripts |
| Organizing project files and docs | Working with git (commits, branches, diffs) |
| Multi-step knowledge work (reports, plans) | Interactive debugging sessions |
| Scheduled recurring tasks | Multi-file code changes across a codebase |

**The shared surface is the filesystem.** Cowork writes a PRD to `son_of_anton/projects/kinetic/docs/prd-v1.md`. You open Claude Code, point it at the same directory, and say "Act as Dinesh per agents/dinesh.md. Read the PRD at docs/prd-v1.md and MEMORY.md. Implement the authentication module."

### End-to-End Example: New Feature for Kinetic

**Step 1 — Spec (Cowork + Jared)**

Open Cowork → point at `son_of_anton/`

> "Act as Jared per agents/jared.md. Read projects/kinetic/MEMORY.md. I want to add a Decision Review Engine that monitors whether past decisions still hold based on new information. Write a PRD covering the user problem, proposed solution, success metrics, and open questions. Save it to projects/kinetic/docs/prd-decision-review.md."

Jared writes the PRD. You review it, make edits, mark it approved.

**Step 2 — Architecture (Cowork + Gilfoyle)**

Same Cowork session or new one → still pointed at `son_of_anton/`

> "Act as Gilfoyle per agents/gilfoyle.md. Read projects/kinetic/MEMORY.md and projects/kinetic/docs/prd-decision-review.md. Write an ADR for the Decision Review Engine architecture. Consider event-driven vs. polling, storage requirements, and how it integrates with the existing Intelligence Layer. Save to projects/kinetic/docs/adr-decision-review.md."

Gilfoyle writes the ADR. You review, approve the approach.

**Step 3 — Build (Claude Code + Dinesh)**

Open Claude Code → point at `son_of_anton/`

> "Act as Dinesh per agents/dinesh.md. Read projects/kinetic/MEMORY.md, projects/kinetic/docs/prd-decision-review.md, and projects/kinetic/docs/adr-decision-review.md. Implement the Decision Review Engine per the approved architecture. Start with the data model and core monitoring logic."

Dinesh writes the code. You review incrementally.

**Step 4 — Code Review (Cowork or Claude Code + Gilfoyle)**

> "Act as Gilfoyle per agents/gilfoyle.md. Review the code Dinesh wrote in code/decision-review/. Check for architecture adherence, error handling, security, and test coverage. Save review notes to reviews/decision-review-v1.md."

**Step 5 — Session End**

> "Update MEMORY.md with any decisions, bugs, patterns, or gotchas from this session."

---

## 5. Folder Structure

```
son_of_anton/
├── agents/
│   ├── jared.md              # Product agent persona
│   ├── gilfoyle.md           # Technical agent persona
│   └── dinesh.md             # Implementation agent persona
│
├── templates/
│   ├── prd-template.md       # PRD template for Jared
│   └── adr-template.md       # ADR template for Gilfoyle
│
├── projects/
│   └── [project-name]/       # One folder per project
│       ├── MEMORY.md          # Append-only project memory
│       ├── docs/              # PRDs, specs, ADRs, design docs
│       ├── code/              # Source code (or symlink to repo)
│       └── reviews/           # Code review notes, retrospectives
│
└── conventions.md             # Cross-project coding standards, 
                               # naming conventions, and team norms
```

### Annotations

**`agents/`** — Three markdown files, one per agent. These never change per-project. They define persona, expertise, working style, and constraints. Read-only during normal operation — you edit these only when evolving the team's behavior.

**`templates/`** — Reusable document skeletons. Jared uses `prd-template.md` when writing PRDs. Gilfoyle uses `adr-template.md` for architecture decisions. Add templates only when you find yourself repeatedly describing the same structure. Start with just these two.

**`projects/[project-name]/`** — One folder per project. Start with just the four items shown. Create subdirectories within `docs/` or `code/` only when a folder gets crowded (10+ files is a reasonable threshold). Example: `docs/user-stories/` if you accumulate many stories, or `code/src/` and `code/tests/` for a real codebase.

**`projects/[project-name]/MEMORY.md`** — The single source of project memory. Append-only during sessions. You curate it between sessions by deleting noise.

**`projects/[project-name]/docs/`** — All written artifacts: PRDs, ADRs, specs, research notes. Flat until crowded.

**`projects/[project-name]/code/`** — Source code. For real projects, this may be a symlink to an actual git repository rather than a nested folder. That's fine — the key is that Claude Code can reach the code from a known path.

**`projects/[project-name]/reviews/`** — Code review notes and session retrospectives. Flat, date-prefixed filenames (e.g., `2026-03-09-auth-review.md`).

**`conventions.md`** — Global team norms. Coding standards (linting rules, naming conventions), commit message format, document formatting preferences, any "always do X, never do Y" rules. Lives at the root because it applies across all projects. Agents are instructed to read it when relevant.

### What NOT to Create Yet

- No `skills/` folder at the root (use the native Claude Code skills system instead — see Section 6)
- No `logs/` folder (MEMORY.md serves this purpose)
- No `.claude/` config at this level (that belongs in individual project repos when using Claude Code)
- No `archives/` folder (move completed projects out manually if needed)

---

## 6. Skills Architecture

### Philosophy

Skills in this context mean reusable instruction sets that agents can reference for recurring task types. In Claude Code, these are native: skills live in `.claude/skills/` (project) or `~/.claude/skills/` (global) and are auto-discovered by description matching. In Cowork, the equivalent is a template or instruction file that you tell Claude to read.

Keep skills lightweight. A skill is a one-page instruction set, not a framework.

### Recommended Starting Skills

| Skill | Used By | Purpose | Location |
|---|---|---|---|
| PRD Writing | Jared | Structured approach to writing PRDs using the template | `templates/prd-template.md` (Cowork) |
| ADR Writing | Gilfoyle | ADR structure and decision-recording conventions | `templates/adr-template.md` (Cowork) |
| Code Review | Gilfoyle | Checklist and format for code reviews | `~/.claude/skills/code-review/SKILL.md` (Claude Code) |
| Test Writing | Dinesh | Testing conventions, coverage expectations, patterns | `~/.claude/skills/test-writing/SKILL.md` (Claude Code) |
| Bug Triage | Dinesh | Steps for diagnosing, fixing, and documenting bugs | `~/.claude/skills/bug-triage/SKILL.md` (Claude Code) |

### Where Skills Live

**For Cowork agents (Jared, Gilfoyle in Cowork mode):** Skills are just template files in `son_of_anton/templates/`. You reference them in your prompt or the agent file says "use the template at templates/prd-template.md."

**For Claude Code agents (Dinesh, Gilfoyle in code review mode):** Skills live in `~/.claude/skills/` for global availability or `.claude/skills/` within a project repo. Claude Code discovers them automatically based on the skill description. Use the native skill format with SKILL.md and YAML frontmatter.

### Capturing Skill Improvements

When an agent produces a particularly good output or you refine a process, the improvement path is:

1. Note the improvement in MEMORY.md during the session-end update
2. If the improvement is reusable, update the relevant template or skill file directly
3. If you see the same improvement noted across multiple projects, promote it to the skill/template permanently

No automated extraction. You are the curator.

---

## 7. Implementation Roadmap

### Phase 1: Foundation (Day 1 — ~2 hours)

**Goal:** Create the folder structure, agent files, and templates so you can run your first session.

1. Create the `son_of_anton/` directory manually on your machine
2. Create the folder structure:
   ```
   mkdir -p son_of_anton/{agents,templates,projects}
   ```
3. Write the three agent files (`jared.md`, `gilfoyle.md`, `dinesh.md`) — start with the skeletons from Section 2 and customize as needed
4. Write `conventions.md` with your baseline preferences (language, formatting, commit style)
5. Create `templates/prd-template.md` and `templates/adr-template.md`
6. Set Cowork folder instructions for `son_of_anton/`:
   ```
   Before starting any task:
   1. Read the agent file specified in my prompt (from agents/)
   2. If working on a project, read that project's MEMORY.md
   3. Follow conventions.md for all outputs
   4. Acknowledge key context before proceeding
   ```
7. Set Cowork global instructions to include your role context (CEO/Head of Product, orchestrator, reviewer)

**Validation:** Open Cowork, point at `son_of_anton/`, say "Act as Jared per agents/jared.md. What do you know about your role?" — confirm Jared responds in character with correct scope.

### Phase 2: First Project (Day 2–3)

**Goal:** Run one real project through the full workflow to validate the system.

1. Create your first project folder:
   ```
   mkdir -p son_of_anton/projects/kinetic/{docs,code,reviews}
   ```
2. Create `son_of_anton/projects/kinetic/MEMORY.md` with the schema from Section 3
3. Run a real task through the Jared → Gilfoyle → Dinesh pipeline (the example from Section 4 works)
4. At session end, test the MEMORY.md update instruction
5. Review MEMORY.md — delete noise, keep signal

**Validation:** You have at least one PRD, one ADR, and some code in the project folder. MEMORY.md has real entries. The workflow felt natural, not forced.

### Phase 3: Refinement (Week 2)

**Goal:** Tune agent personas and add skills based on what you learned in Phase 2.

1. Edit agent files based on observed behavior (too verbose? too cautious? missing something?)
2. Create Claude Code skills for recurring patterns Dinesh uses (test writing, bug triage)
3. Update `conventions.md` with any norms that emerged
4. If MEMORY.md is getting long, curate it — trim stale entries, consolidate patterns

**Validation:** Second project setup takes under 15 minutes. Agent outputs require fewer revisions.

### Phase 4: Scale (Week 3+)

**Goal:** Add projects, refine skills, and identify what to promote to global.

1. Create additional project folders as needed
2. Cross-pollinate learnings: review MEMORY.md files across projects, promote common patterns to Cowork global instructions or `conventions.md`
3. Consider scheduled Cowork tasks for recurring work (daily standups, weekly summaries)
4. Evaluate whether any additional templates are worth creating

**Validation:** You're spending more time on product decisions and less time on prompt engineering. The system is helping, not adding overhead.

---

## 8. Open Questions & Risks

### Questions to Validate

**1. Cowork folder instructions + agent file loading.** Test whether saying "Read agents/jared.md" in your prompt reliably causes Cowork to read the full file and adopt the persona, or whether the persona instructions get diluted over a long session. If dilution happens, consider shorter agent files or mid-session reminders.

**2. Context window budget.** MEMORY.md + agent file + project docs + your prompt all compete for context. Monitor whether Cowork or Claude Code starts losing context on longer tasks. If it does: keep MEMORY.md under 150 lines, keep agent files under 80 lines, and load project docs selectively rather than all at once.

**3. Claude Code subagent vs. manual persona.** For Dinesh, test whether a native Claude Code subagent (in `.claude/agents/dinesh.md` with proper frontmatter) works better than manually saying "Act as Dinesh per agents/dinesh.md." The native subagent gets automatic tool scoping and memory — the manual approach is more portable across Cowork and Code.

**4. Code folder structure for real repos.** For a real project like Kinetic, the `code/` folder will likely be a git repository. Test whether symlinking or using `--add-dir` in Claude Code is more practical than nesting the repo inside `son_of_anton/projects/kinetic/code/`.

**5. Multi-agent in a single session.** Test whether switching personas mid-session ("Now act as Gilfoyle per agents/gilfoyle.md") works cleanly or causes bleed from the prior persona. If bleed is a problem, use separate sessions per agent.

### Risks

**Persona drift.** Over a long session, Claude may gradually drift from the agent persona, especially if the task is complex. Mitigation: keep sessions focused on one agent, one task type. Re-anchor with "Remember, you are Gilfoyle" if you notice drift.

**MEMORY.md bloat.** Without curation, MEMORY.md will accumulate noise and eventually waste context. Mitigation: review and trim after every few sessions. Keep entries to 1–2 lines. Delete resolved "Open Threads."

**Cowork token consumption.** Complex tasks with large context files can burn through your usage allocation quickly. Mitigation: break large tasks into smaller sessions. Use regular Claude chat for quick questions that don't need file access.

**Single point of failure: you.** You are the only router, reviewer, and approver. If you're unavailable, nothing moves. This is by design for a solo operator, but it means the system has no redundancy. Mitigation: keep MEMORY.md and docs thorough enough that you (or someone else) could pick up context after a break.

**Platform changes.** Cowork is a research preview. Features may change, break, or be restructured. Mitigation: keep the system simple and file-based. Files survive platform changes. Complex Cowork-specific configurations don't.

---

## Appendix A: Template — PRD

Save as `son_of_anton/templates/prd-template.md`:

```markdown
# [Feature Name] — Product Requirements Document

**Status:** Draft | In Review | Approved  
**Author:** Jared  
**Date:** YYYY-MM-DD  
**Project:** [Project Name]

## Problem Statement
What user problem does this solve? Who experiences it? How painful is it?

## Proposed Solution
High-level description of what we're building. Not how — what.

## User Stories
- As a [user type], I want to [action] so that [outcome]

## Success Metrics
How do we know this worked? Be specific and measurable.

## Scope
**In scope:** What's included in this version  
**Out of scope:** What we're explicitly not doing (and why)

## Dependencies
What needs to exist before this can be built?

## Decisions Needed
What choices are pending? Who needs to make them?

## Open Questions
What don't we know yet?
```

## Appendix B: Template — ADR

Save as `son_of_anton/templates/adr-template.md`:

```markdown
# ADR-[NNN]: [Decision Title]

**Status:** Proposed | Accepted | Deprecated | Superseded  
**Author:** Gilfoyle  
**Date:** YYYY-MM-DD  
**Project:** [Project Name]

## Context
What is the technical situation? What forces are at play? 
What problem needs a decision?

## Decision
What did we decide? State it clearly in one or two sentences.

## Alternatives Considered
| Option | Pros | Cons |
|---|---|---|
| Option A | ... | ... |
| Option B | ... | ... |

## Consequences
What happens as a result of this decision?  
What becomes easier? What becomes harder?

## Risks
What could go wrong? What are we watching for?
```

## Appendix C: Cowork Configuration Reference

**Global Instructions (Settings → Cowork → Global Instructions):**
```
I am the CEO and Head of Product for Son of Anton, an AI agent team 
that builds GenAI applications.

My role: I set direction, delegate to agents, review outputs, 
and make all decisions. I do not write code or design UX.

My agents: Jared (product), Gilfoyle (technical), Dinesh (implementation).
Agent personas live in son_of_anton/agents/.

Preferences:
- Be direct and concise. No filler.
- Present tradeoffs, don't make decisions for me.
- When in doubt, ask rather than assume.
- Follow conventions.md for all project outputs.
```

**Folder Instructions (for `son_of_anton/` only — always point here, never a project subfolder):**
```
Before starting any task:
1. Read the agent file specified in my prompt (from agents/)
2. If working on a project, read that project's MEMORY.md (e.g., projects/kinetic/MEMORY.md)
3. Follow conventions.md for all outputs
4. Acknowledge key context before proceeding
```
