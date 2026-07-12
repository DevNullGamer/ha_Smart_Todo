"""Smart Todo — self-contained recurring task management for Home Assistant."""
from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components.http import StaticPathConfig
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
    # Register card static files once (guard for multiple config entries)
    if not hass.data[DOMAIN].get("_static_path_registered"):
        await hass.http.async_register_static_paths([
            StaticPathConfig(
                url_path="/smart_todo/frontend",
                path=str(Path(__file__).parent / "www"),
                cache_headers=False,
            )
        ])
        hass.data[DOMAIN]["_static_path_registered"] = True
    coordinator = SmartTodoCoordinator(hass, entry)
    await coordinator.async_setup()
    hass.data[DOMAIN][entry.entry_id] = coordinator
    # Register services once (guard against double-registration on multiple entries)
    if not hass.services.has_service(DOMAIN, SERVICE_CREATE_TASK):
        async_register_services(hass)
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    # Reload on options change (e.g. roster edits) so sensor entities are added/removed.
    entry.async_on_unload(entry.add_update_listener(_async_update_listener))
    return True


async def _async_update_listener(hass: HomeAssistant, entry: SmartTodoConfigEntry) -> None:
    """Reload the config entry when its options change."""
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: SmartTodoConfigEntry) -> bool:
    """Unload a config entry."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unload_ok:
        hass.data[DOMAIN].pop(entry.entry_id, None)
        # When the last real entry is removed, clean up fully. Note:
        # "_static_path_registered" is intentionally NOT cleared here.
        # hass.http.async_register_static_paths has no matching "unregister"
        # (the underlying aiohttp route stays mounted for the process's
        # lifetime), and options-flow changes (e.g. roster edits) now trigger
        # a reload — unload immediately followed by setup of the SAME entry.
        # Clearing the flag here would make the next setup try to register
        # "/smart_todo/frontend" a second time and raise.
        remaining = [v for v in hass.data[DOMAIN].values() if isinstance(v, SmartTodoCoordinator)]
        if not remaining:
            async_unregister_services(hass)
    return unload_ok
