import type CalendarEvent from 'owa-calendar-types/lib/types/CalendarEvent';
import type { DateRange } from 'owa-datetime-utils';
import type { EventsCacheLockId } from 'owa-events-cache';
import { getCalendarEventsForDateRange } from './getCalendarEventsForDateRange';
import { getCalendarEventWithKeyFromLock } from '../../selectors/calendarFolderEventsSelectors';
import type { LockedCalendarEventsReader } from '../../types/LockedCalendarEventsStore';
import { getEnhancedCalendarEventsForDateRange } from './getEnhancedCalendarEventsForDateRange';

export function getLockedCalendarEventsReader(
    existingLockId: EventsCacheLockId
): LockedCalendarEventsReader {
    return {
        getCalendarEventsForDateRange: (
            folderId: string,
            dateRange: DateRange
        ): CalendarEvent[] => {
            return getCalendarEventsForDateRange(existingLockId, folderId, dateRange);
        },

        getEnhancedCalendarEventsForDateRange: (
            folderId: string,
            dateRange: DateRange
        ): CalendarEvent[] => {
            return getEnhancedCalendarEventsForDateRange(existingLockId, folderId, dateRange);
        },
        getFullCalendarEvent: (folderId: string | null, eventKey: string): CalendarEvent | null => {
            return getCalendarEventWithKeyFromLock(folderId, eventKey, existingLockId);
        },
    };
}
