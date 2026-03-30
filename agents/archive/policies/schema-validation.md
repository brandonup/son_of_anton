# Schema Validation Policy

**Why:** schema-mismatch is the #1 defect category by volume. Inline DDL in specs diverges from the canonical schema and propagates wrong table/column names into implementation.

**Defect category:** schema-mismatch

---

## Rules

1. Before submitting any code that creates or references tables, **verify ALL table names, column names, and constraints against `docs/db-schema-spec.md`**.
2. `docs/db-schema-spec.md` is the single source of truth — inline DDL in specs may diverge.
3. Never copy `CREATE TABLE` statements from feature specs into implementation — reference tables by name and link to `db-schema-spec.md`.
4. If a spec contains inline DDL that conflicts with the schema spec, the schema spec wins. Flag the discrepancy.
5. When adding new tables or columns, update `db-schema-spec.md` first, then implement.
