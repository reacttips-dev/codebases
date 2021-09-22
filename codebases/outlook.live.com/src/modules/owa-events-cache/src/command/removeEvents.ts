import type { EventEntity } from '../schema/EventEntity';
import type { EventsCache } from '../schema/EventsCache';
import { logCacheUpdateForDiagnosticsAsync } from 'owa-calendar-cache-diagnostics';

export function removeEvents<T extends EventEntity>(
    shouldRemove: (event: T) => boolean,
    cache: EventsCache<T>
): T[] {
    const { events } = cache;
    const removedEvents: T[] = [];

    events.forEach((cacheItem, key) => {
        if (shouldRemove(cacheItem)) {
            removedEvents.push(cacheItem);
        }
    });

    removedEvents.forEach(removedEvent => {
        events.delete(removedEvent.Key);
    });

    cleanLockedEventInfoForEvents(removedEvents, cache);

    // Log to diagnostics panel
    logCacheUpdateForDiagnosticsAsync({
        lockId: '',
        updateMessage: `Unloaded ${removedEvents.length} items from cache`,
    });

    return removedEvents.reverse();
}

function cleanLockedEventInfoForEvents(events: EventEntity[], cache: EventsCache<EventEntity>) {
    [...cache.locksInfo.keys()].forEach(lockId => {
        const lockInfo = cache.locksInfo.get(lockId);

        // For all the locks remove the corresponding lock for the events
        events.forEach(event => delete lockInfo.lockedEvents[event.Key]);
    });
}
