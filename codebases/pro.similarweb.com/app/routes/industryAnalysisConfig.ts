import { FiltersEnum } from "components/filters-bar/utils";
import { SecondaryBarType } from "reducers/_reducers/SecondaryBarReducer";
import { AssetsService } from "services/AssetsService";

const config = {
    "industryAnalysis-root": {
        abstract: true,
        parent: "research",
        configId: "industryAnalysis",
        templateUrl: "/app/pages/market-research/root.html",
        secondaryBarType: "WebsiteResearch" as SecondaryBarType,
        packageName: "legacy",
    },
    "industryAnalysis_root-home": {
        parent: "industryAnalysis-root",
        url: "^/industry/home",
        template: `<sw-react component="IndustryAnalysisStartPageContainer" 
                                props="{
                                        title: 'industryanalysis.homepage.mainTitle',
                                        subtitle: 'industryanalysis.homepage.subTitle',
                                        subtitlePosition: 'centered'}"
                                        >
                   </sw-react>`,
        configId: "IndustryAnalysisOverview",
        pageId: {
            section: "industry",
            subSection: "home",
        },
        trackingId: {
            section: "industryAnalysis",
            subSection: "home",
        },
        clearSearch: true,
        pageTitle: "websites.home.pageTitle",
        skipDurationCheck: true,
        skipCountryCheck: true,
        params: {
            country: 999,
        },
    },
    industryAnalysis: {
        abstract: true,
        parent: "research",
        url: "/industry",
        templateUrl: "/app/pages/common-layout/index.html",
        configId: "IndustryAnalysis",
        controller: "industryAnalysisModuleCtrl as ctrl",
        data: {
            menuKbItems: false,
            disableRecording: true,
            filtersConfig: {
                duration: FiltersEnum.ENABLED,
                country: FiltersEnum.ENABLED,
                webSource: FiltersEnum.ENABLED,
            },
        },
        pageId: {
            section: "industryAnalysis",
        },
        trackingId: {
            section: "industryAnalysis",
        },
        secondaryBarType: "WebsiteResearch" as SecondaryBarType,
        packageName: "legacy",
    },
    "industryAnalysis-overview": {
        params: {
            comparedDuration: "",
            category: { type: "string", raw: true },
        },
        parent: "industryAnalysis",
        url: "/overview/:category/:country/:duration?webSource&selectedMetric",
        templateUrl: "/app/pages/industry-analysis/overview/industry-analysis-overview.html",
        configId: "IndustryAnalysisOverview",
        controller: "IAOverviewCtrl as pageCtrl",
        periodOverPeriodEnabled: true,
        pageId: {
            section: "industryAnalysis",
            subSection: "overview",
        },
        trackingId: {
            section: "industryAnalysis",
            subSection: "overview",
            subSubSection: "categoryPerformance",
        },
        icon: "sw-icon-overview",
        filters: {
            duration: true,
            country: true,
            category: true,
        },
        reloadOnSearch: false,
        notPermittedConfig: {
            image: AssetsService.assetUrl("images/category-analysis-hook.jpg"),
            description: "ia.overview.desc",
        },
        pageTitle: "industryAnalysis.performance.page.title",
        hideSubtitle: true,
        defaultQueryParams: {
            webSource: "Total",
        },
        legacy: {
            marketresearch: "marketresearch_webmarketanalysis_overview",
        },
        fallbackStates: {
            marketresearch: "marketresearch_webmarketanalysis_overview",
        },
        homeState: "industryAnalysis_root-home",
    },
    "industryAnalysis-topSites": {
        parent: "industryAnalysis",
        url: "/topsites/:category/:country/:duration?webSource",
        templateUrl: "/app/pages/industry-analysis/top-sites/top-sites.html",
        configId: "IATopWebsitesExtended",
        pageId: {
            section: "industryAnalysis",
            subSection: "topSites",
        },
        trackingId: {
            section: "industryAnalysis",
            subSection: "rankings",
            subSubSection: "topWebsites",
        },
        filters: {
            duration: false, // 'false' for visible and disabled filter
            country: true,
            category: true,
            unsupportedCountryTooltip: "topsites.unsupportedCountry.tooltip",
        },
        reloadOnSearch: false,
        clearSearch: true,
        pageTitle: "industryAnalysis.topwebsites.page.title",
        pageSubtitle: "industryAnalysis.topSites.subtitle",
        defaultQueryParams: {
            webSource: "Total",
        },
        legacy: {
            marketresearch: "marketresearch_webmarketanalysis_mapping",
        },
        fallbackStates: {
            marketresearch: "marketresearch_webmarketanalysis_mapping",
        },
        homeState: "industryAnalysis_root-home",
        hideCalendar: true,
        params: {
            category: { type: "string", raw: true },
        },
    },
    "industryAnalysis-categoryLeaders": {
        parent: "industryAnalysis",
        url: "/categoryLeaders/:category/:country/:duration?tab?webSource",
        templateUrl: "/app/pages/industry-analysis/category-leaders/category-leaders.html",
        controller: "CategoryLeaderCtrl as pageCtrl",
        configId: "CategoryLeaders",
        pageId: {
            section: "industryAnalysis",
            subSection: "categoryLeaders",
        },
        trackingId: {
            section: "industryAnalysis",
            subSection: "rankings",
            subSubSection: (params) => params.tab,
        },
        icon: "sw-icon-leaders",
        defaultQueryParams: {
            tab: "CategoryLeadersReferrals",
        },
        filters: {
            duration: false, // 'false' for visible and disabled filter
            country: true, // 'true' for visible and enabled filter
            category: true,
        },
        filtersConfig: {
            webSource: FiltersEnum.DISABLED,
        },
        searchParams: ["tab"],
        reloadOnSearch: true,
        notPermittedConfig: {
            image: AssetsService.assetUrl("images/IACategoryLeaders.png"),
            description: "ia.categoryleaders.desc",
        },
        clearSearch: true,
        pageSubtitle: "industryAnalysis.categoryLeaders.subtitle",
        data: {
            trackPageViewOnSearchUpdate: false,
            filtersConfig: {
                duration: FiltersEnum.DISABLED,
                webSource: FiltersEnum.DISABLED,
            },
        },
        pageTitle: "industryCategoryLeaders.page.title",
        homeState: "industryAnalysis_root-home",
        params: {
            category: { type: "string", raw: true },
        },
    },
    "industryAnalysis-trafficSources": {
        parent: "industryAnalysis",
        url: "/trafficSources/:category/:country/:duration?webSource",
        templateUrl:
            "/app/pages/industry-analysis/traffic-sources/industry-analysis-traffic-sources.html",
        configId: "IndustryAnalysisGeneral",
        controller: "industryAnalysisTrafficSourcesCtrl as pageCtrl",
        legacy: {
            marketresearch: "marketresearch_webmarketanalysis_trafficChannels",
        },
        fallbackStates: {
            digitalmarketing: "findpublishers_byindustry",
            marketresearch: "marketresearch_webmarketanalysis_trafficChannels",
        },
        pageId: {
            section: "industryAnalysis",
            subSection: "traffic",
        },
        trackingId: {
            section: "industryAnalysis",
            subSection: "overview",
            subSubSection: "trafficChannels",
        },
        icon: "sw-icon-traffic-sources",
        filters: {
            duration: true,
            country: true,
            category: true,
        },
        notPermittedConfig: {
            image: AssetsService.assetUrl("images/IATrafficSources.png"),
            description: "ia.trafficsources.desc",
        },
        clearSearch: true,
        reloadOnSearch: false,
        pageTitle: "industryAnalysis.trafficchannels.page.title",
        pageSubtitle: "industryAnalysis.trafficSources.subtitle",
        defaultQueryParams: {
            webSource: "Desktop",
        },
        data: {
            filtersConfig: {
                webSource: FiltersEnum.DISABLED,
            },
        },
        homeState: "industryAnalysis_root-home",
        params: {
            category: { type: "string", raw: true },
        },
    },
    "industryAnalysis-geo": {
        parent: "industryAnalysis",
        url: "/geography/:category/:duration",
        templateUrl: "/app/pages/industry-analysis/geography/geography.html",
        configId: "IndustryAnalysisGeneral",
        legacy: {
            marketresearch: "marketresearch_webmarketanalysis_geography",
        },
        fallbackStates: {
            marketresearch: "marketresearch_webmarketanalysis_geography",
        },
        pageId: {
            section: "industryAnalysis",
            subSection: "geography",
        },
        trackingId: {
            section: "industryAnalysis",
            subSection: "audience",
            subSubSection: "geography",
        },
        filters: {
            duration: true,
            country: false,
            category: true,
        },
        clearSearch: true,
        reloadOnSearch: false,
        pageTitle: "industryAnalysis.geography.page.title",
        pageSubtitle: "industryAnalysis.geography.page.subtitle",
        data: {
            filtersConfig: {
                webSource: FiltersEnum.HIDDEN,
                country: FiltersEnum.HIDDEN,
            },
        },
        homeState: "industryAnalysis_root-home",
        params: {
            category: { type: "string", raw: true },
        },
    },
    "industryAnalysis-topKeywords": {
        parent: "industryAnalysis",
        url:
            "/topkeywords/:category/:country/:duration?webSource&tab&channel&includeBranded&includeNoneBranded&orderBy&search&BooleanSearchTerms?IncludeTrendingKeywords?IncludeNewKeywords?IncludeQuestions?cpcFromValue?cpcToValue?volumeFromValue?volumeToValue",
        templateUrl: "/app/pages/industry-analysis/top-keywords/top-keywords.html",
        configId: "IndustryAnalysisTopKeywords",
        pageId: {
            section: "industryAnalysis",
            subSection: "topKeywords",
        },
        trackingId: {
            section: "industryAnalysis",
            subSection: "search",
            subSubSection: "topKeywords",
        },
        icon: "sw-icon-top-keywords",
        filters: {
            duration: true,
            country: true,
            category: true,
        },
        notPermittedConfig: {
            image: AssetsService.assetUrl("images/IATopKeywords.png"),
            description: "ia.topkeywords.desc",
        },
        clearSearch: true,
        reloadOnSearch: false,
        pageTitle: "industryAnalysis.topkeywords.page.title",
        pageSubtitle: "industryAnalysis.topKeywords.subtitle",
        defaultQueryParams: {
            webSource: "Desktop",
        },
        data: {
            filtersConfig: {
                webSource: FiltersEnum.DISABLED,
            },
        },
        params: {
            isWWW: "*",
            category: { type: "string", raw: true },
        },
        homeState: "industryAnalysis_root-home",
        legacy: {
            digitalmarketing: "findkeywords_byindustry",
        },
        fallbackStates: {
            digitalmarketing: "findkeywords_byindustry",
        },
    },
    "industryAnalysis-KeywordsSeasonality": {
        parent: "industryAnalysis",
        url:
            "/keywords-seasonality/:category/:country/:duration?search?months?includeBranded?includeNoneBranded&BooleanSearchTerms?webSource?orderBy",
        template: '<sw-react component="KeywordsSeasonalityPage">',
        configId: "IndustryAnalysisKeywordsSeasonality",
        params: {
            includeBranded: "true",
            includeNoneBranded: "true",
            duration: "12m",
            category: { type: "string", raw: true },
        },
        pageId: {
            section: "industryAnalysis",
            subSection: "keywordsSeasonality",
        },
        trackingId: {
            section: "industryAnalysis",
            subSection: "search",
            subSubSection: "keywordsSeasonality",
        },
        icon: "sw-icon-top-keywords",
        filters: {
            duration: true,
            country: true,
            category: true,
        },
        notPermittedConfig: {
            image: AssetsService.assetUrl("images/IAKeywordsSeasonality.png"),
            description: "ia.keywordsseasonality.desc",
        },
        clearSearch: true,
        reloadOnSearch: false,
        pageTitle: "industryAnalysis.keywordsSeasonality.page.title",
        pageSubtitle: "industryAnalysis.keywordsSeasonality.subtitle",
        defaultQueryParams: {
            webSource: "Desktop",
        },
        data: {
            filtersConfig: {
                webSource: FiltersEnum.DISABLED,
                duration: FiltersEnum.DISABLED,
            },
        },
    },
    "industryAnalysis-categoryShare": {
        parent: "industryAnalysis",
        url: "/categoryshare/:category/:country/:duration?webSource?mtd",
        templateUrl:
            "/app/pages/industry-analysis/category-share/industry-analysis-category-share.html",
        configId: "CategoryShare",
        controller: "categoryShareCtrl as pageCtrl",
        pageId: {
            section: "industryAnalysis",
            subSection: "categoryShare",
        },
        trackingId: {
            section: "industryAnalysis",
            subSection: "overview",
            subSubSection: "categoryShare",
        },
        icon: "sw-icon-widget-trafficshare",
        filters: {
            duration: true,
            country: true,
            category: true,
            webSource: true,
        },
        notPermittedConfig: {
            image: AssetsService.assetUrl("images/IACategoryShare.png"),
            description: "ia.categoryshare.desc",
        },
        defaultQueryParams: {
            webSource: "Total",
            mtd: false,
        },
        clearSearch: true,
        reloadOnSearch: false,
        pageTitle: "industryAnalysis.categoryShare.title",
        pageSubtitle: "industryAnalysis.categoryShare.subtitle",
        homeState: "industryAnalysis_root-home",
        legacy: {
            marketresearch: "marketresearch_webmarketanalysis_trends",
        },
        fallbackStates: {
            marketresearch: "marketresearch_webmarketanalysis_trends",
        },
        params: {
            category: { type: "string", raw: true },
        },
    },
    "industryAnalysis-outgoingLinks": {
        parent: "industryAnalysis",
        configId: "IndustryAnalysisOutgoingLinks",
        url: "/outgoinglinks/:category/:country/:duration?webSource?outgoing_filters?orderby?page",
        template: '<sw-react component="IndustryAnalysisOutgoingLinksContainer"></sw-react>',
        pageId: {
            section: "industryAnalysis",
            subSection: "overview",
            subSubSection: "outgoinglinks",
        },
        trackingId: {
            section: "industryAnalysis",
            subSection: "overview",
            subSubSection: "outgoinglinks",
        },
        notPermittedConfig: {
            image: AssetsService.assetUrl("images/IAOutgoinglinks.png"),
            description: "ia.outgoinglinks.desc",
        },
        filters: {
            duration: true,
            country: true,
            category: true,
            webSource: true,
        },
        defaultQueryParams: {
            webSource: "Total",
            orderby: "Share%20desc",
            page: 1,
        },
        controller: "OutgoingLinksCtrl as pageCtrl",
        deviceToggleHookId: "outgoinglinks",
        reloadOnSearch: false,
        pageTitle: "industryAnalysis.overview.outgoingLinks.title",
        pageSubtitle: "industryAnalysis.overview.outgoingLinks.subtitle",
        data: {
            filtersConfig: {
                webSource: FiltersEnum.HIDDEN,
            },
        },
        homeState: "industryAnalysis_root-home",
        params: {
            category: { type: "string", raw: true },
        },
    },
    "industryAnalysis-loyalty": {
        parent: "industryAnalysis",
        url: "/audience-loyalty/:category/:country/:duration?webSource",
        template: '<sw-react component="IndustryAnalysisLoyaltyContainer"></sw-react>',
        configId: "IndustryAnalysisAudienceLoyalty",
        pageId: {
            section: "industryAnalysis",
            subSection: "audience",
            subSubSection: "loyalty",
        },
        trackingId: {
            section: "industryAnalysis",
            subSection: "audience",
            subSubSection: "loyalty",
        },
        icon: "sw-icon-audience",
        pageTitle: "industryAnalysis.loyalty.title",
        pageSubtitle: "industryAnalysis.loyalty.subtitle",
        pinkBadgeTitle: "sidenav.beta",
        isBeta: true,
        isVirtualSupported: false,
        isUSStatesSupported: false,
        reloadOnSearch: false,
        overrideDatepickerPreset: ["3m", "6m", "12m", "18m", "24m"],
        minDurationRange: 3,
        defaultQueryParams: {
            webSource: "Desktop",
        },
        data: {
            filtersConfig: {
                webSource: FiltersEnum.DISABLED,
            },
        },
        homeState: "industryAnalysis_root-home",
        legacy: {
            marketresearch: "marketresearch_webmarketanalysis_loyalty",
        },
        fallbackStates: {
            marketresearch: "marketresearch_webmarketanalysis_loyalty",
        },
        params: {
            category: { type: "string", raw: true },
        },
    },
    "industryAnalysis-demographics": {
        parent: "industryAnalysis",
        configId: "IndustryAnalysisDemographics",
        url: "/demographics/:category/:country/:duration?webSource",
        template: '<sw-react component="IndustryAnalysisDemographicsContainer"></sw-react>',
        pageId: {
            section: "industryAnalysis",
            subSection: "overview",
            subSubSection: "demographics",
        },
        trackingId: {
            section: "industryAnalysis",
            subSection: "audience",
            subSubSection: "demographics",
        },
        filters: {
            duration: true,
            country: true,
            category: true,
            webSource: true,
        },
        defaultQueryParams: {
            webSource: "Total",
        },
        reloadOnSearch: false,
        pageTitle: "industryAnalysis.demographics.page.title",
        homeState: "industryAnalysis_root-home",
        legacy: {
            marketresearch: "marketresearch_webmarketanalysis_demographics",
        },
        fallbackStates: {
            marketresearch: "marketresearch_webmarketanalysis_demographics",
        },
        params: {
            category: { type: "string", raw: true },
        },
    },
};

// in order to make trailing space optional
config["industryAnalysis-overviewDuplicate"] = {
    ...config["industryAnalysis-overview"],
    redirectTo: "industryAnalysis-overview",
};
config["industryAnalysis-overview"].url =
    "/overview/:category/:country/:duration:comparedDuration?webSource&selectedMetric";

// @ts-ignore
export const industryAnalysisConfig = config;

export const ignoreIndustryAnalysisParams = {
    channel: null,
    excludeBranded: null,
    search: null,
    BooleanSearchTerms: null,
    IncludeTrendingKeywords: null,
    IncludeNewKeywords: null,
    IncludeQuestions: null,
};
