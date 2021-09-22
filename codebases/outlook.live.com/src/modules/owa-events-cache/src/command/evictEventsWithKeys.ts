import type { EventEntity } from '../schema/EventEntity';
import type { EventsRetentionInfo } from '../types/EventsRetentionInfo';
import { isInAnyOfDateRanges } from '../utils/isInAnyOfDataRanges';

export function evictEventsWithKeys<T extends EventEntity>(
    eventIdsToEvict: string[],
    events: Map<string, T>,
    eventsRetentionInfo: EventsRetentionInfo
): T[] {
    // add evicted events to array and evict outside the forEach loop, deleting while iterating over ObservableMap
    // skips elements
    const evictedEvents: T[] = [];
    events.forEach(currentEvent => {
        const indexOfId = eventIdsToEvict.indexOf(currentEvent.Key);
        if (indexOfId !== -1 && canEventBeEvicted(currentEvent, eventsRetentionInfo)) {
            evictedEvents.push(currentEvent);
        }
    });

    evictedEvents.forEach(evictedEvent => {
        events.delete(evictedEvent.Key);
    });

    return evictedEvents;
}

function canEventBeEvicted(eventToEvict: EventEntity, eventsRetentionInfo: EventsRetentionInfo) {
    const { dateRangesToRetain, eventsToRetain } = eventsRetentionInfo;
    return (
        !isInAnyOfDateRanges(eventToEvict, dateRangesToRetain) && !eventsToRetain[eventToEvict.Key]
    );
}
