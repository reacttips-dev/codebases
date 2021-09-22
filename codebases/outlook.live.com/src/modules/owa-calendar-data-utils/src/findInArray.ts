export interface FindInArrayResult<T> {
    item: T;
    index: number;
}

/**
 * Returns first element of array for which callback function returns true
 * @param input, the input array
 * @param callback, function to check for equality
 * @returns item and index in input array if found, null otherwise
 */
export function findInArray<T>(input: T[], callback: (item: T) => boolean): FindInArrayResult<T> {
    for (let index = 0, length = input.length; index < length; index++) {
        let item = input[index];
        if (callback(item)) {
            return { item: item, index: index };
        }
    }
    return null;
}
