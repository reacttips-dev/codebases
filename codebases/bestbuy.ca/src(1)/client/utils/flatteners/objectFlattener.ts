export const objectFlattener = (obj: {}) => {
    const flattenedArray = [];
    for (const key in obj) {
        if (obj[key]) {
            flattenedArray.push(obj[key]);
        }
    }

    return flattenedArray;
};
