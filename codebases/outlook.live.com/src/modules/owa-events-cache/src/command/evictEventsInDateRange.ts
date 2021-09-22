import { DateRange, dateRangesOverlap } from 'owa-datetime-utils';
import type { EventEntity } from '../schema/EventEntity';
import type { EventsRetentionInfo } from '../types/EventsRetentionInfo';
import { isInAnyOfDateRanges } from '../utils/isInAnyOfDataRanges';

export function evictEventsInDateRange<T extends EventEntity>(
    dateRangeToEvict: DateRange,
    events: Map<string, T>,
    eventsRetentionInfo: EventsRetentionInfo
): T[] {
    const { dateRangesToRetain, eventsToRetain } = eventsRetentionInfo;

    // We are only concerned with overlapping ranges and not disjointed ranges that are
    // out of the scope of the dateRangeToEvict
    const overlappingRanges = dateRangesToRetain.filter(
        range => dateRangesOverlap(range, dateRangeToEvict, true /* inclusive */) === 0
    );

    return evictEventsThatDontNeedToBeRetained(
        events,
        { dateRangesToRetain: overlappingRanges, eventsToRetain },
        dateRangeToEvict
    );
}

function evictEventsThatDontNeedToBeRetained<T extends EventEntity>(
    events: Map<string, T>,
    eventsRetentionInfo: EventsRetentionInfo,
    dateRangeToEvict: DateRange
) {
    const { dateRangesToRetain, eventsToRetain } = eventsRetentionInfo;

    // add evicted events to array and evict outside the forEach loop, deleting while iterating over ObservableMap
    // skips elements
    const evictedEvents: T[] = [];
    events.forEach((currentEvent, key) => {
        const inRangeToEvict = isInAnyOfDateRanges(currentEvent, [dateRangeToEvict]);
        const inRangeToRetain = isInAnyOfDateRanges(currentEvent, dateRangesToRetain);
        const shouldRetain = eventsToRetain[currentEvent.Key] || inRangeToRetain;

        if (inRangeToEvict && !shouldRetain) {
            // if event is in the range of events to be evicted, and isn't supposed to be retained, we evict it
            evictedEvents.push(currentEvent);
        }
    });

    evictedEvents.forEach(event => {
        events.delete(event.Key);
    });

    return evictedEvents;
}
