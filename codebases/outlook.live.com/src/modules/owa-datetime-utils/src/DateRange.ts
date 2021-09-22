import TimeConstants from './TimeConstants';
import { DateRangeType } from '@fluentui/date-time-utilities/lib/dateValues/dateValues';
import {
    addDays,
    addMinutes,
    addWeeks,
    compare,
    differenceInCalendarDays,
    differenceInCalendarWeeks,
    differenceInHours,
    endOfMonth,
    endOfWeek,
    getDay,
    getDaysInMonth,
    now,
    OwaDate,
    startOfDay,
    startOfMonth,
    startOfWeek,
} from 'owa-datetime';

/**
 * Interface representing a date range with start and end dates
 */
export interface DateRange {
    start: OwaDate;
    end: OwaDate;
}

/**
 * Creates a default date range based on beginning of the week
 */
export function createWeekDateRange(
    firstDayOfWeek: number,
    selectedDay: OwaDate = now()
): DateRange {
    return createDateRange(startOfWeek(selectedDay, firstDayOfWeek), TimeConstants.DaysInOneWeek);
}

/**
 * Creates a month long date range which includes the base date
 * and extends to the beginning of the first week and the end of the last week.
 */
export function createMonthDateRange(baseDate: OwaDate, firstDayOfWeek: number): DateRange {
    let rangeStart = getMonthRangeStart(baseDate, firstDayOfWeek);
    let monthEnd = endOfMonth(baseDate);
    let rangeEnd = addDays(endOfWeek(monthEnd, firstDayOfWeek), 1);

    return createDateRange(
        rangeStart,
        Math.abs(differenceInCalendarDays(rangeStart, rangeEnd) - 1)
    );
}

/**
 * Gets the start date of the month range to display
 */
export function getMonthRangeStart(baseDate: OwaDate, firstDayOfWeek: number): OwaDate {
    let monthStart = startOfMonth(baseDate);
    return startOfWeek(monthStart, firstDayOfWeek);
}

/**
 * Creates a date range starting at the specified date with the given number of days
 * @param start: the start date for the range
 * @param length: the number of days in the range
 */
export function createDateRange(start: OwaDate, length: number): DateRange {
    return {
        start: start,
        end: addDays(start, length - 1),
    };
}

/**
 * Creates a date range of a given type, based on a particular date.
 * @param dateRangeType The type of date range to create.
 * @param baseDate The base date for the specified range.
 * @param firstDayOfWeek The index of the first day of the week, where 0 is Sunday.
 * @param workDays work days array.
 */
export function createDateRangeFromType(
    dateRangeType: DateRangeType,
    baseDate: OwaDate,
    firstDayOfWeek: number,
    workDays: number[],
    numOfDaysInDayRange: number = 1
): DateRange {
    switch (dateRangeType) {
        case DateRangeType.Day:
            return createDateRange(startOfDay(baseDate), numOfDaysInDayRange);
        case DateRangeType.Month:
            const start = startOfMonth(baseDate);
            const end = endOfMonth(baseDate);
            const length = Math.abs(differenceInCalendarDays(start, end) - 1);
            return createDateRange(start, length);
        case DateRangeType.Week:
            return createWeekDateRange(firstDayOfWeek, baseDate);
        case DateRangeType.WorkWeek:
            return createWorkWeekDateRange(firstDayOfWeek, workDays, baseDate);
    }
}

/**
 * Creates a date range of a work week, based on a particular date.
 * @param firstDayOfWeek The index of the first day of the week, where 0 is Sunday.
 * @param workDays work days array.
 * @param baseDate The base date for the specified range.
 */
