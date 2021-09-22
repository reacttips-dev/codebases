export default function intersectionOfArrays<T>(
    arr1: T[],
    arr2: T[],
    removeDuplicates: boolean = false
): T[] {
    // Intersects the array
    let result = arr1.filter(item => arr2.indexOf(item) !== -1);

    if (removeDuplicates) {
        // Removes the duplicates
        result = result.filter((item, index, arr) => arr.indexOf(item) === index);
    }

    return result;
}
