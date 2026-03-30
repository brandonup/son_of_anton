# Supabase Async Policy

**Why:** Sync Supabase client calls in async context block the event loop and cause silent failures in production. This is the #1 systemic bug pattern.

**Defect category:** async-supabase

---

## Rules

1. **ALL Supabase client calls inside `async def` methods must use `run_in_executor`:**
   ```python
   await asyncio.get_running_loop().run_in_executor(
       None, lambda: client.table(...).execute()
   )
   ```
2. Never call the sync Supabase client directly in async context.
3. Use `get_running_loop()`, not `get_event_loop()` (deprecated in 3.10+).
4. `run_in_executor` calls must be `await`ed — unawaited calls silently never execute.
5. **Re-verify even if you think you already checked** — this is the most commonly missed item in code review.
