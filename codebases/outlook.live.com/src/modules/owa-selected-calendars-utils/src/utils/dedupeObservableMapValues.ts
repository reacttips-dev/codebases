import { checkUniqueByStrictEquality } from './checkUniqueByStrictEquality';
import { dedupeArrayValues } from './dedupeArrayValues';
import { ObservableMap } from 'mobx';

/**
 * Creates a clone of the observable map with all keys mapping to an array of unique values.
 *
 * Consumers should define their own `isUniqueValue` predicate if not comparing by strict equality.
 *
 * Useful for ensuring that each account's selected calendars list only contains unique values
 */
export function dedupeObservableMapValues<K, V>(
    originalMap: ObservableMap<K, V[]>,
    isUniqueValue: (arr: V[], value: V) => boolean = checkUniqueByStrictEquality
): ObservableMap<K, V[]> {
    // handle nil case
    if (!originalMap) {
        return originalMap;
    }

    // clone a map with de-duped value arrays
    const dedupeMap = new ObservableMap<K, V[]>();
    originalMap.forEach((value, key) => {
        dedupeMap.set(key, dedupeArrayValues(value, isUniqueValue));
    });
    return dedupeMap;
}
