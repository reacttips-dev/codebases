import { CalendarEvent, compareCalendarEvents } from 'owa-calendar-types';
import type { DateRange } from 'owa-datetime-utils';
import {
    getLockedCalendarEventsReader,
    EventsCacheLockId,
    LockedCalendarEventsReader,
} from 'owa-calendar-events-store';

interface CalendarEventsReader extends LockedCalendarEventsReader {
    getOrderedEvents: (folderId: string[], dateRange: DateRange) => CalendarEvent[];
}

export function getEventsReader(lockId: EventsCacheLockId): CalendarEventsReader {
    const lockedReader = getLockedCalendarEventsReader(lockId);
    return {
        ...lockedReader,
        getOrderedEvents: (folderId: string[], dateRange: DateRange) =>
            getOrderedEvents(folderId, dateRange, lockId),
    };
}

function getOrderedEvents(
    folderId: string[],
    dateRange: DateRange,
    lockId: EventsCacheLockId
): CalendarEvent[] {
    const getCalendarEventsForDateRange = getLockedCalendarEventsReader(lockId)
        .getCalendarEventsForDateRange;

    let events: CalendarEvent[] = [];
    folderId.forEach(folder => {
        events.push(...getCalendarEventsForDateRange(folder, dateRange));
    });

    return events.sort(compareCalendarEvents);
}
export { getLockedCalendarEventsStore } from 'owa-calendar-events-store';
