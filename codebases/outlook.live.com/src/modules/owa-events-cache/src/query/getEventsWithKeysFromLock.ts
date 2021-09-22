import { DateRange, dateRangesOverlap } from 'owa-datetime-utils';
import type { EventEntity } from '../schema/EventEntity';
import type { EventsCache, EventsCacheLockId } from '../schema/EventsCache';

export function getEventsWithKeysFromLock<T extends EventEntity>(
    eventKeys: string[],
    lockId: EventsCacheLockId,
    cache: EventsCache<T>
): T[] {
    const { lockedDateRange = null, lockedEvents = [] } = cache.locksInfo.get(lockId) || {};

    if (lockedDateRange === null && Object.keys(lockedEvents).length === 0) {
        return eventKeys.map(_ => null); // List of nulls corresponding to event keys
    } else {
        return getEventsFromCache(eventKeys, lockId, cache);
    }
}

function getEventsFromCache<T extends EventEntity>(
    eventKeys: string[],
    lockId: EventsCacheLockId,
    cache: EventsCache<T>
): T[] {
    const { lockedDateRange, lockedEvents } = cache.locksInfo.get(lockId);
    const foundEvents: { [eventKey: string]: T } = {};

    eventKeys.forEach(eventKey => {
        const event = cache.events.get(eventKey);
        if (event) {
            const itemRange: DateRange = { start: event.Start, end: event.End };
            const rangeOverlap = lockedDateRange
                ? dateRangesOverlap(lockedDateRange, itemRange, true /* inclusive */) === 0
                : false;

            if (rangeOverlap || lockedEvents[event.Key]) {
                // We only add the event to the found list if it was fetched as part of the lock
                foundEvents[event.Key] = event;
            }
        }
    });

    return eventKeys.map(key => foundEvents[key] || null);
}
