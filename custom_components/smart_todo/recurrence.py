"""Recurrence engine for Smart Todo — pure Python, no HA imports."""
from __future__ import annotations

import logging
from datetime import date, datetime, time, timedelta, timezone

from .models import RecurrenceRule

# Recurrence mode string constants — mirror const.py values without importing it
# (const.py imports from homeassistant.const which is unavailable in tests)
RECURRENCE_INTERVAL_DAYS = "interval_days"
RECURRENCE_ROLLING_DAYS = "rolling_days"
RECURRENCE_WEEKDAYS = "weekdays"
RECURRENCE_BIWEEKLY_WEEKDAYS = "biweekly_weekdays"
RECURRENCE_WEEKLY = "weekly"
RECURRENCE_MONTHLY = "monthly"

_LOGGER = logging.getLogger(__name__)

# Abbreviated weekday names (Monday=0 … Sunday=6)
_WEEKDAY_ABBR = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]


# ---------------------------------------------------------------------------
# next_due_date
# ---------------------------------------------------------------------------

def next_due_date(
    rule: RecurrenceRule,
    reference: datetime,
    now: datetime,
) -> datetime:
    """Compute the next due datetime for *rule*.

    Parameters
    ----------
    rule:
        The recurrence rule to evaluate.
    reference:
        Anchor datetime used for fixed-cadence schedules (``interval_days``,
        ``monthly``).  Typically the task's original creation / anchor date.
    now:
        Current time.  Used as the floor — the returned datetime is always
        strictly *after* ``now``.  For rolling schedules this is also the
        roll-from point.

    Returns
    -------
    datetime
        A tz-aware datetime that is strictly greater than ``now``.
    """
    mode = rule.mode

    if mode == RECURRENCE_INTERVAL_DAYS:
        return _next_interval_days(rule, reference, now)

    if mode == RECURRENCE_ROLLING_DAYS:
        return _next_rolling_days(rule, now)

    if mode in (RECURRENCE_WEEKDAYS, RECURRENCE_WEEKLY):
        return _next_weekday_occurrence(rule, now)

    if mode == RECURRENCE_BIWEEKLY_WEEKDAYS:
        return _next_biweekly_weekday(rule, now)

    if mode == RECURRENCE_MONTHLY:
        return _next_monthly(rule, reference, now)

    _LOGGER.warning("next_due_date: unknown recurrence mode %r — falling back to +1 day", mode)
    return now + timedelta(days=1)


# ---------------------------------------------------------------------------
# Mode implementations
# ---------------------------------------------------------------------------

def _next_interval_days(
    rule: RecurrenceRule,
    reference: datetime,
    now: datetime,
) -> datetime:
    """Fixed cadence: reference + N * interval_days, first result > now."""
    interval = rule.interval_days  # guaranteed non-None by RecurrenceRule.__post_init__
    if interval is None or interval <= 0:
        # Degenerate: return now + 1 second to satisfy "strictly after now"
        return now + timedelta(seconds=1)

    delta = timedelta(days=interval)
    # Find smallest N ≥ 0 such that reference + N*delta > now
    if reference > now:
        return reference

    diff_seconds = (now - reference).total_seconds()
    n = int(diff_seconds / delta.total_seconds()) + 1
    candidate = reference + n * delta
    # Guard against floating-point rounding
    while candidate <= now:
        candidate += delta
    return candidate


def _next_rolling_days(rule: RecurrenceRule, now: datetime) -> datetime:
    """Rolling: always now + interval_days."""
    interval = rule.interval_days
    if interval is None or interval <= 0:
        return now + timedelta(seconds=1)
    return now + timedelta(days=interval)


def _next_weekday_occurrence(rule: RecurrenceRule, now: datetime) -> datetime:
    """Next occurrence of any weekday in rule.weekdays at rule.time_of_day, strictly after now."""
    weekdays: list[int] = rule.weekdays or []
    if not weekdays:
        _LOGGER.warning("next_due_date: weekdays mode with empty weekdays list — falling back +1 day")
        return now + timedelta(days=1)

    tod: time = rule.time_of_day or time(0, 0, 0)

    # Build a candidate for each target weekday and pick the earliest one > now
    best: datetime | None = None
    for wd in weekdays:
        candidate = _next_weekday_at_time(now, wd, tod)
        if best is None or candidate < best:
            best = candidate

    assert best is not None  # weekdays is non-empty
    return best


