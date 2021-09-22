import { AppsResourceService } from "services/AppsResourceService";
import { KeywordsResource } from "../../../../../scripts/common/resources/keywordsResource";

const appCategoryConfig = {
    "salesIntelligence-appcategory": {
        abstract: true,
        parent: "salesIntelligence",
        configId: "TopApps",
        data: {
            menuId: "appcategory",
            menuKbItems: "top-apps",
            disableRecording: true,
            showConnectedAccountsGlobalHook: true,
        },
        url: "/appcategory",
        templateUrl: "/partials/topapps/sales-navigation.html",
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
        packageName: "legacy",
    },
    "salesIntelligence-appcategory-leaderboard": {
        parent: "salesIntelligence-appcategory",
        url: "/leaderboard/:store/:country/:category/:device/:mode",
        templateUrl:
            "/app/pages/sales-intelligence/sub-modules/app-analysis/templates/app-category-leaderboard.html",
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
        homeState: "salesIntelligence-apps-home",
        defaultParams: {
            device: "AndroidPhone",
            mode: "Top Free",
        },
        legacy: {
            marketresearch: "marketresearch_appmarketanalysis_top",
        },
        fallbackStates: {
            marketresearch: "marketresearch_appmarketanalysis_top",
        },
        secondaryBarType: "SalesIntelligenceAppReview",
        params: {
            category: { type: "string", raw: true },
        },
    },
    "salesIntelligence-appcategory-trends": {
        parent: "salesIntelligence-appcategory",
        url: "/trends/:store/:country/:category/:device/:mode?tab",
        templateUrl: "/app/pages/sales-intelligence/sub-modules/app-analysis/templates/trends.html",
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
        homeState: "salesIntelligence-apps-home",
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
};

export default appCategoryConfig;
