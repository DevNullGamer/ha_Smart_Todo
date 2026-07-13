# Smart Todo

A self-contained recurring task and todo manager for Home Assistant, with HACS support.

## Features

- One-off and recurring tasks with flexible schedules
- Recurrence modes: every N days, N days after completion, specific weekdays, every other week, weekly, monthly
- Native Home Assistant Todo entity integration
- Completion event firing for automations
- Optional reward points per task with recipient-based tracking and entity attributes
- Fixed reward roster (configurable) with one balance sensor entity per person, and a `spend_points` service for redeeming points
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
| `smart_todo.get_tasks` | Query tasks (returns response data, including the configured roster) |
| `smart_todo.spend_points` | Deduct points from a recipient's balance |

Every service accepts an optional `config_entry_id` field to target a specific list. It's only needed if you have more than one Smart Todo list configured — with a single list, every service auto-resolves to it exactly as before. With two or more lists and no `config_entry_id`, a service call fails with a clear error naming the available lists rather than silently guessing one. The UI's service picker offers a dropdown for this field; find the raw ID under **Settings → Devices & services → Smart Todo → (three dots) → Download diagnostics**, or by hovering the integration entry.

> **Multi-list + the card:** the bundled Lovelace card does not yet send `config_entry_id`, so with two or more lists configured, card actions will hit the "multiple lists configured" error even though the card is already pointed at one specific list's entity. Use the service call directly (with `config_entry_id`) until the card is updated.

### Completion event

Completing a task fires the Home Assistant event `smart_todo_task_completed` with data including `task_id`, `title`, `points`, `points_awarded`, `reward_recipient`, and `completed_at`.

### Reward points

Tasks can optionally define `points` and `reward_recipient` when created or updated. If a task is completed and points are configured, the recipient is credited with those points. If no `reward_recipient` is provided, the task `assignee` is used. This makes it work even for users who do not have Home Assistant accounts.

The todo entity exposes aggregated point attributes: `points_available` (unclaimed, from incomplete tasks), `points_earned_total` / `points_by_recipient` (lifetime gross earned), and `points_spent_total` / `points_balance_by_recipient` (net, after spending).

### Reward roster

By default `reward_recipient` is free text, which risks the same person's points fragmenting across typo/case variants (e.g. "Mina" vs "mina"). To avoid that, configure a fixed roster: go to **Settings → Devices & services → Smart Todo → Configure** and enter a comma-separated list of names (e.g. `Mina, Oskar`).

