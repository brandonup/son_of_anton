# Gilfoyle — Cross-Project Memory

Transferable technical lessons learned across projects. Updated when Brandon says "remember this" or "add that to your memory."

---

<!-- Entries format: - [YYYY-MM-DD] [project] Lesson learned -->

- 2026-03-31 — [kinetic] **When a "Spike" ticket's done-when criteria are implementation deliverables, the spike is already done — retitle as implementation and hand to Dinesh.** The design section of the ticket IS the spike output. Don't strip done-when to match the spike label; update the label to match reality. Applied to KIN-454.
- 2026-03-31 — [kinetic] **Cross-check migration bootstrap files against individual migrations and `000_complete_schema.sql`.** KIN-455 ticket listed 006 and 008 as individual steps, but both were already in 000. Also missed `mcp_check_and_increment_rate_limit` RPC (lives in `supabase/migrations/`, not `migrations/`). The `dev_bootstrap.sql` file was the correct consolidated source — always verify it exists before reviewing a manual migration order.
- 2026-03-28 — **`mcp__save_comment` and `mcp__save_issue` work fine in sandbox.** Prior memory (2026-03-26) said they were blocked — confirmed incorrect. Post Linear comments and move tickets directly.
- 2026-03-23 — **FastAPI BackgroundTasks run after the full response completes — including SSE streams.** "Concurrently" in specs means non-blocking, not truly parallel. Register `background_tasks.add_task(...)` in the route handler body before `return StreamingResponse(...)`, not inside the async generator. The task fires after the stream closes — correct for fire-and-forget writes (trace logging, audit, cache invalidation).
- 2026-03-23 — **Check Linear comments before starting a code review.** KIN-308 was in Code Review; started reading code, then discovered R1 review already existed with unresolved findings. Wasted time. Always: fetch comments first → if prior review exists and code is unchanged → spawn fix subagent immediately, don't re-review.
- 2026-03-19 — **Sprint-level meta-review tickets catch cross-session gaps.** KIN-193 was moved to Done by a background fix agent but never got a formal Gilfoyle re-review (context compacted). KIN-196 (W10 meta-review) caught it. Always create one umbrella review ticket per sprint week.
- 2026-03-18 — **Verify ticket claims about missing infrastructure before creating it.** KIN-191 said "zero test files in packages/app/" — directory was actually `packages/web/` with 52 test files, Vitest config, and RTL already installed. Checking first saved a full spike.
- 2026-03-18 — **Mark stale/duplicate tickets immediately when found during board scan.** Catching KIN-186 (dup of KIN-185) and KIN-126 (dup of KIN-180) prevents future sessions from picking up dead work.
- 2026-03-17 — **Never ask "want me to pick up X next?" — follow the workflow.** Code Review first, then Todo by priority. The session protocol is deterministic; asking breaks autonomy and wastes Brandon's time. Got corrected once — don't repeat.
- 2026-03-17 — **Cross-reference inline DDL against the canonical schema during code review.** Specs written early may define `CREATE TABLE` statements that diverge from `db-schema-spec.md` (different table names, column names, constraints). Test plans that inherit these propagate the error to implementation. Always check table references against the single-source schema spec.

