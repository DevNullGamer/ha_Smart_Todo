"""Persistent storage layer for the Smart Todo integration."""
from __future__ import annotations

import logging

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import STORAGE_KEY, STORAGE_VERSION
from .models import SpendEntry, TaskDefinition, TaskRuntimeState

_LOGGER = logging.getLogger(__name__)


class SmartTodoStore:
    """Wrapper around HA's Store that handles load, save, and schema migration.

    Stored data shape (version 1)::

        {
            "version": 1,
            "definitions": {
                "<task_id>": { ...TaskDefinition.to_dict() }
            },
            "states": {
                "<task_id>": { ...TaskRuntimeState.to_dict() }
            },
            "spend_entries": [ ...SpendEntry.to_dict() ],
            "earned_totals": { "<normalized recipient name>": int }
        }

    The ``overdue`` field is a derived property on :class:`TaskRuntimeState` and
    is intentionally excluded from ``to_dict()``; this class never adds it back.

    ``spend_entries``/``earned_totals`` were added after the initial release
    without bumping ``STORAGE_VERSION`` — loaded additively (``.get(key, ...)``),
    matching how ``points``/``reward_recipient`` were added to task definitions.

    ``earned_totals`` is intentionally NOT derived from task state at read
    time: tasks (and the ``points_earned`` recorded on their runtime state)
    can be permanently deleted via ``purge_completed`` or ``delete_task``,
    which would otherwise silently erase a recipient's earned history and
    push their balance negative once compared against their (undeletable)
    spend ledger. It is persisted independently and incremented at the
    moment points are awarded (see ``SmartTodoCoordinator.async_complete_task``).
    """

    def __init__(self, hass: HomeAssistant) -> None:
        self._store: Store[dict] = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self._definitions: dict[str, TaskDefinition] = {}
        self._states: dict[str, TaskRuntimeState] = {}
        self._spend_entries: list[SpendEntry] = []
        self._earned_totals: dict[str, int] = {}
        self._recipient_display_names: dict[str, str] = {}

    # ------------------------------------------------------------------
    # Public async I/O
    # ------------------------------------------------------------------

    async def async_load(self) -> None:
        """Load persisted data from disk into memory.

        Handles:
        - Empty store (None) → initialise empty dicts.
        - Outdated version → call migration helper then re-read.
        - Deserialisation errors → log warning per task and skip.
        """
        data: dict | None = await self._store.async_load()

        if data is None:
            self._definitions = {}
            self._states = {}
            self._spend_entries = []
            self._earned_totals = {}
            self._recipient_display_names = {}
            return

        stored_version = data.get("version", 0)
        if stored_version < STORAGE_VERSION:
            await self._async_migrate(data)
            # Re-read after migration (migration may have written new data).
            data = await self._store.async_load()
            if data is None:
                self._definitions = {}
                self._states = {}
                self._spend_entries = []
                self._earned_totals = {}
                self._recipient_display_names = {}
                return

        definitions: dict[str, TaskDefinition] = {}
        for task_id, raw in (data.get("definitions") or {}).items():
            try:
                definitions[task_id] = TaskDefinition.from_dict(raw)
            except Exception:  # noqa: BLE001
                _LOGGER.warning(
                    "smart_todo: failed to deserialise definition for task %r — skipping",
                    task_id,
                    exc_info=True,
                )

        states: dict[str, TaskRuntimeState] = {}
        for task_id, raw in (data.get("states") or {}).items():
            try:
                states[task_id] = TaskRuntimeState.from_dict(raw)
            except Exception:  # noqa: BLE001
                _LOGGER.warning(
                    "smart_todo: failed to deserialise state for task %r — skipping",
                    task_id,
                    exc_info=True,
                )

        spend_entries: list[SpendEntry] = []
        for raw in data.get("spend_entries") or []:
            try:
                spend_entries.append(SpendEntry.from_dict(raw))
            except Exception:  # noqa: BLE001
                _LOGGER.warning(
                    "smart_todo: failed to deserialise a spend entry — skipping",
                    exc_info=True,
                )

        if "earned_totals" in data:
            earned_totals: dict[str, int] = dict(data["earned_totals"] or {})
            display_names: dict[str, str] = dict(data.get("recipient_display_names") or {})
        else:
            # First load after upgrading from a version without a persisted
            # ledger (chg001) — backfill once from historical per-task
            # points_earned so already-accrued totals aren't lost. After this
            # save, the "earned_totals" key always exists (even if empty), so
            # this branch never re-fires and never double-counts.
            earned_totals = {}
            display_names = {}
            for task_id, state in states.items():
                if state.points_earned <= 0:
                    continue
                definition = definitions.get(task_id)
                if definition is None:
                    continue
                who = definition.reward_recipient or definition.assignee
                if who is None:
                    continue
                key = who.strip().lower()
                earned_totals[key] = earned_totals.get(key, 0) + state.points_earned
                display_names.setdefault(key, who.strip())

        self._definitions = definitions
        self._states = states
        self._spend_entries = spend_entries
        self._earned_totals = earned_totals
        self._recipient_display_names = display_names

    async def async_save(self) -> None:
        """Serialise current in-memory data and write to disk."""
        data: dict = {
            "version": STORAGE_VERSION,
            "definitions": {
                task_id: defn.to_dict()
                for task_id, defn in self._definitions.items()
            },
            "states": {
                task_id: state.to_dict()
                for task_id, state in self._states.items()
            },
            "spend_entries": [entry.to_dict() for entry in self._spend_entries],
            "earned_totals": dict(self._earned_totals),
            "recipient_display_names": dict(self._recipient_display_names),
        }
        await self._store.async_save(data)

    # ------------------------------------------------------------------
    # Migration
    # ------------------------------------------------------------------

    async def _async_migrate(self, data: dict) -> None:
        """Migrate stored data from an older schema version.

        Currently a stub: logs a warning and allows a best-effort load of the
        existing data.  Concrete migration logic should be added here when the
        schema is bumped beyond version 1.
        """
        from_version = data.get("version", 0)
        _LOGGER.warning(
            "smart_todo: migration from storage version %d to %d is not yet "
            "implemented — attempting best-effort load of existing data",
            from_version,
            STORAGE_VERSION,
        )

    # ------------------------------------------------------------------
    # Properties — return copies so callers cannot mutate internal state
    # ------------------------------------------------------------------

    @property
    def definitions(self) -> dict[str, TaskDefinition]:
        """Return a shallow copy of all task definitions."""
        return dict(self._definitions)

    @property
    def states(self) -> dict[str, TaskRuntimeState]:
        """Return a shallow copy of all task runtime states."""
        return dict(self._states)

    @property
    def spend_entries(self) -> list[SpendEntry]:
        """Return a shallow copy of all spend ledger entries."""
        return list(self._spend_entries)

    @property
    def earned_totals(self) -> dict[str, int]:
        """Return a shallow copy of all persisted per-recipient earned totals.

        Keyed by normalized (``strip().lower()``) recipient name.
        """
        return dict(self._earned_totals)

    @property
    def recipient_display_names(self) -> dict[str, str]:
        """Return normalized recipient name -> first-seen display casing."""
        return dict(self._recipient_display_names)

    # ------------------------------------------------------------------
    # Mutation helpers (called by the coordinator in Stage 5)
    # ------------------------------------------------------------------

    def set_definition(self, definition: TaskDefinition) -> None:
        """Add or replace a task definition."""
        self._definitions[definition.id] = definition

    def set_state(self, state: TaskRuntimeState) -> None:
        """Add or replace a task runtime state."""
        self._states[state.id] = state

    def delete_task(self, task_id: str) -> None:
        """Remove a task from both definitions and states.

        No-op if ``task_id`` is not present in either dict.
        """
        self._definitions.pop(task_id, None)
        self._states.pop(task_id, None)

    def add_spend_entry(self, entry: SpendEntry) -> None:
        """Append a new spend ledger entry."""
        self._spend_entries.append(entry)

    def add_earned(self, normalized_recipient: str, amount: int) -> None:
        """Credit *amount* points to a recipient's persisted earned total."""
        self._earned_totals[normalized_recipient] = (
            self._earned_totals.get(normalized_recipient, 0) + amount
        )

    def record_recipient_seen(self, normalized_recipient: str, display_name: str) -> None:
        """Remember a recipient's display casing, first-seen wins."""
        self._recipient_display_names.setdefault(normalized_recipient, display_name)
