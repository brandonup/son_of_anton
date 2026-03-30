# Error Handling Policy

**Why:** error-swallow is the most common defect category. Silent swallows on write operations mask data loss.

**Defect category:** error-swallow

---

## Rules

1. **Never `return None/[]/False` in a `try/except` on write operations** — raise or log-and-raise instead. Silent swallowing on state-changing operations (DB writes, API mutations, file operations) masks data loss.
2. **Read-path fail-open is acceptable** when documented with a comment: returning `[]` on a failed search is OK.
3. **Every `except` block must contain a log statement** before any `return` or `pass`. No exceptions.
4. Use structured logging (JSON format in production).
5. Every API endpoint needs explicit error handling with meaningful status codes and messages.
6. **Supabase-specific:** `bytes.fromhex()` must never be called on bytea columns returned by Supabase — they arrive as `bytes`, not hex strings.

## Review Enforcement

- Gilfoyle must specifically audit error handling in every code review.
- Check every `try/except`, `.catch()`, and error boundary.
- Flag any silent swallow as a **Critical** defect.
