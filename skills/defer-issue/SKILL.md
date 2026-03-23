---
name: defer-issue
description: "Defer a flagged issue, gap, or inconsistency to the backlog. Use this skill whenever the user writes 'defer' (alone or as 'defer this', 'defer that', 'post-mvp this') in response to any issue, gap, inconsistency, or problem surfaced in a review, analysis, or planning session. Creates a Linear ticket and adds a [DEFERRED] callout block inline in the relevant product doc so future agents don't re-flag it. Triggers on: 'defer', 'defer this', 'defer that', 'backlog this', 'post-mvp this'."
---

# Defer Issue

When the user responds "defer" to a surfaced issue, capture it as a deliberate, documented deferral: create a Linear ticket and mark the relevant doc with a `[DEFERRED]` callout so future agents don't re-flag it as a new problem.

---

## Why this matters

Without the callout, every future agent that reads the doc will re-surface the same issue. The `[DEFERRED]` block is the signal that says: "we know, it's tracked, move on." The Linear ticket is the actual backlog entry. Both are needed.

---

## Steps

### 1. Extract from context

Read the conversation immediately above. Identify:

- **Issue summary** — one sentence describing the problem
- **Why it's deferred** — usually "post-MVP", "not needed for 5-person team", "low ROI at current scale", etc. Infer from context; don't ask
- **Promote when** — a concrete, specific trigger (e.g. "When team size exceeds 10", "After first customer onboards", "When multiple BLs are needed"). Avoid vague triggers like "when needed"
- **Project** — which project this belongs to (e.g. Kinetic). Check MEMORY.md if ambiguous
- **Linear team** — infer from project (Kinetic → team "Kinetic")
- **Relevant doc** — which file to edit. For product issues this is usually `projects/[project]/docs/product-summary.md`. Use context to confirm

### 2. Create the Linear ticket

Create an issue with:

- **Title**: One-line summary of the issue (imperative form: "Define X", "Handle Y", "Add Z")
- **Team**: The project's Linear team
- **Priority**: Low
- **State**: Backlog (or the team's equivalent triage/backlog state)
- **Description**:

```
## Problem
[Issue description]

## Why deferred
Post-MVP — [brief reason].

## Promote when
[Specific trigger condition]
```

Note the ticket identifier (e.g. `KIN-47`) — you need it for the callout.

### 3. Add the [DEFERRED] callout to the doc

Open the relevant doc. Find the paragraph or section most directly related to this issue — where a reviewer reading linearly would naturally encounter this concern.

Insert this callout block **immediately after** that paragraph:

```
> **[DEFERRED · KIN-XX]** _[One-sentence issue summary.]_
> **Decision:** Post-MVP — [brief reason].
> **Promote when:** [Specific trigger condition.]
```

Replace `KIN-XX` with the actual ticket identifier from step 2.

Rules:
- Put the callout in the **prose section** where the issue lives, not in the Decisions table at the bottom
- The callout should make sense to a reader without them needing to look anything up
- If the issue spans multiple sections, place the callout at the most relevant one — don't add it multiple times
- Match the formatting of the existing doc exactly

### 4. Confirm

Reply with a single line:

> Deferred. Created [KIN-XX] and added `[DEFERRED]` callout after [brief location description] in [filename].

Example:
> Deferred. Created KIN-47 and added `[DEFERRED]` callout after the ACL timing paragraph in product-summary.md.

---

## Edge cases

- **Issue is in multiple docs**: Add the callout to the most authoritative one (usually product-summary.md). Note in the Linear ticket if it affects other docs.
- **Can't find the right paragraph**: Place the callout at the end of the most related section heading. If genuinely ambiguous, ask Brandon: "Should I put this under [Section A] or [Section B]?"
- **Linear team or project is unclear**: Check the project's MEMORY.md first. If still unclear, ask before creating the ticket.
- **The issue was already partially addressed**: Note this in the ticket description. The callout still goes in — "partially addressed" is not the same as "resolved."
