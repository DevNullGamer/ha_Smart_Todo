# Changelog

All notable changes to this project are documented here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions track
`custom_components/smart_todo/manifest.json`.

## [0.0.3] - Unreleased

### Added

- **Completion event**: completing a task fires `smart_todo_task_completed`
  (`task_id`, `title`, `points`, `points_awarded`, `reward_recipient`,
  `completed_at`) for automations to react to.
- **Reward points**: tasks can optionally define `points` and
  `reward_recipient`. Completing a task with points configured credits the
  recipient (falling back to the task's `assignee` if no recipient is set) —
  works without a Home Assistant account for the recipient.
- **Spending**: a new `spend_points` service deducts points from a
  recipient's balance, with an optional free-text "spent on" note. Spending
  is rejected if it would exceed the recipient's current balance. Fires
  `smart_todo_points_spent`.
- **Reward roster**: an options-flow step (Settings → Devices & services →
  Smart Todo → Configure) for defining a fixed, comma-separated list of
  reward-eligible people, to avoid the same person's points fragmenting
  across typo/case variants of their name. Once configured, `reward_recipient`
  and `spend_points`' `recipient` must match a roster entry.
- **Per-person point sensors**: one sensor entity per roster member
  (`<name> Points`), whose state is their net spendable balance (earned minus
  spent) — usable directly in dashboards, history graphs, and automation
  triggers, not just as a nested attribute.
- New todo-entity attributes: `points_available`, `points_earned_total`,
  `points_spent_total`, `points_by_recipient` (lifetime gross earned),
  `points_balance_by_recipient` (net, after spending).
- **Monthly recurrence** is now actually usable: exposed in the card's
  recurrence picker (previously listed as "coming soon" and only reachable,
  buggily, via a raw service call).
- **Card: task editing.** The card could previously only create tasks; an
  edit button on each row now opens the same form pre-filled, for
  reassigning, reprioritizing, changing points, or adjusting recurrence.
- Card: points badge on task rows, Points/Reward recipient fields in the
  create/edit form, and roster-backed autocomplete on the Assignee and
  Reward recipient fields.
- **Card: split-award prompt for unassigned tasks.** Completing a
  points-bearing task with no assignee and no reward recipient now prompts
  for who actually did it (roster checkboxes plus a free-text fallback),
  with a "Don't award points" option. Selecting more than one person splits
  the points evenly (to 2 decimal places). `complete_task` gained a matching
  optional `recipients` field; omitting it keeps today's auto-resolve
  behavior, an explicit empty list awards nobody.

### Changed

- **Multi-list targeting**: every service now accepts an optional
  `config_entry_id` field to target a specific Smart Todo list. Single-list
  installs are unaffected; with multiple lists configured, a service call
  without a target now fails with a clear error naming the available lists
  instead of silently operating on whichever list was set up first.
  **Known limitation:** the bundled card does not yet send `config_entry_id`
  on any of its calls, so on a multi-list install every card action will hit
  this new error until the card is updated to resolve one automatically —
  use the service call directly (with `config_entry_id` set) in the
  meantime, or wait for a card update.
- `get_tasks` response now also includes the configured `roster` and each
  task's structured `recurrence_rule` (alongside the existing human-readable
  `recurrence` description).
- Internal: storage now migrates between schema versions properly instead of
  loading old data ad-hoc — relevant to anyone upgrading from an older
  release, not something you need to do anything about.

### Fixed

- `purge_completed` (added in 0.0.2) was missing from the Developer Tools
  service picker UI and had no translation entry, even though the service
  itself worked when called directly.

## [0.0.2] - 2026-06-10

### Added

- `purge_completed` service to permanently delete completed non-recurring
  tasks.
- CI: a GitHub Actions workflow that builds the Lovelace card and runs the
  Python test suite on every push.
- Card: a filter for showing/hiding tasks already completed today, and
  a "show hidden tasks" affordance for tasks excluded by the active filter.

### Fixed

- Card: snoozing a task, and the card's auto-reload after a change, both had
  bugs that are fixed in this release.

## [0.0.1] - 2026-06-03

Initial release.

- Core integration: one-off and recurring tasks with priority, assignee, due
  dates, and snoozing, backed by a native Home Assistant Todo entity.
- Recurrence modes: every N days, N days after completion, specific
  weekdays, and every other week.
- Full service API: `create_task`, `complete_task`, `reopen_task`,
  `update_task`, `snooze_task`, `delete_task`, `recalculate_recurrence`,
  `get_tasks`.
- Persistent storage, and diagnostics reporting aggregate statistics only
  (no task titles, notes, or names).
- A custom Lovelace card for managing tasks beyond what the native Todo card
  shows.
- Example automations, an example dashboard, a recurring-task creation
  blueprint, and script wrappers for common task-creation patterns.
