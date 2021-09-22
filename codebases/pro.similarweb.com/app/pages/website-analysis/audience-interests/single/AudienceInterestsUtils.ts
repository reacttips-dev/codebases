const createTableFilter = (filterKey: string, filterValue: string) => {
    return `${filterKey};contains;"${filterValue.trim()}"`;
};

export const buildSearchFilterForTable = (searchKey: string, searchValue: string) => {
    const filterValue = searchValue
        ? { filter: createTableFilter(searchKey, searchValue) }
        : { filter: "" };

    return filterValue;
};
