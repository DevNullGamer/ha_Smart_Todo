"""Diagnostics support for the Smart Todo integration.

Returns aggregate statistics only — no task titles, notes, assignee names,
or task IDs are ever included.
"""
from __future__ import annotations

from typing import Any

from homeassistant.components.diagnostics import async_redact_data
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import (
    DOMAIN,
    PRIORITY_LABELS,
    RECURRENCE_INTERVAL_DAYS,
    RECURRENCE_ROLLING_DAYS,
    RECURRENCE_WEEKDAYS,
    RECURRENCE_WEEKLY,
    RECURRENCE_BIWEEKLY_WEEKDAYS,
    RECURRENCE_MONTHLY,
)
from .coordinator import SmartTodoCoordinator


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant,
    entry: ConfigEntry,
) -> dict[str, Any]:
    """Return diagnostics for a config entry.

    Only aggregate counts and distributions are returned.
    No PII (task titles, notes, assignee names, or task IDs) is ever included.
    """
    coordinator: SmartTodoCoordinator = hass.data[DOMAIN][entry.entry_id]

    task_count = 0
    completed_count = 0
    overdue_count = 0
    recurring_count = 0
    has_assignees = False

    recurrence_mode_distribution: dict[str, int] = {
        RECURRENCE_INTERVAL_DAYS: 0,
        RECURRENCE_ROLLING_DAYS: 0,
        RECURRENCE_WEEKDAYS: 0,
        RECURRENCE_WEEKLY: 0,
        RECURRENCE_BIWEEKLY_WEEKDAYS: 0,
        RECURRENCE_MONTHLY: 0,
    }

    priority_distribution: dict[str, int] = {
        label: 0 for label in PRIORITY_LABELS.values()
    }

    data = coordinator.data or {}

    for _task_id, (definition, state) in data.items():
        task_count += 1

        if state.completed:
            completed_count += 1

        if state.overdue:
            overdue_count += 1

        if definition.recurrence is not None:
            recurring_count += 1
            mode = definition.recurrence.mode
            if mode in recurrence_mode_distribution:
                recurrence_mode_distribution[mode] += 1

        if definition.assignee is not None:
            has_assignees = True

        priority_label = PRIORITY_LABELS.get(definition.priority)
        if priority_label is not None:
            priority_distribution[priority_label] += 1

    last_update: str | None = None
    _last_update_ts = getattr(coordinator, "last_update_success_time", None) or getattr(
        coordinator, "last_updated_at", None
    )
    if _last_update_ts is not None:
        last_update = _last_update_ts.isoformat()

    return {
        "entry_id": entry.entry_id,
        "entry_title": entry.title,
        "task_count": task_count,
        "completed_count": completed_count,
        "overdue_count": overdue_count,
        "recurring_count": recurring_count,
        "recurrence_mode_distribution": recurrence_mode_distribution,
        "has_assignees": has_assignees,
        "priority_distribution": priority_distribution,
        "coordinator_last_update": last_update,
    }
