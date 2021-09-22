import { compare } from 'owa-datetime';
import type { EventEntity } from '../schema/EventEntity';
import { updateEventProperties } from './updateEventProperties';
import { logCacheUpdateForDiagnosticsAsync } from 'owa-calendar-cache-diagnostics';

export function upsertEvents<T extends EventEntity>(
    eventsToAdd: T[],
    events: Map<string, T>,
    forceOverrideAllPropertiesForExistingEvents: boolean = false
): T[] {
    const eventsAdded = removeExistingEventsAndGetNewEventsToAdd(
        eventsToAdd,
        events,
        forceOverrideAllPropertiesForExistingEvents
    );

    eventsAdded.forEach(event => {
        events.set(event.Key, event);
    });

    sortEventsByStartTimeAsc(eventsAdded);

    // Log to diagnostics panel
    logCacheUpdateForDiagnosticsAsync({
        lockId: '',
        updateMessage: `Upserted ${eventsAdded.length} items in the cache`,
    });

    return eventsAdded;
}

function removeExistingEventsAndGetNewEventsToAdd<T extends EventEntity>(
    eventsToAdd: T[],
    events: Map<string, T>,
    forceOverrideAllPropertiesForExistingEvents: boolean
): T[] {
    const newEventsToAdd: T[] = [];

    for (let i = 0; i < eventsToAdd.length; i++) {
        const eventToAdd = eventsToAdd[i];
        const existingEvent = events.get(eventToAdd.Key);

        if (existingEvent) {
            // As we found an item that already exists we assign properties from
            // the event to add to the event instance we have in cache so that
            // no reference changes.

            updateEventProperties(
                existingEvent,
                eventToAdd,
                forceOverrideAllPropertiesForExistingEvents
            );
            newEventsToAdd.push(existingEvent);
        } else {
            newEventsToAdd.push(eventToAdd);
        }
    }

    return newEventsToAdd;
}

function sortEventsByStartTimeAsc<T extends EventEntity>(events: T[]) {
    events.sort((e1, e2) => compare(e1.Start, e2.Start));
}
