# Code Review Handoff Policy

**Why:** Spawning Gilfoyle without pre-verification wastes tokens on reviews guaranteed to be rejected. Schema mismatch is the #1 rejection category.

**Defect categories:** schema-mismatch, error-swallow, async-supabase, acl-leak, snake-camel, migration

---

## HARD GATE — Pass every item before spawning Gilfoyle subagent

1. **Schema cross-reference (MANDATORY):** Open `docs/db-schema-spec.md`. Verify every table name and column name used in your implementation exists exactly as written. Column types and constraints must match.
2. All Supabase calls in `async def` methods use `run_in_executor` wrapper.
3. `createServerClient()` always receives `workspaceId` for RLS scoping.
4. Every field crossing the Python↔TypeScript boundary has correct snake_case/camelCase mapping.
5. Tests pass: count and command included in handoff comment.
6. No `try/except` that returns a default (`None`, `[]`, `False`) on write operations — raise or log-and-raise.
7. All Supabase writes scoped by `workspaceId` for RLS — not just reads.
8. No `await` on sync Supabase calls without `run_in_executor` — re-verify even if you think you already checked.
9. All migration column names, types, and constraints match `docs/db-schema-spec.md`.

## Handoff Comment Requirements

- Post summary + test command + test count before spawning Gilfoyle.
- Verify ticket has an estimate set. If missing, set one now.

## Iteration Limits

- **Gilfoyle review:** 3 rounds max. Unresolved after 3 → stop and report to Brandon.
- **Jìan QA:** 2 rounds max. Unresolved after 2 → stop and report to Brandon.