export function createWorkWeekDateRange(
    firstDayOfWeek: number,
    workDays: number[],
    baseDate: OwaDate = now()
): DateRange {
    // Get regular week date range
    let weekDateRange = createWeekDateRange(firstDayOfWeek, baseDate);
    var workDateRangeStart;
    var workDateRangeEnd;

    // Starting from weekDateRange.start, the first work day found moving forward will be workDateRangeStart.
    // Starting from weekDateRange.end, the first work day found moving backwards will be workDateRangeEnd.
    for (var i = 0; i <= getDateRangeLength(weekDateRange); i++) {
        let tempDate = addDays(weekDateRange.start, i);

        if (!workDateRangeStart && workDays.includes(getDay(tempDate))) {
            workDateRangeStart = tempDate;
        }
        tempDate = addDays(weekDateRange.end, -i);
        if (!workDateRangeEnd && workDays.includes(getDay(tempDate))) {
            workDateRangeEnd = tempDate;
        }
        if (workDateRangeStart && workDateRangeEnd) {
            break;
        }
    }

    return {
        start: workDateRangeStart,
        end: workDateRangeEnd,
    };
}

/**
 * Gets the number of weeks in the month
 */
export function getWeeksInMonth(selectedDay: OwaDate, firstDayOfWeek: number): number {
    let monthRange = createMonthDateRange(selectedDay, firstDayOfWeek);
    return differenceInCalendarWeeks(monthRange.end, monthRange.start, firstDayOfWeek);
}

/**
 * Gets the next date range based on the given range
 * @param dateRange: The current date range
 * @param dateRangeType: The date range type, i.e., week, month, etc
 * @returns The next date range
 */
export function getNextDateRange(dateRange: DateRange, dateRangeType: DateRangeType): DateRange {
    var start;
    if (dateRangeType == DateRangeType.WorkWeek) {
        start = addWeeks(dateRange.start, 1);
    } else {
        start = addDays(dateRange.end, 1);
    }

    const length =
        dateRangeType == DateRangeType.Month
            ? getDaysInMonth(start)
            : differenceInCalendarDays(dateRange.end, dateRange.start) + 1;

    return createDateRange(start, length);
}

/**
 * Gets the previous date range based on the given date range
 * @param dateRange: The current date range
 * @param dateRangeType: The date range type, i.e., week, month, etc
 * @returns The previous date range
 */
export function getPreviousDateRange(
    dateRange: DateRange,
    dateRangeType: DateRangeType
): DateRange {
    var rangeStart;
    var rangeEnd;

    if (dateRangeType == DateRangeType.WorkWeek) {
        rangeStart = addWeeks(dateRange.start, -1);
        rangeEnd = addWeeks(dateRange.end, -1);
    } else {
        rangeEnd = addDays(dateRange.start, -1);
        const rangeLength =
            dateRangeType == DateRangeType.Month
                ? -getDaysInMonth(rangeEnd)
                : differenceInCalendarDays(dateRange.start, dateRange.end) - 1;

        rangeStart = addDays(dateRange.start, rangeLength);
    }
    return {
        start: rangeStart,
        end: rangeEnd,
    };
}

/**
 * Compares the date range start and end dates to see if they are equal
 * @param dateRange1: The first date range to compare
 * @param dateRange2: The second date range to compare
 * @returns True if the date ranges are equal, false otherwise
 */
export function areDateRangesEqual(dateRange1: DateRange, dateRange2: DateRange): boolean {
    return (
        dateRange1 &&
        dateRange2 &&
        compare(dateRange1.start, dateRange2.start) == 0 &&
        compare(dateRange1.end, dateRange2.end) == 0
    );
}

/**
 * Returns a numerical value indicating  if and how the specified date ranges overlap
 * @param dateRange1: The first date range
 * @param dateRange2: The second date range
 * @param inclusive: Whether we should do an inclusive check
 * @returns
 *  0 if the ranges overlap,
 * -1 if the second range ends before the first range begins
 *  1 if the second range begins after the first range ends
 */
