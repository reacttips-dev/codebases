import {
    EFiltersTypes,
    keywordsIntersectionFiltersMD,
} from "UtilitiesAndConstants/Constants/keywordsIntersectionFiltersMD";

export const filtersConfig = {
    marketCoreFilters: [
        {
            titleKey: "find.keywords.by.competitors.venn.filters.all.keywords.title",
            subtitleKey: "find.keywords.by.competitors.venn.filters.all.keywords.subtitle",
            id: EFiltersTypes.ALL_KEYWORDS,
        },
        {
            titleKey: "find.keywords.by.competitors.venn.filters.core.keywords.title",
            subtitleKey: "find.keywords.by.competitors.venn.filters.core.keywords.subtitle",
            id: EFiltersTypes.CORE_KEYWORDS,
        },
        {
            titleKey: "find.keywords.by.competitors.venn.filters.wins.keywords.title",
            subtitleKey: "find.keywords.by.competitors.venn.filters.wins.keywords.subtitle",
            id: EFiltersTypes.KEYWORD_WINS,
            apiValue: keywordsIntersectionFiltersMD[EFiltersTypes.KEYWORD_WINS].apiValue,
        },
    ],
    recommendationsFilters: [
        {
            titleKey: "find.keywords.by.competitors.venn.filters.opportunity.keywords.title",
            subtitleKey: "find.keywords.by.competitors.venn.filters.opportunity.keywords.subtitle",
            id: EFiltersTypes.KEYWORDS_OPPORTUNITIES,
            apiValue: keywordsIntersectionFiltersMD[EFiltersTypes.KEYWORDS_OPPORTUNITIES].apiValue,
        },
        {
            titleKey: "find.keywords.by.competitors.venn.filters.losses.keywords.title",
            subtitleKey: "find.keywords.by.competitors.venn.filters.losses.keywords.subtitle",
            id: EFiltersTypes.KEYWORD_LOSSES,
            apiValue: keywordsIntersectionFiltersMD[EFiltersTypes.KEYWORD_LOSSES].apiValue,
        },
    ],
    headers: {
        MARKET_CORE_KEY: "find.keywords.by.competitors.venn.filters.headers.market.core",
        RECOMMENDATIONS_KEY: "find.keywords.by.competitors.venn.filters.headers.recommendations",
    },
    tabsHeadersKeys: {
        ALL_TRAFFIC: "find.keywords.by.competitors.venn.filters.tabs.all.traffic",
        ORGANIC: "find.keywords.by.competitors.venn.filters.tabs.organic",
        PAID: "find.keywords.by.competitors.venn.filters.tabs.paid",
    },
    tooltipKeys: {
        SHARED_BY_ALL: "find.keywords.by.competitors.venn.filters.tooltip.shared.by.all",
        KEYWORDS: "find.keywords.by.competitors.venn.filters.tooltip.keywords",
        SEARCH_VISITS: "find.keywords.by.competitors.venn.filters.tooltip.search.visits",
        ORGANIC_TAB_DISABLED: "find.keywords.by.competitors.venn.filters.tabs.organic.disable",
        PAID_TAB_DISABLED: "find.keywords.by.competitors.venn.filters.tabs.paid.disable",
    },
    footerKeys: {
        [EFiltersTypes.ALL_KEYWORDS]:
            "find.keywords.by.competitors.venn.filters.all.keywords.footer",
        [EFiltersTypes.CORE_KEYWORDS]:
            "find.keywords.by.competitors.venn.filters.core.keywords.footer",
        [EFiltersTypes.KEYWORD_WINS]:
            "find.keywords.by.competitors.venn.filters.wins.keywords.footer",
        [EFiltersTypes.KEYWORDS_OPPORTUNITIES]:
            "find.keywords.by.competitors.venn.filters.opportunity.keywords.footer",
        [EFiltersTypes.KEYWORD_LOSSES]:
            "find.keywords.by.competitors.venn.filters.losses.keywords.footer",
        INTERSECTION_WITH_1_SITES:
            "find.keywords.by.competitors.venn.filters.one.sites.keywords.footer",
        INTERSECTION_WITH_2_SITES:
            "find.keywords.by.competitors.venn.filters.two.sites.keywords.footer",
        INTERSECTION_WITH_3_SITES:
            "find.keywords.by.competitors.venn.filters.three.sites.keywords.footer",
        INTERSECTION_WITH_4_SITES:
            "find.keywords.by.competitors.venn.filters.four.sites.keywords.footer",
        SUBTITLE: "find.keywords.by.competitors.venn.filters.keywords.footer.subtitle",
    },
};
