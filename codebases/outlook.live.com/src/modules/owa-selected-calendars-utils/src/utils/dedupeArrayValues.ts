import { checkUniqueByStrictEquality } from './checkUniqueByStrictEquality';

/**
 * Creates a clone of the array containing only unique values.
 *
 * Consumers should define their own `isUniqueValue` predicate if not comparing by strict equality.
 *
 * Useful for ensuring that a selected calendars list only contains unique values
 */
export function dedupeArrayValues<T>(
    originalArr: T[],
    isUniqueValue: (arr: T[], value: T) => boolean = checkUniqueByStrictEquality
): T[] {
    // handle nil case
    if (!originalArr) {
        return [];
    }

    // clone a de-duped array
    const dedupeArr = [];
    if (originalArr) {
        originalArr.forEach(val => {
            if (isUniqueValue(dedupeArr, val)) {
                dedupeArr.push(val);
            }
        });
    }

    return dedupeArr;
}
