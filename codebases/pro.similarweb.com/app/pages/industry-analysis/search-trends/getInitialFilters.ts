import categoryService from "common/services/categoryService";
import DurationService from "services/DurationService";
import { booleanSearchToObject } from "pages/website-analysis/traffic-sources/search/booleanSearchUtility";

export const getInitialFilters = (params, sort) => {
    const {
        category,
        webSource,
        duration,
        country,
        includeBranded: includeBrandedString,
        includeNoneBranded: includeNoneBrandedString,
        IncludeNewKeywords: IncludeNewKeywordsString,
        IncludeTrendingKeywords: IncludeTrendingKeywordsString,
        BooleanSearchTerms: booleanSearchTermsWithPrefix,
    } = params;
    const categoryObject = categoryService.categoryQueryParamToCategoryObject(category);
    const { from, to, isWindow } = DurationService.getDurationData(duration).forAPI;
    const includeBranded = includeBrandedString === true.toString();
    const includeNoneBranded = includeNoneBrandedString === true.toString();
    const IncludeNewKeywords = IncludeNewKeywordsString === true.toString();
    const IncludeTrendingKeywords = IncludeTrendingKeywordsString === true.toString();
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
        orderBy: `${sort.field} ${sort.sortDirection}`,
        ...((!includeBranded || !includeNoneBranded) && {
            IncludeBranded: includeBranded,
            IncludeNoneBranded: includeNoneBranded,
        }),
        IncludeNewKeywords,
        IncludeTrendingKeywords,
        ...(booleanSearchTermsWithPrefix &&
            booleanSearchToObject(decodeURIComponent(booleanSearchTermsWithPrefix))),
    };
};
