"""Todo platform for the Smart Todo integration."""
from __future__ import annotations

import logging
from datetime import date, datetime, timezone

from homeassistant.components.todo import (
    TodoItem,
    TodoItemStatus,
    TodoListEntity,
    TodoListEntityFeature,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity import DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DOMAIN
from .coordinator import SmartTodoCoordinator

_LOGGER = logging.getLogger(__name__)

# DeviceEntryType is available in HA 2023.6+ as an enum; fall back to raw
# string "service" for compatibility with the 2024.1+ target.
try:
    from homeassistant.helpers.entity import DeviceEntryType as _DeviceEntryType

    _ENTRY_TYPE_SERVICE = _DeviceEntryType.SERVICE
except (ImportError, AttributeError):
    _ENTRY_TYPE_SERVICE = "service"  # type: ignore[assignment]


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up Smart Todo list entity from a config entry."""
    coordinator: SmartTodoCoordinator = hass.data[DOMAIN][entry.entry_id]
    async_add_entities([SmartTodoListEntity(coordinator, entry)])


class SmartTodoListEntity(CoordinatorEntity[SmartTodoCoordinator], TodoListEntity):
    """A single Home Assistant Todo list backed by SmartTodoCoordinator."""

    def __init__(self, coordinator: SmartTodoCoordinator, entry: ConfigEntry) -> None:
        super().__init__(coordinator)
        self._entry = entry
        self._attr_unique_id = f"{DOMAIN}_{entry.entry_id}"
        self._attr_name = entry.data.get("name", "Smart Todo")
        self._attr_supported_features = (
            TodoListEntityFeature.CREATE_TODO_ITEM
            | TodoListEntityFeature.UPDATE_TODO_ITEM
            | TodoListEntityFeature.DELETE_TODO_ITEM
            | TodoListEntityFeature.MOVE_TODO_ITEM
        )

    # ------------------------------------------------------------------
    # Device info
    # ------------------------------------------------------------------

    @property
    def device_info(self) -> DeviceInfo:
        """Return device info for grouping entities in the UI."""
        return DeviceInfo(
            identifiers={(DOMAIN, self._entry.entry_id)},
            name=self._attr_name,
            manufacturer="Smart Todo",
            model="Recurring Task Manager",
            entry_type=_ENTRY_TYPE_SERVICE,
        )

    # ------------------------------------------------------------------
    # TodoListEntity required property
    # ------------------------------------------------------------------

    @property
    def todo_items(self) -> list[TodoItem]:
        """Return all tasks sorted by sort_order."""
        if self.coordinator.data is None:
            return []

        items: list[TodoItem] = []
        for task_id, (definition, state) in self.coordinator.data.items():
            due: date | None = state.due_at.date() if state.due_at is not None else None
            status = (
                TodoItemStatus.COMPLETED
                if state.completed
                else TodoItemStatus.NEEDS_ACTION
            )
            items.append(
                TodoItem(
                    uid=task_id,
                    summary=definition.title,
                    status=status,
                    due=due,
                    description=definition.notes,
                )
            )

        # Sort by sort_order so the UI reflects user-defined ordering.
        items.sort(
            key=lambda item: self.coordinator.data[item.uid][1].sort_order
            if item.uid in self.coordinator.data
            else 0
        )
        return items

    # ------------------------------------------------------------------
    # Extra state attributes (list-level summary)
    # ------------------------------------------------------------------

    @property
    def extra_state_attributes(self) -> dict:
        """Return list-level summary attributes."""
        if self.coordinator.data is None:
            return {
                "total_tasks": 0,
                "overdue_count": 0,
                "completed_today": 0,
                "points_available": 0,
                "points_earned_total": 0,
                "points_spent_total": 0,
                "points_by_recipient": {},
                "points_balance_by_recipient": {},
                "next_due": None,
            }

        today = datetime.now(timezone.utc).date()
        total_tasks = len(self.coordinator.data)
        overdue_count = 0
        completed_today = 0
        points_available = 0
        next_due_dt: datetime | None = None

        for task_id, (definition, state) in self.coordinator.data.items():
            if state.overdue:
                overdue_count += 1

            if (
                state.last_completed_at is not None
                and state.last_completed_at.date() == today
            ):
                completed_today += 1

            if state.due_at is not None and not state.completed:
                if next_due_dt is None or state.due_at < next_due_dt:
                    next_due_dt = state.due_at

            if definition.points > 0 and not state.completed:
                points_available += definition.points

        # Recipients come from the persisted ledger (coordinator.py), not from
        # live task iteration — a recipient's earned/spent history must not
        # disappear just because the task that earned it was later deleted
        # (e.g. via purge_completed).
        # points_by_recipient stays gross-earned (chg001 meaning, unchanged for
        # backward compatibility); net balances are exposed separately.
        recipients = self.coordinator.get_known_recipients()
        points_by_recipient = {
            name: self.coordinator.get_earned_total(name) for name in recipients
        }
        points_balance_by_recipient = {
            name: self.coordinator.get_balance(name) for name in recipients
        }
        points_earned_total = sum(points_by_recipient.values())
        # Derived rather than re-summing get_spent_total() per recipient —
        # spent = earned - balance, and both are already computed above.
        points_spent_total = points_earned_total - sum(points_balance_by_recipient.values())

        return {
            "total_tasks": total_tasks,
            "overdue_count": overdue_count,
            "completed_today": completed_today,
            "points_available": points_available,
            "points_earned_total": points_earned_total,
            "points_spent_total": points_spent_total,
            "points_by_recipient": points_by_recipient,
            "points_balance_by_recipient": points_balance_by_recipient,
            "next_due": next_due_dt.isoformat() if next_due_dt is not None else None,
        }

    # ------------------------------------------------------------------
    # TodoListEntity mutation methods
    # ------------------------------------------------------------------

    async def async_create_todo_item(self, item: TodoItem) -> None:
        """Create a new task from a TodoItem."""
        due_at: datetime | None = None
        if item.due is not None:
            # HA Todo uses date; convert to midnight UTC datetime.
            due_at = datetime(
                item.due.year,
                item.due.month,
                item.due.day,
                tzinfo=timezone.utc,
            )

        definition_data: dict = {
            "title": item.summary or "",
            "notes": item.description,
        }
        if due_at is not None:
            definition_data["due_at"] = due_at

        await self.coordinator.async_create_task(definition_data)

    async def async_update_todo_item(self, item: TodoItem) -> None:
        """Update an existing task from a TodoItem."""
        patch: dict = {}

        if item.summary is not None:
            patch["title"] = item.summary
        if item.description is not None:
            patch["notes"] = item.description
        if item.due is not None:
            # Convert date → datetime at midnight UTC.
            patch["due_at"] = datetime(
                item.due.year,
                item.due.month,
                item.due.day,
                tzinfo=timezone.utc,
            )

        # Apply field-level patch first (if there is anything to patch).
        if patch:
            await self.coordinator.async_update_task(item.uid, patch)

        # Handle status change separately via dedicated coordinator methods.
        if item.status == TodoItemStatus.COMPLETED:
            await self.coordinator.async_complete_task(item.uid)
        elif item.status == TodoItemStatus.NEEDS_ACTION:
            await self.coordinator.async_reopen_task(item.uid)

    async def async_delete_todo_items(self, uids: list[str]) -> None:
        """Delete one or more tasks by UID."""
        for uid in uids:
            await self.coordinator.async_delete_task(uid)

    async def async_move_todo_item(self, uid: str, previous_uid: str | None) -> None:
        """Reorder a task by adjusting sort_order values.

        Moves *uid* to immediately after *previous_uid* in the sorted list, or
        to position 0 when *previous_uid* is None.  Only sort_order is changed;
        priority is never touched.
        """
        if self.coordinator.data is None:
            return

        # Build ordered list of task IDs by current sort_order.
        ordered_ids: list[str] = sorted(
            self.coordinator.data.keys(),
            key=lambda tid: self.coordinator.data[tid][1].sort_order,
        )

        if uid not in ordered_ids:
            return

        # Remove the task from its current position.
        ordered_ids.remove(uid)

        if previous_uid is None:
            ordered_ids.insert(0, uid)
        else:
            try:
                insert_after = ordered_ids.index(previous_uid)
            except ValueError:
                # previous_uid not found — append at end.
                ordered_ids.append(uid)
            else:
                ordered_ids.insert(insert_after + 1, uid)

        # Reassign sequential sort_order values and persist changed states.
        store = self.coordinator._store  # noqa: SLF001
        for new_order, task_id in enumerate(ordered_ids):
            state = store._states.get(task_id)  # noqa: SLF001
            if state is not None and state.sort_order != new_order:
                state.sort_order = new_order
                store.set_state(state)

        await store.async_save()
        await self.coordinator.async_refresh()