export function dateRangesOverlap(
    dateRange1: DateRange,
    dateRange2: DateRange,
    inclusive: boolean
): number {
    if (!dateRange1 || !dateRange2) {
        throw new Error('Date ranges cannot be null in call to areDateRangesOverlapping');
    }

    if (inclusive) {
        if (compare(dateRange1.start, dateRange2.start) <= 0) {
            return compare(dateRange1.end, dateRange2.start) >= 0 ? 0 : 1;
        } else {
            return compare(dateRange2.end, dateRange1.start) >= 0 ? 0 : -1;
        }
    } else {
        if (compare(dateRange1.start, dateRange2.start) < 0) {
            return compare(dateRange1.end, dateRange2.start) > 0 ? 0 : 1;
        } else {
            return compare(dateRange2.end, dateRange1.start) > 0 ? 0 : -1;
        }
    }
}

/**
 * Checks if the second date range is included within the first date range
 * @param dateRange1 The outside range
 * @param dateRange2 The range to check if it is contained in the outer range
 * @param inclusive: Whether to do an inclusive check
 * @returns True if the dateRange1 contains dateRange2
 */
export function containsDateRange(
    dateRange1: DateRange,
    dateRange2: DateRange,
    inclusive: boolean
): boolean {
    if (!dateRange1 || !dateRange2) {
        return false;
    } else if (inclusive) {
        return (
            compare(dateRange1.start, dateRange2.start) <= 0 &&
            compare(dateRange1.end, dateRange2.end) >= 0
        );
    } else {
        return (
            compare(dateRange1.start, dateRange2.start) < 0 &&
            compare(dateRange1.end, dateRange2.end) > 0
        );
    }
}

/**
 * Creates a new date range based on the earliest start date and the latest end date of the provided date ranges
 * @param dateRange1 The first date range
 * @param dateRange2 The second date range
 * @returns The new (merged) date range
 */
export function createDateRangeUnion(dateRange1: DateRange, dateRange2: DateRange): DateRange {
    if (!dateRange1 || !dateRange2) {
        return null;
    } else {
        let start =
            compare(dateRange1.start, dateRange2.start) < 0 ? dateRange1.start : dateRange2.start;
        let end = compare(dateRange1.end, dateRange2.end) > 0 ? dateRange1.end : dateRange2.end;
        return {
            start: start,
            end: end,
        };
    }
}

/**
 * Gets the length of the date range in number of calendar days in between
 * @param dateRange: The date range
 * @returns The number of days in the date range
 */
export function getDateRangeLength(dateRange: DateRange): number {
    return differenceInCalendarDays(dateRange.end, dateRange.start);
}

/**
 * Gets the number of days this date range will cover
 * @param dateRange: The date range
 * @returns The number of days in the date range
 */
export function getDateRangeDayCount(dateRange: DateRange): number {
    // BUG 27159 for tracking the case when DST begins and the day is of 23hrs only. This will return '1' instead of '2'
    return (
        Math.floor(differenceInHours(dateRange.end, dateRange.start) / 24) +
        (differenceInHours(dateRange.end, dateRange.start) % 24 > 0 ? 1 : 0)
    );
}

/**
 * Gets a date range from a list of dates
 * @param dateRangeArray: The dates to get the date range for
 * @returns The date range encompassing all specified dates, or null if no dates specified
 */
export function toDateRange(dateRangeArray: OwaDate[]): DateRange {
    if (dateRangeArray == null || dateRangeArray.length == 0) {
        return null;
    }

    // For now assume the dates are sorted from min to max
    return {
        start: dateRangeArray[0],
        end: dateRangeArray[dateRangeArray.length - 1],
    };
}

export function isDateInDateRange(dateRange: DateRange, date: OwaDate): boolean {
    return (
        differenceInCalendarDays(dateRange.start, date) <= 0 &&
        differenceInCalendarDays(dateRange.end, date) >= 0
    );
}

/**
 * Adds minutes to both the start and the end of the date range
 * @param dateRange date range to add minutes to
 * @param minutes number of minutes to add
 */
export function addMinutesToDateRange(dateRange: DateRange, minutes: number): DateRange {
    return {
        start: addMinutes(dateRange.start, minutes),
        end: addMinutes(dateRange.end, minutes),
    };
}
