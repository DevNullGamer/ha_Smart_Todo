"""Service handlers for the Smart Todo integration."""
from __future__ import annotations

import logging
from datetime import datetime

import voluptuous as vol
from homeassistant.core import HomeAssistant, ServiceCall, SupportsResponse
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import config_validation as cv

from .const import (
    DOMAIN,
    PRIORITY_HIGH,
    PRIORITY_LOW,
    SERVICE_COMPLETE_TASK,
    SERVICE_CREATE_TASK,
    SERVICE_DELETE_TASK,
    SERVICE_GET_TASKS,
    SERVICE_RECALCULATE_RECURRENCE,
    SERVICE_REOPEN_TASK,
    SERVICE_SNOOZE_TASK,
    SERVICE_UPDATE_TASK,
)
from .coordinator import SmartTodoCoordinator

_LOGGER = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------

CREATE_TASK_SCHEMA = vol.Schema(
    {
        vol.Required("title"): cv.string,
        vol.Optional("notes"): vol.Any(None, cv.string),
        vol.Optional("due_at"): vol.Any(None, cv.string),
        vol.Optional("priority", default=2): vol.In([1, 2, 3]),
        vol.Optional("assignee"): vol.Any(None, cv.string),
        vol.Optional("recurrence"): vol.Any(None, dict),
    }
)

TASK_ID_SCHEMA = vol.Schema(
    {
        vol.Required("task_id"): cv.string,
    }
)

UPDATE_TASK_SCHEMA = vol.Schema(
    {
        vol.Required("task_id"): cv.string,
        vol.Optional("title"): cv.string,
        vol.Optional("notes"): vol.Any(None, cv.string),
        vol.Optional("due_at"): vol.Any(None, cv.string),
        vol.Optional("priority"): vol.In([1, 2, 3]),
        vol.Optional("assignee"): vol.Any(None, cv.string),
        vol.Optional("recurrence"): vol.Any(None, dict),
    }
)

SNOOZE_TASK_SCHEMA = vol.Schema(
    {
        vol.Required("task_id"): cv.string,
        vol.Optional("snooze_until"): cv.string,
    }
)

RECALCULATE_SCHEMA = vol.Schema(
    {
        vol.Optional("task_id"): vol.Any(None, cv.string),
    }
)

GET_TASKS_SCHEMA = vol.Schema(
    {
        vol.Optional("overdue_only", default=False): cv.boolean,
        vol.Optional("assignee"): vol.Any(None, cv.string),
        vol.Optional("priority"): vol.Any(None, vol.In([1, 2, 3])),
        vol.Optional("completed"): vol.Any(None, cv.boolean),
    }
)

# ---------------------------------------------------------------------------
# Helper
# ---------------------------------------------------------------------------


def _get_coordinator(hass: HomeAssistant, call: ServiceCall) -> SmartTodoCoordinator:
    """Return the first registered coordinator. Raises HomeAssistantError if none."""
    domain_data = hass.data.get(DOMAIN, {})
    if not domain_data:
        raise HomeAssistantError("Smart Todo integration is not configured.")
    # Return first entry's coordinator (single-entry assumption for now)
    return next(iter(domain_data.values()))


def _parse_iso_datetime(value: str, field_name: str) -> datetime:
    """Parse an ISO 8601 datetime string. Raises HomeAssistantError on failure."""
    try:
        return datetime.fromisoformat(value)
    except (ValueError, TypeError) as exc:
        raise HomeAssistantError(
            f"Invalid ISO 8601 datetime for '{field_name}': {value!r}. "
            "Expected format: YYYY-MM-DDTHH:MM:SS or YYYY-MM-DDTHH:MM:SS+HH:MM"
        ) from exc


# ---------------------------------------------------------------------------
# Service handlers
# ---------------------------------------------------------------------------


async def async_create_task(call: ServiceCall) -> None:
    """Handle the create_task service call."""
    coordinator = _get_coordinator(call.hass, call)

    definition_data: dict = {
        "title": call.data["title"],
        "notes": call.data.get("notes"),
        "priority": call.data.get("priority", 2),
        "assignee": call.data.get("assignee"),
        "recurrence": call.data.get("recurrence"),
    }

    due_at_raw = call.data.get("due_at")
    if due_at_raw is not None:
        # Validate the ISO string; coordinator will re-parse it
        _parse_iso_datetime(due_at_raw, "due_at")
        definition_data["due_at"] = due_at_raw

    await coordinator.async_create_task(definition_data)


