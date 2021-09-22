import { SecondaryBarType } from "reducers/_reducers/SecondaryBarReducer";
import { AppsResourceService } from "services/AppsResourceService";
import { KeywordsResource } from "../../scripts/common/resources/keywordsResource";

export const appCategoryConfig = {
    "appcategory-root": {
        abstract: true,
        parent: "research",
        configId: "TopApps",
        templateUrl: "/app/pages/market-research/root.html",
        secondaryBarType: "AppResearch" as SecondaryBarType,
        packageName: "legacy",
    },
    "appcategory-root-home": {
        parent: "appcategory-root",
        url: "^/appcategory/home",
        templateUrl: "/app/pages/app-category/home/home.html",
        isHomePage: true,
        data: {
            menuId: "",
        },
        pageId: {
            section: "topapps",
            subSection: "home",
        },
        trackingId: {
            section: "appCategoryAnalysis",
            subSection: "home",
            subsubSection: "",
        },
        clearSearch: true,
        pageTitle: "appCategory.home.pageTitle",
        params: {
            country: "", //this param set in app.ts
        },
    },
    appcategory: {
        abstract: true,
        parent: "research",
        configId: "TopApps",
        data: {
            menuId: "appcategory",
            menuKbItems: "top-apps",
            disableRecording: true,
            showConnectedAccountsGlobalHook: true,
        },
        url: "/appcategory",
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
        secondaryBarType: "AppResearch" as SecondaryBarType,
        packageName: "legacy",
    },
    "appcategory-leaderboard": {
        parent: "appcategory",
        url: "/leaderboard/:store/:country/:category/:device/:mode",
        templateUrl: "/app/pages/app-category/leaderboard/app-category-leaderboard.html",
        controller: "appCategoryLeaderBoardCtrl as ctrl",
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
        homeState: "appcategory-root-home",
        defaultParams: {
            device: "AndroidPhone",
            mode: "Top Free",
        },
        legacy: {
            marketresearch: "marketresearch_appmarketanalysis_top",
            salesIntelligence: "salesIntelligence-appcategory-leaderboard",
        },
        fallbackStates: {
            marketresearch: "marketresearch_appmarketanalysis_top",
        },
        params: {
            category: { type: "string", raw: true },
        },
    },
    "appcategory-trends": {
        parent: "appcategory",
        url: "/trends/:store/:country/:category/:device/:mode?tab",
        templateUrl: "/partials/topapps/trends.html",
        controller: "trendsCtrl as ctrl",
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
        homeState: "appcategory-root-home",
        legacy: {
            marketresearch: "marketresearch_appmarketanalysis_trending",
        },
        fallbackStates: {
            marketresearch: "marketresearch_appmarketanalysis_trending",
        },
        params: {
            category: { type: "string", raw: true },
        },
    },
    // 'appcategory.topkeywords': {
    //     parent: 'appcategory',
    //     configId: 'TopKeywords',
    //     icon: 'sw-icon-topkeywords',
    //     url: '/topkeywords/Google/:country/:duration/:category?orderby?page?filter',
    //     templateUrl: '/partials/topapps/top-keywords.html',
    //     controller: 'keywordsTopCtrl',
    //     pageTitle: 'storekeywords.topkeywords.title',
    //     pageSubtitle: 'appstorekeywords.topkeywords.subtitle',
    //     pageId: {
    //         section: 'topapps',
    //         subSection: 'category',
    //         subSubSection: 'topkeywords'
    //     },
    //     trackingId: {
    //         section: 'appCategoryAnalysis',
    //         subSection: 'store',
    //         subSubSection: 'topKeywords'
    //     },
    //     defaultQueryParams: {
    //     }
    // }
};

export default appCategoryConfig;
