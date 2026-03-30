# Field Mapping Policy

**Why:** No automatic serialization layer exists between Python and TypeScript. Every unmapped field is a silent bug at the API boundary.

**Defect category:** snake-camel

---

## Rules

1. Python uses `snake_case` (`workspace_id`). TypeScript uses `camelCase` (`workspaceId`).
2. **Every field crossing the BFF boundary must be manually mapped.** There is no automatic conversion.
3. Watch SSE events especially: `session_id` vs `sessionId`, `message_id` vs `messageId`.
4. When adding a new field to an API response, verify the TypeScript consumer maps it correctly.
5. When reviewing, check every field in API responses and SSE payloads for case consistency.
