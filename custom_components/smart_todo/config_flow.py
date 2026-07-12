"""Config flow for Smart Todo integration."""
from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol

from homeassistant.config_entries import ConfigEntry, ConfigFlow, ConfigFlowResult, OptionsFlow
from homeassistant.core import callback
from homeassistant.helpers.selector import TextSelector, TextSelectorConfig
from homeassistant.util import slugify

from .const import CONF_NAME, CONF_ROSTER, DOMAIN

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


def _parse_roster(raw: str) -> list[str]:
    """Split a comma-separated roster string into a deduped name list.

    Dedup is case-insensitive (first-seen casing wins) so "Mina" and "mina"
    collapse to one entry before the slug-collision check ever runs.
    """
    seen_lower: set[str] = set()
    names: list[str] = []
    for part in raw.split(","):
        name = part.strip()
        if not name or name.lower() in seen_lower:
            continue
        seen_lower.add(name.lower())
        names.append(name)
    return names


class SmartTodoOptionsFlow(OptionsFlow):
    """Handle options for Smart Todo."""

    def __init__(self, config_entry: ConfigEntry) -> None:
        """Initialize options flow."""
        self._config_entry = config_entry

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Handle the roster options step.

        The roster is a fixed list of reward-eligible people, entered as a
        comma-separated string. One sensor entity is created per roster
        member (see sensor.py), keyed by ``slugify(name)`` as the unique_id
        suffix — two names that slugify to the same value would collide, so
        that's rejected here rather than silently overwriting one sensor.
        """
        errors: dict[str, str] = {}
        current_roster: list[str] = self._config_entry.options.get(CONF_ROSTER, [])
        # Pre-fill with whatever the user just typed on a redisplay (e.g. after
        # a validation error), falling back to the saved roster on first show —
        # otherwise a rejected submission would silently revert their edit.
        default_text = ", ".join(current_roster)

        if user_input is not None:
            default_text = user_input.get(CONF_ROSTER, "")
            roster = _parse_roster(default_text)

            slugs: dict[str, str] = {}
            duplicate = False
            for name in roster:
                slug = slugify(name)
                if slug in slugs:
                    duplicate = True
                    break
                slugs[slug] = name

            if duplicate:
                errors[CONF_ROSTER] = "duplicate_name"
            else:
                return self.async_create_entry(title="", data={CONF_ROSTER: roster})

        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema(
                {
                    vol.Optional(CONF_ROSTER, default=default_text): TextSelector(
                        TextSelectorConfig(autocomplete="off")
                    ),
                }
            ),
            errors=errors,
        )
