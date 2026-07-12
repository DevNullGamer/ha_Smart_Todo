"""Unit tests for reward points support in the Smart Todo models."""
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
TaskDefinition = _models.TaskDefinition
TaskRuntimeState = _models.TaskRuntimeState


def test_task_definition_round_trip_preserves_reward_fields() -> None:
    """Reward points and recipient should survive serialization."""
    definition = TaskDefinition(
        id="task-1",
        title="Clean room",
        created_at=datetime.now(timezone.utc),
        points=5,
        reward_recipient="Mina",
    )

    payload = definition.to_dict()

    assert payload["points"] == 5
    assert payload["reward_recipient"] == "Mina"

    restored = TaskDefinition.from_dict(payload)

    assert restored.points == 5
    assert restored.reward_recipient == "Mina"


def test_task_runtime_state_round_trip_preserves_points_earned() -> None:
    """Awarded points should persist in runtime state serialization."""
    state = TaskRuntimeState(id="task-1", points_earned=8)

    payload = state.to_dict()

    assert payload["points_earned"] == 8

    restored = TaskRuntimeState.from_dict(payload)

    assert restored.points_earned == 8


def test_task_runtime_state_defaults_points_awarded_flag_false() -> None:
    """Existing/legacy state data without the new field must not break loading."""
    state = TaskRuntimeState(id="task-1")

    assert state.points_awarded_this_cycle is False

    restored = TaskRuntimeState.from_dict({"id": "task-1"})

    assert restored.points_awarded_this_cycle is False


def test_task_runtime_state_round_trip_preserves_points_awarded_flag() -> None:
    """The reopen-exploit guard flag must survive serialization."""
    state = TaskRuntimeState(id="task-1", points_earned=5, points_awarded_this_cycle=True)

    payload = state.to_dict()

    assert payload["points_awarded_this_cycle"] is True

    restored = TaskRuntimeState.from_dict(payload)

    assert restored.points_awarded_this_cycle is True
