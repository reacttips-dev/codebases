import type CalendarEvent from 'owa-calendar-types/lib/types/CalendarEvent';
import type { DateRange } from 'owa-datetime-utils';
import { EventsCacheLockId, getEventsInDateRangeFromLock } from 'owa-events-cache';
import { getEventsCache } from '../../selectors/eventsCacheSelectors';
import { filterSeriesMasters } from '../filterSeriesMasters';

export function getCalendarEventsForDateRange(
    lockId: EventsCacheLockId,
    folderId: string,
    dateRange: DateRange
): CalendarEvent[] {
    const events = getEventsInDateRangeFromLock(dateRange, lockId, getEventsCache(folderId));
    return events ? filterSeriesMasters(events) : [];
}
