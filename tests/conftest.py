"""Shared fixtures for Smart Todo's Home Assistant-backed test suite.

Registers the pytest-homeassistant-custom-component plugin, which provides
the `hass` fixture (a real, in-memory Home Assistant core instance) used by
tests/test_coordinator_integration.py.
"""
import pytest

pytest_plugins = "pytest_homeassistant_custom_component"


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations):
    """Let `hass` discover and load custom_components/smart_todo.

    Without this, `hass` only loads Home Assistant's built-in integrations.
    `enable_custom_integrations` is provided by pytest-homeassistant-custom-component.
    """
    yield
