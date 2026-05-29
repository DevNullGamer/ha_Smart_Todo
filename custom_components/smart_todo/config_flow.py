"""Config flow for Smart Todo integration."""
from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol

from homeassistant.config_entries import ConfigEntry, ConfigFlow, ConfigFlowResult, OptionsFlow
from homeassistant.core import callback
from homeassistant.helpers.selector import TextSelector, TextSelectorConfig
from homeassistant.util import slugify

from .const import CONF_NAME, DOMAIN

_LOGGER = logging.getLogger(__name__)


class SmartTodoConfigFlow(ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Smart Todo."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Handle the initial step."""
        errors: dict[str, str] = {}

        if user_input is not None:
            name = user_input.get(CONF_NAME, "").strip()
            if not name:
                errors[CONF_NAME] = "name_empty"
            else:
                await self.async_set_unique_id(slugify(name))
                self._abort_if_unique_id_configured()
                return self.async_create_entry(
                    title=name,
                    data={CONF_NAME: name},
                )

        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_NAME): TextSelector(
                        TextSelectorConfig(autocomplete="off")
                    ),
                }
            ),
            errors=errors,
        )

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> SmartTodoOptionsFlow:
        """Return the options flow handler."""
        return SmartTodoOptionsFlow(config_entry)


class SmartTodoOptionsFlow(OptionsFlow):
    """Handle options for Smart Todo."""

    def __init__(self, config_entry: ConfigEntry) -> None:
        """Initialize options flow."""
        self._config_entry = config_entry

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Handle options flow — no options to configure yet."""
        return self.async_create_entry(title="", data={})
