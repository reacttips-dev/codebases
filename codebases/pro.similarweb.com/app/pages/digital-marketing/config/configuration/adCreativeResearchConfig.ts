/* eslint-disable @typescript-eslint/camelcase */
import { FiltersEnum } from "components/filters-bar/utils";

const trafficOverviewSearchParams = {
    Keywords_filters: null,
    groupedKeywords_filters: null,
    groupedKeywords_orderby: null,
    Ads_filters: null,
    IncludeOrganic: null,
    IncludePaid: null,
    IncludeBranded: null,
    IncludeNoneBranded: null,
    IncludeNewKeywords: null,
    IncludeTrendingKeywords: null,
    IncludeQuestions: null,
    limits: null,
    BooleanSearchTerms: null,
    search: null,
    selectedDomain: null,
    orderBy: null,
};

function siteInfo() {
    return function (sitesResource, $stateParams, chosenSites) {
        return sitesResource
            .getSiteInfo({
                keys: $stateParams.key,
                mainDomainOnly: !!$stateParams.isWWW,
            })
            .$promise.then(function (headerData) {
                chosenSites.updateMainSite(headerData);
                chosenSites.updateInfo(headerData);
                return chosenSites.sitelistForLegend();
            });
    };
}

const findSearchTextAdsConfig = {
    findSearchTextAds_home: {
        parent: "digitalmarketing",
        url: "/findsearchtextads/home",
        template: `<sw-react component="FindTextAdsPageContainer"></sw-react>`,
        configId: "AdCreativeFindTextAdsHome",
        pageId: {
            section: "affiliateResearch",
            subSection: "home",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Ad Creative Research",
            subSubSection: "Find_Search_Ads/Home",
        },
        pageTitle: "digitalmarketing.adcreativeresearch.find_search_ads.homepage.title",
        skipDurationCheck: true,
        skipCountryCheck: true,
    },
    findSearchTextAds_bycompetitor_root: {
        abstract: true,
        parent: "digitalmarketing_root",
        url: "/findsearchtextads",
        templateUrl: "/app/pages/common-layout/index.html",
        controller: "websiteAnalysisModuleCtrl as ctrl",
        configId: "WebAnalysis",
        data: {
            menuId: "websites",
            filtersConfig: {
                duration: FiltersEnum.ENABLED,
                country: FiltersEnum.ENABLED,
                webSource: FiltersEnum.ENABLED,
            },
        },
    },
    findSearchTextAds_bycompetitor: {
        parent: "findSearchTextAds_bycompetitor_root",
        url: `/bycompetitor/:key/:isWWW/:country/:duration?webSource?${Object.keys(
            trafficOverviewSearchParams,
        ).join(`?`)}`,
        template: `<sw-react component="PlaResearchTableWebsiteContext" props="{type: 'text'}" class="bordered-panel"></sw-react>`,
        fallbackStates: {
            legacy: "websites-trafficSearch",
        },
        resolve: {
            legendItems: siteInfo(),
        },
        pageId: {
            section: "website",
            subSection: "traffic",
            subSubSection: "search",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Ad Creative Research",
            subSubSection: "Find_Search_Ads/Competitor",
        },
        icon: "sw-icon-search",
        hidePageTitle: true,
        pageTitle: "keywordAnalysis.ads.page.title",
        pageSubtitle: "keywordAnalysis.ads.page.title.info",
        searchParams: ["selectedTab", "webSource"],
        isUSStatesSupported: true,
        reloadOnSearch: true,
        data: {
            trackPageViewOnSearchUpdate: false,
        },
        childStates: ({ selectedTab, webSource }) => {
            if (selectedTab === "keywords") {
                return webSource === "mobileweb"
                    ? "TrafficSourceSearchKeywordMobileWeb"
                    : "TrafficSourceSearchKeyword";
            } else {
                return webSource === "mobileweb" ? "MobileWebSearch" : "WebAnalysis";
            }
        },
        homeState: "findSearchTextAds_home",
    },
    findSearchTextAds_root: {
        abstract: true,
        parent: "digitalmarketing",
        url: "/findsearchtextads",
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
    findSearchTextAds_keywordAnalysis_root: {
        abstract: true,
        parent: "findSearchTextAds_root",
        url: "/bykeyword/:country/:duration/:keyword?tab",
        templateUrl: "/app/pages/keyword-analysis/search.html",
        configId: "KeywordAnalysis",
        controller: "keywordSearchCtrl as ctrl",
        pageId: {
            section: "keywordAnalysis",
        },
        trackingId: {
            section: "keywordAnalysis",
        },
        pageTitle: "keywordAnalysis.page.title",
        reloadOnSearch: false,
    },
    findSearchTextAds_bykeyword: {
        params: {
            duration: "3m",
        },
        parent: "findSearchTextAds_keywordAnalysis_root",
        url: "/ads?webSource&type&selectedCategory&orderBy&search",
        template: `<sw-react
                    component="PlaResearchTableKeywordsContext"
                    props="{type: 'text',
                    emptyStateTitle: 'keyword.analysis.ads.page.empty.title',
                    emptyStateSubTitle: 'keyword.analysis.ads.page.empty.subtitle'}">
                  </sw-react>`,
        fallbackStates: {
            legacy: "keywordAnalysis-ads",
        },
        configId: "KeywordsAds",
        pageId: {
            section: "keywordAnalysis",
            subSection: "keywordCompetitors",
            subSubSection: "ads",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Ad Creative Research",
            subSubSection: "Find_Search_Ads/Keyword",
        },
        reloadOnSearch: true,
        pageTitle: "keywordAnalysis.ads.page.title",
        pageSubtitle: "KeywordAnalysis.ads.title.tooltip",
        homeState: "findSearchTextAds_home",
    },
};

const findProductListingAds = {
    findProductListingAds_home: {
        parent: "digitalmarketing",
        url: "/findproductlistingads/home",
        template: `<sw-react component="FindProductListingAdsPageContainer"></sw-react>`,
        configId: "AdCreativeFindProductAdsHome",
        pageId: {
            section: "findProductListingAds",
            subSection: "home",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Ad Creative Research",
            subSubSection: "Find_Product_Ads/Home",
        },
        pageTitle: "digitalmarketing.adcreativeresearch.find_product_ads.homepage.title",
        skipDurationCheck: true,
        skipCountryCheck: true,
    },
    findProductListingAds_bycompetitor_root: {
        abstract: true,
        parent: "digitalmarketing_root",
        url: "/findproductlistingads",
        templateUrl: "/app/pages/common-layout/index.html",
        controller: "websiteAnalysisModuleCtrl as ctrl",
        configId: "WebAnalysis",
        data: {
            menuId: "websites",
            filtersConfig: {
                duration: FiltersEnum.ENABLED,
                country: FiltersEnum.ENABLED,
                webSource: FiltersEnum.ENABLED,
            },
        },
    },
    findProductListingAds_bycompetitor: {
        parent: "findProductListingAds_bycompetitor_root",
        url: `/bycompetitor/:key/:isWWW/:country/:duration?webSource?${Object.keys(
            trafficOverviewSearchParams,
        ).join(`?`)}`,
        template: `<sw-react component="PlaResearchTableWebsiteContext" props="{type: 'shopping'}" class="bordered-panel"></sw-react>`,
        fallbackStates: {
            legacy: "websites-trafficSearch",
        },
        resolve: {
            legendItems: siteInfo(),
        },
        pageId: {
            section: "website",
            subSection: "traffic",
            subSubSection: "search",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Ad Creative Research",
            subSubSection: "Find_Product_Ads/Competition",
        },
        icon: "sw-icon-search",
        hidePageTitle: true,
        pageTitle: "keywordAnalysis.plaResearch.page.title",
        pageSubtitle: "keywordAnalysis.plaResearch.page.title.info",
        searchParams: ["webSource"],
        isUSStatesSupported: true,
        reloadOnSearch: true,
        data: {
            trackPageViewOnSearchUpdate: false,
            filtersConfig: {
                webSource: FiltersEnum.DISABLED,
            },
        },
        childStates: ({ webSource }) => {
            return webSource === "mobileweb" ? "MobileWebSearch" : "WebAnalysis";
        },
        homeState: "findProductListingAds_home",
    },
    findProductListingAds_root: {
        abstract: true,
        parent: "digitalmarketing_root",
        url: "/findproductlistingads",
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
    findProductListingAds_keywordAnalysis_root: {
        abstract: true,
        parent: "findProductListingAds_root",
        url: "/bykeyword/:country/:duration/:keyword?tab",
        templateUrl: "/app/pages/keyword-analysis/search.html",
        configId: "KeywordAnalysis",
        controller: "keywordSearchCtrl as ctrl",
        pageId: {
            section: "keywordAnalysis",
        },
        trackingId: {
            section: "keywordAnalysis",
        },
        pageTitle: "keywordAnalysis.page.title",
        reloadOnSearch: false,
    },
    findProductListingAds_bykeyword: {
        params: {
            duration: "3m",
        },
        parent: "findProductListingAds_keywordAnalysis_root",
        url: "/plaResearch?webSource&type&selectedCategory&orderBy&search",
        template: `<sw-react
                    component="PlaResearchTableKeywordsContext"
                    props="{type: 'shopping',
                    emptyStateTitle: 'keyword.analysis.ads.page.empty.title',
                    emptyStateSubTitle: 'keyword.analysis.ads.page.empty.subtitle'}">
                  </sw-react>`,
        fallbackStates: {
            legacy: "keywordAnalysis-plaResearch",
        },
        configId: "KeywordsAds",
        pageId: {
            section: "keywordAnalysis",
            subSection: "keywordCompetitors",
            subSubSection: "ads",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Ad Creative Research",
            subSubSection: "Find_Product_Ads/Keyword",
        },
        reloadOnSearch: true,
        pageTitle: "keywordAnalysis.plaResearch.page.title",
        pageSubtitle: "KeywordAnalysis.ads.title.tooltip",
        homeState: "findProductListingAds_home",
    },
};

const findDisplayAds = {
    findDisplayAds_home: {
        parent: "digitalmarketing",
        url: "/finddisplayads/home",
        template: `<sw-react component="FindDisplayAdsPageContainer"></sw-react>`,
        configId: "AdCreativeFindDisplayAdsHome",
        pageId: {
            section: "findDisplayAds",
            subSection: "home",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Ad Creative Research",
            subSubSection: "Find_Display_Ads/Home",
        },
        pageTitle: "digitalmarketing.adcreativeresearch.find_display_ads.homepage.title",
        skipDurationCheck: true,
        skipCountryCheck: true,
    },
    findDisplayAds_bycompetitor_root: {
        abstract: true,
        parent: "digitalmarketing_root",
        url: "/finddisplayads",
        templateUrl: "/app/pages/common-layout/index.html",
        controller: "websiteAnalysisModuleCtrl as ctrl",
        configId: "WebAnalysis",
        data: {
            menuId: "websites",
            filtersConfig: {
                duration: FiltersEnum.ENABLED,
                country: FiltersEnum.ENABLED,
                webSource: FiltersEnum.ENABLED,
            },
        },
    },
    findDisplayAds_bycompetitor: {
        parent: "findDisplayAds_bycompetitor_root",
        url: "/display-creatives/:key/:isWWW/:country/:duration?webSource&sort&domain",
        template: `<sw-react component="CreativesContainer"></sw-react>`,
        fallbackStates: {
            legacy: "websites-trafficDisplay-creatives",
        },
        configId: "WebsiteAdsIntelDisplay",
        overrideDatepickerPreset: ["1m", "28d", "3m", "6m", "12m", "18m"],
        resolve: {
            siteInfo: siteInfo(),
        },
        pageId: {
            section: "website",
            subSection: "traffic",
            subSubSection: "display",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Ad Creative Research",
            subSubSection: "Find_Display_Ads/Competition",
        },
        icon: "sw-icon-display-ads",
        pageTitle: "analysis.display.creatives.title",
        pageSubtitle: "analysis.display.creatives.sub.title",
        searchParams: ["webSource"],
        isUSStatesSupported: true,
        hidePageTitle: true,
        data: {
            trackPageViewOnSearchUpdate: false,
        },
        homeState: "findDisplayAds_home",
    },
};

const findVideoAds = {
    findVideoAds_home: {
        parent: "digitalmarketing",
        url: "/findvideoads/home",
        template: `<sw-react component="FindVideoAdsPageContainer"></sw-react>`,
        configId: "AdCreativeFindVideoAdsHome",
        pageId: {
            section: "findVideoAds",
            subSection: "home",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Ad Creative Research",
            subSubSection: "Find_Video_Ads/Home",
        },
        pageTitle: "digitalmarketing.adcreativeresearch.find_video_ads.homepage.title",
        skipDurationCheck: true,
        skipCountryCheck: true,
    },
    findVideoAds_bycompetitor_root: {
        abstract: true,
        parent: "digitalmarketing_root",
        url: "/findvideoads",
        templateUrl: "/app/pages/common-layout/index.html",
        controller: "websiteAnalysisModuleCtrl as ctrl",
        configId: "WebAnalysis",
        data: {
            menuId: "websites",
            filtersConfig: {
                duration: FiltersEnum.ENABLED,
                country: FiltersEnum.ENABLED,
                webSource: FiltersEnum.ENABLED,
            },
        },
    },
    findVideoAds_bycompetitor: {
        parent: "findVideoAds_bycompetitor_root",
        url: "/display-videos/:key/:isWWW/:country/:duration?webSource&sort&domain",
        template: `<sw-react component="VideosContainer"></sw-react>`,
        fallbackStates: {
            legacy: "websites-trafficDisplay-videos",
        },
        configId: "WebsiteAdsIntelVideo",
        resolve: {
            siteInfo: siteInfo(),
        },
        pageId: {
            section: "website",
            subSection: "traffic",
            subSubSection: "display",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Ad Creative Research",
            subSubSection: "Find_Video_Ads/videos",
        },
        icon: "sw-icon-display-ads",
        pageTitle: "analysis.display.videos.title",
        pageSubtitle: "analysis.display.videos.title.info",
        searchParams: ["webSource"],
        reloadOnSearch: true,
        data: {
            trackPageViewOnSearchUpdate: false,
        },
        homeState: "findVideoAds_home",
    },
};

export const adCreativeResearchConfig = {
    ...findSearchTextAdsConfig,
    ...findProductListingAds,
    ...findDisplayAds,
    ...findVideoAds,
};
