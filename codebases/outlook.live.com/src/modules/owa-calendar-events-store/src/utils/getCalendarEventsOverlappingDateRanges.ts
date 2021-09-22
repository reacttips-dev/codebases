import type CalendarEvent from 'owa-calendar-types/lib/types/CalendarEvent';
import { DateRange, dateRangesOverlap } from 'owa-datetime-utils';

/**
 * It goes over the list of events passed on and returns back
 * only the events that overlap with atleast one of the passed in date ranges.
 * @param calendarEvents The calendar events to filter
 * @param dateRanges The list of date ranges for which to see if the event is part of it
 */
export function getCalendarEventsOverlappingDateRanges(
    calendarEvents: ReadonlyArray<Readonly<CalendarEvent>>,
    dateRanges: DateRange[]
): { eventsOverlapping: CalendarEvent[]; eventsNotOverlapping: CalendarEvent[] } {
    const eventsOverlapping: CalendarEvent[] = [];
    const eventsNotOverlapping: CalendarEvent[] = [];

    calendarEvents.forEach(event => {
        const eventDateRange: DateRange = { start: event.Start, end: event.End };
        const doesDateOverLapWithAny = dateRanges.some(
            dateRange => dateRangesOverlap(dateRange, eventDateRange, true /* inclusive */) === 0
        );

        if (doesDateOverLapWithAny) {
            eventsOverlapping.push(event);
        } else {
            eventsNotOverlapping.push(event);
        }
    });

    return { eventsOverlapping, eventsNotOverlapping };
}
