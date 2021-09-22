import type { DateRange } from 'owa-datetime-utils';
import type { EventEntity } from '../schema/EventEntity';
import type { EventsCache, EventsCacheLockId } from '../schema/EventsCache';
import { evictEventsInDateRange } from './evictEventsInDateRange';
import { evictEventsWithKeys } from './evictEventsWithKeys';
import { tryInitializeLockInfo } from './tryInitializeLockInfo';
import { aggDateRanges, notInLock, aggEvents, LockEvents } from '../utils/lockInfoEntryUtils';

export enum EvictEventsForLockType {
    All,
    DateRange,
    EventIds,
}

export function evictEventsForLock<T extends EventEntity>(
    evictionType: EvictEventsForLockType,
    lockId: EventsCacheLockId,
    cache: EventsCache<T>
) {
    tryInitializeLockInfo(lockId, cache);

    const lockInfo = cache.locksInfo.get(lockId);
    const { lockedDateRange, lockedEvents } = lockInfo;

    // We create a list of all date ranges of locks which need to be retained.
    // When EvictEventsForLockType is All or DateRange, we need to evict only the date ranges of the lock
    // and should retain events in date ranges of all other locks.
    // When EvictEventsForLockType is EventIds, we do not need to evict
    // any DateRanges, and should retain all DateRanges that are locked by any lock.
    const dateRangesToRetain: DateRange[] = [...cache.locksInfo.entries()].reduce(
        aggDateRanges(
            evictionType !== EvictEventsForLockType.EventIds ? notInLock(lockId) : () => true
        ),
        []
    );

    // We create a map of event keys which needs to be retained.
    // When EvictEventsForLockType is All or EventIds, we need to evict only the events with keys in the lock
    // and should retain all other event's keys that are locked by some other lock.
    // When EvictEventsForLockType is DateRange, we do not need to evict
    // any event's keys, and should retain all event's keys that are locked by any lock.
    const eventsToRetain = [...cache.locksInfo.entries()].reduce<LockEvents>(
        aggEvents(
            evictionType !== EvictEventsForLockType.DateRange ? notInLock(lockId) : () => true
        ),
        {}
    );

    if (
        lockedDateRange &&
        (evictionType === EvictEventsForLockType.All ||
            evictionType === EvictEventsForLockType.DateRange)
    ) {
        // Evict the date range for the lock if its present
        evictEventsInDateRange(lockedDateRange, cache.events, {
            dateRangesToRetain,
            eventsToRetain,
        });

        lockInfo.lockedDateRange = null;
    }

    const lockedEventIds = Object.keys(lockedEvents);
    if (
        lockedEventIds.length > 0 &&
        (evictionType === EvictEventsForLockType.All ||
            evictionType === EvictEventsForLockType.EventIds)
    ) {
        evictEventsWithKeys(lockedEventIds, cache.events, {
            dateRangesToRetain,
            eventsToRetain,
        });

        lockInfo.lockedEvents = {};
    }
}
