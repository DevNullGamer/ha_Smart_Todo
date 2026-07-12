"""Sensor platform for the Smart Todo integration.

Creates one points-balance sensor per configured roster member (see
config_flow.py's options flow). Entities are added/removed on config entry
reload, which is triggered automatically whenever the roster option changes
(see __init__.py's update listener).
"""
from __future__ import annotations

import logging

from homeassistant.components.sensor import SensorEntity, SensorStateClass
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity import DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity
from homeassistant.util import slugify

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
    """Set up one points-balance sensor per configured roster member."""
    coordinator: SmartTodoCoordinator = hass.data[DOMAIN][entry.entry_id]
    async_add_entities(
        [
            SmartTodoRosterSensor(coordinator, entry, name)
            for name in coordinator.get_roster()
        ]
    )


class SmartTodoRosterSensor(CoordinatorEntity[SmartTodoCoordinator], SensorEntity):
    """Reports one roster member's current spendable points balance.

    The state is a net balance (earned minus spent), not a nested attribute,
    so it can be graphed, put on a dashboard tile, and used directly as an
    automation trigger.
    """

    _attr_native_unit_of_measurement = "pts"
    _attr_state_class = SensorStateClass.TOTAL
    _attr_icon = "mdi:star-four-points"

    def __init__(
        self, coordinator: SmartTodoCoordinator, entry: ConfigEntry, recipient: str
    ) -> None:
        super().__init__(coordinator)
        self._entry = entry
        self._recipient = recipient
        self._attr_unique_id = f"{DOMAIN}_{entry.entry_id}_roster_{slugify(recipient)}"
        self._attr_name = f"{recipient} Points"

    # ------------------------------------------------------------------
    # Device info — grouped under the same device as the todo list entity
    # ------------------------------------------------------------------

    @property
    def device_info(self) -> DeviceInfo:
        """Return device info for grouping entities in the UI."""
        return DeviceInfo(
            identifiers={(DOMAIN, self._entry.entry_id)},
            name=self._entry.data.get("name", "Smart Todo"),
            manufacturer="Smart Todo",
            model="Recurring Task Manager",
            entry_type=_ENTRY_TYPE_SERVICE,
        )

    # ------------------------------------------------------------------
    # State
    # ------------------------------------------------------------------

    @property
    def native_value(self) -> int:
        """Return the recipient's current spendable balance."""
        return self.coordinator.get_balance(self._recipient)

    @property
    def extra_state_attributes(self) -> dict:
        """Return earned/spent totals alongside the net balance state."""
        earned_total = self.coordinator.get_earned_total(self._recipient)
        balance = self.native_value
        return {
            "recipient": self._recipient,
            "points_earned_total": earned_total,
            # Derived rather than a second get_spent_total() scan — every
            # state-machine poll already reads native_value (which computes
            # earned - spent internally), so spent = earned - balance is free.
            "points_spent_total": earned_total - balance,
        }
