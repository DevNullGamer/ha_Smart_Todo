# Changelog

All notable changes to this project are documented here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions track
`custom_components/smart_todo/manifest.json`.

## [0.2.0]

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
- **Multi-list targeting**: every service now accepts an optional
  `config_entry_id` field to target a specific Smart Todo list. Single-list
  installs are unaffected; with multiple lists configured, a service call
  without a target now fails with a clear error naming the available lists
  instead of silently operating on whichever list was set up first.
  **Known limitation:** the bundled Lovelace card does not yet send
  `config_entry_id` on any of its service calls. On an install with two or
  more lists, every card action (loading tasks, creating/completing/deleting/
  snoozing) will hit the new "multiple lists configured" error, even though
  the card is already configured to point at one specific list's entity. Until
  the card is updated to resolve and send the right `config_entry_id`
  automatically, multi-list households should use the service call directly
  (with `config_entry_id` set) for anything the card can't do, or wait for a
  card update.
- New todo-entity attributes: `points_available`, `points_earned_total`,
  `points_spent_total`, `points_by_recipient` (lifetime gross earned),
  `points_balance_by_recipient` (net, after spending).
- Lovelace card: points badge on task rows, Points/Reward recipient fields in
  the create-task form, and roster-backed autocomplete on the Assignee and
  Reward recipient fields.

### Fixed

- A task could earn reward points more than once by being reopened and
  re-completed; completion now tracks award-eligibility per cycle so a
  manual reopen can't re-trigger the same reward.
- `points`/`reward_recipient` service fields were missing from the HA
  Developer Tools UI form and translation strings despite being accepted by
  the service schema; both are now fully documented in `services.yaml` and
  `strings.json`/`translations/en.json`. Same fix applied to `purge_completed`,
  which had no translation entry at all.
- A recipient's earned-points history could be silently lost if the task
  that earned them was later deleted (e.g. via `purge_completed`), which
  could push their balance negative once compared against their (undeletable)
  spend history. Earned totals are now persisted independently of task
  lifetime, with a one-time backfill for upgrading installs.
- Editing the reward roster could crash the integration on reload (a
  duplicate static-resource registration) or briefly drop all `smart_todo.*`
  services; both are fixed.

## [0.1.0]

Initial release: recurring and one-off tasks, priority, assignee, multiple
recurrence modes, native Home Assistant Todo entity integration, full service
API, persistent storage, and a custom Lovelace card.
