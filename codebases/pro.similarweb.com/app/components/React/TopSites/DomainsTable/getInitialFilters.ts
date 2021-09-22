import categoryService from "common/services/categoryService";
import DurationService from "services/DurationService";

export const getInitialFilters = (params, sort) => {
    const { category, webSource, duration, country } = params;
    const categoryObject = categoryService.categoryQueryParamToCategoryObject(category);
    const { from, to, isWindow } = DurationService.getDurationData(duration).forAPI;
    return {
        keys: categoryObject.forApi,
        duration,
        from,
        to,
        webSource,
        isWindow,
        includeSubDomains: true,
        country,
        category: categoryObject.forDisplayApi,
        sort: sort.field,
        asc: sort.sortDirection === "asc",
    };
};
