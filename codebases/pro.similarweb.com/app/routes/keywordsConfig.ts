import { SecondaryBarType } from "reducers/_reducers/SecondaryBarReducer";
import { KeywordsResource } from "../../scripts/common/resources/keywordsResource";

export const googleKeywordsConfig = {
    "keywords-root": {
        abstract: true,
        parent: "research",
        configId: "AppKeywordAnalysis",
        templateUrl: "/app/pages/market-research/root.html",
        secondaryBarType: "AppResearch" as SecondaryBarType,
        packageName: "legacy",
    },
    keywords: {
        abstract: true,
        data: {
            menuId: "keywords",
            menuKbItems: "appstore-keywords",
            showConnectedAccountsGlobalHook: true,
        },
        parent: "research",
        url: "/keywords",
        templateUrl: "/app/pages/google-play-keywords/google-play-keywords-navigation.html",
        controller: "keywordsNavigationCtrl",
        configId: "AppKeywordAnalysis",
        resolve: {
            categories: [
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
    "keywords-home": {
        url: "^/keywords/home",
        templateUrl: "/app/pages/google-play-keywords/home.html",
        parent: "keywords-root",
        isHomePage: true,
        data: {
            menuId: "",
        },
        pageId: {
            section: "keywords",
            subSection: "home",
        },
        trackingId: {
            section: "keywords",
            subSection: "home",
        },
        clearSearch: true,
    },
    "keywords-analysis": {
        url: "/analysis/:keyword/:country/:duration/:category",
        templateUrl: "/app/pages/google-play-keywords/GooglePlayKeywordAnalysis.html",
        controller: "googlePlayKeywordAnalysisCtrl",
        controllerAs: "ctrl",
        parent: "keywords",
        configId: "AppKeywordAnalysis",
        pageId: {
            section: "keywords",
            subSection: "keywords",
            subSubSection: "analysis",
        },
        trackingId: {
            section: "keywords",
            subSection: "keywordCompetitors",
            subSubSection: "organic",
        },
        pageTitle: "keywordcompetitors.organic.title",
        pageSubtitle: "appstorekeywords.analysis.subtitle",
        defaultParams: {
            category: "All",
        },
        homeState: "keywords-home",
        params: {
            category: { type: "string", raw: true },
        },
    },
};

/*"keywords-root": {
        abstract: true,
        parent: "research",
        configId: "AppKeywordAnalysis",
        templateUrl: "/app/pages/market-research/root.html",
        secondaryBarType: 'AppResearch' as SecondaryBarType
    }*/
