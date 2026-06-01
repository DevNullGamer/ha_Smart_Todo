# Smart Todo

A self-contained recurring task and todo manager for Home Assistant, with HACS support.

## Features

- One-off and recurring tasks with flexible schedules
- Recurrence modes: every N days, N days after completion, specific weekdays, every other week, weekly, monthly (coming soon)
- Native Home Assistant Todo entity integration
- Services for full automation control
- Persistent storage across restarts with schema migration
- HACS-installable

## Installation

### HACS (Recommended)

1. Open HACS in Home Assistant
2. Go to Integrations → Custom repositories
3. Add `https://github.com/DevNullGamer/ha_Smart_Todo` as an Integration
4. Install "Smart Todo"
5. Restart Home Assistant
6. Go to Settings → Integrations → Add Integration → search "Smart Todo"

### Manual

1. Copy `custom_components/smart_todo/` to your HA `custom_components/` folder
2. Restart Home Assistant
3. Add integration via Settings → Integrations

## Configuration

Provide a name for the list (e.g. "Family Tasks") when prompted during setup.

## Services

| Service | Description |
|---------|-------------|
| `smart_todo.create_task` | Create a new task |
| `smart_todo.complete_task` | Mark a task completed |
| `smart_todo.reopen_task` | Reopen a completed task |
| `smart_todo.update_task` | Update task fields |
| `smart_todo.snooze_task` | Snooze a task until a date/time |
| `smart_todo.delete_task` | Delete a task permanently |
| `smart_todo.recalculate_recurrence` | Recalculate due dates |
| `smart_todo.get_tasks` | Query tasks (returns response data) |

## Lovelace Card

A custom card is included that shows all task fields (priority, assignee, recurrence, overdue state) not visible in the native Todo card.

### Add the resource

In Home Assistant go to **Settings → Dashboards → Resources → Add resource**:

| Field | Value |
|-------|-------|
| URL | `/local/community/smart_todo/smart-todo-card.js` |
| Resource type | JavaScript module |

Or add to your `configuration.yaml`:
```yaml
lovelace:
  resources:
    - url: /local/community/smart_todo/smart-todo-card.js
      type: module
```

### Add the card

```yaml
type: custom:smart-todo-card
entity: todo.family_tasks   # replace with your entity ID
title: My Tasks             # optional
```

Find your entity ID in **Settings → Entities** — search for "smart_todo".

### Build from source (contributors)

```bash
cd card-src
npm install
npm run build   # outputs to custom_components/smart_todo/www/smart-todo-card.js
npm run dev     # watch mode with source maps
```

The compiled `smart-todo-card.js` is committed to the repo so end users do not need Node.js.

## Automation Examples

See `custom_components/smart_todo/example_automations.yaml` for copy-pasteable examples covering task creation, completion triggers, overdue notifications, and snoozing.

## Lovelace

See `custom_components/smart_todo/example_dashboard.yaml` for a ready-to-use dashboard configuration including a native todo card and a task summary markdown card.

## Recurrence Rule Reference

| Mode | Required fields | Example |
|------|-----------------|---------|
| `interval_days` | `interval_days` | Every 7 days |
| `rolling_days` | `interval_days` | 3 days after completion |
| `weekdays` | `weekdays`, `time_of_day` | Every Mon+Wed at 09:00 |
| `weekly` | `weekdays`, `time_of_day` | Every Friday at 08:00 |
| `biweekly_weekdays` | `weekdays`, `week_parity`, `anchor_date` | Every other Tuesday |
| `monthly` | — | Monthly (stub, coming soon) |

## License

MIT
