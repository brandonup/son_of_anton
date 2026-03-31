# Son of Anton — Process Map

Last updated: 2026-03-30

This is the single source of truth for how the Son of Anton system works. Every process file, agent, skill, and workflow is documented here with its purpose, dependencies, and relationships. **Update this file whenever the process changes.**

---

## End-to-End Workflow

```
Idea → Spec → Tech Review → Tickets → Implementation → Dev Verify → Review → Done
 │       │        │            │            │               │           │        │
Brandon  Jared  Gilfoyle     Jared       Dinesh          Dinesh     Reviewer  Dinesh
```

### Stage 1: Idea
**Owner:** Brandon
**What happens:** Brandon identifies a feature, product direction, or problem to solve.
**Output:** A conversation or directive to Jared.

### Stage 2: Spec
**Owner:** Jared
**What happens:** Jared writes a PRD or user story set, runs the spec approval checklist (surface inventory, data requirements, cross-reference, no inline DDL), gets Brandon's approval.
**Output:** Approved spec document in `projects/[project]/docs/`.
**Governed by:** `agents/jared.md` § Spec Approval Checklist

### Stage 2b: Technical Review
**Owner:** Gilfoyle (spawned by Jared as subagent)
**What happens:** After Brandon approves a spec, Jared spawns Gilfoyle to review it from a technical feasibility perspective — architecture fit, schema impact, security implications, ADR conflicts, infra dependencies. Gilfoyle returns approval or flags issues that must be resolved before ticket creation.
**Output:** Tech review verdict (approved or issues flagged). ADR updates if needed.
**Governed by:** `agents/gilfoyle.md`, `agents/jared.md` § Spec → Ticket Translation

### Stage 3: Tickets
**Owner:** Jared
**What happens:** After Gilfoyle's tech review passes, Jared translates the approved spec into implementation tickets with done-when criteria, estimates, and priorities. Tickets land in Todo.
**Output:** Linear tickets in Todo queue.
**Governed by:** `agents/jared.md` § Spec → Ticket Translation, `agents/linear-workflow.md`

### Stage 4: Implementation
**Owner:** Dinesh
**What happens:** Dinesh picks highest-priority Todo, moves to In Progress, implements code + tests, runs verification checklist.
**Output:** Working code with tests passing.
**Governed by:** `agents/dinesh.md` § Implementation Flow, § Verification Checklist

### Stage 4b: Dev Environment Verification
**Owner:** Dinesh
**What happens:** After implementation and verification checklist, Dinesh builds the `kinetic-api-dev` Docker image and runs the code against the dev Supabase instance. Migrations are pasted into the dev Supabase SQL Editor and tested first. No code proceeds to review without passing dev verification. This is critical because `git push` auto-deploys to both Railway (API) and Vercel (frontend) — there is no manual deploy gate.
**Output:** Confirmed working feature in dev environment.
**Governed by:** `agents/dinesh.md` § Implementation Flow step 5, `conventions.md` § Environments, `projects/kinetic/docs/environment-architecture.md`

### Stage 5: Review
**Owner:** Reviewer (spawned by Dinesh as subagent)
**What happens:** One-pass code review checking schema, ACL, error handling, async, API contract, tests, field mapping. Returns findings or APPROVED.
**Output:** Review findings list or APPROVED verdict.
**Governed by:** `agents/reviewer.md` § Review Checklist

### Stage 5b: Defect Logging
**Owner:** Dinesh
**What happens:** After fixing Critical reviewer findings, Dinesh logs each one to `projects/[project]/defect-log.md`. This feeds Richard's failure mode analysis pipeline.
**Governed by:** `agents/dinesh.md` § Defect Logging

### Stage 5c: Documentation Updates
**Owner:** Dinesh
**What happens:** Dinesh updates all affected documentation before moving to Done: `db-schema-spec.md` for schema changes, ADRs amended in-place for deviations, API docs for endpoint changes, feature docs for behavior changes, `process.md` for workflow changes, and new gotchas to `dinesh.md` § Known Gotchas.
**Governed by:** `agents/dinesh.md` § Documentation Updates

### Stage 6: Done
**Owner:** Dinesh
**What happens:** Dinesh moves ticket to Done with a comment summarizing what was built and test count.
**Governed by:** `agents/dinesh.md` § Implementation Flow step 8

