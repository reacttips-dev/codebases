import {
    ICategoryLeadersNavParams,
    ICategoryLeadersServices,
    ITableColumnSort,
} from "pages/industry-analysis/category-leaders/CategoryLeaders.types";
import { UserCustomCategoryService } from "services/category/userCustomCategoryService";

export const getTableParams = (
    navParams: ICategoryLeadersNavParams,
    sort: ITableColumnSort,
    services: ICategoryLeadersServices,
) => {
    const { category: categoryId } = navParams;

    const isCustomCategory = UserCustomCategoryService.isCustomCategory(categoryId);
    const category = services.categoryService.categoryQueryParamToCategoryObject(categoryId);

    const tableApiParams = {
        ...navParams,
        category: category.forApi,
        keys: category.forApi,
        categoryHash: isCustomCategory ? category.categoryHash : "",
        isWindow: false,
        timeGranularity: "Monthly",
        includeSubDomains: true,
        orderBy: `${sort.field} ${sort.sortDirection}`,
    };

    return services.apiHelper.transformParamsForAPI(tableApiParams);
};

export const getUrlForTableRecord = (
    row: { Domain: string },
    navParams: ICategoryLeadersNavParams,
    services: ICategoryLeadersServices,
) => {
    const { Domain } = row;
    const { country, duration, websource } = navParams;

    const toState = "companyresearch_website_websiteperformance";
    const navigationParams = {
        key: Domain,
        country,
        duration,
        websource,
        isWWW: "*",
    };
    const innerLink = services.navigator.href(toState, navigationParams);
    return innerLink;
};
