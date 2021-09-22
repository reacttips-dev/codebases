import {
    addDays,
    addMinutes,
    addMonths,
    compare,
    differenceInCalendarDays,
    differenceInMinutes,
    endOfMonth,
    endOfWeek,
    getDate,
    getDay,
    getMonth,
    OwaDate,
    startOfDay,
    startOfMonth,
    startOfWeek,
} from 'owa-datetime';
import type AbsoluteMonthlyRecurrence from 'owa-service/lib/contract/AbsoluteMonthlyRecurrence';
import type CalendarEvent from 'owa-calendar-types/lib/types/CalendarEvent';
import getRecurrenceEndDate from 'owa-recurrence-utils/lib/getRecurrenceEndDate';
import type IntervalRecurrencePatternBaseType from 'owa-service/lib/contract/IntervalRecurrencePatternBaseType';
import type RelativeMonthlyRecurrence from 'owa-service/lib/contract/RelativeMonthlyRecurrence';
import type WeeklyRecurrence from 'owa-service/lib/contract/WeeklyRecurrence';
import { DateRange, isDateInDateRange } from 'owa-datetime-utils';
import {
    isDailyRecurrence,
    isMonthlyRecurrence,
    isWeeklyRecurrence,
    isYearlyRecurrence,
    isAbsoluteMonthlyRecurrence,
} from 'owa-recurrence-utils/lib/checkRecurrenceTypes';
import { mergeAllOverlappingDateRanges } from '../utils/mergeAllOverlappingDateRanges';
import type RecurrenceType from 'owa-service/lib/contract/RecurrenceType';

import assign from 'object-assign';

/**
 * Expands the given master event to all occurrences that fall within the given rangeToInclude. The master
 * event's Recurrence will also have it's own start and end date so this may return nothing besides the given master.
 * Expands Daily, Weekly, Monthly custom recurrences. Does not expand yearly.
 * @param master the master event to expand
 * @param rangeToInclude a date range to create occurrences in
 */
export function expandRecurringItem(
    master: CalendarEvent,
    rangesToInclude: DateRange[]
): CalendarEvent[] {
    const expandRecurrence = getExpandRecurrenceFunction(master.Recurrence);
    if (!expandRecurrence) {
        return [{ ...master }];
    }
    const mergedDateRanges = mergeAllOverlappingDateRanges(rangesToInclude);
    const allOccurrenceDates: OwaDate[] = [];
    let recurrence = master.Recurrence;
    let recurrenceInterval = (recurrence.RecurrencePattern as IntervalRecurrencePatternBaseType)
        .Interval;
    mergedDateRanges.forEach(range => {
        let recurrenceDateRange = calculateRequiredRange(master, range);
        let occurrenceDates = expandRecurrence(master, recurrenceDateRange, recurrenceInterval);
        allOccurrenceDates.push(...occurrenceDates);
    });
    let startMinute = differenceInMinutes(master.Start, startOfDay(master.Start));
    let endMinute = differenceInMinutes(master.End, startOfDay(master.Start));
    // now we have our occurrence dates, create the events for them
    return populateOccurrences(master, startMinute, endMinute, allOccurrenceDates);
}

type ExpandRecurrenceFunctionType = (
    master: CalendarEvent,
    recurrenceDateRange: DateRange,
    recurrenceInterval: number
) => OwaDate[];

function getExpandRecurrenceFunction(
    recurrence: RecurrenceType
): ExpandRecurrenceFunctionType | null {
    if (isDailyRecurrence(recurrence)) {
        return expandDailyRecurrence;
    } else if (isWeeklyRecurrence(recurrence)) {
        return expandWeeklyRecurrence;
    } else if (isMonthlyRecurrence(recurrence)) {
        return expandMonthlyRecurrence;
    } else if (isYearlyRecurrence(recurrence)) {
        // for a yearly recurrence, no point in expanding it since any occurrence besides the master will be outside our cache range
        return null;
    } else {
        // not a known recurrence so just return a copy of the given item
        return null;
    }
}

function calculateRequiredRange(master: CalendarEvent, rangeToInclude: DateRange): DateRange {
    let recurrenceStartDate = startOfDay(master.Start);
    let recurrenceEndDate = getRecurrenceEndDate(recurrenceStartDate.tz, master.Recurrence);
    let recurrenceDateRange = { start: recurrenceStartDate, end: recurrenceEndDate };
    shrinkRange(recurrenceDateRange, rangeToInclude);

    return recurrenceDateRange;
}

function expandDailyRecurrence(
    master: CalendarEvent,
    recurrenceDateRange: DateRange,
    recurrenceInterval: number
): OwaDate[] {
    let occurrenceDates: OwaDate[] = [];
    let daysToCreate = differenceInCalendarDays(recurrenceDateRange.end, recurrenceDateRange.start);
    for (let i = 0; i <= daysToCreate; i = i + recurrenceInterval) {
        let date = addDays(recurrenceDateRange.start, i);
        occurrenceDates.push(date);
    }
    return occurrenceDates;
}

