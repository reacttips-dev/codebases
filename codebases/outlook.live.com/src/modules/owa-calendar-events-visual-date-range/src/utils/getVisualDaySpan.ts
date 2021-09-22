import { MILLISECONDS_IN_DAY } from 'owa-date-constants';
import { startOfDay, differenceInMilliseconds } from 'owa-datetime';
import type { CalendarEvent } from 'owa-calendar-types';
import { getCalendarEventVisualDateRange } from './getCalendarEventVisualDateRange';

export function getVisualDaySpan(item: CalendarEvent): number {
    const visualDateRange = getCalendarEventVisualDateRange(item);
    const duration = differenceInMilliseconds(
        startOfDay(visualDateRange.end),
        startOfDay(visualDateRange.start)
    );
    return Math.ceil(duration / MILLISECONDS_IN_DAY);
}
