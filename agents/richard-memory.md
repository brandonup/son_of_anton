# Richard — Cross-Project Memory

Process baselines, bottleneck patterns, and recommendation outcomes. Updated at session end.

---

<!-- Entries format: - [YYYY-MM-DD] [project] Lesson or baseline -->

_Defect log last analyzed through: 2026-03-28 (full Critical audit)_

_**2026-03-28 process migration:** Multi-agent system (Dinesh, Big Head, Gilfoyle, Jìan, Bachman) collapsed into Builder + Reviewer. Historical entries below reference old agent names — these are baselines from the prior system, retained for trend comparison against the new process._

- [2026-03-24] [kinetic] **Defect pattern: untested-infra — migration files shipped to CEO without platform validation.** 9 fragmented files, missing `set_updated_at` function, HNSW index exceeding Supabase 2000-dim cap, circular cross-file dependencies. Root causes: no migration testing gate, no single-file setup convention, ad-hoc patch files instead of source fixes. Convention added to `conventions.md § Database Migrations`. KIN-360 (consolidated schema) under Gilfoyle review.

- [2026-03-24] [kinetic] **Defect pattern: fix-forward-spiral — agent gave piecemeal SQL fixes instead of stepping back to diagnose.** Each fix surfaced a new error, compounding frustration. Convention added: after second failed fix attempt, stop fix-forward, diagnose all errors, produce single corrected artifact.

- [2026-03-23] [kinetic] **Defect pattern: acl-leak now top category (4 entries, 2026-03-23).** KIN-319 and KIN-327 both missed ownership validation on path params (agent_id, company_id, conversation). Pattern: implementers validate the resource but not that the path param belongs to the current user — a convention gap, not a one-off.

- [2026-03-23] [kinetic] **Defect pattern: error-swallow persists despite existing convention (now 10+ occurrences).** KIN-319 (frontend) and KIN-310 (backend) added new instances. Convention exists in conventions.md and both implementer memory files — but Gilfoyle continues to catch it every sprint. Needs enforcement mechanism, not just documentation.

- [2026-03-23] [kinetic] **Dinesh WIP overload at sprint start: 3 simultaneous In Progress tickets (KIN-309, KIN-311, KIN-319).** All moved to IP on the same day. Pattern to watch: sprint kickoffs without WIP discipline inflate context-switching cost and historically correlate with higher review rejection rates.

- [2026-03-23] [kinetic] **Interaction/workflow split creates systematic Big Head idleness.** UI-heavy sprints starve Big Head — KIN-321–324 (MCP) sat in Backlog while Dinesh had 4 active/upcoming items. Fix: promote Big Head MCP work in parallel (Option A) + horizontal API/UI decomposition for Dinesh tickets (Option B).

- [2026-03-23] [kinetic] **Retrospective skill was missing — agents had no session-end ritual.** Skill referenced in all agent files and CLAUDE.md but SKILL.md didn't exist. Built and shipped 2026-03-23.

- [2026-03-18] [kinetic] **Baseline: review rejection rate = 30%.** Dinesh 28% (5/18 tickets), Big Head 33% (4/12 tickets). KIN-165 (Big Head) was the only 3-round ticket.

- [2026-03-18] [kinetic] **Baseline: estimate coverage = 2.5%.** 2 of 81 Done tickets have estimates. Recent Code Review tickets (KIN-181, KIN-193) have estimates — improvement starting W9.

- [2026-03-18] [kinetic] **Top Critical review categories: async/sync Supabase (5), RLS bypass (4), schema mismatch (3), error swallowing (8+ Important).** Error swallowing not in either implementer memory file — biggest uncaptured pattern.

- [2026-03-18] [kinetic] **Big Head handoff comments missing on KIN-171 and KIN-172.** Process requires summary + test command + test count before Gilfoyle review spawns.

- [2026-03-18] [kinetic] **Decision ticket lag is not a bottleneck.** KIN-147 resolved in 2.5 hours, KIN-188 in 1 hour. Jared question-routing filter is effective.

- [2026-03-18] [kinetic] **Big Head's 0 standalone bug tickets is a tracking gap, not cleaner code.** 33% review rejection rate + only 3-round ticket suggests inline fixing without separate Bug tickets.

- [2026-03-19] [kinetic] **Pipeline stages per feature: 5–7 (spec → tech spec → scaffolding → implement → review → QA).** Gilfoyle pre-spec is redundant for non-architectural features. Target: 3–4 stages.

- [2026-03-19] [kinetic] **Context loading per sprint: ~25K–30K lines of process docs.** ~60% of subagent tokens go to setup, not work. Lean subagent prompts could halve this.

- [2026-03-19] [kinetic] **Serial A→B→C chains add ~2 cycles per multi-part feature.** Horizontal decomposition (data → logic → API) enables parallelism. W9 Custom Agents would have been ~50% faster.

- [2026-03-19] [kinetic] **R1 and R5 are partially mutually exclusive.** Eliminating Gilfoyle pre-spec increases the value of Jìan scaffolding (which catches spec errors). Adopt R5 only if R1 is not adopted.

- [2026-03-19] [kinetic] **Token baseline: ~55K-65K lines process overhead per sprint.** Base context per session: ~1,100 lines. Per Gilfoyle subagent: ~1,300 lines. W11: 14 subagent spawns consumed ~18K lines of base context alone.

