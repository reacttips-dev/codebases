import type { CalendarEntry } from 'owa-graph-schema';
import { getCalculatedFolderId } from 'owa-calendar-properties';
/**
 * Predicate for checking Calendar value uniqueness based on the calculatedFolderId.
 */
export function checkUniqueCalendar(arr: CalendarEntry[], value: CalendarEntry): boolean {
    return !arr.some(
        arrVal =>
            arrVal &&
            value &&
            getCalculatedFolderId(arrVal)?.Id === getCalculatedFolderId(value)?.Id
    );
}