function expandWeeklyRecurrence(
    master: CalendarEvent,
    recurrenceDateRange: DateRange,
    recurrenceInterval: number
): OwaDate[] {
    let occurrenceDates: OwaDate[] = [];
    let pattern = master.Recurrence.RecurrencePattern as WeeklyRecurrence;
    let daysIncluded = pattern.DaysOfWeek.split(' ');
    let days = daysIncluded.map(day => indexOfDayOfWeek(day));
    let firstDayOfWeek = Math.max(indexOfDayOfWeek(pattern.FirstDayOfWeek), 0);

    let startDate = recurrenceDateRange.start;
    while (compare(startDate, recurrenceDateRange.end) <= 0) {
        let innerDate = startDate;
        let endDate = endOfWeek(innerDate, firstDayOfWeek);
        while (compare(innerDate, endDate) <= 0) {
            if (
                days.includes(getDay(innerDate)) &&
                isDateInDateRange(recurrenceDateRange, innerDate)
            ) {
                occurrenceDates.push(innerDate);
            }
            innerDate = addDays(innerDate, 1);
        }
        startDate = startOfWeek(addDays(startDate, 7 * recurrenceInterval), firstDayOfWeek);
    }
    return occurrenceDates;
}

function expandMonthlyRecurrence(
    master: CalendarEvent,
    recurrenceDateRange: DateRange,
    recurrenceInterval: number
): OwaDate[] {
    let occurrenceDates: OwaDate[] = [];
    if (isAbsoluteMonthlyRecurrence(master.Recurrence)) {
        let pattern = master.Recurrence.RecurrencePattern as AbsoluteMonthlyRecurrence;
        let dayOfMonth = pattern.DayOfMonth;
        let startDate = recurrenceDateRange.start;
        while (compare(startDate, recurrenceDateRange.end) <= 0) {
            let innerDate = startDate;
            let endDate = endOfMonth(innerDate);
            while (compare(innerDate, endDate) <= 0) {
                if (
                    getDate(innerDate) == dayOfMonth &&
                    isDateInDateRange(recurrenceDateRange, innerDate)
                ) {
                    occurrenceDates.push(innerDate);
                }
                innerDate = addDays(innerDate, 1);
            }
            startDate = startOfMonth(addMonths(startDate, recurrenceInterval));
        }
    } else {
        let pattern = master.Recurrence.RecurrencePattern as RelativeMonthlyRecurrence;
        let weekday = indexOfDayOfWeek(pattern.DaysOfWeek);

        let n = -1;
        switch (pattern.DayOfWeekIndex) {
            case 'First':
                n = 1;
                break;
            case 'Second':
                n = 2;
                break;
            case 'Third':
                n = 3;
                break;
            case 'Fourth':
                n = 4;
                break;
            case 'Last':
                break;
            default:
                // none
                break;
        }

        let startDate = recurrenceDateRange.start;
        while (compare(startDate, recurrenceDateRange.end) <= 0) {
            let date: OwaDate;
            if (n > 0) {
                date = nthWeekdayOfMonth(weekday, n, startDate);
            } else {
                date = lastWeekdayOfMonth(weekday, startDate);
            }
            if (isDateInDateRange(recurrenceDateRange, date)) {
                occurrenceDates.push(date);
            }
            startDate = startOfMonth(addMonths(startDate, recurrenceInterval));
        }
    }

    return occurrenceDates;
}

function populateOccurrences(
    master: CalendarEvent,
    startMinute: number,
    endMinute: number,
    occurrenceDates: OwaDate[]
) {
    let occurrences: CalendarEvent[] = [];
    occurrenceDates.forEach(date => {
        let occurrence: CalendarEvent = {} as CalendarEvent;
        assign(occurrence, master);
        occurrence.Start = addMinutes(date, startMinute);
        occurrence.End = addMinutes(date, endMinute);
        occurrence.CalendarItemType = 'Occurrence';
        occurrences.push(occurrence);
    });

    return occurrences;
}

/** Shrinks the first interval so it is withing the bounds of the second interval */
function shrinkRange(a: DateRange, b: DateRange): void {
    a.start = compare(a.start, b.start) > 0 ? a.start : b.start;
    /**
     * DateRange can be null in the case where a recurring event has no end date,
     * Right now compare is coerces the null value to a zero timestamp, so we must check for a null
     * value here
     * VSO 43183: fix compare is coercing the null value to a zero timestamp
     */
    a.end = a.end != null && compare(a.end, b.end) < 0 ? a.end : b.end;
}

function indexOfDayOfWeek(dayOfWeek: string): number {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(
        dayOfWeek
    );
}

/**
 * Finds the nth occurrence of a given weekday in the given month. See https://stackoverflow.com/a/32193378
 *
 * @param weekday weekday number, starting from sunday = 0
 * @param n which occurrence to find
 * @param dateInMonth some date in the month to find last weekday of
 * @returns the date for the nth weekday in the given month
 */
function nthWeekdayOfMonth(weekday: number, n: number, dateInMonth: OwaDate): OwaDate {
    const firstDayOfMonth = startOfMonth(dateInMonth);
    const daysToAdd = ((weekday - getDay(firstDayOfMonth) + 7) % 7) + (n - 1) * 7;
    return addDays(firstDayOfMonth, daysToAdd);
}

/**
 * Finds the last occurrence of the given weekday in the given month. Since every month has
 * either 4 or 5 occurrences of each weekday in it, tries the 5th first, then defaults to 4th if
 * 5th doesn't exist.
 *
 * @param weekday weekday number, starting from sunday = 0
 * @param dateInMonth some date in the month to find last weekday of
 * @returns the date for the last weekday in the given month
 */
function lastWeekdayOfMonth(weekday: number, dateInMonth: OwaDate): OwaDate {
    let fifth = nthWeekdayOfMonth(weekday, 5, dateInMonth);
    if (getMonth(fifth) == getMonth(dateInMonth)) {
        return fifth;
    } else {
        return nthWeekdayOfMonth(weekday, 4, dateInMonth);
    }
}
