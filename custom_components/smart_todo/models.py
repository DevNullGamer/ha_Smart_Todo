"""Data models for the Smart Todo integration."""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date, datetime, time, timezone


# ---------------------------------------------------------------------------
# RecurrenceRule
# ---------------------------------------------------------------------------

@dataclass
class RecurrenceRule:
    """Describes how a task recurs over time."""

    mode: str  # one of the RECURRENCE_* constants from const.py
    interval_days: int | None = None
    # 0=Monday … 6=Sunday; used by weekdays, biweekly_weekdays, weekly
    weekdays: list[int] | None = None
    week_parity: str | None = None        # "odd" or "even"; biweekly_weekdays
    anchor_date: date | None = None       # used for biweekly parity computation
    time_of_day: time | None = None       # local time component

    # ------------------------------------------------------------------
    def __post_init__(self) -> None:
        if self.mode == "biweekly_weekdays" and self.anchor_date is None:
            raise ValueError(
                "RecurrenceRule with mode='biweekly_weekdays' requires anchor_date."
            )
        if self.mode in ("interval_days", "rolling_days") and self.interval_days is None:
            raise ValueError(
                f"RecurrenceRule with mode='{self.mode}' requires interval_days."
            )

    # ------------------------------------------------------------------
    def to_dict(self) -> dict:
        """Serialise to a plain dict suitable for JSON storage."""
        return {
            "mode": self.mode,
            "interval_days": self.interval_days,
            "weekdays": list(self.weekdays) if self.weekdays is not None else None,
            "week_parity": self.week_parity,
            "anchor_date": self.anchor_date.isoformat() if self.anchor_date is not None else None,
            "time_of_day": self.time_of_day.strftime("%H:%M:%S") if self.time_of_day is not None else None,
        }

    # ------------------------------------------------------------------
    @classmethod
    def from_dict(cls, data: dict) -> RecurrenceRule:
        """Deserialise from a dict produced by :meth:`to_dict`."""
        anchor_raw = data.get("anchor_date")
        anchor: date | None = date.fromisoformat(anchor_raw) if anchor_raw else None

        tod_raw = data.get("time_of_day")
        tod: time | None = time.fromisoformat(tod_raw) if tod_raw else None

        weekdays_raw = data.get("weekdays")
        weekdays: list[int] | None = list(weekdays_raw) if weekdays_raw is not None else None

        return cls(
            mode=data["mode"],
            interval_days=data.get("interval_days"),
            weekdays=weekdays,
            week_parity=data.get("week_parity"),
            anchor_date=anchor,
            time_of_day=tod,
        )


# ---------------------------------------------------------------------------
# TaskDefinition
# ---------------------------------------------------------------------------

@dataclass
class TaskDefinition:
    """Immutable definition of a task (user-authored content)."""

    id: str                            # uuid4 string
    title: str
    created_at: datetime              # tz-aware; stored as ISO string
    notes: str | None = None
    priority: int = 2                  # 1=low, 2=medium, 3=high
    assignee: str | None = None
    recurrence: RecurrenceRule | None = None

    # ------------------------------------------------------------------
    def to_dict(self) -> dict:
        """Serialise to a plain dict suitable for JSON storage."""
        return {
            "id": self.id,
            "title": self.title,
            "created_at": self.created_at.isoformat(),
            "notes": self.notes,
            "priority": self.priority,
            "assignee": self.assignee,
            "recurrence": self.recurrence.to_dict() if self.recurrence is not None else None,
        }

    # ------------------------------------------------------------------
    @classmethod
    def from_dict(cls, data: dict) -> TaskDefinition:
        """Deserialise from a dict produced by :meth:`to_dict`."""
        recurrence_raw = data.get("recurrence")
        recurrence: RecurrenceRule | None = (
            RecurrenceRule.from_dict(recurrence_raw) if recurrence_raw else None
        )
        return cls(
            id=data["id"],
            title=data["title"],
            created_at=datetime.fromisoformat(data["created_at"]),
            notes=data.get("notes"),
            priority=data.get("priority", 2),
            assignee=data.get("assignee"),
            recurrence=recurrence,
        )


# ---------------------------------------------------------------------------
# TaskRuntimeState
# ---------------------------------------------------------------------------

@dataclass
class TaskRuntimeState:
    """Mutable runtime state for a task (completion, due date, snooze, etc.)."""

    id: str                                  # matches TaskDefinition.id
    completed: bool = False
    due_at: datetime | None = None           # tz-aware; stored as ISO string or None
    last_completed_at: datetime | None = None  # tz-aware; stored as ISO string or None
    snoozed_until: datetime | None = None    # tz-aware; stored as ISO string or None
    sort_order: int = 0                      # drag-to-reorder position

    # ------------------------------------------------------------------
    @property
    def overdue(self) -> bool:
        """Return True if the task is past due and not snoozed.

        Derived at runtime — never stored, never included in to_dict().
        Uses datetime.now(timezone.utc) to avoid importing homeassistant.util.dt
        at module level, which would create a circular import when running tests
        outside of a HA environment.
        """
        if self.completed or self.due_at is None:
            return False
        now_tz = datetime.now(timezone.utc)
        if self.due_at >= now_tz:
            return False
        # Still snoozed?
        if self.snoozed_until is not None and self.snoozed_until >= now_tz:
            return False
        return True

    # ------------------------------------------------------------------
    def to_dict(self) -> dict:
        """Serialise to a plain dict suitable for JSON storage.

        NOTE: ``overdue`` is a derived property and is intentionally excluded.
        """
        return {
            "id": self.id,
            "completed": self.completed,
            "due_at": self.due_at.isoformat() if self.due_at is not None else None,
            "last_completed_at": (
                self.last_completed_at.isoformat()
                if self.last_completed_at is not None
                else None
            ),
            "snoozed_until": (
                self.snoozed_until.isoformat() if self.snoozed_until is not None else None
            ),
            "sort_order": self.sort_order,
        }

    # ------------------------------------------------------------------
    @classmethod
    def from_dict(cls, data: dict) -> TaskRuntimeState:
        """Deserialise from a dict produced by :meth:`to_dict`."""

        def _parse_dt(value: str | None) -> datetime | None:
            return datetime.fromisoformat(value) if value else None

        return cls(
            id=data["id"],
            completed=data.get("completed", False),
            due_at=_parse_dt(data.get("due_at")),
            last_completed_at=_parse_dt(data.get("last_completed_at")),
            snoozed_until=_parse_dt(data.get("snoozed_until")),
            sort_order=data.get("sort_order", 0),
        )


# ---------------------------------------------------------------------------
# Module-level helpers
# ---------------------------------------------------------------------------

def make_task_id() -> str:
    """Generate a new unique task ID."""
    import uuid
    return str(uuid.uuid4())
