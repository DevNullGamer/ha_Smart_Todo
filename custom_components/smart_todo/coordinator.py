"""DataUpdateCoordinator for the Smart Todo integration."""
from __future__ import annotations

import logging
from datetime import datetime, timezone, timedelta

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from .const import CONF_ROSTER, DOMAIN, DEFAULT_UPDATE_INTERVAL_SECONDS, PRIORITY_LABELS
from .models import RecurrenceRule, SpendEntry, TaskDefinition, TaskRuntimeState, make_task_id
from .storage import SmartTodoStore
from .recurrence import next_due_date, is_overdue, describe_rule

_LOGGER = logging.getLogger(__name__)


class SmartTodoCoordinator(
    DataUpdateCoordinator[dict[str, tuple[TaskDefinition, TaskRuntimeState]]]
):
    """Coordinator that owns all task state and persists via SmartTodoStore."""

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        self._store = SmartTodoStore(hass)
        self._entry = entry
        super().__init__(
            hass,
            _LOGGER,
            name=DOMAIN,
            update_interval=timedelta(seconds=DEFAULT_UPDATE_INTERVAL_SECONDS),
        )

    # ------------------------------------------------------------------
    # Setup
    # ------------------------------------------------------------------

    async def async_setup(self) -> None:
        """Load persisted data then populate self.data via the first refresh."""
        await self._store.async_load()
        await self.async_refresh()

    # ------------------------------------------------------------------
    # DataUpdateCoordinator hook
    # ------------------------------------------------------------------

    async def _async_update_data(
        self,
    ) -> dict[str, tuple[TaskDefinition, TaskRuntimeState]]:
        """Build the coordinator data dict.

        The ``overdue`` property on each TaskRuntimeState is computed on demand
        (it is a property, never stored), so no explicit recomputation is needed
        here — consuming code simply reads ``state.overdue``.
        """
        try:
            return {
                task_id: (definition, self._store.states[task_id])
                for task_id, definition in self._store.definitions.items()
                if task_id in self._store.states
            }
        except Exception as exc:
            raise UpdateFailed(f"Error building task data: {exc}") from exc

    # ------------------------------------------------------------------
    # Task CRUD
    # ------------------------------------------------------------------

    async def async_create_task(self, definition_data: dict) -> str:
        """Create a new task from raw definition data and return its task_id."""
        task_id = make_task_id()
        now = datetime.now(timezone.utc)

        recurrence_raw = definition_data.get("recurrence")
        recurrence: RecurrenceRule | None = (
            RecurrenceRule.from_dict(recurrence_raw)
            if isinstance(recurrence_raw, dict)
            else recurrence_raw  # already a RecurrenceRule or None
        )

        definition = TaskDefinition(
            id=task_id,
            title=definition_data["title"],
            created_at=now,
            notes=definition_data.get("notes"),
            priority=definition_data.get("priority", 2),
            assignee=definition_data.get("assignee"),
            recurrence=recurrence,
            points=definition_data.get("points", 0),
            reward_recipient=definition_data.get("reward_recipient"),
        )

        state = TaskRuntimeState(
            id=task_id,
            sort_order=len(self._store.definitions),
        )

        # Set initial due_at when a recurrence rule is provided
        if recurrence is not None:
            state.due_at = next_due_date(recurrence, now, now)

        # Also honour an explicit due_at in definition_data (non-recurring tasks)
        elif definition_data.get("due_at") is not None:
            raw_due = definition_data["due_at"]
            dt = (
                datetime.fromisoformat(raw_due)
                if isinstance(raw_due, str)
                else raw_due
            )
            if isinstance(dt, datetime) and dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            state.due_at = dt

        self._store.set_definition(definition)
        self._store.set_state(state)
        await self._store.async_save()
        await self.async_refresh()
        return task_id

    async def async_complete_task(
        self, task_id: str, recipients: list[str] | None = None
    ) -> None:
        """Mark a task complete.

        For recurring tasks the completion is registered, a new due_at is
        computed, and completed is immediately reset to False so the task
        remains active on the next recurrence.

        *recipients*, when given, overrides the normal
        reward_recipient/assignee auto-resolution: points are split evenly
        (2-decimal precision) across the named people. An empty list means
        "explicitly award to nobody" (used by the card's unassigned-task
        prompt); ``None`` (the default) preserves the original
        auto-resolve-or-skip behaviour.
        """
        states = self._store.states
        definitions = self._store.definitions

        if task_id not in states:
            raise ValueError(f"Task {task_id} not found")

        state = states[task_id]
        definition = definitions.get(task_id)
        now = datetime.now(timezone.utc)
        already_awarded_this_cycle = state.points_awarded_this_cycle

        state.completed = True
        state.last_completed_at = now
        state.snoozed_until = None

        starting_new_cycle = False
        if definition is not None and definition.recurrence is not None:
            rule = definition.recurrence
            # Rolling mode: roll from now (completion time)
            # Fixed modes: advance from the existing due_at so the schedule
            # stays anchored, but ensure the result is strictly after now.
            if rule.mode == "rolling_days":
                reference = now
            else:
                reference = state.due_at if state.due_at is not None else now

            state.due_at = next_due_date(rule, reference, now)
            # Recurring tasks auto-reset — they do NOT stay completed
            state.completed = False
            starting_new_cycle = True

        points_awarded: int | float = 0
        reward_recipient: str | None = None
        recipients_awarded: list[dict] = []
        # points_awarded_this_cycle guards against earning points repeatedly by
        # reopening and re-completing the same (non-recurring) task — reopening
        # resets `completed` but must not reset eligibility for a fresh reward.
        if not already_awarded_this_cycle and definition is not None and definition.points > 0:
            if recipients is not None:
                chosen = [name for name in recipients if name]
            else:
                auto = definition.reward_recipient or definition.assignee
                chosen = [auto] if auto is not None else []

            if chosen:
                total = definition.points
                if len(chosen) == 1:
                    shares = [total]
                else:
                    share = round(total / len(chosen), 2)
                    shares = [share] * len(chosen)
                    shares[-1] = round(total - share * (len(chosen) - 1), 2)

                for name, share in zip(chosen, shares):
                    state.points_earned += share
                    normalized = self.normalize_recipient(name)
                    self._store.add_earned(normalized, share)
                    self._store.record_recipient_seen(normalized, name.strip())
                    recipients_awarded.append({"recipient": name, "points": share})

                points_awarded = total
                reward_recipient = chosen[0] if len(chosen) == 1 else None

        # A new recurrence cycle always starts fresh and eligible for its own
        # reward; otherwise latch the flag once points have been awarded.
        state.points_awarded_this_cycle = (
            False if starting_new_cycle else (already_awarded_this_cycle or points_awarded > 0)
        )

        self._store.set_state(state)
        await self._store.async_save()
        await self.async_refresh()

        self.hass.bus.async_fire(
            "smart_todo_task_completed",
            {
                "task_id": task_id,
                "title": definition.title if definition is not None else None,
                "points": definition.points if definition is not None else 0,
                "points_awarded": points_awarded,
                "reward_recipient": reward_recipient,
                "recipients_awarded": recipients_awarded,
                "completed_at": now.isoformat(),
            },
        )

    # ------------------------------------------------------------------
    # Config entry identity
    # ------------------------------------------------------------------

    @property
    def title(self) -> str:
        """Return this list's display name (the config entry title)."""
        return self._entry.title

    # ------------------------------------------------------------------
    # Roster / reward ledger
    # ------------------------------------------------------------------

    def get_roster(self) -> list[str]:
        """Return the configured list of reward-eligible recipient names."""
        return list(self._entry.options.get(CONF_ROSTER, []))

    @staticmethod
    def normalize_recipient(name: str) -> str:
        """Canonicalization rule used everywhere recipient names are compared."""
        return name.strip().lower()

    def get_earned_total(self, recipient: str) -> int | float:
        """Return recipient's persisted lifetime earned total (case-insensitive).

        Backed by SmartTodoStore's independent ``earned_totals`` ledger, not
        derived from live task state — task deletion (e.g. purge_completed)
        must not silently erase earned history that a spend ledger entry may
        already depend on.
        """
        return self._store.earned_totals.get(self.normalize_recipient(recipient), 0)

    def get_spent_total(self, recipient: str) -> int:
        """Sum all spend ledger entries for *recipient* (case-insensitive)."""
        target = self.normalize_recipient(recipient)
        return sum(
            entry.amount
            for entry in self._store.spend_entries
            if self.normalize_recipient(entry.recipient) == target
        )

    def get_balance(self, recipient: str) -> int | float:
        """Return *recipient*'s current spendable balance (earned minus spent)."""
        return self.get_earned_total(recipient) - self.get_spent_total(recipient)

    def get_known_recipients(self) -> list[str]:
        """Return display names for everyone who has ever earned or spent points.

        Roster casing wins when a name matches a configured roster entry;
        otherwise falls back to the first-seen casing recorded in storage.
        """
        keys = set(self._store.earned_totals.keys()) | {
            self.normalize_recipient(entry.recipient)
            for entry in self._store.spend_entries
        }
        roster_by_key = {
            self.normalize_recipient(name): name for name in self.get_roster()
        }
        display_names = self._store.recipient_display_names
        return sorted(
            roster_by_key.get(key) or display_names.get(key, key) for key in keys
        )

    async def async_spend_points(
        self, recipient: str, amount: int, note: str | None = None
    ) -> None:
        """Deduct *amount* points from *recipient*'s balance.

        Rejects the spend (raises ValueError) if amount is non-positive or
        exceeds the recipient's current balance — overspending into a negative
        balance is not allowed.
        """
        if amount <= 0:
            raise ValueError("amount must be a positive number of points")

        balance = self.get_balance(recipient)
        if amount > balance:
            raise ValueError(
                f"{recipient} has {balance} point(s) available; cannot spend {amount}"
            )

        now = datetime.now(timezone.utc)
        entry = SpendEntry(
            id=make_task_id(),
            recipient=recipient,
            amount=amount,
            timestamp=now,
            note=note,
        )
        self._store.add_spend_entry(entry)
        self._store.record_recipient_seen(
            self.normalize_recipient(recipient), recipient.strip()
        )
        await self._store.async_save()
        await self.async_refresh()

        self.hass.bus.async_fire(
            "smart_todo_points_spent",
            {
                "recipient": recipient,
                "amount": amount,
                "note": note,
                "balance_after": self.get_balance(recipient),
                "spent_at": now.isoformat(),
            },
        )

    async def async_reopen_task(self, task_id: str) -> None:
        """Reopen a completed task; last_completed_at is preserved."""
        states = self._store.states

        if task_id not in states:
            raise ValueError(f"Task {task_id} not found")

        state = states[task_id]
        state.completed = False
        # last_completed_at is intentionally preserved

        self._store.set_state(state)
        await self._store.async_save()
        await self.async_refresh()

    async def async_update_task(self, task_id: str, patch: dict) -> None:
        """Partially update a task.

        Updatable definition fields: title, notes, priority, assignee, recurrence
        Updatable state fields: due_at, snoozed_until
        """
        definitions = self._store.definitions
        states = self._store.states

        if task_id not in definitions or task_id not in states:
            raise ValueError(f"Task {task_id} not found")

        definition = definitions[task_id]
        state = states[task_id]
        now = datetime.now(timezone.utc)

        # --- definition fields ---
        if "title" in patch:
            definition.title = patch["title"]
        if "notes" in patch:
            definition.notes = patch["notes"]
        if "priority" in patch:
            definition.priority = patch["priority"]
        if "assignee" in patch:
            definition.assignee = patch["assignee"]
        if "points" in patch:
            definition.points = patch["points"]
        if "reward_recipient" in patch:
            definition.reward_recipient = patch["reward_recipient"]
        if "recurrence" in patch:
            raw = patch["recurrence"]
            if raw is None:
                definition.recurrence = None
            elif isinstance(raw, dict):
                definition.recurrence = RecurrenceRule.from_dict(raw)
            else:
                definition.recurrence = raw  # already a RecurrenceRule

            # Recompute due_at when recurrence is updated to a non-None value
            if definition.recurrence is not None:
                state.due_at = next_due_date(definition.recurrence, now, now)

        # --- state fields ---
        if "due_at" in patch:
            raw_due = patch["due_at"]
            if raw_due is None:
                state.due_at = None
            elif isinstance(raw_due, str):
                state.due_at = datetime.fromisoformat(raw_due)
            else:
                state.due_at = raw_due
        if "snoozed_until" in patch:
            raw_snooze = patch["snoozed_until"]
            if raw_snooze is None:
                state.snoozed_until = None
            elif isinstance(raw_snooze, str):
                state.snoozed_until = datetime.fromisoformat(raw_snooze)
            else:
                state.snoozed_until = raw_snooze

        self._store.set_definition(definition)
        self._store.set_state(state)
        await self._store.async_save()
        await self.async_refresh()

    async def async_snooze_task(self, task_id: str, snooze_until: datetime) -> None:
        """Set snoozed_until on a task; due_at is NOT affected."""
        states = self._store.states

        if task_id not in states:
            raise ValueError(f"Task {task_id} not found")

        state = states[task_id]
        state.snoozed_until = snooze_until

        self._store.set_state(state)
        await self._store.async_save()
        await self.async_refresh()

    async def async_delete_task(self, task_id: str) -> None:
        """Remove a task from the store."""
        self._store.delete_task(task_id)
        await self._store.async_save()
        await self.async_refresh()

    async def async_purge_completed(self) -> None:
        """Delete all completed non-recurring tasks."""
        definitions = self._store.definitions
        states = self._store.states
        to_delete = [
            task_id for task_id, definition in definitions.items()
            if definition.recurrence is None
            and states.get(task_id) is not None
            and states[task_id].completed
        ]
        for task_id in to_delete:
            self._store.delete_task(task_id)
        if to_delete:
            await self._store.async_save()
            await self.async_refresh()

    # ------------------------------------------------------------------
    # Recalculation
    # ------------------------------------------------------------------

    async def async_recalculate_all(self, task_id: str | None = None) -> None:
        """Recompute due_at for recurring tasks whose due_at is None or in the past.

        If *task_id* is given, only that task is processed.
        """
        now = datetime.now(timezone.utc)
        definitions = self._store.definitions
        states = self._store.states

        task_ids = [task_id] if task_id is not None else list(definitions.keys())

        for tid in task_ids:
            definition = definitions.get(tid)
            state = states.get(tid)

            if definition is None or state is None:
                continue
            if definition.recurrence is None:
                continue
            if state.completed:
                continue

            # Recompute if due_at is not set or is already in the past
            if state.due_at is None or state.due_at <= now:
                reference = state.due_at if state.due_at is not None else now
                state.due_at = next_due_date(definition.recurrence, reference, now)
                self._store.set_state(state)

        await self._store.async_save()
        await self.async_refresh()

    # ------------------------------------------------------------------
    # Query helpers
    # ------------------------------------------------------------------

    def get_tasks_as_list(
        self,
        overdue_only: bool = False,
        assignee: str | None = None,
        priority: int | None = None,
        completed: bool | None = None,
    ) -> list[dict]:
        """Return all tasks (optionally filtered) as a list of plain dicts."""
        if self.data is None:
            return []

        results: list[dict] = []

        for task_id, (definition, state) in self.data.items():
            # Apply filters
            if overdue_only and not state.overdue:
                continue
            if assignee is not None and (
                definition.assignee is None
                or self.normalize_recipient(definition.assignee)
                != self.normalize_recipient(assignee)
            ):
                continue
            if priority is not None and definition.priority != priority:
                continue
            if completed is not None and state.completed != completed:
                continue

            results.append(
                {
                    "id": task_id,
                    "title": definition.title,
                    "notes": definition.notes,
                    "priority": definition.priority,
                    "priority_label": PRIORITY_LABELS.get(definition.priority, "unknown"),
                    "assignee": definition.assignee,
                    "points": definition.points,
                    "reward_recipient": definition.reward_recipient,
                    "points_earned": state.points_earned,
                    "due_at": state.due_at.isoformat(timespec="seconds") if state.due_at else None,
                    "completed": state.completed,
                    "overdue": state.overdue,  # computed property — never stored
                    "snoozed_until": (
                        state.snoozed_until.isoformat(timespec="seconds") if state.snoozed_until else None
                    ),
                    "recurrence": (
                        describe_rule(definition.recurrence)
                        if definition.recurrence
                        else None
                    ),
                    # Structured form (mode/interval_days/weekdays/week_parity/
                    # anchor_date/time_of_day) alongside the human-readable
                    # "recurrence" description above — the card's edit form
                    # needs the structured shape to prefill recurrence
                    # sub-fields; "recurrence" stays a plain description for
                    # backward compatibility with existing consumers.
                    "recurrence_rule": (
                        definition.recurrence.to_dict()
                        if definition.recurrence
                        else None
                    ),
                    "last_completed_at": (
                        state.last_completed_at.isoformat(timespec="seconds")
                        if state.last_completed_at
                        else None
                    ),
                    "created_at": definition.created_at.isoformat(timespec="seconds"),
                    "sort_order": state.sort_order,
                }
            )

        return results
