"""Persistent storage layer for the Smart Todo integration."""
from __future__ import annotations

import logging

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import STORAGE_KEY, STORAGE_VERSION
from .models import TaskDefinition, TaskRuntimeState

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
            }
        }

    The ``overdue`` field is a derived property on :class:`TaskRuntimeState` and
    is intentionally excluded from ``to_dict()``; this class never adds it back.
    """

    def __init__(self, hass: HomeAssistant) -> None:
        self._store: Store[dict] = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self._definitions: dict[str, TaskDefinition] = {}
        self._states: dict[str, TaskRuntimeState] = {}

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
            return

        stored_version = data.get("version", 0)
        if stored_version < STORAGE_VERSION:
            await self._async_migrate(data)
            # Re-read after migration (migration may have written new data).
            data = await self._store.async_load()
            if data is None:
                self._definitions = {}
                self._states = {}
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

        self._definitions = definitions
        self._states = states

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
