/* eslint-disable @typescript-eslint/camelcase */
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { FiltersEnum } from "components/filters-bar/utils";
import { AssetsService } from "services/AssetsService";
import { AppsResourceService } from "services/AppsResourceService";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";
import { KeywordsResource } from "../../../../../scripts/common/resources/keywordsResource";

const industryOverviewQueryParams = "webSource&selectedMetric&pageUrl";

const webmarketAnalysisConfig = {
    marketresearch_webmarketanalysis_home: {
        parent: "marketresearch",
        url: "/marketresearch/webmarketanalysis/home",
        template: `<sw-react component="IndustryAnalysisStartPageContainer"
                             props="{
                             pageState: 'marketresearch_webmarketanalysis_overview',
                             title: 'webmarketanalysis.homepage.mainTitle',
                             subtitle: 'webmarketanalysis.homepage.subTitle',
                             }"
                             >
                   </sw-react>`,
        configId: "WebMarketAnalysisOverviewHome",
        pageId: {
            section: "marketresearch",
            subSection: "marketresearch",
            subsubSection: "analyzewebsites",
        },
        trackingId: {
            section: "Market Research",
            subSection: "Industry Research",
            subSubSection: "home",
        },
        pageTitle: "marketintelligence.marketresearch.webmarketanalysis.homepage.title",
    },
    marketresearch_webmarketanalysis: {
        abstract: true,
        parent: "marketresearch",
        url: "/marketresearch/webmarketanalysis",
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
        homeState: "marketresearch_webmarketanalysis_home",
    },
    marketresearch_webmarketanalysis_overview: {
        params: {
            comparedDuration: "",
            category: { type: "string", raw: true },
        },
        parent: "marketresearch_webmarketanalysis",
        url: `/overview/:category/:country/:duration?${industryOverviewQueryParams}`,
        templateUrl: "/app/pages/industry-analysis/overview/industry-analysis-overview.html",
        configId: "IndustryAnalysisOverview",
        controller: "IAOverviewCtrl as pageCtrl",
        fallbackStates: {
            legacy: "industryAnalysis-overview",
        },
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
        homeState: "marketresearch_webmarketanalysis_home",
    },
    marketresearch_webmarketanalysis_mapping: {
        parent: "marketresearch_webmarketanalysis",
        url: "/mapping/:category/:country/:duration?webSource",
        templateUrl: "/app/pages/industry-analysis/top-sites/top-sites.html",
        configId: "IATopWebsitesExtended",
        fallbackStates: {
            legacy: "industryAnalysis-topSites",
        },
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
        homeState: "marketresearch_webmarketanalysis_home",
        hideCalendar: true,
        params: {
            category: { type: "string", raw: true },
        },
    },
    marketresearch_webmarketanalysis_trends: {
        parent: "marketresearch_webmarketanalysis",
        url: "/trends/:category/:country/:duration?webSource?mtd",
        templateUrl:
            "/app/pages/industry-analysis/category-share/industry-analysis-category-share.html",
        configId: "CategoryShare",
        controller: "categoryShareCtrl as pageCtrl",
        pageId: {
            section: "industryAnalysis",
            subSection: "categoryShare",
        },
        fallbackStates: {
            legacy: "industryAnalysis-categoryShare",
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
        homeState: "marketresearch_webmarketanalysis_home",
        params: {
            category: { type: "string", raw: true },
        },
    },
    marketresearch_webmarketanalysis_trafficChannels: {
        parent: "marketresearch_webmarketanalysis",
        url: "/trafficChannels/:category/:country/:duration?webSource",
        templateUrl:
            "/app/pages/industry-analysis/traffic-sources/industry-analysis-traffic-sources.html",
        configId: "IndustryAnalysisGeneral",
        controller: "industryAnalysisTrafficSourcesCtrl as pageCtrl",
        fallbackStates: {
            legacy: "industryAnalysis-trafficSources",
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
        homeState: "marketresearch_webmarketanalysis_home",
        params: {
            category: { type: "string", raw: true },
        },
    },
    marketresearch_webmarketanalysis_demographics: {
        parent: "marketresearch_webmarketanalysis",
        configId: "IndustryAnalysisDemographics",
        url: "/demographics/:category/:country/:duration?webSource",
        template: '<sw-react component="IndustryAnalysisDemographicsContainer"></sw-react>',
        fallbackStates: {
            legacy: "industryAnalysis-demographics",
        },
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
        homeState: "marketresearch_webmarketanalysis_home",
        params: {
            category: { type: "string", raw: true },
        },
    },
    marketresearch_webmarketanalysis_geography: {
        parent: "marketresearch_webmarketanalysis",
        url: "/geography/:category/:duration",
        templateUrl: "/app/pages/industry-analysis/geography/geography.html",
        configId: "IndustryAnalysisGeneral",
        fallbackStates: {
            legacy: "industryAnalysis-geo",
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
        homeState: "marketresearch_webmarketanalysis_home",
        params: {
            category: { type: "string", raw: true },
        },
    },
    marketresearch_webmarketanalysis_loyalty: {
        parent: "marketresearch_webmarketanalysis",
        url: "/audience-loyalty/:category/:country/:duration?webSource",
        template: '<sw-react component="IndustryAnalysisLoyaltyContainer"></sw-react>',
        configId: "IndustryAnalysisAudienceLoyalty",
        fallbackStates: {
            legacy: "industryAnalysis-loyalty",
        },
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
        // hideCalendar: true,
        defaultQueryParams: {
            webSource: "Desktop",
        },
        data: {
            filtersConfig: {
                webSource: FiltersEnum.DISABLED,
            },
        },
        homeState: "marketresearch_webmarketanalysis_home",
        params: {
            category: { type: "string", raw: true },
        },
    },
    marketresearch_webmarketanalysis_searchtrends: {
        parent: "marketresearch_webmarketanalysis",
        url:
            "/searchtrends/:category/:country/:duration?tab&channel&includeBranded&includeNoneBranded&excludeBranded&orderBy&search&BooleanSearchTerms?webSource?IncludeTrendingKeywords?IncludeNewKeywords?IncludeQuestions",
        template: `<sw-react component="SearchTrendsTable"></sw-react>`,
        configId: "IndustryAnalysisTopKeywords",
        params: {
            includeNoneBranded: "true",
            includeBranded: "false",
            category: { type: "string", raw: true },
        },
        pageId: {
            section: "industryAnalysis",
            subSection: "audience",
            subSubSection: "searchTrends",
        },
        trackingId: {
            section: "industryAnalysis",
            subSection: "audience",
            subSubSection: "searchTrends",
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
        pageTitle: "industryAnalysis.searchTrends.page.title",
        pageSubtitle: "industryAnalysis.searchTrends.subtitle",
        defaultQueryParams: {
            webSource: "Desktop",
        },
        data: {
            filtersConfig: {
                webSource: FiltersEnum.DISABLED,
            },
        },
        homeState: "marketresearch_webmarketanalysis_home",
        fallbackStates: {
            legacy: "industryAnalysis.searchTrends",
        },
    },
    marketresearch_webmarketanalysis_rankings: {
        parent: "marketresearch_webmarketanalysis",
        url: "/rankings/:category/:country/:duration?tab?webSource",
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
            tab: "CategoryLeadersSearch",
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
        homeState: "marketresearch_webmarketanalysis_home",
        fallbackStates: {
            legacy: "industryAnalysis-categoryLeaders",
        },
        params: {
            category: { type: "string", raw: true },
        },
    },
};
// in order to make trailing space optional
webmarketAnalysisConfig["marketresearch_webmarketanalysis_overview_duplicate"] = {
    ...webmarketAnalysisConfig["marketresearch_webmarketanalysis_overview"],
    redirectTo: "marketresearch_webmarketanalysis_overview",
};
webmarketAnalysisConfig[
    "marketresearch_webmarketanalysis_overview"
].url = `/overview/:category/:country/:duration:comparedDuration?${industryOverviewQueryParams}`;

const appMarketAnalysisConfig = {
    marketresearch_appmarketanalysis_home: {
        parent: "marketresearch",
        url: "/marketresearch/appmarketanalysis/home",
        template: `<sw-react component="AppCategoriesStartPageContainer"
                                 props="{
                                        pageState: 'marketresearch_appmarketanalysis_top',
                                        title: 'marketresearch.appmarketanalysis.homepage.mainTitle',
                                        subtitle: 'marketresearch.appmarketanalysis.homepage.subTitle'
                                        }"
                                        ></sw-react>`,
        configId: "AppMarketAnalysisHomepage",
        pageId: {
            section: "marketresearch",
            subSection: "marketresearch",
            subsubSection: "analyzeapps",
        },
        trackingId: {
            section: "Market Research",
            subSection: "Industry Research",
            subsubSection: "App Market Analysis",
        },
        pageTitle: "marketintelligence.marketresearch.appmarketanalysis.homepage.title",
    },
    marketresearch_appmarketanalysis: {
        abstract: true,
        parent: "marketresearch",
        configId: "TopApps",
        data: {
            menuId: "appcategory",
            menuKbItems: "top-apps",
            disableRecording: true,
            showConnectedAccountsGlobalHook: true,
        },
        url: "/marketresearch/appmarketanalysis",
        templateUrl: "/partials/topapps/navigation.html",
        controller: "topAppsNavigationCtrl",
        resolve: {
            storeOptions: [
                function () {
                    return AppsResourceService.storeOptions().then(function (response) {
                        return response;
                    });
                },
            ],
            keywordsCategories: [
                function () {
                    return KeywordsResource.getCategories().then(function (response) {
                        return response;
                    });
                },
            ],
        },
    },
    marketresearch_appmarketanalysis_top: {
        parent: "marketresearch_appmarketanalysis",
        url: "/top/:store/:country/:category/:device/:mode",
        templateUrl: "/app/pages/app-category/leaderboard/app-category-leaderboard.html",
        controller: "appCategoryLeaderBoardCtrl as ctrl",
        fallbackStates: {
            legacy: "appcategory-leaderboard",
        },
        params: {
            category: { type: "string", raw: true },
        },
        configId(toState, toParams) {
            return "TopApps" + (toParams ? toParams.store : "");
        },
        pageTitle: "rankings.topapps.title",
        pageSubtitle: "topapps.lastupdated",
        pageId: {
            section: "topapps",
            subSection: "category",
            subSubSection: "categoryanalysis",
        },
        trackingId: {
            section: "appCategoryAnalysis",
            subSection: "rankings",
            subSubSection: "topApps",
        },
        clearSearch: true,
        homeState: "marketresearch_appmarketanalysis_home",
    },
    marketresearch_appmarketanalysis_trending: {
        parent: "marketresearch_appmarketanalysis",
        url: "/trending/:store/:country/:category/:device/:mode?tab",
        templateUrl: "/partials/topapps/trends.html",
        controller: "trendsCtrl as ctrl",
        fallbackStates: {
            legacy: "appcategory-trends",
        },
        configId(toState, toParams) {
            return "TopAppsTrends" + (toParams ? toParams.store : "");
        },
        pageTitle: "rankings.trendingapps.title",
        pageSubtitle: "topapps.lastupdated",
        icon: "sw-icon-trends",
        pageId: {
            section: "topapps",
            subSection: "category",
            subSubSection: "trends",
        },
        trackingId: {
            section: "appCategoryAnalysis",
            subSection: "rankings",
            subSubSection: "trendingApps",
        },
        defaultQueryParams: {
            tab: "usageRank",
        },
        homeState: "marketresearch_appmarketanalysis_home",
        params: {
            category: { type: "string", raw: true },
        },
    },
};

export const industryResearchConfig = {
    ...webmarketAnalysisConfig,
    ...appMarketAnalysisConfig,
    marketresearch_keywordmarketanalysis_home: {
        parent: "marketresearch",
        url: "/marketresearch/keywordmarketanalysis/home",
        template: `<sw-react
                       component="KeywordAnalysisStartPageContainer"
                        props="{
                        pageState: 'marketresearch_keywordmarketanalysis_total',
                        title: 'marketintelligence.marketresearch.keywordmarket.home.title',
                        subtitle: 'marketintelligence.marketresearch.keywordmarket.home.subtitle'
                          }"></sw-react>`,
        configId: "TopicMarketAnalysisHome",
        pageId: {
            section: "marketresearch",
            subSection: "marketresearch",
            subsubSection: "analyzekeywords",
        },
        trackingId: {
            section: "Industry Research",
            subSection: "Search Interest Analysis",
            subSubSection: "home",
        },
        pageTitle: "marketintelligence.marketresearch.webmarketanalysis.homepage.title",
    },
    marketresearch_keywordmarketanalysis: {
        abstract: true,
        parent: "marketresearch",
        url: "/marketresearch/keywordmarketanalysis",
        templateUrl: "/app/pages/keyword-analysis/templates/keywords-layout.html",
        configId: "KeywordAnalysis",
        controller: "layoutCtrl as ctrl",
        data: {
            menuKbItems: false,
            disableRecording: true,
        },
        pageId: {
            section: "keywordAnalysis",
        },
        trackingId: {
            section: "keywordAnalysis",
        },
    },
    marketresearch_keywordmarketanalysis_search: {
        abstract: true,
        parent: "marketresearch_keywordmarketanalysis",
        url: "/search/:country/:duration/:keyword?tab?mtd",
        templateUrl: "/app/pages/keyword-analysis/search.html",
        configId: "KeywordAnalysis",
        controller: "keywordSearchCtrl as ctrl",
        params: {
            mtd: "true",
        },
        pageId: {
            section: "keywordAnalysis",
        },
        trackingId: {
            section: "keywordAnalysis",
        },
        pageTitle: "keywordAnalysis.page.title",
        reloadOnSearch: false,
    },
    marketresearch_keywordmarketanalysis_total: {
        parent: "marketresearch_keywordmarketanalysis_search",
        url: "/total?webSource",
        template: `<sw-react
                       component="KeywordAnalysisTotalPageDri"
                        ></sw-react>`,
        fallbackStates: {
            digitalmarketing: "keywordAnalysis_total",
            legacy: "keywordAnalysis-total",
        },
        configId: "KeywordAnalysisTotal",
        pageId: {
            section: "keywordAnalysis",
            subSection: "total",
        },
        trackingId: {
            section: "Industry Research",
            subSection: "Search Interest Analysis",
            subSubSection: "total",
        },
        defaultQueryParams: {
            webSource: "Total",
        },
        data: {
            filtersConfig: {
                webSource: FiltersEnum.DISABLED,
            },
        },
        reloadOnSearch: false,
        pageTitle: "keywordAnalysisTotal.page.title",
        pageSubtitle: "KeywordAnalysis.total.title.tooltip",
        icon: "sw-icon-nav-total",
        homeState: "marketresearch_keywordmarketanalysis_home",
    },
    marketresearch_keywordmarketanalysis_geo: {
        parent: "marketresearch_keywordmarketanalysis_search",
        url: "/geo?keywordSource",
        template: `<sw-react component="KeywordsGeoPageDri" data-automation="keywords-geo-page-dri" ></sw-react>`,
        configId: "KeywordsByGeo",
        fallbackStates: {
            digitalmarketing: "keywordAnalysis_geography",
            legacy: "keywordAnalysis-geo",
        },
        pageId: {
            section: "keywordAnalysis",
            subSection: "geo",
        },
        trackingId: {
            section: "Industry Research",
            subSection: "Search Interest Analysis",
            subSubSection: "geo",
        },
        reloadOnSearch: false,
        pageTitle: "keywordAnalysis.geo.page.title",
        hideCalendar: true,
        get overrideDatepickerPreset() {
            const swNavigator = Injector.get<SwNavigator>("swNavigator");
            if (keywordsGroupsService.isKeywordGroup(swNavigator.getParams()?.keyword)) {
                return ["1m", "3m", "6m", "12m", "18m", "24m"];
            }
            return ["3m", "6m", "12m", "18m", "24m"];
        },
        orangeBadgeTitle: "sidenav.new",
        icon: "sw-icon-nav-paid",
        defaultQueryParams: {
            webSource: "Desktop",
            country: 999,
            keywordSource: "both",
        },
        params: {
            webSource: "Desktop",
            country: 999,
        },
        data: {
            filtersConfig: {
                country: FiltersEnum.DISABLED,
                webSource: FiltersEnum.DISABLED,
            },
        },
        homeState: "marketresearch_keywordmarketanalysis_home",
    },
    marketresearch_keywordmarketanalysis_sneakpeekQuery: {
        parent: "marketresearch_keywordmarketanalysis_search",
        url: "/sneakpeek/query?editedId",
        templateUrl: "/app/pages/sneakpeek/sneakpeek-query.html",
        configId: "KeywordSneakpeek",
        pageId: {
            section: "keywordAnalysis",
            subSection: "sneakpeek",
            subSubSection: "query",
        },
        trackingId: {
            section: "keywordAnalysis",
            subSection: "sneakpeek",
            subSubSection: "query",
        },
        icon: "sw-icon-overview",
        pageTitle: "Create Data Prototype",
        hidePageTitle: true,
        reloadOnSearch: false,
        isUSStatesSupported: true,
    },
    marketresearch_keywordmarketanalysis_sneakpeekResults: {
        parent: "marketresearch_keywordmarketanalysis_search",
        url: "/sneakpeek/results?queryId",
        templateUrl: "/app/pages/sneakpeek/sneakpeek-results.html",
        configId: "KeywordSneakpeek",
        pageId: {
            section: "keywordAnalysis",
            subSection: "sneakpeek",
            subSubSection: "results",
        },
        trackingId: {
            section: "keywordAnalysis",
            subSection: "sneakpeek",
            subSubSection: "results",
        },
        icon: "sw-icon-overview",
        pageTitle: "Data Prototype Results",
        hidePageTitle: true,
        reloadOnSearch: false,
        isUSStatesSupported: true,
    },
};