async def async_complete_task(call: ServiceCall) -> None:
    """Handle the complete_task service call."""
    coordinator = _get_coordinator(call.hass, call)
    await coordinator.async_complete_task(call.data["task_id"])


async def async_reopen_task(call: ServiceCall) -> None:
    """Handle the reopen_task service call."""
    coordinator = _get_coordinator(call.hass, call)
    await coordinator.async_reopen_task(call.data["task_id"])


async def async_update_task(call: ServiceCall) -> None:
    """Handle the update_task service call."""
    coordinator = _get_coordinator(call.hass, call)

    task_id: str = call.data["task_id"]
    patch: dict = {k: v for k, v in call.data.items() if k != "task_id"}

    # Validate due_at if present and non-None
    if "due_at" in patch and patch["due_at"] is not None:
        _parse_iso_datetime(patch["due_at"], "due_at")

    await coordinator.async_update_task(task_id, patch)


async def async_snooze_task(call: ServiceCall) -> None:
    """Handle the snooze_task service call."""
    coordinator = _get_coordinator(call.hass, call)

    task_id: str = call.data["task_id"]
    snooze_until_raw: str | None = call.data.get("snooze_until")

    if snooze_until_raw is None:
        raise HomeAssistantError("snooze_until is required for snooze_task.")

    snooze_until_dt = _parse_iso_datetime(snooze_until_raw, "snooze_until")
    await coordinator.async_snooze_task(task_id, snooze_until_dt)


async def async_delete_task(call: ServiceCall) -> None:
    """Handle the delete_task service call."""
    coordinator = _get_coordinator(call.hass, call)
    await coordinator.async_delete_task(call.data["task_id"])


async def async_recalculate_recurrence(call: ServiceCall) -> None:
    """Handle the recalculate_recurrence service call."""
    coordinator = _get_coordinator(call.hass, call)
    await coordinator.async_recalculate_all(task_id=call.data.get("task_id"))


async def async_get_tasks(call: ServiceCall) -> dict:
    """Handle the get_tasks service call. Returns task list as response data."""
    coordinator = _get_coordinator(call.hass, call)

    result_list = coordinator.get_tasks_as_list(
        overdue_only=call.data.get("overdue_only", False),
        assignee=call.data.get("assignee"),
        priority=call.data.get("priority"),
        completed=call.data.get("completed"),
    )
    return {"tasks": result_list}


# ---------------------------------------------------------------------------
# Registration / unregistration
# ---------------------------------------------------------------------------


def async_register_services(hass: HomeAssistant) -> None:
    """Register all Smart Todo services. Called once from __init__.py."""
    hass.services.async_register(
        DOMAIN, SERVICE_CREATE_TASK, async_create_task, schema=CREATE_TASK_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_COMPLETE_TASK, async_complete_task, schema=TASK_ID_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_REOPEN_TASK, async_reopen_task, schema=TASK_ID_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_UPDATE_TASK, async_update_task, schema=UPDATE_TASK_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_SNOOZE_TASK, async_snooze_task, schema=SNOOZE_TASK_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_DELETE_TASK, async_delete_task, schema=TASK_ID_SCHEMA
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_RECALCULATE_RECURRENCE,
        async_recalculate_recurrence,
        schema=RECALCULATE_SCHEMA,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_GET_TASKS,
        async_get_tasks,
        schema=GET_TASKS_SCHEMA,
        supports_response=SupportsResponse.ONLY,
    )


def async_unregister_services(hass: HomeAssistant) -> None:
    """Unregister all Smart Todo services. Called from __init__.py on unload."""
    for service in [
        SERVICE_CREATE_TASK,
        SERVICE_COMPLETE_TASK,
        SERVICE_REOPEN_TASK,
        SERVICE_UPDATE_TASK,
        SERVICE_SNOOZE_TASK,
        SERVICE_DELETE_TASK,
        SERVICE_RECALCULATE_RECURRENCE,
        SERVICE_GET_TASKS,
    ]:
        hass.services.async_remove(DOMAIN, service)