---

## Bug Workflow

```
Brandon reports bug → /bug skill → Linear ticket (Todo) → Dinesh picks it up → normal flow
```

**Governed by:** `/Users/brandonupchuch/.claude/skills/bug/SKILL.md`

---

## Policy Creation

```
Defect pattern / process friction detected → Richard invokes write-policy skill → Brandon approves → Richard edits the target file
```

**Owner:** Richard (diagnosis + implementation), Brandon (approval)
**Trigger:** A defect category hits 3+ occurrences, a process friction is identified, or Brandon requests a process change.
**Skill:** `write-policy` — gates every policy on evidence (3+ occurrences), uniqueness (no existing rule covers it), and enforceability (pass/fail check). Prevents policy bloat.

**Target files:** `conventions.md`, agent files (`agents/*.md`), `process.md`, skill files.
**Never without approval:** Agent constraint changes, workflow stage changes, security policy changes.

**Governed by:** `agents/richard.md` § Constraints, `projects/kinetic/skills/write-policy.md`

---

## Agents

| Agent | Role | When to use | File |
|---|---|---|---|
| **Dinesh** | Implementation | Building features, fixing bugs, shipping code | `agents/dinesh.md` |
| **Gilfoyle** | Technical review | Pre-implementation spec review, ADR ownership, schema spec ownership | `agents/gilfoyle.md` |
| **Reviewer** | Code review | Spawned automatically by Dinesh — not used standalone | `agents/reviewer.md` |
| **Jared** | Product | Writing specs, creating tickets, answering product questions, sprint planning | `agents/jared.md` |
| **Richard** | Dev process | Velocity analysis, process audits, sprint health, bottleneck diagnosis | `agents/richard.md` |
| **Monica** | AI systems advisor | Architecture advice, eval design, context engineering — advisory only | `agents/monica.md` |

**Archived agents** (available on-demand from `agents/archive/`): BigHead, Jian, Bachman, old-builder.

---

## Process Files — Registry

Every file that governs process behavior, its purpose, and what depends on it.

### Core Config

| File | Purpose | Depended on by |
|---|---|---|
| `CLAUDE.md` | Top-level config: agent list, security rules, session start protocol, skills directories, operating norms | All agents, every session |
| `conventions.md` | Code style, git workflow, doc naming, MEMORY.md rules, testing standards, environment config | All agents that write code or docs |
| `process.md` | This file — process map and dependency registry | Richard (audits), Brandon (reference) |

### Agent Files

| File | Purpose | Depended on by |
|---|---|---|
| `agents/dinesh.md` | Implementation workflow, verification checklist, known gotchas, reviewer spawning | Dinesh sessions, Reviewer (spawned from here) |
| `agents/gilfoyle.md` | Technical review protocol, ADR ownership, schema spec ownership | Gilfoyle sessions, spawned by Jared for spec review |
| `agents/reviewer.md` | Code review protocol and checklist | Reviewer subagent (spawned by Dinesh) |
| `agents/jared.md` | Spec workflow, ticket translation, sprint prep, subagent consultation | Jared sessions, question routing from Dinesh |
| `agents/richard.md` | Board health scan, diagnostic reports, failure mode analysis | Richard sessions |
| `agents/monica.md` | AI systems advisory protocol, independence constraint | Monica sessions |
| `agents/linear-workflow.md` | Shared Linear workflow: status lifecycle, issue format, stop conditions, question routing | All agents that touch Linear (Dinesh, Gilfoyle, Jared, Richard) |

### Memory Files

| File | Purpose | Depended on by |
|---|---|---|
| `agents/dinesh-memory.md` | Implementation gotchas, session learnings | Dinesh (read at session start) |
| `agents/gilfoyle-memory.md` | Architecture patterns, review learnings | Gilfoyle (read at session start) |
| `agents/jared-memory.md` | Product learnings, spec patterns | Jared (read at session start) |
| `agents/richard-memory.md` | Process baselines, trend data, defect patterns | Richard (read at session start) |
| `agents/monica-memory.md` | Research positions, prior advice | Monica (read at session start) |
| `projects/kinetic/MEMORY.md` | Project decisions, implementation status, open questions | All agents working on Kinetic |
| `projects/kinetic/defect-log.md` | Reviewer findings log — feeds Richard's failure mode analysis | Dinesh (writes), Richard (reads) |