def _next_weekday_at_time(now: datetime, target_weekday: int, tod: time) -> datetime:
    """Return the next datetime on *target_weekday* at *tod* that is strictly after *now*."""
    # Start from today at tod
    today_at_tod = now.replace(
        hour=tod.hour, minute=tod.minute, second=tod.second, microsecond=0
    )
    # Days until target weekday (0 = today, 1 = tomorrow, …)
    days_ahead = (target_weekday - now.weekday()) % 7
    candidate = today_at_tod + timedelta(days=days_ahead)
    if candidate <= now:
        # Same weekday but time has passed (or exactly now) — go one week later
        candidate += timedelta(weeks=1)
    return candidate


def _next_biweekly_weekday(rule: RecurrenceRule, now: datetime) -> datetime:
    """Next occurrence on the correct parity week for biweekly_weekdays."""
    weekdays: list[int] = rule.weekdays or []
    anchor: date = rule.anchor_date  # guaranteed non-None by RecurrenceRule.__post_init__
    tod: time = rule.time_of_day or time(0, 0, 0)

    if not weekdays:
        _LOGGER.warning(
            "next_due_date: biweekly_weekdays mode with empty weekdays — falling back +14 days"
        )
        return now + timedelta(days=14)

    # Determine the parity of the anchor week (week 0 = "even")
    # We advance day-by-day from tomorrow, checking matching weekday AND correct week parity.
    search_start = now + timedelta(days=1)
    for offset in range(28):
        candidate_date = (search_start + timedelta(days=offset)).date()
        if candidate_date.weekday() not in weekdays:
            continue
        weeks_since_anchor = (candidate_date - anchor).days // 7
        # The anchor week itself is week 0 (even).
        # A matching occurrence happens when weeks_since_anchor is even (0, 2, 4, …)
        if weeks_since_anchor % 2 == 0:
            candidate_dt = datetime(
                candidate_date.year,
                candidate_date.month,
                candidate_date.day,
                tod.hour,
                tod.minute,
                tod.second,
                tzinfo=now.tzinfo,
            )
            if candidate_dt > now:
                return candidate_dt

    _LOGGER.warning(
        "next_due_date: biweekly_weekdays search exceeded 28 days — returning now + 14 days"
    )
    return now + timedelta(days=14)


def _next_monthly(
    rule: RecurrenceRule,
    reference: datetime,
    now: datetime,
) -> datetime:
    """Stub monthly: same day-of-month as reference, one month after now."""
    import calendar

    target_day = reference.day
    # Advance by one month from now
    year = now.year
    month = now.month + 1
    if month > 12:
        month = 1
        year += 1

    # Clamp day to the last day of the target month
    last_day = calendar.monthrange(year, month)[1]
    day = min(target_day, last_day)

    candidate = now.replace(year=year, month=month, day=day)
    # Ensure strictly after now
    if candidate <= now:
        # Advance another month
        month += 1
        if month > 12:
            month = 1
            year += 1
        last_day = calendar.monthrange(year, month)[1]
        day = min(target_day, last_day)
        candidate = now.replace(year=year, month=month, day=day)

    return candidate


# ---------------------------------------------------------------------------
# is_overdue
# ---------------------------------------------------------------------------

def is_overdue(due_at: datetime | None, now: datetime) -> bool:
    """Return True if *due_at* is not None and is strictly before *now*.

    Note: snoozed_until is intentionally NOT a parameter.
    Snooze logic is handled by TaskRuntimeState.overdue.
    """
    if due_at is None:
        return False
    return due_at < now


# ---------------------------------------------------------------------------
# describe_rule
# ---------------------------------------------------------------------------

def describe_rule(rule: RecurrenceRule) -> str:
    """Return a human-readable description of *rule*."""
    mode = rule.mode

    if mode == RECURRENCE_INTERVAL_DAYS:
        n = rule.interval_days or 0
        unit = "day" if n == 1 else "days"
        return f"Every {n} {unit}"

    if mode == RECURRENCE_ROLLING_DAYS:
        n = rule.interval_days or 0
        unit = "day" if n == 1 else "days"
        return f"{n} {unit} after completion"

    if mode in (RECURRENCE_WEEKDAYS, RECURRENCE_WEEKLY):
        days = rule.weekdays or []
        names = ", ".join(_WEEKDAY_ABBR[d] for d in sorted(days))
        return f"Every {{{names}}}"

    if mode == RECURRENCE_BIWEEKLY_WEEKDAYS:
        days = rule.weekdays or []
        name = _WEEKDAY_ABBR[days[0]] if days else "?"
        return f"Every other {name}"

    if mode == RECURRENCE_MONTHLY:
        day = rule.anchor_date.day if rule.anchor_date else (
            rule.interval_days or "?"
        )
        return f"Monthly (day {day})"

    return "Custom recurrence"
