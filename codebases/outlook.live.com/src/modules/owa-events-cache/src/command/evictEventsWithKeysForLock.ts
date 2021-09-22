import type { EventEntity } from '../schema/EventEntity';
import type { EventsCache, EventsCacheLockId } from '../schema/EventsCache';
import { evictEventsWithKeys } from './evictEventsWithKeys';
import { tryInitializeLockInfo } from './tryInitializeLockInfo';
import { aggDateRanges, aggEvents, notInLock, LockEvents } from '../utils/lockInfoEntryUtils';
/**
 * This evicts the event with the keys locked by the lock.
 * It will not evict anything if the event corresponding to key
 * was locked using a date range
 * @param eventKeysToEvict The keys of the events to evict
 * @param lockId The lock id for which to evict the events
 * @param cache The events cache
 * @returns The list of events that were evicted
 */
export function evictEventsWithKeysForLock<T extends EventEntity>(
    eventKeysToEvict: string[],
    lockId: EventsCacheLockId,
    cache: EventsCache<T>
): T[] {
    if (eventKeysToEvict.length === 0) {
        return [];
    }

    tryInitializeLockInfo(lockId, cache);

    const lockInfo = cache.locksInfo.get(lockId);

    // We filter any keys to evict not locked by the lock
    eventKeysToEvict = eventKeysToEvict.filter(key => lockInfo.lockedEvents[key]);

    const dateRangesToRetain = [...cache.locksInfo.entries()].reduce(aggDateRanges(), []);

    const eventsToRetain = [...cache.locksInfo.entries()].reduce<LockEvents>(
        aggEvents(notInLock(lockId)),
        {}
    );

    const evictedEvents = evictEventsWithKeys(eventKeysToEvict, cache.events, {
        dateRangesToRetain,
        eventsToRetain,
    });

    // We go over all the events that should have been evicted
    // and remove from the lock. We don't use the `evictedEvents`
    // as even though we might consider the event to be evicted for
    // this lock but it might be locked by some other lock
    eventKeysToEvict.forEach(eventKey => {
        delete lockInfo.lockedEvents[eventKey];
    });

    return evictedEvents;
}
