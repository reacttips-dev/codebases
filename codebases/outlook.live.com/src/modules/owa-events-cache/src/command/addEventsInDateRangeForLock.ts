import { compare, differenceInMilliseconds } from 'owa-datetime';
import type { EventEntity } from '../schema/EventEntity';
import type { EventsCache, EventsCacheLockId } from '../schema/EventsCache';
import { evictEventsForLock, EvictEventsForLockType } from './evictEventsForLock';
import { trace } from 'owa-trace';
import { tryInitializeLockInfo } from './tryInitializeLockInfo';
import { upsertEvents } from './upsertEvents';
import {
    containsDateRange,
    DateRange,
    dateRangesOverlap,
    createDateRangeUnion,
} from 'owa-datetime-utils';
import { logCacheUpdateForDiagnosticsAsync } from 'owa-calendar-cache-diagnostics';

/**
 * Adds the events in date range and locks them for the specific lock.
 * @param dateRange The date range that needs to be added
 * @param eventsToAdd The list of events to add for the specified data range
 * @param lockId The lock id for which to add the events and lock them
 * @param cache The cache
 */
export function addEventsInDateRangeForLock<T extends EventEntity>(
    dateRange: DateRange,
    eventsToAdd: T[],
    lockId: EventsCacheLockId,
    cache: EventsCache<T>
) {
    tryInitializeLockInfo(lockId, cache);

    let { lockedDateRange } = cache.locksInfo.get(lockId);

    // get the current date range to log to diagnostics panel
    const diagnosticMessageCurrentDateRange = lockedDateRange
        ? `${lockedDateRange.start} - ${lockedDateRange.end}`
        : 'null';

    if (
        !lockedDateRange ||
        areDateRangesDisjointed(lockedDateRange, dateRange) ||
        containsDateRange(dateRange, lockedDateRange, true /* inclusive */)
    ) {
        // In the following cases, we start with a fresh collection of items and range:
        // - This is the first load
        // - We are loading a disjoint range into the cache.
        // - The newly requested range is a superset of the current cached range
        trace.info(
            `[addEventsForLock] Replacing all items in cache for lock "${lockId}". Date range: ${dateRange.start} - ${dateRange.end}`
        );

        evictEventsForLock(EvictEventsForLockType.DateRange, lockId, cache);
        lockedDateRange = dateRange;
    } else if (containsDateRange(lockedDateRange, dateRange, true /* inclusive */)) {
        trace.info(
            `[addEventsForLock]: Date range in lock ${lockId} already contains the range to be added.`
        );
    } else {
        lockedDateRange = createDateRangeUnion(lockedDateRange, dateRange);
    }

    const eventsAdded = upsertEvents(eventsToAdd, cache.events);
    cache.locksInfo.get(lockId).lockedDateRange = lockedDateRange;
    trace.info(
        `[addEvents] New range in cache for lock "${lockId}": ${lockedDateRange.start} - ${lockedDateRange.end}`
    );

    // Log to diagnostics panel
    logCacheUpdateForDiagnosticsAsync({
        lockId: lockId,
        updateMessage: `${eventsAdded.length} events added to the lock. Previous locked daterange: ${diagnosticMessageCurrentDateRange}. New locked daterange: ${lockedDateRange.start} - ${lockedDateRange.end}`,
    });

    return eventsAdded;
}

function areDateRangesDisjointed(dateRange1: DateRange, dateRange2: DateRange): boolean {
    return (
        dateRangesOverlap(dateRange1, dateRange2, true /* inclusive */) != 0 &&
        !areDateRangesContiguous(dateRange1, dateRange2)
    );
}

function areDateRangesContiguous(dateRange1: DateRange, dateRange2: DateRange): boolean {
    let delta = 0;
    if (compare(dateRange1.start, dateRange2.start) < 0) {
        delta = differenceInMilliseconds(dateRange2.start, dateRange1.end);
    } else {
        delta = differenceInMilliseconds(dateRange1.start, dateRange2.end);
    }
    // The date ranges are contiguous if they are within 1 ms of each other
    return delta == 1;
}
