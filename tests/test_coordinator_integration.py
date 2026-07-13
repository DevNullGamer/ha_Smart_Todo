"""HA-backed integration tests for SmartTodoCoordinator.

Unlike test_recurrence.py/test_reward_points.py/test_spending.py, these tests
exercise the real config-entry setup path (custom_components/smart_todo's
__init__.py, coordinator.py, storage.py, services.py) against a real
(in-memory) Home Assistant core instance via pytest-homeassistant-custom-component,
rather than loading modules standalone. This is what lets coordinator/storage/
service-level behavior actually be verified by running tests instead of only
by manual code-trace review.

Each test below ports a scenario that was previously verified by hand during
development and caught a real bug at the time:
- test_reopen_does_not_double_award_points: the reopen-exploit fix (points
  could be earned repeatedly via complete -> reopen -> complete).
- test_earned_total_survives_purge_completed: earned totals are persisted
  independently of the tasks that earned them, so deleting a task doesn't
  erase a recipient's earned history.
- test_roster_options_update_reloads_cleanly: a roster edit (which triggers
  a config-entry reload) must not crash on duplicate static-path
  registration or leave services unregistered.
- test_config_entry_id_targets_specific_list: multi-list service targeting —
  the actual new logic this test file's own diff is meant to guard. Goes
  through hass.services.async_call (the real service layer: schema
  validation, _get_coordinator's config_entry_id resolution) rather than
  calling coordinator methods directly, unlike the other three tests above.
"""
from __future__ import annotations

import pytest
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.smart_todo.const import DOMAIN


async def _setup_entry(
    hass: HomeAssistant, options: dict | None = None, name: str = "Test List"
) -> MockConfigEntry:
    """Create and set up a Smart Todo config entry, returning it once loaded.

    async_setup_entry unconditionally registers a static path via
    hass.http, so the http component must be set up first — the bare `hass`
    fixture doesn't include it by default.
    """
    await async_setup_component(hass, "http", {})
    entry = MockConfigEntry(domain=DOMAIN, data={"name": name}, options=options or {})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def test_reopen_does_not_double_award_points(hass: HomeAssistant) -> None:
    """complete -> reopen -> complete on a non-recurring task must only award once."""
    entry = await _setup_entry(hass)
    coordinator = hass.data[DOMAIN][entry.entry_id]

    task_id = await coordinator.async_create_task(
        {"title": "Clean room", "points": 5, "reward_recipient": "Mina"}
    )

    await coordinator.async_complete_task(task_id)
    assert coordinator.get_balance("Mina") == 5

    await coordinator.async_reopen_task(task_id)
    await coordinator.async_complete_task(task_id)

    assert coordinator.get_balance("Mina") == 5


async def test_earned_total_survives_purge_completed(hass: HomeAssistant) -> None:
    """Deleting the task that earned points must not erase the earned total."""
    entry = await _setup_entry(hass)
    coordinator = hass.data[DOMAIN][entry.entry_id]

    task_id = await coordinator.async_create_task(
        {"title": "One-off chore", "points": 10, "reward_recipient": "Mina"}
    )
    await coordinator.async_complete_task(task_id)
    assert coordinator.get_balance("Mina") == 10

    await coordinator.async_purge_completed()

    assert coordinator.data is not None
    assert task_id not in coordinator.data
    assert coordinator.get_balance("Mina") == 10


async def test_roster_options_update_reloads_cleanly(hass: HomeAssistant) -> None:
    """Editing the roster triggers a reload that must not break the integration.

    The reload re-runs async_setup_entry for the same entry; it must not try
    to re-register the static frontend path (which has no matching
    "unregister") and must not leave smart_todo.* services unregistered.
    """
    entry = await _setup_entry(hass, options={"roster": ["Mina"]})
    assert entry.state is ConfigEntryState.LOADED
    assert hass.services.has_service(DOMAIN, "create_task")

    hass.config_entries.async_update_entry(
        entry, options={"roster": ["Mina", "Oskar"]}
    )
    await hass.async_block_till_done()

    assert entry.state is ConfigEntryState.LOADED
    assert hass.services.has_service(DOMAIN, "create_task")
    assert hass.services.has_service(DOMAIN, "spend_points")


async def test_config_entry_id_targets_specific_list(hass: HomeAssistant) -> None:
    """With 2+ lists configured, a service call must require config_entry_id
    and route to the specified list, not silently pick one."""
    entry_a = await _setup_entry(hass, name="Chores")
    entry_b = await _setup_entry(hass, name="Groceries")

    # Ambiguous — no target, more than one list — must raise, not guess.
    with pytest.raises(HomeAssistantError):
        await hass.services.async_call(
            DOMAIN, "create_task", {"title": "Ambiguous"}, blocking=True
        )

    # Explicit target routes to the correct list and only that list.
    await hass.services.async_call(
        DOMAIN,
        "create_task",
        {"title": "Buy groceries", "config_entry_id": entry_b.entry_id},
        blocking=True,
    )

    coordinator_a = hass.data[DOMAIN][entry_a.entry_id]
    coordinator_b = hass.data[DOMAIN][entry_b.entry_id]
    assert coordinator_a.data == {}
    assert len(coordinator_b.data) == 1
