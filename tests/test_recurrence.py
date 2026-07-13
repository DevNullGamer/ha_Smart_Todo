"""Unit tests for custom_components.smart_todo.recurrence.

All datetimes are tz-aware (UTC).  No Home Assistant dependencies.
"""
from __future__ import annotations

import importlib.util
import sys
import os
from datetime import date, datetime, time, timedelta, timezone

import pytest

# ---------------------------------------------------------------------------
# Direct module loading — bypasses the package __init__.py which imports HA.
# ---------------------------------------------------------------------------
_REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_PKG_DIR = os.path.join(_REPO_ROOT, "custom_components", "smart_todo")


def _load_module(name: str, path: str):
    """Load a .py file as a module by path, registering it in sys.modules."""
    spec = importlib.util.spec_from_file_location(name, path)
    mod = importlib.util.module_from_spec(spec)
    sys.modules[name] = mod
    spec.loader.exec_module(mod)
    return mod


# Register a stub package so relative imports inside models.py / recurrence.py work.
_pkg_stub = type(sys)("custom_components.smart_todo")
_pkg_stub.__path__ = [_PKG_DIR]
_pkg_stub.__package__ = "custom_components.smart_todo"
sys.modules.setdefault("custom_components", type(sys)("custom_components"))
sys.modules.setdefault("custom_components.smart_todo", _pkg_stub)

# Load models first (no HA imports)
_models = _load_module(
    "custom_components.smart_todo.models",
    os.path.join(_PKG_DIR, "models.py"),
)
RecurrenceRule = _models.RecurrenceRule

# Load recurrence (no HA imports)
_recurrence = _load_module(
    "custom_components.smart_todo.recurrence",
    os.path.join(_PKG_DIR, "recurrence.py"),
)
next_due_date = _recurrence.next_due_date
is_overdue = _recurrence.is_overdue
describe_rule = _recurrence.describe_rule

UTC = timezone.utc


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def dt(*args, **kwargs) -> datetime:
    """Shorthand: datetime(..., tzinfo=UTC)."""
    return datetime(*args, tzinfo=UTC, **kwargs)


# ---------------------------------------------------------------------------
# next_due_date — interval_days
# ---------------------------------------------------------------------------

class TestNextDueDateIntervalDays:
    """Fixed cadence tests."""

    def test_next_monday_from_wednesday(self):
        """reference=Mon, interval=7, now=Wed → result is next Mon at same time."""
        # Reference: Monday 2024-01-08 09:00 UTC
        reference = dt(2024, 1, 8, 9, 0, 0)   # Monday
        # Now: Wednesday 2024-01-10 09:00 UTC
        now = dt(2024, 1, 10, 9, 0, 0)
        rule = RecurrenceRule(mode="interval_days", interval_days=7)
        result = next_due_date(rule, reference, now)

        # Next Monday from Wednesday Jan 10 → Jan 15
        assert result > now
        assert result == dt(2024, 1, 15, 9, 0, 0)

    def test_strictly_after_now_when_on_scheduled_occurrence(self):
        """When now is exactly on a scheduled occurrence, return the NEXT one."""
        reference = dt(2024, 1, 1, 12, 0, 0)
        now = dt(2024, 1, 8, 12, 0, 0)  # exactly on a scheduled slot
        rule = RecurrenceRule(mode="interval_days", interval_days=7)
        result = next_due_date(rule, reference, now)

        assert result > now
        assert result == dt(2024, 1, 15, 12, 0, 0)

    def test_interval_one_day(self):
        """Daily interval: tomorrow."""
        reference = dt(2024, 3, 1, 8, 0, 0)
        now = dt(2024, 3, 5, 8, 0, 0)
        rule = RecurrenceRule(mode="interval_days", interval_days=1)
        result = next_due_date(rule, reference, now)
        assert result > now
        assert result == dt(2024, 3, 6, 8, 0, 0)

    def test_result_is_tz_aware(self):
        """Returned datetime must be tz-aware."""
        reference = dt(2024, 1, 1, 0, 0, 0)
        now = dt(2024, 1, 3, 0, 0, 0)
        rule = RecurrenceRule(mode="interval_days", interval_days=7)
        result = next_due_date(rule, reference, now)
        assert result.tzinfo is not None


# ---------------------------------------------------------------------------
# next_due_date — rolling_days
# ---------------------------------------------------------------------------

