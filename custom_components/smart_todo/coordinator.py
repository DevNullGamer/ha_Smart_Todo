"""DataUpdateCoordinator for the Smart Todo integration."""
from __future__ import annotations

import logging
from datetime import datetime, timezone, timedelta

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from .const import DOMAIN, DEFAULT_UPDATE_INTERVAL_SECONDS, PRIORITY_LABELS
from .models import TaskDefinition, TaskRuntimeState, RecurrenceRule, make_task_id
from .storage import SmartTodoStore
from .recurrence import next_due_date, is_overdue, describe_rule

_LOGGER = logging.getLogger(__name__)


class SmartTodoCoordinator(
    DataUpdateCoordinator[dict[str, tuple[TaskDefinition, TaskRuntimeState]]]
):
    """Coordinator that owns all task state and persists via SmartTodoStore."""

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        self._store = SmartTodoStore(hass)
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

    async def async_complete_task(self, task_id: str) -> None:
        """Mark a task complete.

        For recurring tasks the completion is registered, a new due_at is
        computed, and completed is immediately reset to False so the task
        remains active on the next recurrence.
        """
        states = self._store.states
        definitions = self._store.definitions

        if task_id not in states:
            raise ValueError(f"Task {task_id} not found")

        state = states[task_id]
        definition = definitions.get(task_id)
        now = datetime.now(timezone.utc)

        state.completed = True
        state.last_completed_at = now
        state.snoozed_until = None

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

        self._store.set_state(state)
        await self._store.async_save()
        await self.async_refresh()

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
                or definition.assignee.lower() != assignee.lower()
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
