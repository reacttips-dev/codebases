import { checkUniqueByStrictEquality } from './checkUniqueByStrictEquality';
import type { ObservableMap } from 'mobx';

/**
 * Creates a flat list of unique values from the entries of an observable map.
 *
 * Consumers should define their own `isUniqueValue` predicate if not comparing by strict equality.
 *
 * Useful for generating a single unique list of selected calendars across all connected accounts
 */
export function flattenObservableMapValues<K, V>(
    originalMap: ObservableMap<K, V[]>,
    isUniqueValue: (arr: V[], value: V) => boolean = checkUniqueByStrictEquality
): V[] {
    // handle nil case
    if (!originalMap) {
        return [];
    }

    // iterate through map entries to build flat list
    const flattenedValues = [];
    originalMap.forEach(value => {
        if (value) {
            value.forEach(val => {
                if (isUniqueValue(flattenedValues, val)) {
                    flattenedValues.push(val);
                }
            });
        }
    });

    return flattenedValues;
}
