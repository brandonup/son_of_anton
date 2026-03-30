# Status Management Policy

**Why:** Agents forget to move tickets to In Progress before starting work, causing invisible WIP and inaccurate board state. This is the most common process violation.

**Defect category:** process-violation

---

## Rules

1. **Move ticket to `In Progress` BEFORE starting any work** — never retroactively.
2. **WIP limit: one `In Progress` per agent.** Before moving any issue to `In Progress`, query `list_issues` with `state: "In Progress"` for that assignee. If one already exists, the new issue stays in `Todo`.
3. **Verify estimate is set before moving to `In Progress`.** If missing, set one now using the scale: 1=half day, 2=full day, 3=two days, 4=three+ days.
4. **Move to `Code Review` when implementation is complete** and ready for review. The implementer sets it, not the reviewer.
5. **Move `Blocked` → `In Progress`** the moment the blocker resolves.
6. **Backlog ≠ Blocked.** Backlog = work hasn't started (upstream dependency or not yet prioritized). Blocked = work started and hit a wall — always pair with `blockedBy` and a comment.

**Status lifecycle:** `Backlog → Todo → In Progress → Code Review → Done`
**Exception path:** `In Progress → Blocked` (dependency or Brandon decision pending)