class TestNextDueDateRollingDays:
    """Rolling cadence tests."""

    def test_rolling_three_days_from_wednesday(self):
        """interval=3, now=Wed 10:00 → result is Sat 10:00."""
        now = dt(2024, 1, 10, 10, 0, 0)   # Wednesday
        rule = RecurrenceRule(mode="rolling_days", interval_days=3)
        reference = now  # reference is irrelevant for rolling
        result = next_due_date(rule, reference, now)

        assert result > now
        assert result == dt(2024, 1, 13, 10, 0, 0)  # Saturday

    def test_rolling_zero_interval_does_not_infinite_loop(self):
        """interval=0 → returns now + 1 second (no infinite loop)."""
        now = dt(2024, 6, 15, 12, 0, 0)
        rule = RecurrenceRule.__new__(RecurrenceRule)
        # Bypass __post_init__ validation to test degenerate input
        object.__setattr__(rule, "mode", "rolling_days")
        object.__setattr__(rule, "interval_days", 0)
        object.__setattr__(rule, "weekdays", None)
        object.__setattr__(rule, "week_parity", None)
        object.__setattr__(rule, "anchor_date", None)
        object.__setattr__(rule, "time_of_day", None)

        result = next_due_date(rule, now, now)
        assert result > now

    def test_result_is_tz_aware(self):
        """Returned datetime must be tz-aware."""
        now = dt(2024, 4, 1, 8, 0, 0)
        rule = RecurrenceRule(mode="rolling_days", interval_days=5)
        result = next_due_date(rule, now, now)
        assert result.tzinfo is not None


# ---------------------------------------------------------------------------
# next_due_date — weekdays
# ---------------------------------------------------------------------------

class TestNextDueDateWeekdays:
    """Weekday recurrence tests."""

    def test_next_wednesday_from_tuesday_noon(self):
        """weekdays=[0,2] (Mon, Wed), time=09:00, now=Tue 12:00 → Wed 09:00."""
        # 2024-01-09 is Tuesday
        now = dt(2024, 1, 9, 12, 0, 0)
        rule = RecurrenceRule(
            mode="weekdays",
            weekdays=[0, 2],  # Mon=0, Wed=2
            time_of_day=time(9, 0, 0),
        )
        result = next_due_date(rule, now, now)

        # Next occurrence: Wednesday Jan 10 at 09:00
        assert result == dt(2024, 1, 10, 9, 0, 0)
        assert result > now

    def test_today_in_weekdays_time_passed(self):
        """Today IS in weekdays but time has passed → returns same weekday next week."""
        # 2024-01-10 is Wednesday (weekday 2)
        now = dt(2024, 1, 10, 14, 0, 0)  # 14:00, after 09:00
        rule = RecurrenceRule(
            mode="weekdays",
            weekdays=[2],  # Wednesday
            time_of_day=time(9, 0, 0),
        )
        result = next_due_date(rule, now, now)

        # Should be next Wednesday: Jan 17
        assert result == dt(2024, 1, 17, 9, 0, 0)
        assert result > now

    def test_today_in_weekdays_time_not_passed(self):
        """Today IS in weekdays and time has NOT passed → returns today at that time."""
        # 2024-01-10 is Wednesday (weekday 2)
        now = dt(2024, 1, 10, 7, 0, 0)  # 07:00, before 09:00
        rule = RecurrenceRule(
            mode="weekdays",
            weekdays=[2],  # Wednesday
            time_of_day=time(9, 0, 0),
        )
        result = next_due_date(rule, now, now)

        # Should be today: Jan 10 at 09:00
        assert result == dt(2024, 1, 10, 9, 0, 0)
        assert result > now

    def test_result_is_tz_aware(self):
        """Returned datetime must be tz-aware."""
        now = dt(2024, 1, 9, 12, 0, 0)
        rule = RecurrenceRule(
            mode="weekdays",
            weekdays=[0, 4],
            time_of_day=time(10, 0, 0),
        )
        result = next_due_date(rule, now, now)
        assert result.tzinfo is not None


# ---------------------------------------------------------------------------
# next_due_date — weekly (single-weekday alias)
# ---------------------------------------------------------------------------

