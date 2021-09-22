import {
    DataGranularity,
    ICategoryShareServices,
} from "pages/industry-analysis/category-share/CategoryShareTypes";
import { UserCustomCategoryService } from "services/category/userCustomCategoryService";
import categoryService from "common/services/categoryService";

export const getCategoryShareParams = (
    navParams: any,
    timeGranulairty: DataGranularity,
    services: ICategoryShareServices,
    isMonthToDate?: boolean,
) => {
    const { apiHelper } = services;
    const { category } = navParams;

    const isCustomCategory = UserCustomCategoryService.isCustomCategory(category);

    const categoryObject = categoryService.categoryQueryParamToCategoryObject(category);
    const apiParams = {
        ...navParams,
        includeSubDomains: true,
        timeGranularity: timeGranulairty,
        categoryHash: isCustomCategory
            ? UserCustomCategoryService.getCategoryHash(
                  UserCustomCategoryService.removeCategoryIdPrefix(category),
                  "categoryId",
              )
            : "",
        keys: categoryObject?.forApi,
        category: categoryObject?.forDisplayApi,
        latest: isMonthToDate ? "l" : undefined,
    };

    return apiHelper.transformParamsForAPI(apiParams);
};
