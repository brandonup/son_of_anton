# Ownership Validation Policy

**Why:** ACL leaks allow cross-tenant data access. Implementers validate the resource exists but miss verifying the path parameter belongs to the current user.

**Defect category:** acl-leak

---

## Rules

1. **Every endpoint with path params** (`company_id`, `agent_id`, `conversation_id`, etc.) **must verify the param belongs to `current_user`** — not just that the resource exists.
2. Use **404 for cross-tenant denials** (anti-enumeration). Never 403.
3. Background jobs must verify conversation/resource ownership before dispatching.
4. `createServerClient()` must always receive `workspaceId` for RLS scoping.
5. Private agent access: owner only. Public agent access: any authenticated user.
6. Compute-only endpoints (no DB read/write of protected data) are exempt from path-param ownership — but the **save endpoint MUST enforce it**.