class TestNextDueDateWeekly:
    """Weekly (single weekday) recurrence tests."""

    def test_weekly_friday_from_wednesday(self):
        """weekdays=[4] (Fri), now=Wed → result is Fri."""
        # 2024-01-10 is Wednesday
        now = dt(2024, 1, 10, 9, 0, 0)
        rule = RecurrenceRule(
            mode="weekly",
            weekdays=[4],  # Friday
            time_of_day=time(9, 0, 0),
        )
        result = next_due_date(rule, now, now)

        # 2024-01-12 is Friday
        assert result == dt(2024, 1, 12, 9, 0, 0)
        assert result > now

    def test_weekly_result_is_tz_aware(self):
        """Returned datetime must be tz-aware."""
        now = dt(2024, 1, 10, 9, 0, 0)
        rule = RecurrenceRule(
            mode="weekly",
            weekdays=[4],
            time_of_day=time(9, 0, 0),
        )
        result = next_due_date(rule, now, now)
        assert result.tzinfo is not None


# ---------------------------------------------------------------------------
# next_due_date — biweekly_weekdays
# ---------------------------------------------------------------------------

class TestNextDueDateBiweeklyWeekdays:
    """Biweekly weekday recurrence tests."""

    def test_biweekly_from_tuesday(self):
        """anchor=last Monday, weekdays=[0], now=this Tuesday → Monday 2 weeks from anchor."""
        # Anchor Monday: 2024-01-08
        # Now: Tuesday 2024-01-09
        anchor = date(2024, 1, 8)   # Monday, week 0 (even)
        now = dt(2024, 1, 9, 10, 0, 0)  # Tuesday

        rule = RecurrenceRule(
            mode="biweekly_weekdays",
            weekdays=[0],  # Monday
            anchor_date=anchor,
            time_of_day=time(9, 0, 0),
        )
        result = next_due_date(rule, now, now)

        # From Tuesday Jan 9, next Monday is Jan 15.
        # Weeks since anchor for Jan 15: (Jan 15 - Jan 8).days // 7 = 1 → odd → skip
        # Next Monday: Jan 22. Weeks since anchor: (Jan 22 - Jan 8).days // 7 = 2 → even → match
        assert result == dt(2024, 1, 22, 9, 0, 0)
        assert result > now

    def test_biweekly_result_is_tz_aware(self):
        """Returned datetime must be tz-aware."""
        anchor = date(2024, 1, 8)
        now = dt(2024, 1, 9, 10, 0, 0)
        rule = RecurrenceRule(
            mode="biweekly_weekdays",
            weekdays=[0],
            anchor_date=anchor,
            time_of_day=time(9, 0, 0),
        )
        result = next_due_date(rule, now, now)
        assert result.tzinfo is not None


# ---------------------------------------------------------------------------
# next_due_date — monthly
# ---------------------------------------------------------------------------

