import type { EventEntity } from '../schema/EventEntity';
import type { EventsCache, EventsCacheLockId } from '../schema/EventsCache';
import { tryInitializeLockInfo } from './tryInitializeLockInfo';
import { updateEventProperties } from './updateEventProperties';
import { upsertEvents } from './upsertEvents';
import { logCacheUpdateForDiagnosticsAsync } from 'owa-calendar-cache-diagnostics';

export function addEventForLock<T extends EventEntity>(
    event: T,
    lockId: EventsCacheLockId,
    cache: EventsCache<T>,
    hasEventChanged: boolean = false,
    forceOverrideAllPropertiesForEventIfAvailable: boolean = false
): T {
    tryInitializeLockInfo(lockId, cache);

    const { events } = cache;

    if (hasEventChanged) {
        const existingEvent = events.get(event.Key);

        if (existingEvent) {
            updateEventProperties(
                existingEvent,
                event,
                forceOverrideAllPropertiesForEventIfAvailable
            );
            event = existingEvent;
        }
    }

    const [eventAdded] = upsertEvents(
        [event],
        events,
        forceOverrideAllPropertiesForEventIfAvailable
    );

    // Adding the event to the locked events list
    const { lockedEvents } = cache.locksInfo.get(lockId);
    lockedEvents[event.Key] = true;

    // Log to diagnostics panel
    logCacheUpdateForDiagnosticsAsync({
        lockId: lockId,
        updateMessage: `Event with startTime ${eventAdded.Start} added to the lock`,
    });

    return eventAdded;
}
