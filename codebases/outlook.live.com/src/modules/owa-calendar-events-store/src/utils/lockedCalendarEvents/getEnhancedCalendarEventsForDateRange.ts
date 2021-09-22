import { getCalendarEventsForDateRange } from './getCalendarEventsForDateRange';
import type { DateRange } from 'owa-datetime-utils';
import type { EventsCacheLockId } from 'owa-events-cache';
import { isEnhancedDateRange } from '../../store/EnhancedItemsMap';

export function getEnhancedCalendarEventsForDateRange(
    lockId: EventsCacheLockId,
    folderId: string,
    dateRange: DateRange
) {
    // do the extra checking to make sure the ++ events had loaded
    if (isEnhancedDateRange(folderId, dateRange)) {
        return getCalendarEventsForDateRange(lockId, folderId, dateRange);
    }
    // If we have not finished loading the Enhanced calendar events, return null
    return null;
}
