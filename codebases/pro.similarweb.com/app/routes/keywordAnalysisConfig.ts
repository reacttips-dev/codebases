import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { swSettings } from "common/services/swSettings";
import { FiltersEnum } from "components/filters-bar/utils";
import { SecondaryBarType } from "reducers/_reducers/SecondaryBarReducer";
import { PdfExportService } from "services/PdfExportService";
import { clearAllParams } from "../actions/keywordGeneratorToolActions";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";

declare let window: any;
export default {
    keywordAnalysis: {
        abstract: true,
        parent: "research",
        url: "/keyword",
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
        secondaryBarType: "WebsiteResearch" as SecondaryBarType,
        packageName: "legacy",
    },
    "keywordAnalysis-home": {
        parent: "keywordAnalysis",
        url: "/home",
        template: `<sw-react
                        component="KeywordAnalysisStartPageContainer"
                        props="{
                            pageState: 'keywordAnalysis-overview',
                            title: 'aquisitionintelligence.keywordresearch.keywordanalysis.home.title',
                            subtitle: 'aquisitionintelligence.keywordresearch.keywordanalysis.home.subtitle'
                        }">
                    </sw-react>
        `,
        configId: "KeywordAnalysis",
        pageId: {
            section: "keywordAnalysis",
            subSection: "home",
        },
        trackingId: {
            section: "Search Interest Analysis",
            subSection: "home",
        },
        pageTitle: "keywordAnalysis.home.pageTitle",
        legacy: {
            digitalmarketing: "keywordanalysis_home",
            marketresearch: "marketresearch_keywordmarketanalysis_home",
        },
    },
    "keywordAnalysis-search": {
        abstract: true,
        parent: "keywordAnalysis",
        url: "/search/:country/:duration/:keyword?tab?mtd",
        templateUrl: "/app/pages/keyword-analysis/search.html",
        configId: "KeywordAnalysis",
        controller: "keywordSearchCtrl as ctrl",
        params: {
            mtd: "false",
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
    "keywordAnalysis-overview": {
        parent: "keywordAnalysis-search",
        url: "/overview?webSource",
        template: `<sw-react component="KeywordsOverviewPage"></sw-react>`,
        configId: "KeywordAnalysis",
        pageId: {
            section: "keywordAnalysis",
            subSection: "overview",
        },
        trackingId: {
            section: "keywordAnalysis",
            subSection: "keywordCompetitors",
            subSubSection: "overview",
        },
        reloadOnSearch: false,
        pageTitle: "keyword.analysis.overview.page.title",
        pageSubtitle: "keyword.analysis.overview.page.title.info",
        icon: "sw-icon-nav-organic",
        isPdfDownloadButton: true,
        pdfDownloadsMethod: () =>
            PdfExportService.downloadPdfFedService(
                "wwo.report.link",
                "keyword.analysis.overview.page.title",
            ),
        legacy: {
            digitalmarketing: "keywordAnalysis_overview",
        },
        fallbackStates: {
            digitalmarketing: "keywordAnalysis_overview",
        },
        homeState: "keywordAnalysis-home",
    },
    "keywordAnalysis-organic": {
        parent: "keywordAnalysis-search",
        url: "/organic",
        template: '<sw-react component="KeywordAnalysisOrganicPage"></sw-react>',
        configId: "KeywordAnalysis",
        pageId: {
            section: "keywordAnalysis",
            subSection: "organic",
        },
        trackingId: {
            section: "keywordAnalysis",
            subSection: "keywordCompetitors",
            subSubSection: "organic",
        },
        reloadOnSearch: false,
        pageTitle: "keywordAnalysisOrganic.page.title",
        pageSubtitle: "KeywordAnalysis.organic.title.tooltip",
        icon: "sw-icon-nav-organic",
        legacy: {
            digitalmarketing: "keywordAnalysis_organic",
        },
        fallbackStates: {
            digitalmarketing: "keywordAnalysis_organic",
        },
        homeState: "keywordAnalysis-home",
    },
    "keywordAnalysis-paid": {
        parent: "keywordAnalysis-search",
        url: "/paid",
        template: '<sw-react component="KeywordAnalysisPaidPage"></sw-react>',
        configId: "KeywordAnalysis",
        pageId: {
            section: "keywordAnalysis",
            subSection: "paid",
        },
        trackingId: {
            section: "keywordAnalysis",
            subSection: "keywordCompetitors",
            subSubSection: "paid",
        },
        reloadOnSearch: false,
        pageTitle: "keywordAnalysisPaid.page.title",
        pageSubtitle: "KeywordAnalysis.paid.title.tooltip.text",
        icon: "sw-icon-nav-paid",
        legacy: {
            digitalmarketing: "keywordAnalysis_paid",
        },
        fallbackStates: {
            digitalmarketing: "keywordAnalysis_paid",
        },
        isPdfDownloadButton: true,
        homeState: "keywordAnalysis-home",
        pdfDownloadsMethod: () =>
            PdfExportService.downloadPdfFedService(
                "wwo.report.link",
                "keyword.analysis.overview.page.title",
            ),
    },
    "keywordAnalysis-total": {
        parent: "keywordAnalysis-search",
        url: "/total?webSource",
        template: `<sw-react
                       component="KeywordAnalysisTotalPageDri"
                        ></sw-react>`,
        legacy: {
            digitalmarketing: "keywordAnalysis_total",
            marketresearch: "marketresearch_keywordmarketanalysis_total",
        },
        fallbackStates: {
            digitalmarketing: "keywordAnalysis_total",
            marketresearch: "marketresearch_keywordmarketanalysis_total",
        },
        configId: "KeywordAnalysisTotal",
        pageId: {
            section: "keywordAnalysis",
            subSection: "total",
        },
        trackingId: {
            section: "keywordAnalysis",
            subSection: "keywordCompetitors",
            subSubSection: "total",
        },
        data: {
            filtersConfig: {
                webSource: FiltersEnum.DISABLED,
            },
        },
        defaultQueryParams: {
            webSource: "Total",
        },
        reloadOnSearch: false,
        pageTitle: "keywordAnalysisTotal.page.title",
        pageSubtitle: "KeywordAnalysis.total.title.tooltip",
        icon: "sw-icon-nav-total",
        homeState: "keywordAnalysis-home",
    },
    "keywordAnalysis-mobileweb": {
        parent: "keywordAnalysis-search",
        url: "/mobile",
        template: '<sw-react component="KeywordAnalysisMobileWebPage"></sw-react>',
        configId: "KeywordAnalysisMobileWeb",
        pageId: {
            section: "keywordAnalysis",
            subSection: "mobileweb",
        },
        trackingId: {
            section: "keywordAnalysis",
            subSection: "keywordCompetitors",
            subSubSection: "mobile",
        },
        reloadOnSearch: false,
        pageTitle: "keywordAnalysisMobile.page.title",
        pageSubtitle: "KeywordAnalysis.mobile.title.tooltip.text",
        pinkBadgeTitle: "sidenav.beta",
        icon: "sw-icon-nav-paid",
        homeState: "keywordAnalysis-home",
        legacy: {
            digitalmarketing: "keywordAnalysis_mobileweb",
        },
        fallbackStates: {
            digitalmarketing: "keywordAnalysis_mobileweb",
        },
    },
    "keywordAnalysis-geo": {
        parent: "keywordAnalysis-search",
        url: "/geo?keywordSource",
        template: `<sw-react component="KeywordsGeoPageDri" data-automation="keywords-geo-page-dri" ></sw-react>`,
        configId: "KeywordsByGeo",
        pageId: {
            section: "keywordAnalysis",
            subSection: "geo",
        },
        trackingId: {
            section: "keywordAnalysis",
            subSection: "keywordCompetitors",
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
        homeState: "keywordAnalysis-home",
        legacy: {
            digitalmarketing: "keywordAnalysis_geography",
            marketresearch: "marketresearch_keywordmarketanalysis_geo",
        },
        fallbackStates: {
            digitalmarketing: "keywordAnalysis_geography",
            marketresearch: "marketresearch_keywordmarketanalysis_geo",
        },
    },
    "keywordAnalysis-ads": {
        parent: "keywordAnalysis-search",
        url: "/ads?webSource&type&selectedCategory&orderBy&search",
        template: `<sw-react
                    component="PlaResearchTableKeywordsContext"
                    props="{type: 'text',
                    emptyStateTitle: 'keyword.analysis.ads.page.empty.title',
                    emptyStateSubTitle: 'keyword.analysis.ads.page.empty.subtitle'}">
                  </sw-react>`,
        configId: "KeywordsAds",
        pageId: {
            section: "keywordAnalysis",
            subSection: "keywordCompetitors",
            subSubSection: "ads",
        },
        trackingId: {
            section: "keywordAnalysis",
            subSection: "keywordCompetitors",
            subSubSection: "topads",
        },
        reloadOnSearch: true,
        pageTitle: "keywordAnalysis.ads.page.title",
        pageSubtitle: "KeywordAnalysis.ads.title.tooltip",
        homeState: "keywordAnalysis-home",
        legacy: {
            digitalmarketing: "keywordAnalysis_ads",
        },
        fallbackStates: {
            digitalmarketing: "keywordAnalysis_ads",
        },
    },
    "keywordAnalysis-plaResearch": {
        parent: "keywordAnalysis-search",
        url: "/plaResearch?webSource&type&selectedCategory&orderBy&search",
        template: `<sw-react
                    component="PlaResearchTableKeywordsContext"
                    props="{type: 'shopping',
                    emptyStateTitle: 'keyword.analysis.plaresearch.page.empty.title',
                    emptyStateSubTitle: 'keyword.analysis.plaresearch.page.empty.subtitle'}">
                  </sw-react>`,
        configId: "KeywordsAds",
        pageId: {
            section: "keywordAnalysis",
            subSection: "keywordCompetitors",
            subSubSection: "plaResearch",
        },
        trackingId: {
            section: "keywordAnalysis",
            subSection: "keywordCompetitors",
            subSubSection: "plaResearch",
        },
        reloadOnSearch: true,
        pageTitle: "keywordAnalysis.plaResearch.page.title",
        pageSubtitle: "keyword.analysis.plaResearch.page.subTitle",
        orangeBadgeTitle: "sidenav.new",
        homeState: "keywordAnalysis-home",
        legacy: {
            digitalmarketing: "keywordAnalysis_plaResearch",
        },
        fallbackStates: {
            digitalmarketing: "keywordAnalysis_plaResearch",
        },
    },
    "keywordAnalysis-generator": {
        parent: "keywordAnalysis-search",
        url: "/generator?webSource?selectedWidgetTab",
        template: `<sw-react component="KeywordGeneratorToolInlinePage"></sw-react>`,
        configId: "KeywordsGenerator",
        pageId: {
            section: "keywordAnalysis",
            subSection: "recommendation",
            subSubSection: "generator",
        },
        trackingId: {
            section: "keywordAnalysis",
            subSection: "recommendation",
            subSubSection: "generator",
        },
        reloadOnSearch: false,
        pageTitle: "keywordAnalysis.generator.page.title",
        defaultQueryParams: {
            webSource: "Desktop",
        },
        legacy: {
            digitalmarketing: "findkeywords_keywordGeneratorTool",
        },
        homeState: "keywordAnalysis-home",
    },
    "keywordAnalysis-unauthorized": {
        parent: "keywordAnalysis",
        url: "/preview",
        templateUrl: "/app/pages/keyword-analysis/unauthorized.html",
        configId: "KeywordAnalysis",
        pageId: {
            section: "keywordAnalysis",
            subSection: "unauthorized",
        },
        trackingId: {
            section: "keywordAnalysis",
            subSection: "unauthorized",
        },
        data: {
            pageViewTracking: function (toParams, toState) {
                //Override default behaviour, avoid sending tracking
            },
        },
        controllerAs: "ctrl",
        controller: function (swNavigator) {
            const ctrl = this;
            ctrl.hideContactButton = swSettings.components.Home.resources.IsRestrictedUser;
        },
    },
    "keywordAnalysis-unauthorizedMobile": {
        parent: "keywordAnalysis",
        url: "/mobile-upgrade",
        templateUrl: "/app/pages/keyword-analysis/unauthorized-mobile.html",
        configId: "KeywordAnalysis",
        pageId: {
            section: "keywordAnalysis",
            subSection: "unauthorizedMobile",
        },
        trackingId: {
            section: "keywordAnalysis",
            subSection: "unauthorizedMobile",
        },
        data: {
            pageViewTracking: function (toParams, toState) {
                //Override default behaviour, avoid sending tracking
            },
        },
        controllerAs: "ctrl",
        controller: function (swNavigator) {
            const ctrl = this;
            ctrl.hideContactButton = swSettings.components.Home.resources.IsRestrictedUser;
        },
    },
    "keywordAnalysis-sneakpeekQuery": {
        parent: "keywordAnalysis-search",
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
    "keywordAnalysis-sneakpeekResults": {
        parent: "keywordAnalysis-search",
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
    "keywordAnalysis-keywordGeneratorTool": {
        parent: "keywordAnalysis",
        configId: "KeywordsGenerator",
        url: "/keyword-generator-tool?seedKeyword",
        controller: async ($scope, $ngRedux) => {
            $scope.$on("$destroy", () => {
                $ngRedux.dispatch(clearAllParams());
            });
        },
        template:
            '<div class="sw-layout-scrollable-element  use-sticky-css-rendering" style="height: 100%">' +
            '<sw-react component="KeywordGeneratorToolPage"></sw-react>' +
            "</div>",
        pageId: {
            section: "keywordAnalysis",
            subSection: "keywordGeneratorTool",
        },
        trackingId: {
            section: "keywordAnalysis",
            subSection: "keywordGeneratorTool",
        },
        reloadOnSearch: false,
        data: {
            disableRecording: false,
        },
    },
};
