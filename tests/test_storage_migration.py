"""Unit tests for SmartTodoStore's migration registry (storage.py).

_migrate_v1_to_v2 is pure dict -> dict logic, but storage.py imports real
homeassistant modules at module level (Store, HomeAssistant) — unlike
test_recurrence.py/test_reward_points.py/test_spending.py, which load
models.py/recurrence.py standalone specifically to avoid that dependency,
this file needs the pytest-homeassistant-custom-component environment (see
conftest.py) purely so the import below can resolve. None of these tests use
the `hass` fixture — they call the migration function directly.
"""
from __future__ import annotations

import copy

from custom_components.smart_todo.storage import _migrate_v1_to_v2


def test_migrate_v1_to_v2_is_idempotent_when_ledger_already_present() -> None:
    """The common real-world case: v1-tagged data that already carries the
    spend-ledger keys (written ad-hoc, before this migration mechanism
    existed) must only get its version bumped — not have its data
    recomputed or altered."""
    data = {
        "version": 1,
        "definitions": {},
        "states": {},
        "spend_entries": [
            {
                "id": "s1",
                "recipient": "mina",
                "amount": 5,
                "timestamp": "2026-01-01T00:00:00+00:00",
                "note": None,
            }
        ],
        "earned_totals": {"mina": 20},
        "recipient_display_names": {"mina": "Mina"},
    }

    migrated = _migrate_v1_to_v2(data)

    assert migrated["version"] == 2
    assert migrated["spend_entries"] == data["spend_entries"]
    assert migrated["earned_totals"] == {"mina": 20}
    assert migrated["recipient_display_names"] == {"mina": "Mina"}


def test_migrate_v1_to_v2_backfills_earned_totals_from_legacy_data() -> None:
    """A true pre-ledger v1 payload (no spend_entries/earned_totals keys at
    all) must backfill earned_totals/recipient_display_names from historical
    per-task points_earned, matching what each task actually accrued."""
    data = {
        "version": 1,
        "definitions": {
            "task-1": {
                "id": "task-1",
                "title": "Clean room",
                "reward_recipient": "Mina",
                "assignee": None,
            },
            "task-2": {
                "id": "task-2",
                "title": "Groceries",
                "reward_recipient": None,
                "assignee": "Oskar",
            },
        },
        "states": {
            "task-1": {"id": "task-1", "points_earned": 15},
            "task-2": {"id": "task-2", "points_earned": 5},
        },
    }

    migrated = _migrate_v1_to_v2(data)

    assert migrated["version"] == 2
    assert migrated["spend_entries"] == []
    assert migrated["earned_totals"] == {"mina": 15, "oskar": 5}
    assert migrated["recipient_display_names"] == {"mina": "Mina", "oskar": "Oskar"}


def test_migrate_v1_to_v2_skips_tasks_with_no_points_earned() -> None:
    """A task that never earned points must not appear in the backfill."""
    data = {
        "version": 1,
        "definitions": {
            "task-1": {"id": "task-1", "reward_recipient": "Mina", "assignee": None},
        },
        "states": {
            "task-1": {"id": "task-1", "points_earned": 0},
        },
    }

    migrated = _migrate_v1_to_v2(data)

    assert migrated["earned_totals"] == {}
    assert migrated["recipient_display_names"] == {}


def test_migrate_v1_to_v2_does_not_mutate_input() -> None:
    """Must return a new dict, not mutate the caller's — including nested
    structures (definitions/states), not just the top level. Every
    _MIGRATIONS entry is documented as a pure dict -> dict function; a
    shallow-only copy would satisfy a top-level-only version of this test
    while still aliasing (and risking mutation of) the caller's nested
    dicts."""
    data = {
        "version": 1,
        "definitions": {"task-1": {"id": "task-1", "title": "Clean room"}},
        "states": {"task-1": {"id": "task-1", "points_earned": 5}},
    }
    original = copy.deepcopy(data)

    result = _migrate_v1_to_v2(data)
    result["definitions"]["task-1"]["title"] = "Mutated"
    result["states"]["task-1"]["points_earned"] = 999

    assert data == original
