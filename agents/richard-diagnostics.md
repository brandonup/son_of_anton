# Richard — Diagnostic Reports & Investigation

---

## Report Types

| Report | Trigger | Output |
|---|---|---|
| Speed audit | Brandon requests or scheduled | Cycle time by agent, bottleneck analysis, ranked recommendations |
| Bottleneck report | On-demand | Specific ticket IDs, lag times, root causes, handoff gaps |
| Process compliance report | Scheduled or on-demand | Estimate coverage %, handoff format compliance, memory update frequency |
| Sprint health dashboard | Sprint mid-point or end | Milestone progress, blocked tickets, carryover count, completion rate |
| Review pattern analysis | On-demand | Rejection rate by agent, common categories, rework cycle count |
| Failure Mode Report | On-demand or scheduled | Top failure modes, policy coverage gaps, new policy recommendations |

---

## Sprint Snapshot (every sprint end)

Generate a `sprint-N.json` snapshot and update `manifest.json` in `projects/[project]/dashboards/data/`.

1. Read the sprint health report and defect log to gather metrics.
2. Populate all fields in the `sprint-snapshot-v1` schema (see `templates/sprint-dashboard/README.md`).
3. Write to `projects/[project]/dashboards/data/sprint-N.json`.
4. Add the sprint reference to `projects/[project]/dashboards/data/manifest.json`.
5. Note any data gaps in the `notes` field.

**Key metrics:**
- `velocity`: planned, completed, carryover counts
- `estimates.coveragePercent` + per-agent breakdown
- `cycleTime.averageDays` + per-agent average
- `reviews.rejectionRate` + per-agent rejection rates and max rounds
- `defects.byCategory` + `bySeverity` + `defectsPerTicket`
- `agentActivity`: completed count and WIP peak per agent
- `processHealth`: decision ticket lag and handoff compliance %

---

## Failure Mode Report Pipeline

**Trigger:** Brandon says "failure mode report," "defect pattern analysis," or similar.

1. Read `projects/[project]/defect-log.md` for the specified timeframe.
2. Count entries by category. Filter for categories with 3+ occurrences.
3. For each high-frequency category, invoke the `write-policy` skill to gate-check whether a new policy is warranted.
4. Output ranked by occurrence count, highest first.

---

## On-Demand Investigation

When Brandon asks a specific process question:

1. **Restate the question** as a measurable hypothesis. "Why is Big Head slow?" → "Is Big Head's cycle time above the team median, and if so, which phase (implementation, review, rework) accounts for the difference?"
2. **Gather evidence** from Linear (tickets, timestamps, status transitions, comments), review docs in `reviews/`, agent memory files, and process files.
3. **Analyze** — quantify the gap, trace the causal chain, identify the root cause. Use parallel subagents for data gathering when multiple independent queries are needed.
4. **Report** — findings + recommendations, standard format below. Save to `projects/[project]/docs/process/`.
5. **Update `richard-memory.md`** with any new baselines or patterns discovered.

---

## Report Format (all types)

```
## [Report Type] — [Date]

### Scope
What was analyzed, time window, ticket set.

### Key Findings
Ranked by impact. Each finding includes: what was measured, the metric value, affected ticket IDs, and root cause diagnosis.

### Recommendations
Ranked by estimated impact (time saved per sprint).

| # | Recommendation | Impact | Effort | Affected Agent Files |
|---|---|---|---|---|
| 1 | [what to change] | [hours/sprint saved] | [Low/Med/High] | [agents/xxx.md § section] |

### What's Working Well
Things that should not be changed.

### Open Questions for Brandon
Tradeoffs requiring a product or strategic decision.

### Baselines Updated
Metrics recorded in `richard-memory.md` for trend tracking.
```
