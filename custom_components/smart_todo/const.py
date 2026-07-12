"""Constants for the Smart Todo integration."""
from __future__ import annotations

from homeassistant.const import Platform

DOMAIN = "smart_todo"

CONF_NAME = "name"
CONF_ROSTER = "roster"

PLATFORMS: list[Platform] = [Platform.TODO, Platform.SENSOR]

STORAGE_KEY = "smart_todo.tasks"
STORAGE_VERSION = 1

# Priority constants
PRIORITY_LOW = 1
PRIORITY_MEDIUM = 2
PRIORITY_HIGH = 3

PRIORITY_LABELS: dict[int, str] = {
    1: "low",
    2: "medium",
    3: "high",
}

# Service name constants (must match service names in services.yaml)
SERVICE_CREATE_TASK = "create_task"
SERVICE_COMPLETE_TASK = "complete_task"
SERVICE_REOPEN_TASK = "reopen_task"
SERVICE_UPDATE_TASK = "update_task"
SERVICE_SNOOZE_TASK = "snooze_task"
SERVICE_DELETE_TASK = "delete_task"
SERVICE_RECALCULATE_RECURRENCE = "recalculate_recurrence"
SERVICE_GET_TASKS = "get_tasks"
SERVICE_PURGE_COMPLETED = "purge_completed"
SERVICE_SPEND_POINTS = "spend_points"

# Recurrence mode constants (must match Literal values in models.py Stage 2)
RECURRENCE_INTERVAL_DAYS = "interval_days"
RECURRENCE_ROLLING_DAYS = "rolling_days"
RECURRENCE_WEEKDAYS = "weekdays"
RECURRENCE_BIWEEKLY_WEEKDAYS = "biweekly_weekdays"
RECURRENCE_WEEKLY = "weekly"
RECURRENCE_MONTHLY = "monthly"

CONF_ENTRY_ID = "entry_id"

DEFAULT_UPDATE_INTERVAL_SECONDS = 60
