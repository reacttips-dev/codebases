import { compare } from 'owa-datetime';
import { containsDateRange, DateRange } from 'owa-datetime-utils';
import type { EventEntity } from '../schema/EventEntity';
import type { EventsCache, EventsCacheLockId } from '../schema/EventsCache';
import { evictEventsInDateRange } from './evictEventsInDateRange';
import { trace } from 'owa-trace';
import { tryInitializeLockInfo } from './tryInitializeLockInfo';
import { aggEvents, aggDateRanges, notInLock, LockEvents } from '../utils/lockInfoEntryUtils';
import { logCacheUpdateForDiagnosticsAsync } from 'owa-calendar-cache-diagnostics';

export function evictEventsExceptInDateRangeForLock<T extends EventEntity>(
    dateRange: DateRange,
    lockId: EventsCacheLockId,
    cache: EventsCache<T>
) {
    tryInitializeLockInfo(lockId, cache);

    const lockInfo = cache.locksInfo.get(lockId);
    const lockedDateRange = lockInfo.lockedDateRange;

    if (
        !lockedDateRange ||
        containsDateRange(dateRange, lockInfo.lockedDateRange, true /* inclusive */)
    ) {
        return;
    }

    // Log to diagnostics panel
    logCacheUpdateForDiagnosticsAsync({
        lockId: lockId,
        updateMessage: `Now evicting events in cache except for events in date range ${dateRange.start} - ${dateRange.end}. Current locked cache range: ${lockedDateRange.start} - ${lockedDateRange.end}`,
    });

    // Get list of all date ranges that need to be retained
    const dateRangesToRetain = [...cache.locksInfo.entries()].reduce(
        aggDateRanges(notInLock(lockId)), // Get all the date ranges except the ones from the lock which we need to evict events
        [dateRange /** we need to retain the new date range hence we add it to the list */]
    );

    // Get the list of event keys that need to be retained, which will be all events
    // locked by key
    const eventsToRetain = [...cache.locksInfo.entries()].reduce<LockEvents>(aggEvents(), {});

    const eventsEvicted = evictEventsInDateRange(lockedDateRange, cache.events, {
        dateRangesToRetain,
        eventsToRetain,
    });

    trace.info(
        `[owa-events-cache:evictEventsExceptInDateRangeForLock] Evicted ${eventsEvicted.length} events for lock '${lockId}'`
    );

    if (containsDateRange(lockedDateRange, dateRange, true /* inclusive */)) {
        // If the new date range is equal to or within the locked date range then use
        // the new date range
        lockInfo.lockedDateRange = { ...dateRange };
    } else {
        // As the new date range is not contained within the old cached range
        // we need to figure out what the new range for the cache is. We don't
        // set it as is to new date range as there might not be events loaded for
        // that range hence it would be incorrect to set to it.
        lockInfo.lockedDateRange = getMinDateRange(dateRange, lockedDateRange);
    }

    // Log to diagnostics panel
    logCacheUpdateForDiagnosticsAsync({
        lockId: lockId,
        updateMessage: `Evicted ${eventsEvicted.length} events for lock. New locked cache range: ${lockedDateRange.start} - ${lockedDateRange.end}`,
    });
}

function getMinDateRange(dateRange1: DateRange, dateRange2: DateRange): DateRange {
    // We figure out the new range as
    //
    // start = max(dateRange1.start, dateRange2.start)
    // end = min(dateRange1.end, dateRange2.end)
    //
    // As these are not numbers so we use the compareAsc to implement similar logic
    const isDateRange1StartBeforeDateRange2Start =
        compare(dateRange1.start, dateRange2.start) === -1;
    const isDateRange1EndAfterDateRange2End = compare(dateRange1.end, dateRange2.end) === 1;

    let { start, end } = dateRange1;

    if (isDateRange1StartBeforeDateRange2Start) {
        start = dateRange2.start;
    }

    if (isDateRange1EndAfterDateRange2End) {
        end = dateRange2.end;
    }

    return { start, end };
}
