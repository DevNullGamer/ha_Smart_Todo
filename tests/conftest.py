"""Shared fixtures for Smart Todo's Home Assistant-backed test suite.

Registers the pytest-homeassistant-custom-component plugin, which provides
the `hass` fixture (a real, in-memory Home Assistant core instance) used by
tests/test_coordinator_integration.py.
"""
import sys

import pytest

pytest_plugins = "pytest_homeassistant_custom_component"


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations):
    """Let `hass` discover and load custom_components/smart_todo.

    Without this, `hass` only loads Home Assistant's built-in integrations.
    `enable_custom_integrations` is provided by pytest-homeassistant-custom-component.
    """
    yield


if sys.platform == "win32":
    import socket as _socket_module

    # pytest-homeassistant-custom-component unconditionally calls
    # pytest_socket.disable_socket() from its own pytest_runtest_setup
    # hookimpl, which runs as a *plain* (non-wrapper) hook alongside the
    # core pytest_runner hookimpl that actually instantiates fixtures
    # (including asyncio's event_loop fixture) — so by the time any of our
    # own hooks could run, fixture setup (and the crash below) has already
    # happened. Hooking into pytest's hook system can't reliably win this
    # race, so patch the stdlib directly instead, once, before collection.
    #
    # Windows has no native AF_UNIX socketpair, so asyncio's event loop
    # falls back to a real loopback TCP socket for its internal self-pipe
    # (Lib/socket.py's _fallback_socketpair) on every event loop it
    # creates — not just on tests that intentionally touch the network.
    # With socket.socket() replaced by pytest_socket's guard, that
    # fallback raises SocketBlockedError before any test code runs at all.
    #
    # Capture the real, unguarded socket class now (conftest.py is
    # imported before any test-time patching) and have socket.socketpair
    # always use it, regardless of whatever socket.socket currently points
    # to when it's called.
    _real_socket_class = _socket_module.socket
    _orig_socketpair = _socket_module.socketpair

    def _socketpair_with_real_socket(*args, **kwargs):
        current = _socket_module.socket
        _socket_module.socket = _real_socket_class
        try:
            return _orig_socketpair(*args, **kwargs)
        finally:
            _socket_module.socket = current

    _socket_module.socketpair = _socketpair_with_real_socket
