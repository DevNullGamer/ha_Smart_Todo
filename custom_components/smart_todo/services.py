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
    SERVICE_PURGE_COMPLETED,
    SERVICE_RECALCULATE_RECURRENCE,
    SERVICE_REOPEN_TASK,
    SERVICE_SNOOZE_TASK,
    SERVICE_SPEND_POINTS,
    SERVICE_UPDATE_TASK,
)
from .coordinator import SmartTodoCoordinator

_LOGGER = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------

# Every service schema is built through _service_schema() below, which adds
# this shared optional field. Only needed when more than one Smart Todo list
# is configured; omitted, the call auto-resolves to "the only list" and
# behaves exactly as before.
_CONFIG_ENTRY_ID_FIELD = {vol.Optional("config_entry_id"): cv.string}


def _service_schema(fields: dict) -> vol.Schema:
    """Build a service schema, adding the shared list-targeting field.

    Centralizing this (rather than splicing _CONFIG_ENTRY_ID_FIELD into each
    schema literal) means a newly added service schema only supports
    list-targeting by explicitly going through this function.
    """
    return vol.Schema(fields).extend(_CONFIG_ENTRY_ID_FIELD)


CREATE_TASK_SCHEMA = _service_schema(
    {
        vol.Required("title"): cv.string,
        vol.Optional("notes"): vol.Any(None, cv.string),
        vol.Optional("due_at"): vol.Any(None, cv.string),
        vol.Optional("priority", default=2): vol.In([1, 2, 3]),
        vol.Optional("assignee"): vol.Any(None, cv.string),
        vol.Optional("recurrence"): vol.Any(None, dict),
        vol.Optional("points", default=0): vol.All(vol.Coerce(int), vol.Range(min=0)),
        vol.Optional("reward_recipient"): vol.Any(None, cv.string),
    }
)

TASK_ID_SCHEMA = _service_schema(
    {
        vol.Required("task_id"): cv.string,
    }
)

COMPLETE_TASK_SCHEMA = _service_schema(
    {
        vol.Required("task_id"): cv.string,
        # Overrides the normal reward_recipient/assignee auto-resolution:
        # points split evenly across these people. Omit to keep today's
        # behaviour; pass an empty list to explicitly award nobody.
        vol.Optional("recipients"): vol.All(cv.ensure_list, [cv.string]),
    }
)

UPDATE_TASK_SCHEMA = _service_schema(
    {
        vol.Required("task_id"): cv.string,
        vol.Optional("title"): cv.string,
        vol.Optional("notes"): vol.Any(None, cv.string),
        vol.Optional("due_at"): vol.Any(None, cv.string),
        vol.Optional("priority"): vol.In([1, 2, 3]),
        vol.Optional("assignee"): vol.Any(None, cv.string),
        vol.Optional("recurrence"): vol.Any(None, dict),
        vol.Optional("points"): vol.All(vol.Coerce(int), vol.Range(min=0)),
        vol.Optional("reward_recipient"): vol.Any(None, cv.string),
    }
)

SNOOZE_TASK_SCHEMA = _service_schema(
    {
        vol.Required("task_id"): cv.string,
        vol.Optional("snooze_until"): cv.string,
    }
)

RECALCULATE_SCHEMA = _service_schema(
    {
        vol.Optional("task_id"): vol.Any(None, cv.string),
    }
)

GET_TASKS_SCHEMA = _service_schema(
    {
        vol.Optional("overdue_only", default=False): cv.boolean,
        vol.Optional("assignee"): vol.Any(None, cv.string),
        vol.Optional("priority"): vol.Any(None, vol.In([1, 2, 3])),
        vol.Optional("completed"): vol.Any(None, cv.boolean),
    }
)

PURGE_COMPLETED_SCHEMA = _service_schema({})

SPEND_POINTS_SCHEMA = _service_schema(
    {
        vol.Required("recipient"): cv.string,
        vol.Required("amount"): vol.All(vol.Coerce(int), vol.Range(min=1)),
        vol.Optional("note"): vol.Any(None, cv.string),
    }
)

# ---------------------------------------------------------------------------
# Helper
# ---------------------------------------------------------------------------


