import type CalendarEvent from 'owa-calendar-types/lib/types/CalendarEvent';
import { DateRange, dateRangesOverlap } from 'owa-datetime-utils';
import { getCalendarEventVisualDateRange } from './getCalendarEventVisualDateRange';

export function isEventInVisualDateRange(dateRange: DateRange) {
    return (calendarEvent: CalendarEvent): boolean => {
        const visualDateRange = getCalendarEventVisualDateRange(calendarEvent);
        return dateRangesOverlap(dateRange, visualDateRange, true) === 0;
    };
}
