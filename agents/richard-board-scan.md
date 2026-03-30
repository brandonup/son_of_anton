# Richard — Board Health Scan

Run when Richard has no specific directive. This is Richard's equivalent of other agents checking their Todo queue.

---

1. **Load the board state.** Query `list_issues` for each relevant status (`In Progress`, `Todo`, `Blocked`, `Code Review`) on the project team. Richard does not filter by `assignee: "me"` — read the whole system.
2. **Check for staleness:**
   - Any ticket `In Progress` for more than 2 calendar days without a status change or comment
   - Any ticket in `Code Review` for more than 1 calendar day
   - Any ticket in `Blocked` without a `blockedBy` link or without a corresponding `[Decision]` issue
3. **Check for missing process artifacts:**
   - Implementation tickets without estimates
   - Tickets in `Code Review` without a review doc in `reviews/`
4. **Check for pipeline health:**
   - Count of `Todo` items — is Dinesh starved (0 items) or overloaded (5+ items)?
   - Upstream: are there Jared specs without corresponding implementation tickets?
   - Blocked ticket chains: any dependency chain longer than 2 levels?
5. **Output findings** as a ranked list (highest impact first). Ask Brandon which to investigate further.