class TestNextDueDateMonthly:
    """Monthly recurrence stub tests."""

    def test_monthly_day_15_from_may_20(self):
        """day=15, now=May 20 → result is June 15."""
        now = dt(2024, 5, 20, 10, 0, 0)
        # reference day=15
        reference = dt(2024, 1, 15, 10, 0, 0)
        rule = RecurrenceRule.__new__(RecurrenceRule)
        object.__setattr__(rule, "mode", "monthly")
        object.__setattr__(rule, "interval_days", None)
        object.__setattr__(rule, "weekdays", None)
        object.__setattr__(rule, "week_parity", None)
        object.__setattr__(rule, "anchor_date", None)
        object.__setattr__(rule, "time_of_day", None)

        result = next_due_date(rule, reference, now)

        assert result > now
        assert result.month == 6
        assert result.day == 15

    def test_monthly_end_of_month_clamp(self):
        """Day 31 in February → clamped to Feb 28 (or 29 in leap year)."""
        # reference day=31
        reference = dt(2024, 1, 31, 0, 0, 0)
        # now = Jan 31 so next month is Feb
        now = dt(2024, 1, 31, 0, 0, 0)

        rule = RecurrenceRule.__new__(RecurrenceRule)
        object.__setattr__(rule, "mode", "monthly")
        object.__setattr__(rule, "interval_days", None)
        object.__setattr__(rule, "weekdays", None)
        object.__setattr__(rule, "week_parity", None)
        object.__setattr__(rule, "anchor_date", None)
        object.__setattr__(rule, "time_of_day", None)

        result = next_due_date(rule, reference, now)

        # 2024 is a leap year → Feb 29
        assert result > now
        assert result.month == 2
        assert result.day == 29  # leap year 2024

    def test_monthly_result_is_tz_aware(self):
        """Returned datetime must be tz-aware."""
        reference = dt(2024, 1, 10, 0, 0, 0)
        now = dt(2024, 3, 15, 0, 0, 0)

        rule = RecurrenceRule.__new__(RecurrenceRule)
        object.__setattr__(rule, "mode", "monthly")
        object.__setattr__(rule, "interval_days", None)
        object.__setattr__(rule, "weekdays", None)
        object.__setattr__(rule, "week_parity", None)
        object.__setattr__(rule, "anchor_date", None)
        object.__setattr__(rule, "time_of_day", None)

        result = next_due_date(rule, reference, now)
        assert result.tzinfo is not None

    def test_monthly_stays_in_current_month_if_day_not_yet_passed(self):
        """now=Jul 1, target day=28 -> Jul 28 (same month), not Aug 28.

        Regression test: the original implementation unconditionally jumped
        to next month regardless of whether the target day-of-month was
        still ahead in the current month.
        """
        now = dt(2024, 7, 1, 0, 0, 0)
        rule = RecurrenceRule.__new__(RecurrenceRule)
        object.__setattr__(rule, "mode", "monthly")
        object.__setattr__(rule, "interval_days", None)
        object.__setattr__(rule, "weekdays", None)
        object.__setattr__(rule, "week_parity", None)
        object.__setattr__(rule, "anchor_date", date(2024, 1, 28))
        object.__setattr__(rule, "time_of_day", None)

        result = next_due_date(rule, now, now)

        assert result.year == 2024
        assert result.month == 7
        assert result.day == 28

    def test_monthly_uses_anchor_date_over_reference(self):
        """anchor_date.day takes priority over reference.day when both are set."""
        now = dt(2024, 3, 1, 0, 0, 0)
        reference = dt(2024, 1, 10, 0, 0, 0)  # day=10, should be ignored
        rule = RecurrenceRule.__new__(RecurrenceRule)
        object.__setattr__(rule, "mode", "monthly")
        object.__setattr__(rule, "interval_days", None)
        object.__setattr__(rule, "weekdays", None)
        object.__setattr__(rule, "week_parity", None)
        object.__setattr__(rule, "anchor_date", date(2024, 1, 20))  # day=20
        object.__setattr__(rule, "time_of_day", None)

        result = next_due_date(rule, reference, now)

        assert result.month == 3
        assert result.day == 20

    def test_monthly_uses_time_of_day(self):
        """The result's time must come from rule.time_of_day, not from `now`.

        now is deliberately given an unrelated time (22:00) so this fails if
        the implementation ever regresses to reusing now's own time-of-day
        (as the original stub did) instead of applying rule.time_of_day.
        """
        now = dt(2024, 7, 1, 22, 0, 0)
        rule = RecurrenceRule.__new__(RecurrenceRule)
        object.__setattr__(rule, "mode", "monthly")
        object.__setattr__(rule, "interval_days", None)
        object.__setattr__(rule, "weekdays", None)
        object.__setattr__(rule, "week_parity", None)
        object.__setattr__(rule, "anchor_date", date(2024, 1, 15))
        object.__setattr__(rule, "time_of_day", time(9, 0, 0))

        result = next_due_date(rule, now, now)

        assert result.month == 7
        assert result.day == 15
        assert result.hour == 9
        assert result.minute == 0

    def test_monthly_construction_requires_anchor_date(self):
        """Real construction (not the __new__ bypass used above) must reject
        mode='monthly' with no anchor_date — matching biweekly_weekdays'
        existing requirement, and closing off the only way a rule with a
        permanently-drifting day-of-month fallback could be created going
        forward (see _next_monthly's docstring)."""
        with pytest.raises(ValueError):
            RecurrenceRule(mode="monthly", anchor_date=None)

        # A real anchor_date is accepted without error.
        RecurrenceRule(mode="monthly", anchor_date=date(2024, 1, 15))


# ---------------------------------------------------------------------------
# is_overdue
# ---------------------------------------------------------------------------

