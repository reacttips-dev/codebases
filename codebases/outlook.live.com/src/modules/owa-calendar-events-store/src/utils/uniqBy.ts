export function uniqBy<T>(array: T[], mappingFunction: (element: T) => string | number): T[] {
    const seenKeys = {};
    const output: T[] = [];
    array.forEach(element => {
        const key = mappingFunction(element);
        if (!seenKeys.hasOwnProperty(key)) {
            output.push(element);
            seenKeys[key] = true;
        }
    });

    return output;
}
