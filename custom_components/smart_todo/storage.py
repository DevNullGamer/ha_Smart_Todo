"""Persistent storage layer for the Smart Todo integration."""
from __future__ import annotations

import copy
import logging
from collections.abc import Callable

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import STORAGE_KEY, STORAGE_VERSION
from .models import SpendEntry, TaskDefinition, TaskRuntimeState

_LOGGER = logging.getLogger(__name__)

# Home Assistant's own Store envelope version, passed to Store's constructor
# below — intentionally kept fixed at 1 forever, entirely separate from
# STORAGE_VERSION (this integration's own nested app-level schema version,
# tracked in data["version"] and handled by _MIGRATIONS below).
#
# SmartTodoStore never overrides Store's _async_migrate_func. HA's Store only
# tolerates an envelope version mismatch silently when just the *minor*
# version differs (or a migrate_func is provided) — a *major* version
# mismatch with the default (NotImplementedError-raising) migrate_func
# propagates out of Store.async_load() as an unhandled exception. Since this
# integration already does all of its own schema evolution via the nested
# "version" field / _MIGRATIONS, the outer envelope version must never
# change, or every existing install would fail to load on upgrade.
_HA_STORE_VERSION = 1


def _migrate_v1_to_v2(data: dict) -> dict:
    """v1 -> v2: add the spend ledger (spend_entries, earned_totals,
    recipient_display_names).

    Backfills earned_totals/recipient_display_names from historical per-task
    points_earned when those keys aren't already present. Idempotent: every
    real install's data already carries these keys (they were written
    ad-hoc, without a version bump, before this migration mechanism
    existed) — for those, this only bumps the version number.
    """
    # Deep, not shallow: _MIGRATIONS entries are documented as pure
    # dict -> dict functions, so nested structures (definitions/states) must
    # not alias the caller's dict either, even though this particular
    # migration only reads them today — a future migration that needs to
    # transform something inside them shouldn't have to remember to copy.
    data = copy.deepcopy(data)
    data.setdefault("spend_entries", [])

    if "earned_totals" not in data or "recipient_display_names" not in data:
        definitions_raw: dict = data.get("definitions") or {}
        states_raw: dict = data.get("states") or {}

        earned_totals: dict[str, int] = {}
        display_names: dict[str, str] = {}
        for task_id, state_raw in states_raw.items():
            points_earned = state_raw.get("points_earned", 0)
            if not points_earned or points_earned <= 0:
                continue
            definition_raw = definitions_raw.get(task_id)
            if definition_raw is None:
                continue
            who = definition_raw.get("reward_recipient") or definition_raw.get("assignee")
            if who is None:
                continue
            key = who.strip().lower()
            earned_totals[key] = earned_totals.get(key, 0) + points_earned
            display_names.setdefault(key, who.strip())

        data.setdefault("earned_totals", earned_totals)
        data.setdefault("recipient_display_names", display_names)

    data["version"] = 2
    return data


# Registered migrations, keyed by the version they migrate FROM. New schema
# changes that need a real one-time transform (not just a new field with a
# safe default — TaskDefinition/TaskRuntimeState's own `.get(key, default)`
# in from_dict already handles those) register a new entry here, rather than
# another ad-hoc inline backfill in async_load.
_MIGRATIONS: dict[int, Callable[[dict], dict]] = {
    1: _migrate_v1_to_v2,
}


class SmartTodoStore:
    """Wrapper around HA's Store that handles load, save, and schema migration.

    Stored data shape (current version)::

        {
            "version": 2,
            "definitions": {
                "<task_id>": { ...TaskDefinition.to_dict() }
            },
            "states": {
                "<task_id>": { ...TaskRuntimeState.to_dict() }
            },
            "spend_entries": [ ...SpendEntry.to_dict() ],
            "earned_totals": { "<normalized recipient name>": int },
            "recipient_display_names": { "<normalized recipient name>": str }
        }

    The ``overdue`` field is a derived property on :class:`TaskRuntimeState` and
    is intentionally excluded from ``to_dict()``; this class never adds it back.

    ``earned_totals`` is intentionally NOT derived from task state at read
    time: tasks (and the ``points_earned`` recorded on their runtime state)
    can be permanently deleted via ``purge_completed`` or ``delete_task``,
    which would otherwise silently erase a recipient's earned history and
    push their balance negative once compared against their (undeletable)
    spend ledger. It is persisted independently and incremented at the
    moment points are awarded (see ``SmartTodoCoordinator.async_complete_task``).
    """

    def __init__(self, hass: HomeAssistant) -> None:
        self._store: Store[dict] = Store(hass, _HA_STORE_VERSION, STORAGE_KEY)
        self._definitions: dict[str, TaskDefinition] = {}
        self._states: dict[str, TaskRuntimeState] = {}
        self._spend_entries: list[SpendEntry] = []
        self._earned_totals: dict[str, int | float] = {}
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

        # By this point data["version"] == STORAGE_VERSION — either it
        # already was, or _async_migrate() just brought it up to date — so
        # earned_totals/recipient_display_names/spend_entries are guaranteed
        # present (every migration ensures its own target shape).
        earned_totals: dict[str, int | float] = dict(data.get("earned_totals") or {})
        display_names: dict[str, str] = dict(data.get("recipient_display_names") or {})

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
        """Run registered migrations sequentially until data reaches STORAGE_VERSION.

        Each migration in _MIGRATIONS is a pure ``dict -> dict`` function,
        keyed by the version it migrates FROM, and sets the new version on
        its output. The fully migrated dict is persisted once at the end;
        the caller (async_load) re-reads from the store afterward.

        Raises RuntimeError rather than silently proceeding if a required
        migration is missing (e.g. the integration was downgraded after
        being run with a newer version) or if a migration fails to advance
        the version number (a bug in that migration, which would otherwise
        loop forever). async_load has no fallback for a partially-migrated
        dict — better to fail loudly during setup than silently drop the
        recipient point ledger on the next save.
        """
        original_version = data.get("version", 0)
        while data.get("version", 0) < STORAGE_VERSION:
            from_version = data.get("version", 0)
            migration = _MIGRATIONS.get(from_version)
            if migration is None:
                raise RuntimeError(
                    f"smart_todo: no migration registered from storage version "
                    f"{from_version} to {STORAGE_VERSION} — refusing to load "
                    f"(this usually means the integration was downgraded after "
                    f"running with a newer version)"
                )
            data = migration(data)
            if data.get("version", 0) <= from_version:
                raise RuntimeError(
                    f"smart_todo: migration from version {from_version} did not "
                    f"advance the stored version — aborting to avoid an infinite loop"
                )

        _LOGGER.info(
            "smart_todo: migrated storage from version %d to %d",
            original_version,
            STORAGE_VERSION,
        )
        await self._store.async_save(data)

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
    def earned_totals(self) -> dict[str, int | float]:
        """Return a shallow copy of all persisted per-recipient earned totals.

        Keyed by normalized (``strip().lower()``) recipient name. Values are
        float only for recipients who have received a split (multi-person)
        award at some point; whole-point awards stay int.
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

    def add_earned(self, normalized_recipient: str, amount: int | float) -> None:
        """Credit *amount* points to a recipient's persisted earned total."""
        self._earned_totals[normalized_recipient] = (
            self._earned_totals.get(normalized_recipient, 0) + amount
        )

    def record_recipient_seen(self, normalized_recipient: str, display_name: str) -> None:
        """Remember a recipient's display casing, first-seen wins."""
        self._recipient_display_names.setdefault(normalized_recipient, display_name)