class TestIsOverdue:
    """Tests for the is_overdue helper."""

    def test_past_due_returns_true(self):
        """due_at in the past → True."""
        now = dt(2024, 6, 1, 12, 0, 0)
        due_at = dt(2024, 6, 1, 11, 0, 0)
        assert is_overdue(due_at, now) is True

    def test_future_due_returns_false(self):
        """due_at in the future → False."""
        now = dt(2024, 6, 1, 12, 0, 0)
        due_at = dt(2024, 6, 1, 13, 0, 0)
        assert is_overdue(due_at, now) is False

    def test_none_due_at_returns_false(self):
        """due_at is None → False."""
        now = dt(2024, 6, 1, 12, 0, 0)
        assert is_overdue(None, now) is False

    def test_exactly_now_not_overdue(self):
        """due_at == now → False (not strictly less than)."""
        now = dt(2024, 6, 1, 12, 0, 0)
        assert is_overdue(now, now) is False


# ---------------------------------------------------------------------------
# describe_rule
# ---------------------------------------------------------------------------

class TestDescribeRule:
    """Tests for human-readable rule descriptions."""

    def test_interval_days_plural(self):
        rule = RecurrenceRule(mode="interval_days", interval_days=7)
        desc = describe_rule(rule)
        assert desc
        assert "7" in desc
        assert "day" in desc.lower()

    def test_interval_days_singular(self):
        rule = RecurrenceRule(mode="interval_days", interval_days=1)
        desc = describe_rule(rule)
        assert "1" in desc
        # Should use singular "day"
        assert "day" in desc.lower()

    def test_rolling_days(self):
        rule = RecurrenceRule(mode="rolling_days", interval_days=3)
        desc = describe_rule(rule)
        assert desc
        assert "3" in desc
        assert "completion" in desc.lower()

    def test_weekdays_contains_day_names(self):
        rule = RecurrenceRule(mode="weekdays", weekdays=[0, 2])  # Mon, Wed
        desc = describe_rule(rule)
        assert desc
        assert "Mon" in desc
        assert "Wed" in desc

    def test_weekly_contains_day_name(self):
        rule = RecurrenceRule(mode="weekly", weekdays=[4])  # Fri
        desc = describe_rule(rule)
        assert desc
        assert "Fri" in desc

    def test_biweekly_weekdays(self):
        rule = RecurrenceRule(
            mode="biweekly_weekdays",
            weekdays=[1],  # Tue
            anchor_date=date(2024, 1, 2),
        )
        desc = describe_rule(rule)
        assert desc
        assert "Tue" in desc
        assert "other" in desc.lower()

    def test_monthly(self):
        rule = RecurrenceRule.__new__(RecurrenceRule)
        object.__setattr__(rule, "mode", "monthly")
        object.__setattr__(rule, "interval_days", None)
        object.__setattr__(rule, "weekdays", None)
        object.__setattr__(rule, "week_parity", None)
        object.__setattr__(rule, "anchor_date", date(2024, 1, 15))
        object.__setattr__(rule, "time_of_day", None)

        desc = describe_rule(rule)
        assert desc
        assert "monthly" in desc.lower() or "Monthly" in desc
        assert "15" in desc

    def test_unknown_mode(self):
        rule = RecurrenceRule.__new__(RecurrenceRule)
        object.__setattr__(rule, "mode", "totally_custom_unknown")
        object.__setattr__(rule, "interval_days", None)
        object.__setattr__(rule, "weekdays", None)
        object.__setattr__(rule, "week_parity", None)
        object.__setattr__(rule, "anchor_date", None)
        object.__setattr__(rule, "time_of_day", None)

        desc = describe_rule(rule)
        assert desc
        assert "custom" in desc.lower() or "Custom" in desc


# ---------------------------------------------------------------------------
# Edge cases
# ---------------------------------------------------------------------------

