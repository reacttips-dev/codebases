import {
    EFiltersTypes,
    keywordsIntersectionFiltersMD,
} from "UtilitiesAndConstants/Constants/keywordsIntersectionFiltersMD";
import { AdvancedFilterService, IAdvancedFilter } from "./AdvancedFilterService";
const keywordsAdvancedFilters: IAdvancedFilter[] = [
    {
        id: "opportunities",
        api: keywordsIntersectionFiltersMD[EFiltersTypes.KEYWORDS_OPPORTUNITIES].apiValue,
        name: "analysis.source.search.keywords.filters.advanced.predefined.opportunities",
        tooltip:
            "analysis.source.search.keywords.filters.advanced.predefined.opportunities.tooltip",
    },
    {
        id: "losing",
        api: keywordsIntersectionFiltersMD[EFiltersTypes.KEYWORD_LOSSES].apiValue,
        name: "analysis.source.search.keywords.filters.advanced.predefined.losing",
        tooltip: "analysis.source.search.keywords.filters.advanced.predefined.losing.tooltip",
    },
    {
        id: "exclusive",
        api: keywordsIntersectionFiltersMD[EFiltersTypes.KEYWORD_WINS].apiValue,
        name: "analysis.source.search.keywords.filters.advanced.predefined.exclusive",
        tooltip: "analysis.source.search.keywords.filters.advanced.predefined.exclusive.tooltip",
    },
    {
        id: "competitive",
        api: keywordsIntersectionFiltersMD[EFiltersTypes.COMPETITIVE_KEYWORDS].apiValue,
        name: "analysis.source.search.keywords.filters.advanced.predefined.competitive",
        tooltip: "analysis.source.search.keywords.filters.advanced.predefined.competitive.tooltip",
    },
];
export const KeywordAdvancedFilterService = new AdvancedFilterService(keywordsAdvancedFilters);
