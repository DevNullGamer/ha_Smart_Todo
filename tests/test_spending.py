"""Unit tests for the SpendEntry model (chg002 — spending/roster feature)."""
from __future__ import annotations

import importlib.util
import os
import sys
import types
from datetime import datetime, timezone


_REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_PKG_DIR = os.path.join(_REPO_ROOT, "custom_components", "smart_todo")


def _load_module(name: str, path: str):
    """Load a module by file path, registering it in sys.modules."""
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


_pkg_stub = types.ModuleType("custom_components.smart_todo")
_pkg_stub.__path__ = [_PKG_DIR]
_pkg_stub.__package__ = "custom_components.smart_todo"
sys.modules.setdefault("custom_components", types.ModuleType("custom_components"))
sys.modules.setdefault("custom_components.smart_todo", _pkg_stub)

_models = _load_module(
    "custom_components.smart_todo.models",
    os.path.join(_PKG_DIR, "models.py"),
)
SpendEntry = _models.SpendEntry


def test_spend_entry_round_trip_preserves_fields() -> None:
    """A spend entry's amount, note, and recipient must survive serialization."""
    entry = SpendEntry(
        id="spend-1",
        recipient="Mina",
        amount=20,
        timestamp=datetime.now(timezone.utc),
        note="30 min extra screen time",
    )

    payload = entry.to_dict()

    assert payload["recipient"] == "Mina"
    assert payload["amount"] == 20
    assert payload["note"] == "30 min extra screen time"

    restored = SpendEntry.from_dict(payload)

    assert restored.id == "spend-1"
    assert restored.recipient == "Mina"
    assert restored.amount == 20
    assert restored.note == "30 min extra screen time"
    assert restored.timestamp == entry.timestamp


def test_spend_entry_note_defaults_to_none() -> None:
    """The 'spent on' note is optional — omitting it must not break loading."""
    entry = SpendEntry(
        id="spend-2",
        recipient="Oskar",
        amount=5,
        timestamp=datetime.now(timezone.utc),
    )

    assert entry.note is None

    payload = entry.to_dict()
    del payload["note"]  # simulate an older/partial stored record
    restored = SpendEntry.from_dict(payload)

    assert restored.note is None
