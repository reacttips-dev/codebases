const createSearchFilter = (searchTerm: string) => {
    return searchTerm ? `Domain;contains;"${searchTerm.trim()}"` : "";
};

const createCategoryFilter = (category: string) => {
    return category ? `Category;category;"${category}"` : "";
};

export const buildFiltersForTable = ({
    search,
    category,
}: {
    search?: string;
    category?: string;
}) => {
    const filters = [createSearchFilter(search), createCategoryFilter(category)];
    const filtersString = filters
        .filter((tableFilter) => tableFilter && tableFilter.length > 0)
        .join(",");
    return { filter: filtersString };
};
