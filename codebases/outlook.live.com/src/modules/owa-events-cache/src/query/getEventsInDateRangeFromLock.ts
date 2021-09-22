import { getEventsFromCache } from './getEventsFromCache';
import type { EventEntity } from '../schema/EventEntity';
import type { EventsCache, EventsCacheLockId } from '../schema/EventsCache';
import { logCacheUpdateForDiagnosticsAsync } from 'owa-calendar-cache-diagnostics';
import { containsDateRange, DateRange } from 'owa-datetime-utils';
import { hasQueryStringParameter } from 'owa-querystring';

export function getEventsInDateRangeFromLock<T extends EventEntity>(
    dateRange: DateRange,
    lockId: EventsCacheLockId,
    cache: EventsCache<T>
): T[] | null {
    const lockedDateRange =
        cache && cache.locksInfo.get(lockId) ? cache.locksInfo.get(lockId).lockedDateRange : null;

    if (lockedDateRange == null || !containsDateRange(lockedDateRange, dateRange, true)) {
        return null;
    } else {
        const returnItems = getEventsFromCache(dateRange, cache.events);

        if (hasQueryStringParameter('debugEventsCache')) {
            // Log to diagnostics panel
            const diagnosticMessageItemsLength = returnItems ? returnItems.length : 'no';
            logCacheUpdateForDiagnosticsAsync({
                lockId: lockId,
                updateMessage: `Returning ${diagnosticMessageItemsLength} items from cache for date range: ${dateRange.start} - ${dateRange.end}`,
            });
        }

        return returnItems;
    }
}
