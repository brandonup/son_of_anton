# Sprint Efficiency & Code Quality Dashboard

A self-contained HTML dashboard for monitoring sprint health trends over time. Open `dashboard.html` in any browser — no server or build step required.

---

## Quick Start

1. Copy this folder into your project:
   ```
   projects/[your-project]/dashboards/
     sprint-dashboard.html   ← copy dashboard.html here
     data/
       manifest.json
       sprint-1.json
       sprint-2.json
       ...
   ```

2. Open `sprint-dashboard.html` in Chrome or Edge (Firefox support for File System Access API may be limited).

3. Click **Load Real Data** → select your `data/` folder.

The template ships with 3 sample sprints showing a realistic improvement trend. These render immediately without loading a folder.

---

## Adding a New Sprint

At the end of each sprint, create `sprint-N.json` in the `data/` folder and add a reference to `manifest.json`.

### 1. Update `manifest.json`

```json
{
  "sprints": [
    { "number": 1, "file": "sprint-1.json", "label": "Sprint 1" },
    { "number": 2, "file": "sprint-2.json", "label": "Sprint 2" }
  ]
}
```

### 2. Create `sprint-N.json`

```json
{
  "$schema": "sprint-snapshot-v1",
  "sprint": {
    "number": 2,
    "name": "Sprint 2",
    "startDate": "YYYY-MM-DD",
    "endDate": "YYYY-MM-DD"
  },
  "velocity": {
    "planned": 20,
    "completed": 18,
    "carryover": 2,
    "totalPoints": 42,
    "completedPoints": 38
  },
  "estimates": {
    "coveragePercent": 65,
    "byAgent": {
      "alice": { "total": 10, "estimated": 7, "coveragePercent": 70 }
    }
  },
  "cycleTime": {
    "averageDays": 2.1,
    "medianDays": 1.8,
    "p90Days": 4.0,
    "byAgent": {
      "alice": { "averageDays": 1.9, "ticketCount": 10 }
    }
  },
  "reviews": {
    "totalReviews": 18,
    "rejections": 5,
    "rejectionRate": 27.8,
    "byAgent": {
      "alice": { "reviews": 10, "rejections": 3, "rejectionRate": 30, "maxRounds": 2 }
    }
  },
  "defects": {
    "total": 24,
    "byCategory": {
      "acl-leak": 2,
      "error-swallow": 5,
      "api-contract": 4,
      "spec-gap": 3,
      "schema-mismatch": 2,
      "rls-bypass": 1,
      "async-supabase": 2,
      "test-missing": 1,
      "other": 4
    },
    "bySeverity": { "critical": 8, "important": 14, "minor": 2 },
    "defectsPerTicket": 1.5
  },
  "agentActivity": {
    "alice": { "completed": 10, "wipPeak": 2 }
  },
  "processHealth": {
    "decisionTicketLagHours": 2.5,
    "handoffCompliancePercent": 80
  },
  "notes": "Optional free-text sprint notes. Shown below the charts."
}
```

---

## JSON Schema Reference (`sprint-snapshot-v1`)

| Field | Type | Description |
|---|---|---|
| `sprint.number` | int | Sprint index (used for ordering) |
| `sprint.startDate` / `endDate` | string (YYYY-MM-DD) | Sprint window |
| `velocity.planned` | int | Tickets in scope at sprint start |
| `velocity.completed` | int | Tickets marked Done by sprint end |
| `velocity.carryover` | int | Tickets that spilled into next sprint |
| `velocity.totalPoints` / `completedPoints` | int | Story points (optional; use 0 if not tracked) |
| `estimates.coveragePercent` | float | % of implementation tickets with estimates |
| `estimates.byAgent` | object | Per-agent estimate coverage |
| `cycleTime.averageDays` | float | Mean days from In Progress → Done |
| `cycleTime.medianDays` | float | Median cycle time |
| `cycleTime.p90Days` | float | 90th percentile cycle time |
| `cycleTime.byAgent` | object | Per-agent average cycle time |
| `reviews.totalReviews` | int | Total review tickets (unique tickets, not rounds) |
| `reviews.rejections` | int | Reviews that required at least one rework round |
| `reviews.rejectionRate` | float | Rejection % (0–100) |
| `reviews.byAgent` | object | Per-agent review stats |
| `defects.total` | int | Total defects logged in code reviews |
| `defects.byCategory` | object | Count per category (see categories below) |
| `defects.bySeverity` | object | `{ critical, important, minor }` |
| `defects.defectsPerTicket` | float | `total / velocity.completed` |
| `agentActivity` | object | Per-agent `{ completed, wipPeak }` |
| `processHealth.decisionTicketLagHours` | float | Avg hours to resolve `[Decision]` tickets |
| `processHealth.handoffCompliancePercent` | float | % of handoffs with required summary/test comment |
| `notes` | string | Free-text sprint summary (optional) |

### Defect Categories

| Category | Meaning |
|---|---|
| `acl-leak` | Authorization check missing or bypassed |
| `error-swallow` | Exception caught silently; no log or re-raise |
| `api-contract` | Response shape, status code, or field missing/wrong |
| `spec-gap` | Code diverges from spec requirements |
| `schema-mismatch` | Wrong column, table, or field name used |
| `rls-bypass` | Supabase Row Level Security policy incorrect |
| `async-supabase` | Sync Supabase client called in async context |
| `test-missing` | Required test coverage absent |
| `other` | Doesn't fit another category |

---

## Customization

**Rename agents:** Update `agentDisplayNames` in `manifest.json`.

**Change accent color:** Edit `--accent` in the CSS `:root` block.

**Add defect categories:** Add the new key to `defects.byCategory` in your sprint JSON files, then add a color mapping to the `DEFECT_COLORS` object in the HTML `<script>` block.

**Embed data for offline use:** Copy the kinetic `sprint-dashboard.html` pattern: inline the manifest and sprint data as JS constants (like this template does for sample data) so the dashboard works without File System Access API.

---

## Browser Compatibility

The **Load Real Data** button uses the [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API), which requires:
- Chrome 86+
- Edge 86+
- Safari 15.2+ (partial)

If loading from folder is not supported, the fallback is to embed sprint data directly in the HTML (or serve from a local web server with `fetch`).