### Skills

| Skill | Purpose | Used by |
|---|---|---|
| `linear-automation` | Linear MCP tool configuration and learnings | Dinesh, Gilfoyle, Jared, Richard |
| `bug` | Bug report → Linear ticket flow | Brandon (via `/bug`) |
| `retrospective` | Session-end memory capture, MEMORY.md hygiene, defect analysis | All agents at session end |
| `requesting-code-review` | Prepare code for review handoff | Dinesh (before spawning Reviewer) |
| `receiving-code-review` | Structured code review protocol | Reviewer, Gilfoyle (when starting a review) |
| `dispatching-parallel-agents` | Run independent tickets simultaneously | Dinesh (when 2+ independent Todos exist) |
| `executing-plans` | Execute a written implementation plan | Dinesh |
| `test-driven-development` | TDD workflow | Dinesh |
| `architecture-decision-records` | ADR writing and maintenance | Gilfoyle |
| `brainstorming` | Creative ideation (required before creative work) | Jared |
| `prd-development` | PRD writing workflow | Jared |
| `research` | Web research with citations | Jared, Monica, Richard |
| `write-policy` | Evidence-gated policy drafting (3+ occurrences, no existing rule, enforceable) | Richard |

**Skill stack reference:** `projects/kinetic/research/skill-stack-reference.md` — lookup table of public/internal skills organized by task type. Check when starting a task to see if a skill applies.

---

## Dependency Graph

When you change a file, check its dependents for stale references.

```
CLAUDE.md
├── agents/dinesh.md
│   ├── agents/reviewer.md (spawned from here)
│   ├── agents/dinesh-memory.md
│   └── conventions.md
├── agents/gilfoyle.md
│   ├── agents/gilfoyle-memory.md
│   ├── agents/gilfoyle-handoffs.md
│   └── agents/linear-workflow.md
├── agents/jared.md
│   ├── agents/jared-memory.md
│   ├── agents/gilfoyle.md (spawns Gilfoyle for tech review)
│   └── agents/linear-workflow.md
├── agents/richard.md
│   ├── agents/richard-memory.md
│   ├── agents/linear-workflow.md
│   └── agents/dinesh.md (reads verification checklist for failure mode reports)
├── agents/monica.md
│   └── agents/monica-memory.md
├── conventions.md
├── agents/linear-workflow.md
└── process.md (this file)

Skills (loaded on demand):
├── bug/SKILL.md → uses Linear MCP directly
├── retrospective/skill.md → reads agent memory files, MEMORY.md, dinesh.md § Verification Checklist
├── linear-automation/SKILL.md → configures Linear MCP usage
└── dispatching-parallel-agents → used by dinesh.md
```

---

## Change Protocol

When modifying any process file:

1. **Check the dependency graph above.** Identify all files that reference or depend on the file you're changing.
2. **Update dependents.** If you rename a section header, change an agent name, remove a workflow step, or restructure a file — update every file that references it.
3. **Update this file.** If you add, remove, or rename a process file, update the registry tables and dependency graph above.
4. **Verify with a sweep.** After changes, grep for the old term/name/reference across `agents/`, `conventions.md`, `CLAUDE.md`, and the skills directories to catch stragglers.

---

## Session Lifecycle (All Agents)

```
1. Load agent file (e.g., agents/dinesh.md)
2. Read agent memory file + project MEMORY.md
3. State "Security layers active" (coding sessions)
4. Do work per agent protocol
5. Run /retrospective at session end
```

**Every session loads:** `CLAUDE.md` (automatic) + agent file + memory files.
**Every session ends with:** retrospective skill → memory updates → session summary.

---

## What This File Does NOT Cover

- **Product decisions** — those live in `projects/kinetic/MEMORY.md` and spec documents
- **Architecture decisions** — those live in ADRs (`projects/kinetic/docs/adr-*.md`)
- **Code conventions** — those live in `conventions.md`
- **Security rules** — those live in `CLAUDE.md` § Security
- **Linear board state** — that's live data in Linear, not documented here
