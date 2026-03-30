# Linear Workflow

Shared workflow rules for all agents.

---

## Session Start

1. Read your agent memory file + project `MEMORY.md`.
2. Invoke `linear-automation` — once, when ready for your first Linear call.
3. Query for Todo issues: `list_issues` with `state: "Todo"`, `team: "Kinetic"`, `project: "Kinetic MVP"`, `limit: 5`.
4. Pick the highest-priority item. Move to `In Progress` before starting work.
5. If no issues: report "No work queued — board is empty."

**One at a time.** Finish before picking the next Todo.

**Sprint loop.** After completing a ticket, re-query for the next Todo. Don't ask Brandon.

---

## Status Lifecycle

`Backlog → Todo → In Progress → Code Review → Done`

| Status | Meaning |
|---|---|
| Backlog | Not yet ready — waiting on upstream work or unprioritized |
| Todo | Ready to start. No blockers. |
| In Progress | Active work. Set **before** starting, not after. |
| Code Review | Implementation complete, awaiting review. |
| Done | Complete. |
| Blocked | Cannot proceed. Set `blockedBy`, comment with reason. |
| Canceled | Dropped. Comment with reason. |

**Key rules:**
- Never set `In Progress` retroactively
- One `In Progress` per agent at a time
- `Code Review` → reviewer spawns inline → findings fixed → `Done`
- `Blocked` = waiting on a dependency or Brandon decision

---

## Creating Issues

| Field | Value |
|---|---|
| Title | Short imperative description |
| Team | `Kinetic` |
| Project | `Kinetic MVP` |
| Priority | 1=Urgent, 2=High, 3=Normal, 4=Low |
| Estimate | 1=half day, 2=full day, 3=two days |
| Labels | One type label: `Feature` / `Bug` / `Improvement` |

**Estimates:** Required on every implementation ticket before `In Progress`. If estimate is 3+, split the ticket.

---

## Comments

- **Max 5 lines.** Verdict + summary + link to detailed doc if needed.
- **Sign every comment** with your agent name: `— Builder`, `— Jared`, etc.

---

## Question Routing

When stuck on a product question mid-session:
1. **Spawn a Jared subagent** (model: haiku) with the question + MEMORY.md context.
2. Jared returns `ANSWERED: [answer]` or `ESCALATE: [question for Brandon]`.
3. If escalated, create a `[Decision]` issue and continue with other work if available.

---

## Stop Conditions

**Blocking (stop, tell Brandon):**
- Hard-blocked command needed (`git push`, `rm`)
- Ambiguity that would waste work if guessed wrong

**Non-blocking (note it, keep going):**
- Sprint queue empty → end session
- Minor question → use judgment, note assumption in ticket comment

---

## Token Efficiency

- Always filter `list_issues` — never load the full board
- Skip `get_issue` when the list response has enough detail
- Get context from files, not ticket comments
- Write Linear updates in batches, not interleaved with reads

---

## Reference

**Board:** https://linear.app/brandonup/team/KIN

**MCP Tools:**
| Operation | Tool |
|---|---|
| List issues | `list_issues` |
| Get one issue | `get_issue` |
| Create/update issue | `save_issue` |
| Add comment | `save_comment` |
| List statuses | `list_issue_statuses` |
| List labels | `list_issue_labels` |
| List cycles | `list_cycles` |
