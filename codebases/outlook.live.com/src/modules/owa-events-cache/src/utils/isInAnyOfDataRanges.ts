import { DateRange, dateRangesOverlap } from 'owa-datetime-utils';
import type { EventEntity } from '../schema/EventEntity';

export function isInAnyOfDateRanges(event: EventEntity, dateRanges: DateRange[]): boolean {
    const eventDateRange: DateRange = { start: event.Start, end: event.End };
    for (let i = 0; i < dateRanges.length; i++) {
        if (dateRangesOverlap(dateRanges[i], eventDateRange, true /* inclusive */) === 0) {
            return true;
        }
    }

    return false;
}