- [2026-03-19] [kinetic] **MEMORY.md is a growing liability: 199 lines / 140 entries / 51KB.** Loaded by every session + subagent. ~80% of entries are historical. Needs archival to stay under 80 lines.

- [2026-03-19] [kinetic] **conventions.md has ~40-50% redundancy.** Supabase async, error handling, snake_case mapping, Linear labels, issue lifecycle — all duplicated in agent files or linear-workflow.md. ~90 lines removable.

- [2026-03-22] [kinetic] **Baseline: Sprint 1 (Cycle 1) completion rate = 91.7% (22/24).** 2 carryovers, both Big Head (KIN-201, KIN-202), both Custom Agents Part C. Root cause: mid-sprint scope additions to in-progress ticket.

- [2026-03-22] [kinetic] **Estimate coverage improved to 27.6% (21/76 Done).** Dinesh 43%, Big Head 38%, Jìan 33%, Gilfoyle 0%, Jared 0%. Improvement from 2.5% baseline — norm establishing organically. Target for Sprint 2: 70%+ on implementation tickets.

- [2026-03-22] [kinetic] **Carryover baseline: 8.3% (2/24), 100% Big Head.** Both from mid-sprint scope additions. Watch for repeat pattern. Decision KIN-220 (scope question) archived without resolution.

- [2026-03-22] [kinetic] **Review doc coverage: 1 of 16 Gilfoyle reviews have a doc in reviews/.** KIN-244 only. 15 prior reviews exist in Linear only. Decision pending with Brandon on whether review docs are required for all reviews or only Complex-tier.

- [2026-03-22] [kinetic] **Sprint 2 board state at pivot: clean.** 0 In Progress, 0 Code Review, 2 Todo (Jìan QA stubs), 5 Backlog (4 archived old-project, 1 active). No cycle created yet. Codebase not bootstrapped — first implementation tickets not yet written.

- [2026-03-28] [kinetic] **Context bloat audit: session load per agent ranges 1,058–1,202 lines.** Dinesh 1,202, Big Head 1,194, Gilfoyle 1,104, Jared 1,191, Jìan 1,077, Bachman 1,058, Richard 1,162. Shared overhead (CLAUDE.md + conventions + linear-workflow + MEMORY.md) = ~930 lines per session.

- [2026-03-28] [kinetic] **Root cause of status-change failures: procedural rules buried at 52%+ position.** "Move to In Progress" appears 6 times across 2 files but all instances sit past line 82 of 347 (linear-workflow.md) and line 127 of 245 (dinesh.md). Reference tables (MCP tools, field definitions) occupy the high-attention top of files. Session Start instructions are at the midpoint of both files.

- [2026-03-28] [kinetic] **MEMORY.md still at 205 lines (was 199 on 2026-03-19).** No archival implemented despite prior recommendation. Key Decisions Locked alone is 85 lines. Loaded by every agent + every subagent.

- [2026-03-28] [kinetic] **Duplicate tickets detected: KIN-402/403 and KIN-395/396.** Two identical pairs in Backlog. Process gap: no dedup check on ticket creation.

- [2026-03-28] [kinetic] **Process mode shift: feature dev → bug-hunt.** Brandon entering "use the app and fix bugs" phase. Added Bug Fix Mode + Review Tiering to dinesh.md. Key change: fix first, file to Linear after; skip Reviewer for small fixes (<20 lines, single file).

- [2026-03-28] [kinetic] **Critical defect audit: 5 of 41 Critical findings still unresolved in codebase.** (1) bytes.fromhex on bytea — crashes BYOK decryption (KIN-307/306, conversations.py, user_keys.py, linked_upload.py, agents.py). (2) Sequence race — count-then-insert in conversations.py:1267 + generation.py (KIN-385). (3) "now()" literal string in mcp.py:138 (KIN-325). (4) Fire-and-forget run_in_executor — 5 instances in generation.py + mcp.py (KIN-388). (5) 403 vs 404 in non-MCP routes — AuthorizationError → 403 in errors.py (KIN-324). Items 1-3 are user-visible.

- [2026-03-28] [kinetic] **Defect log totals: 123 entries, 41 Critical.** Top categories: other (30), test-missing (18), error-swallow (18), spec-gap (17), api-contract (12), schema-mismatch (11), acl-leak (10). Defect rate declining — most entries from pre-2026-03-25 sprints.

- [2026-03-29] [kinetic] **5 policies added to dinesh.md § Verification Checklist.** (1) Frontend error handling — catch blocks must show user feedback, not silent console.error (6+ occurrences). (2) Ownership check ordering — must be first DB query before business logic (4+ occurrences). (3) Non-atomic read-modify-write — must use transaction or single UPDATE with WHERE (3+ occurrences). (4) Timestamp "now()" literal — use datetime.utcnow().isoformat(), not string (2 occurrences, Critical severity). (5) Fire-and-forget run_in_executor — must await or ensure_future (3+ occurrences).

- [2026-03-28] [kinetic] **Stale Backlog: 5 tickets recommended for Cancel.** KIN-220 (unresolved Decision, archived), KIN-202/201 (Big Head, archived agent), KIN-180 (Gilfoyle W9 review, archived agent), KIN-160 (Slack pagination, not MVP scope). Pending Brandon approval.
