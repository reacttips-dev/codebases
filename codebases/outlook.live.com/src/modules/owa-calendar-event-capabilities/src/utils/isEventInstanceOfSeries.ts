import type { CalendarEvent } from 'owa-calendar-types';
import isException from './isException';
import isOccurrence from './isOccurrence';

/**
 * Returns true if item
 * is an instance of a series.
 */
export default function isEventInstanceOfSeries(event: CalendarEvent): boolean {
    return isOccurrence(event.CalendarItemType) || isException(event.CalendarItemType);
}
