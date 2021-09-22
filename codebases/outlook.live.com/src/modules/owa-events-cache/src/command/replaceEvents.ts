import type { EventEntity } from '../schema/EventEntity';
import type { EventsCache } from '../schema/EventsCache';
import { logCacheUpdateForDiagnosticsAsync } from 'owa-calendar-cache-diagnostics';
import { dateRangesOverlap, DateRange } from 'owa-datetime-utils';

export function replaceEvents<T extends EventEntity>(
    eventsToAdd: T[],
    cache: EventsCache<any>,
    dateRange: DateRange[]
) {
    const numEventsInCache = cache.events.size;

    // wipe off the existing events in the ranges to drop and add new events
    let keysToDelete = [];
    cache.events.forEach((event: any, key: string) => {
        const eventDateRange = { start: event.Start, end: event.End };
        if (dateRange.some(range => dateRangesOverlap(eventDateRange, range, true) === 0)) {
            keysToDelete.push(key);
        }
    });

    // delete outside of first loop to avoid breaking the forEach and having it skip elements
    keysToDelete.forEach(key => {
        cache.events.delete(key);
    });

    eventsToAdd.forEach(event => {
        cache.events.set(event.Key, event);
    });

    // Log to diagnostics panel
    logCacheUpdateForDiagnosticsAsync({
        lockId: '',
        updateMessage: `Replaced ${keysToDelete.length} items of initial ${numEventsInCache} from cache with ${eventsToAdd.length} items`,
    });
}
