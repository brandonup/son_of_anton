# Migration Testing Policy

**Why:** Migration files are infrastructure code that runs against real databases. Platform-specific limits (HNSW dimension caps, extension availability) are not caught by local testing.

**Defect category:** migration, untested-infra

---

## Rules

1. **Test against the target platform.** If the target is Supabase, run the migration against a real Supabase instance — not just local Postgres.
2. **All dependencies declared in-file.** Every function, extension, or type the migration references must be created in the same file, before first use.
3. **Single-file convention.** One canonical migration file (`000_complete_schema.sql`) creates the entire schema from scratch. Incremental files only for post-launch changes.
4. **Idempotent where possible:** `CREATE ... IF NOT EXISTS`.
5. **No ad-hoc patch files.** When a migration fails, fix the source file — do not create patch files (05a, 05b, 05c).
6. **Run-order documentation.** If multiple files exist, specify exact execution order with prerequisites.
7. **Gilfoyle review gate applies.** Gilfoyle verifies: (a) tested against target platform, (b) no missing dependencies, (c) idempotent.

## Cascading Error Protocol

If the second fix attempt fails, **STOP**. Do not continue fix-forward. Instead:
1. Diagnose all remaining errors at once.
2. Produce a single corrected file.
3. Provide one set of instructions.
