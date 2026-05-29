"""Smart Todo — self-contained recurring task management for Home Assistant."""
from __future__ import annotations

import logging

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import DOMAIN, PLATFORMS, SERVICE_CREATE_TASK
from .coordinator import SmartTodoCoordinator
from .services import async_register_services, async_unregister_services

_LOGGER = logging.getLogger(__name__)

type SmartTodoConfigEntry = ConfigEntry  # Narrowed in coordinator; kept broad here for compat


async def async_setup_entry(hass: HomeAssistant, entry: SmartTodoConfigEntry) -> bool:
    """Set up Smart Todo from a config entry."""
    hass.data.setdefault(DOMAIN, {})
    coordinator = SmartTodoCoordinator(hass, entry)
    await coordinator.async_setup()
    hass.data[DOMAIN][entry.entry_id] = coordinator
    # Register services once (guard against double-registration on multiple entries)
    if not hass.services.has_service(DOMAIN, SERVICE_CREATE_TASK):
        async_register_services(hass)
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: SmartTodoConfigEntry) -> bool:
    """Unload a config entry."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unload_ok:
        hass.data[DOMAIN].pop(entry.entry_id, None)
        # Unregister services when last entry is removed
        if not hass.data.get(DOMAIN):
            async_unregister_services(hass)
    return unload_ok