Once a roster is configured:
- `reward_recipient` (on `create_task`/`update_task`) and `recipient` (on `spend_points`) must case-insensitively match a roster entry, or the service call fails with a clear error.
- One sensor entity per roster member is created automatically (e.g. "Mina Points"), whose state is their current spendable balance (`points_earned` minus `points_spent`) — usable directly in dashboard tiles, history graphs, and automation triggers, not just as a nested attribute.
- The Lovelace card offers roster names as autocomplete suggestions on the Assignee and Reward recipient fields (still free text if you don't pick a suggestion).

If the roster is left empty, `reward_recipient`/`recipient` stay unrestricted free text — this matches the pre-roster behavior so existing setups aren't broken.

### Spending points

Call `smart_todo.spend_points` with `recipient`, `amount`, and an optional `note` (e.g. "30 min extra screen time") to deduct points from a recipient's balance. Spending is rejected if `amount` exceeds their current balance — points cannot go negative. Each spend fires a `smart_todo_points_spent` event with `recipient`, `amount`, `note`, `balance_after`, and `spent_at`, so automations can react (e.g. notify a parent when a reward is redeemed).

## Lovelace Card

A custom card is included that shows all task fields (priority, assignee, points, recurrence, overdue state) not visible in the native Todo card, and lets you set points/reward recipient when creating a task (with roster autocomplete, if configured).

### Add the resource

In Home Assistant go to **Settings → Dashboards → Resources → Add resource**:

| Field | Value |
|-------|-------|
| URL | `/smart_todo/frontend/smart-todo-card.js` |
| Resource type | JavaScript module |

Or add to your `configuration.yaml`:
```yaml
lovelace:
  resources:
    - url: /smart_todo/frontend/smart-todo-card.js
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

### Running tests

```bash
pip install -r tests/requirements.txt
pytest
```

`tests/test_recurrence.py`, `test_reward_points.py`, and `test_spending.py` load
`models.py`/`recurrence.py` standalone and need only `pytest` itself — no Home
Assistant install required. `tests/test_coordinator_integration.py` exercises
the real config-entry setup path against an in-memory Home Assistant core via
[pytest-homeassistant-custom-component](https://github.com/MatthewFlamm/pytest-homeassistant-custom-component),
which `tests/requirements.txt` installs alongside a compatible `homeassistant`
core version.

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
| `monthly` | `anchor_date`, `time_of_day` | Every 15th at 09:00 (day comes from `anchor_date`; month/year are ignored — only the day-of-month is used, clamped to the last day of shorter months) |

## License

MIT

## Script Wrappers

Pre-built scripts are included in `custom_components/smart_todo/example_scripts.yaml`. They wrap common `smart_todo.create_task` patterns so you can trigger task creation from dashboards, automations, or the Developer Tools without repeating boilerplate recurrence data each time.

> **Requirement:** Home Assistant 2023.5 or later (`response_variable` support is required for `smart_todo_complete_by_title`).

### How to install the scripts

**Option A — configuration.yaml**

Copy the contents of `custom_components/smart_todo/example_scripts.yaml` into your `configuration.yaml` under a top-level `script:` key (or into a separate `scripts.yaml` file if you use `script: !include scripts.yaml`), then reload scripts:

```yaml
# configuration.yaml
script: !include scripts.yaml
```

**Option B — HA Scripts UI**

1. Go to **Settings → Automations & Scenes → Scripts**
2. Click **Add Script → Edit in YAML**
3. Paste the desired script block and save
4. Repeat for each script you want

After adding scripts, go to **Developer Tools → YAML → Reload Scripts** (or restart HA).

### Script examples

Each script can be called from **Developer Tools → Services** by selecting `script.<script_key>` and filling in the fields shown below.

#### `smart_todo_create_task` — one-off task

Fields: `title`, `due_date`, `priority`, `assignee`

```yaml
service: script.smart_todo_create_task
data:
  title: Buy groceries
  due_date: "2026-06-10"
  priority: 2
  assignee: Alice
```

#### `smart_todo_create_daily_task` — daily recurring task

Fields: `title`, `priority`, `assignee`

```yaml
service: script.smart_todo_create_daily_task
data:
  title: Check morning messages
  priority: 2
  assignee: Alice
```

#### `smart_todo_create_weekly_task` — weekly recurring task

Fields: `title`, `weekday` (0 = Monday … 6 = Sunday), `hour` (0–23), `priority`, `assignee`

```yaml
service: script.smart_todo_create_weekly_task
data:
  title: Water the plants
  weekday: 4   # Friday
  hour: 8
  priority: 1
  assignee: Bob
```

#### `smart_todo_create_interval_task` — every N days

Fields: `title`, `interval_days`, `due_date`, `priority`, `assignee`

```yaml
service: script.smart_todo_create_interval_task
data:
  title: Change air filter
  interval_days: 30
  due_date: "2026-07-01"
  priority: 2
```

#### `smart_todo_create_rolling_task` — N days after completion

Fields: `title`, `interval_days`, `priority`, `assignee`

```yaml
service: script.smart_todo_create_rolling_task
data:
  title: Clean the fridge
  interval_days: 14
  priority: 2
  assignee: Alice
```

#### `smart_todo_complete_by_title` — complete by title fragment

Fields: `title_fragment`

```yaml
service: script.smart_todo_complete_by_title
data:
  title_fragment: groceries
```

The script performs a case-insensitive partial match and completes the first task found. If no match is found, a persistent notification is created.

### Blueprint install instructions

A blueprint is included at `blueprints/automation/smart_todo/create_recurring_task.yaml`.

1. Copy the file to your HA config directory:
   ```
   config/blueprints/automation/smart_todo/create_recurring_task.yaml
   ```
2. In Home Assistant go to **Settings → Automations & Scenes → Blueprints**
3. Find **"Create Recurring Task"** and click **Create Automation**

The blueprint accepts inputs for task title, recurrence mode (daily, weekly, interval, or rolling), weekday, hour, interval days, priority, and assignee. It generates the appropriate `smart_todo.create_task` service call automatically.
