import { DateRange, dateRangesOverlap } from 'owa-datetime-utils';
import type { EventEntity } from '../schema/EventEntity';

export function getEventsFromCache<T extends EventEntity>(
    dateRange: DateRange,
    events: Map<string, T>
): T[] {
    const returnItems: T[] = [];

    events.forEach(cacheItem => {
        const itemRange: DateRange = { start: cacheItem.Start, end: cacheItem.End };
        const rangeOverlap = dateRangesOverlap(dateRange, itemRange, true /* inclusive */);

        if (rangeOverlap === 0) {
            returnItems.push(cacheItem);
        }
    });

    return returnItems;
}
