/**
 * Simple predicate for checking value uniqueness based on strict equality.
 *
 * Typically used for primitive values, e.g. calendarIds or folderIds (which are both string type)
 */
export function checkUniqueByStrictEquality<T>(arr: T[], value: T): boolean {
    return arr.indexOf(value) < 0;
}