class TestEdgeCases:
    """Edge-case and boundary tests."""

    def test_interval_days_exactly_on_occurrence_returns_next(self):
        """now exactly equals a scheduled occurrence → next occurrence returned."""
        reference = dt(2024, 1, 1, 8, 0, 0)
        # now is exactly 7 days after reference
        now = dt(2024, 1, 8, 8, 0, 0)
        rule = RecurrenceRule(mode="interval_days", interval_days=7)
        result = next_due_date(rule, reference, now)
        assert result > now
        assert result == dt(2024, 1, 15, 8, 0, 0)

    def test_weekdays_today_is_target_time_passed(self):
        """Today is in weekdays but the scheduled time has already passed."""
        # 2024-01-10 is Wednesday (weekday=2), 14:00 is after 09:00
        now = dt(2024, 1, 10, 14, 0, 0)
        rule = RecurrenceRule(
            mode="weekdays",
            weekdays=[2],
            time_of_day=time(9, 0, 0),
        )
        result = next_due_date(rule, now, now)
        # Must be next Wednesday
        assert result > now
        assert result == dt(2024, 1, 17, 9, 0, 0)

    def test_weekdays_today_is_target_time_not_passed(self):
        """Today is in weekdays and the scheduled time has NOT passed."""
        # 2024-01-10 is Wednesday (weekday=2), 07:00 is before 09:00
        now = dt(2024, 1, 10, 7, 0, 0)
        rule = RecurrenceRule(
            mode="weekdays",
            weekdays=[2],
            time_of_day=time(9, 0, 0),
        )
        result = next_due_date(rule, now, now)
        # Must be today
        assert result > now
        assert result == dt(2024, 1, 10, 9, 0, 0)

    def test_rolling_days_zero_interval_no_infinite_loop(self):
        """interval=0 for rolling_days must not loop infinitely."""
        now = dt(2024, 3, 15, 8, 0, 0)
        # Bypass __post_init__ to create degenerate rule
        rule = RecurrenceRule.__new__(RecurrenceRule)
        object.__setattr__(rule, "mode", "rolling_days")
        object.__setattr__(rule, "interval_days", 0)
        object.__setattr__(rule, "weekdays", None)
        object.__setattr__(rule, "week_parity", None)
        object.__setattr__(rule, "anchor_date", None)
        object.__setattr__(rule, "time_of_day", None)

        result = next_due_date(rule, now, now)
        assert result > now


# ---------------------------------------------------------------------------
# DST edge case (documentation / tz-awareness test)
# ---------------------------------------------------------------------------

class TestDSTEdgeCases:
    """Verify that tz-aware inputs produce tz-aware outputs across all modes."""

    def test_interval_days_tz_aware_output(self):
        """Fixed UTC datetimes in → tz-aware datetime out."""
        reference = dt(2024, 3, 1, 12, 0, 0)
        now = dt(2024, 3, 10, 12, 0, 0)
        rule = RecurrenceRule(mode="interval_days", interval_days=7)
        result = next_due_date(rule, reference, now)
        assert result.tzinfo is not None
        assert result > now

    def test_rolling_days_tz_aware_output(self):
        now = dt(2024, 3, 10, 1, 0, 0)
        rule = RecurrenceRule(mode="rolling_days", interval_days=3)
        result = next_due_date(rule, now, now)
        assert result.tzinfo is not None
        assert result > now

    def test_weekdays_tz_aware_output(self):
        now = dt(2024, 3, 13, 2, 0, 0)  # Wednesday UTC
        rule = RecurrenceRule(
            mode="weekdays",
            weekdays=[4],  # Friday
            time_of_day=time(10, 0, 0),
        )
        result = next_due_date(rule, now, now)
        assert result.tzinfo is not None
        assert result > now

    def test_biweekly_tz_aware_output(self):
        anchor = date(2024, 3, 4)  # Monday
        now = dt(2024, 3, 12, 9, 0, 0)  # Tuesday
        rule = RecurrenceRule(
            mode="biweekly_weekdays",
            weekdays=[0],
            anchor_date=anchor,
            time_of_day=time(9, 0, 0),
        )
        result = next_due_date(rule, now, now)
        assert result.tzinfo is not None
        assert result > now

    def test_monthly_tz_aware_output(self):
        reference = dt(2024, 1, 10, 0, 0, 0)
        now = dt(2024, 4, 1, 0, 0, 0)

        rule = RecurrenceRule.__new__(RecurrenceRule)
        object.__setattr__(rule, "mode", "monthly")
        object.__setattr__(rule, "interval_days", None)
        object.__setattr__(rule, "weekdays", None)
        object.__setattr__(rule, "week_parity", None)
        object.__setattr__(rule, "anchor_date", None)
        object.__setattr__(rule, "time_of_day", None)

        result = next_due_date(rule, reference, now)
        assert result.tzinfo is not None
        assert result > now
