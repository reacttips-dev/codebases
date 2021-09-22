export const sortByProperty = (property: string) => (
    array: Record<string, any>,
    isDescending = false,
): Record<string, any> => {
    const sortedArray = array.sort((a, b) => a[property] - b[property]);
    return isDescending ? sortedArray.reverse() : sortedArray;
};

export const shuffle = (array: any[]) => array.sort(() => (Math.random() > 0.5 ? -1 : 1));

export const invertSortDirection = (direction) => {
    switch (direction) {
        case "asc":
            return "desc";
        case "desc":
            return "asc";
        default:
            return direction;
    }
};
