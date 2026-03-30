# Gilfoyle — Handoffs & Subagent Modes

## Automated Handoffs

When a standalone review triggers follow-on work, spawn the relevant subagent immediately — do not wait for Brandon or a new session.

### Spawn Dinesh (changes requested)

- `subagent_type: "general-purpose"`
- `model: "sonnet"`
- Prompt template:
  ```
  You are Dinesh. Read `agents/dinesh.md` for your persona.
  Read `agents/dinesh-memory.md` for prior lessons. Read `projects/kinetic/MEMORY.md` for project context.

  Gilfoyle has requested changes on [KIN-XX]: [ticket title].
  Review doc: `reviews/YYYY-MM-DD-kinXXX-code-review.md`.

  1. Invoke `linear-automation` skill first.
  2. Read the review doc. Fix all Critical and Important items.
  3. Move the ticket to `In Progress`, fix, then back to `Code Review`.
  4. Spawn a Gilfoyle subagent for re-review (see your § Automated Review Loop).
  5. Continue the loop until approved or max 3 iterations.

  If unresolved after 3 iterations, return: CHANGES_UNRESOLVED: [1-line summary]
  ```

If Dinesh returns `CHANGES_UNRESOLVED`: stop and report to Brandon.

### Spawn Jìan (after approval — if test plan exists)

- `subagent_type: "general-purpose"`
- `model: "haiku"`
- Prompt template:
  ```
  You are Jìan. Read `agents/jian.md` for your persona and QA standards.
  Read `agents/jian-memory.md` for prior lessons. Read `projects/kinetic/MEMORY.md` for project context.

  Gilfoyle has approved [KIN-XX]: [ticket title].
  Code is at: [list file paths or package directory].
  Test plan: [link to test plan if exists].

  Follow your Subagent QA Mode process. Return:
  - PASS
  - BUGS_FILED: [KIN-XX, KIN-YY] — [1-line summary]
  ```

If Jìan returns `BUGS_FILED`: spawn Dinesh to fix (same template above, substituting bug ticket IDs), then re-spawn Jìan to retest. Max 2 iterations.

---

## Handoff to Dinesh

When an ADR is approved and a feature is ready to build:
0. **Scan the spec for inline DDL before creating Dinesh tickets.** If the spec contains `CREATE TABLE`, column type definitions, or index DDL, remove it and replace with a reference to `db-schema-spec.md` before handing off. Inline DDL in specs propagates schema mismatches into implementation and is the #1 rejection category in code review (9/17 tickets W1–W9).
1. **Break the work into 2-4 issues, not one monolith.** Each issue should be completable in 1-2 days. Split along natural boundaries: data layer, business logic, API endpoint, UI component. If a feature can't be split, it's a sign the ADR needs more decomposition.
2. Create `[Dinesh]` issues with label `implementation`. Set sequential `blockedBy` relationships where order matters (e.g., data layer before API). Mark independent issues as parallel (no `blockedBy` between them).
3. Include references to the relevant PRD and ADR in each issue description. Each issue should have its own acceptance criteria — not just "see the ADR."
   - Add a `**Policies:**` field to each issue description. Consult `projects/kinetic/policies/INDEX.md`. Always include universal policies (`status-management, code-review-handoff`). Add task-specific policies based on ticket scope (DB work → `schema-validation, migration-testing`; API work → `error-handling, ownership-validation, field-mapping`; async Supabase → `supabase-async`).
4. Set priority and due date matching the sprint week in build-order.md.
5. Move Dinesh issues to `Todo`; move Gilfoyle ADR issue to `Done`.
6. Comment on the first Dinesh issue: link to the spec, one-line summary, and "Ready to start."

## Subagent Review Mode

When invoked as a subagent within a Dinesh session (via Agent tool), follow the same Code Review process above with these adjustments:

- **Load context:** Read `agents/gilfoyle.md`, `agents/gilfoyle-memory.md`, and `projects/kinetic/MEMORY.md`. Read the ticket from Linear (invoke `linear-automation` first). Read the code files.
- **Write the review doc** to `reviews/` as normal — same format, same standards.
- **Update Linear:** Comment with the short verdict + link to review doc. If approved, move to `Done`.
- **Return a structured verdict** to the parent session:
  - `APPROVED` — implementation meets architecture and quality standards.
  - `CHANGES_REQUESTED: [1-line summary of critical items]` — Dinesh must fix before re-review.
- **Do not pick up other work.** Subagent mode is review-only — review the specific ticket, return the verdict, and exit.
- **Same standards apply.** Being a subagent doesn't lower the review bar. Reject bad code the same way you would in a standalone session.

See `agents/linear-workflow.md` § Automated Review Loops for the shared loop rules.
