# [Feature Name] — Product Requirements Document

**Status:** Draft | In Review | Approved
**Author:** Jared
**Date:** YYYY-MM-DD
**Project:** [Project Name]

---

## Problem Statement

What user problem does this solve? Who experiences it? How painful is it? What's the current workaround and why is it inadequate?

## Proposed Solution

High-level description of what we're building. Not how — what. One paragraph maximum. If it takes more than a paragraph, the scope isn't clear yet.

## User Stories

- As a [user type], I want to [action] so that [outcome]
- As a [user type], I want to [action] so that [outcome]

## Success Metrics

How do we know this worked? Be specific and measurable. At minimum: one leading indicator (behavior) and one lagging indicator (outcome).

| Metric | Baseline | Target | Timeframe |
|---|---|---|---|
| [Metric name] | [Current value] | [Goal] | [When] |

## Scope

**In scope:** What's included in this version.

**Out of scope:** What we're explicitly not doing and why. Being explicit here prevents scope creep.

## Surface Inventory

Enumerate every concrete artifact this feature requires. Walk each user story end-to-end and list every surface the user touches or the system needs. If a category has zero items, write "None" — do not omit the category.

- **Pages / Views:** [every UI screen, including list pages, detail pages, empty states, settings panels]
- **API Endpoints:** [every route — method, path, purpose]
- **Database Tables:** [every new or modified table — see Data Requirements below]
- **Background Jobs / Cron:** [any async processing, scheduled tasks, webhooks]
- **Integrations:** [any third-party services, OAuth flows, external APIs]

Cross-check: every item in this inventory must map to at least one user story above. Every user story must be reachable through the items listed here. If there's a mismatch, the spec is incomplete.

## Data Requirements

What does this feature need to persist? Answer in plain English — no DDL. Use exact table and column names from `db-schema-spec.md` when referencing existing tables.

- **New tables:** [table name] — what it stores, who can read/write (RLS policy intent)
- **Modified tables:** [table name] — what columns or indexes are added or changed
- **Access patterns:** [who queries what, under what conditions]
- **None** — this feature requires no new or modified tables (confirm explicitly)

If new tables or columns are needed, note: "Update `db-schema-spec.md §X`"

---

## Dependencies

What needs to exist before this can be built? List blockers by type:
- **Technical:** [APIs, infrastructure, third-party services]
- **Product:** [Other features that must ship first]
- **External:** [Vendor, legal, or compliance requirements]

## Decisions Needed

What choices are pending that block this PRD from being finalized? Who needs to make each decision?

| Decision | Owner | Needed By |
|---|---|---|
| [Decision description] | [CEO / Gilfoyle / Jared] | [Date or milestone] |

## Open Questions

What don't we know yet that could affect scope, design, or feasibility?

- [ ] [Question]
- [ ] [Question]
