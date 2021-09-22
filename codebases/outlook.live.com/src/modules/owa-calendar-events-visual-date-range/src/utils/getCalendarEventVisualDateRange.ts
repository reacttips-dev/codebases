import type { CalendarEvent } from 'owa-calendar-types';
import type { DateRange } from 'owa-datetime-utils';
import { isEqual, startOfDay, subMilliseconds } from 'owa-datetime';

/***
 * When represented visually, events that end at the begining of a day, but do not begin at
 * the begining of the that day are considered events from the previous day.
 * i.e. events that end at 12AM, but do not begin at 12AM on a particular day are considered
 *  the previous days events. We add milliseconds -1 milleseconds to get the visual date range.
 *
 * Example: An event from Mon to Tue has start date Mon 12:00AM and end date as Wed 12:00AM.
 * The sub 1 milliseconds makes sure we announce Tue as end day (otherwise the visual date range would extend to Wed).
 *  */

export function getCalendarEventVisualDateRange(calendarEvent: CalendarEvent): DateRange {
    return getCalendarEventDateRangeVisualDateRange({
        start: calendarEvent.Start,
        end: calendarEvent.End,
    });
}

export function getCalendarEventDateRangeVisualDateRange(dateRange: DateRange): DateRange {
    const startOfEndDate = startOfDay(dateRange.end);
    const itemRange: DateRange = { start: dateRange.start, end: dateRange.end };

    const eventEndsAtStartOfDay = isEqual(dateRange.end, startOfEndDate);
    const eventStartsAtEndOfDay = isEqual(dateRange.start, startOfEndDate);

    if (eventEndsAtStartOfDay && !eventStartsAtEndOfDay) {
        itemRange.end = subMilliseconds(itemRange.end, 1);
    }
    return itemRange;
}
