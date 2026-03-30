# Policy Index

Consult this file when creating `[Dinesh]` or `[Big Head]` implementation tickets. Add the relevant policies to the ticket's `**Policies:**` field.

---

## Universal Policies (include on EVERY implementation ticket)

| Policy | File | Prevents |
|---|---|---|
| Status Management | `status-management.md` | process-violation |
| Code Review Handoff | `code-review-handoff.md` | schema-mismatch, error-swallow |

---

## Task-Specific Policies

| Policy | File | Prevents | When to Include |
|---|---|---|---|
| Error Handling | `error-handling.md` | error-swallow | Any ticket writing try/except, API endpoints, error boundaries |
| Schema Validation | `schema-validation.md` | schema-mismatch | Any ticket referencing or creating DB tables |
| Supabase Async | `supabase-async.md` | async-supabase | Any ticket with async Python + Supabase calls |
| Ownership Validation | `ownership-validation.md` | acl-leak | Any ticket with path params, new endpoints, background jobs |
| Field Mapping | `field-mapping.md` | snake-camel | Any ticket crossing the Python↔TypeScript boundary |
| Migration Testing | `migration-testing.md` | migration | Any ticket including SQL migration files |

---

## Ticket Description Format

Add this field to every implementation ticket description:

**Policies:** status-management, code-review-handoff, [task-specific policies]

Example for a ticket creating a new API endpoint with a DB migration:

**Policies:** status-management, code-review-handoff, error-handling, schema-validation, ownership-validation, field-mapping, migration-testing

---

## Defect Category Coverage

| Defect Category | Policy |
|---|---|
| schema-mismatch | schema-validation, code-review-handoff |
| error-swallow | error-handling, code-review-handoff |
| acl-leak | ownership-validation |
| async-supabase | supabase-async, code-review-handoff |
| snake-camel | field-mapping |
| migration | migration-testing |
| untested-infra | migration-testing |
| rls-bypass | ownership-validation |
| api-contract | error-handling, field-mapping |
| spec-gap | (Gilfoyle review process — not a coding policy) |
| test-missing | code-review-handoff |