def _get_coordinator(hass: HomeAssistant, call: ServiceCall) -> SmartTodoCoordinator:
    """Return the coordinator for the targeted Smart Todo list.

    If `config_entry_id` is present in the call data, resolve directly to
    that list. Otherwise auto-resolve when exactly one list is configured —
    the common case, and identical to this integration's original behaviour.
    With multiple lists configured and no target given, raise a clear error
    naming the available lists rather than silently picking one.
    """
    domain_data = hass.data.get(DOMAIN, {})
    coordinators: dict[str, SmartTodoCoordinator] = {
        entry_id: value
        for entry_id, value in domain_data.items()
        if isinstance(value, SmartTodoCoordinator)
    }

    config_entry_id = call.data.get("config_entry_id")
    if config_entry_id is not None:
        coordinator = coordinators.get(config_entry_id)
        if coordinator is None:
            raise HomeAssistantError(
                f"No Smart Todo list found for config_entry_id '{config_entry_id}'."
            )
        return coordinator

    if not coordinators:
        raise HomeAssistantError("Smart Todo integration is not configured.")
    if len(coordinators) == 1:
        return next(iter(coordinators.values()))

    # Include entry_id alongside title: it's what the caller actually needs
    # to supply, and titles aren't guaranteed unique — the config flow checks
    # uniqueness at creation time, but a later rename via the generic HA
    # "rename" UI doesn't re-check it against other entries.
    listing = ", ".join(
        f"{coord.title} ({entry_id})"
        for entry_id, coord in sorted(coordinators.items(), key=lambda kv: kv[1].title)
    )
    raise HomeAssistantError(
        "Multiple Smart Todo lists are configured — specify 'config_entry_id' "
        f"to choose one. Available lists: {listing}."
    )


def _validate_recipient(
    coordinator: SmartTodoCoordinator, recipient: str | None, field_name: str
) -> None:
    """Validate a recipient name against the configured roster.

    Permissive when no roster has been configured yet — any free text is
    accepted, matching pre-roster behaviour and keeping the points feature
    usable without setup. Once a roster exists, the recipient must
    case-insensitively match one of its entries.
    """
    if recipient is None:
        return
    roster = coordinator.get_roster()
    if not roster:
        return
    target = coordinator.normalize_recipient(recipient)
    if not any(coordinator.normalize_recipient(name) == target for name in roster):
        raise HomeAssistantError(
            f"'{recipient}' is not in the configured roster for '{field_name}'. "
            "Add them via Settings → Devices & services → Smart Todo → "
            "Configure, or leave this field blank."
        )


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
    _validate_recipient(coordinator, call.data.get("reward_recipient"), "reward_recipient")

    definition_data: dict = {
        "title": call.data["title"],
        "notes": call.data.get("notes"),
        "priority": call.data.get("priority", 2),
        "assignee": call.data.get("assignee"),
        "recurrence": call.data.get("recurrence"),
        "points": call.data.get("points", 0),
        "reward_recipient": call.data.get("reward_recipient"),
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
    recipients = call.data.get("recipients")
    if recipients is not None:
        for name in recipients:
            _validate_recipient(coordinator, name, "recipients")
    await coordinator.async_complete_task(call.data["task_id"], recipients=recipients)


async def async_reopen_task(call: ServiceCall) -> None:
    """Handle the reopen_task service call."""
    coordinator = _get_coordinator(call.hass, call)
    await coordinator.async_reopen_task(call.data["task_id"])


async def async_update_task(call: ServiceCall) -> None:
    """Handle the update_task service call."""
    coordinator = _get_coordinator(call.hass, call)

    task_id: str = call.data["task_id"]
    patch: dict = {
        k: v for k, v in call.data.items() if k not in ("task_id", "config_entry_id")
    }

    # Validate due_at if present and non-None
    if "due_at" in patch and patch["due_at"] is not None:
        _parse_iso_datetime(patch["due_at"], "due_at")

    if "reward_recipient" in patch:
        _validate_recipient(coordinator, patch["reward_recipient"], "reward_recipient")

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


async def async_purge_completed(call: ServiceCall) -> None:
    """Handle the purge_completed service call."""
    coordinator = _get_coordinator(call.hass, call)
    await coordinator.async_purge_completed()


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
    return {"tasks": result_list, "roster": coordinator.get_roster()}


async def async_spend_points(call: ServiceCall) -> None:
    """Handle the spend_points service call."""
    coordinator = _get_coordinator(call.hass, call)
    recipient: str = call.data["recipient"]
    _validate_recipient(coordinator, recipient, "recipient")

    try:
        await coordinator.async_spend_points(
            recipient=recipient,
            amount=call.data["amount"],
            note=call.data.get("note"),
        )
    except ValueError as exc:
        raise HomeAssistantError(str(exc)) from exc


# ---------------------------------------------------------------------------
# Registration / unregistration
# ---------------------------------------------------------------------------


def async_register_services(hass: HomeAssistant) -> None:
    """Register all Smart Todo services. Called once from __init__.py."""
    hass.services.async_register(
        DOMAIN, SERVICE_CREATE_TASK, async_create_task, schema=CREATE_TASK_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_COMPLETE_TASK, async_complete_task, schema=COMPLETE_TASK_SCHEMA
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
        SERVICE_PURGE_COMPLETED,
        async_purge_completed,
        schema=PURGE_COMPLETED_SCHEMA,
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
    hass.services.async_register(
        DOMAIN, SERVICE_SPEND_POINTS, async_spend_points, schema=SPEND_POINTS_SCHEMA
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
        SERVICE_PURGE_COMPLETED,
        SERVICE_RECALCULATE_RECURRENCE,
        SERVICE_GET_TASKS,
        SERVICE_SPEND_POINTS,
    ]:
        hass.services.async_remove(DOMAIN, service)
