import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { adaptKeywordsQueryBarProps } from "components/compare/KeywordsQueryBar/KeywordsQueryBarHelper";
/* eslint-disable @typescript-eslint/camelcase */
import { FiltersEnum } from "components/filters-bar/utils";
import { AssetsService } from "services/AssetsService";
import { BasicDurations } from "services/DurationService";
import { marketingWorkspaceApiService } from "services/marketingWorkspaceApiService";
import { PdfExportService } from "services/PdfExportService";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";
import { DefaultFetchService } from "services/fetchService";
import queryString from "querystring";
import { apiHelper } from "common/services/apiHelper";
import swLog from "@similarweb/sw-log";
import { swSettings } from "common/services/swSettings";

function siteInfo() {
    return (sitesResource, $stateParams, chosenSites) => {
        return sitesResource
            .getSiteInfo({
                keys: $stateParams.key,
                mainDomainOnly: !!$stateParams.isWWW,
            })
            .$promise.then((headerData) => {
                chosenSites.updateMainSite(headerData);
                chosenSites.updateInfo(headerData);
                return chosenSites.sitelistForLegend();
            });
    };
}

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
    BooleanSearchTerms: null,
    search: null,
    selectedDomain: null,
    orderBy: null,
    ExcludeTerms: null,
    ExcludeUrls: null,
    IncludeUrls: null,
    IncludeTerms: null,
    family: null,
    source: null,
    selectedPhrase: null,
    volumeFromValue: null,
    volumeToValue: null,
    cpcFromValue: null,
    cpcToValue: null,
    limitsUsingAndOperator: null,
    predefinedFiler: null,
    gapFilterSelectedTab: null,
    selectedIntersection: null,
    serp: null,
};

const keywordAnalysisConfig = {
    keywordanalysis_home: {
        parent: "digitalmarketing",
        url: "/keywordanalysis/home",
        template: `<sw-react
                        component="KeywordAnalysisStartPageContainer"
                        props="{
                            pageState: 'keywordAnalysis_overview',
                            title: 'aquisitionintelligence.keywordresearch.keywordanalysis.home.title',
                            subtitle: 'aquisitionintelligence.keywordresearch.keywordanalysis.home.subtitle'
                        }">
                    </sw-react>
        `,
        configId: "KeywordAnalysisHome",
        pageId: {
            section: "digitalmarketing",
            subSection: "keywordresearch",
            subSubSection: "home",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Keyword Research",
            subSubSection: "Keyword_Analysis/HomePage",
        },
        pageTitle: "aquisitionintelligence.keywordanalysis.homepage.title",
    },
    keywordanalysis_root: {
        abstract: true,
        parent: "digitalmarketing_root",
        url: "/keyword",
        templateUrl: "/app/pages/keyword-analysis/templates/keywords-layout.html",
        configId: "KeywordAnalysis",
        controller: "layoutCtrl as ctrl",
        data: {
            menuKbItems: false,
            disableRecording: true,
            getCustomUrlType: () => {
                return "Digital Marketing - Keywords";
            },
        },
        pageId: {
            section: "keywordAnalysis",
        },
        trackingId: {
            section: "keywordAnalysis",
        },
    },
    keywordAnalysis_search_root: {
        abstract: true,
        parent: "keywordanalysis_root",
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
    keywordAnalysis_overview: {
        parent: "keywordAnalysis_search_root",
        url: "/overview?webSource",
        template: `<sw-react component="KeywordsOverviewPage"></sw-react>`,
        configId: "KeywordAnalysis",
        fallbackStates: {
            legacy: "keywordAnalysis-overview",
        },
        pageId: {
            section: "keywordAnalysis",
            subSection: "overview",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Keyword Research",
            subSubSection: "Keyword_Analysis/Overview",
        },
        defaultQueryParams: {
            webSource: "Total",
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
        homeState: "keywordanalysis_home",
    },
    keywordAnalysis_organic: {
        parent: "keywordAnalysis_search_root",
        url: "/organic",
        template: '<sw-react component="KeywordAnalysisOrganicPage"></sw-react>',
        configId: "KeywordAnalysis",
        fallbackStates: {
            legacy: "keywordAnalysis-organic",
        },
        pageId: {
            section: "keywordAnalysis",
            subSection: "organic",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Keyword Research",
            subSubSection: "Keyword_Analysis/organic",
        },
        reloadOnSearch: false,
        pageTitle: "keywordAnalysisOrganic.page.title",
        pageSubtitle: "KeywordAnalysis.organic.title.tooltip",
        icon: "sw-icon-nav-organic",
        homeState: "keywordanalysis_home",
    },
    keywordAnalysis_paid: {
        parent: "keywordAnalysis_search_root",
        url: "/paid",
        template: '<sw-react component="KeywordAnalysisPaidPage"></sw-react>',
        configId: "KeywordAnalysis",
        fallbackStates: {
            legacy: "keywordAnalysis-paid",
        },
        pageId: {
            section: "keywordAnalysis",
            subSection: "paid",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Keyword Research",
            subSubSection: "Keyword_Analysis/paid",
        },
        reloadOnSearch: false,
        pageTitle: "keywordAnalysisPaid.page.title",
        pageSubtitle: "KeywordAnalysis.paid.title.tooltip.text",
        icon: "sw-icon-nav-paid",
        homeState: "keywordanalysis_home",
    },
    keywordAnalysis_mobileweb: {
        parent: "keywordAnalysis_search_root",
        url: "/mobile",
        template: '<sw-react component="KeywordAnalysisMobileWebPage"></sw-react>',
        configId: "KeywordAnalysisMobileWeb",
        fallbackStates: {
            legacy: "keywordAnalysis-mobileweb",
        },
        pageId: {
            section: "keywordAnalysis",
            subSection: "mobileweb",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Keyword Research",
            subSubSection: "Keyword_Analysis/Mobile",
        },
        reloadOnSearch: false,
        pageTitle: "keywordAnalysisMobile.page.title",
        pageSubtitle: "KeywordAnalysis.mobile.title.tooltip.text",
        pinkBadgeTitle: "sidenav.beta",
        icon: "sw-icon-nav-paid",
        homeState: "keywordanalysis_home",
    },
    keywordAnalysis_geography: {
        parent: "keywordAnalysis_search_root",
        url: "/geo?keywordSource",
        template: `<sw-react component="KeywordsGeoPage" data-automation="keywords-geo-page" ></sw-react>`,
        configId: "KeywordsByGeo",
        fallbackStates: {
            legacy: "keywordAnalysis-geo",
        },
        pageId: {
            section: "keywordAnalysis",
            subSection: "geo",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Keyword Research",
            subSubSection: "Keyword_Analysis/Geo",
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
        homeState: "keywordanalysis_home",
    },
    keywordAnalysis_serpSnapshot: {
        parent: "keywordAnalysis_search_root",
        url: `/serpsnapshot?webSource?${Object.keys(trafficOverviewSearchParams).join(`?`)}`,
        template: `<sw-react component="SERPSnapshot"></sw-react>`,
        redirectTo: (transition) => {
            return new Promise(async (resolve, reject) => {
                const params = { ...transition.params() };
                const countryCode = Number(params.country);
                if (countryCode === 999) {
                    const filtered = Object.fromEntries(
                        Object.entries(params).filter(([key, value]) => value),
                    );
                    const paramsForApi = apiHelper.transformParamsForAPI(filtered);
                    paramsForApi.keys = paramsForApi.term;
                    const queryStringParams = queryString.stringify(paramsForApi);
                    const redirectResult = {
                        state: "keywordAnalysis_serpSnapshot",
                        params,
                    };
                    try {
                        const topCountryCode = await DefaultFetchService.getInstance().get(
                            `/api/SerpSnapshot/TopCountry?${queryStringParams}`,
                            null,
                            {
                                preventAutoCancellation: true,
                            },
                        );
                        redirectResult.params.country = topCountryCode;
                    } catch (e) {
                        swLog.error(e);
                        redirectResult.params.country =
                            swSettings.components.SerpSnapshot.resources.InitialCountry;
                    } finally {
                        resolve(redirectResult);
                    }
                } else {
                    resolve(true);
                }
            });
        },
        configId: "SerpSnapshot",
        pageId: {
            section: "keywordAnalysis",
            subSection: "serpSnapshot",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Keyword Research",
            subSubSection: "Keyword_Analysis/Serp Snapshot",
        },
        defaultQueryParams: {
            webSource: "Desktop",
        },
        reloadOnSearch: true,
        pageTitle: "keyword.analysis.serp.snapshot.page.title",
        pageSubtitle: "keyword.analysis.serp.snapshot.page.title.info",
        icon: "sw-icon-nav-organic",
        homeState: "keywordanalysis_home",
    },
    keywordAnalysis_ads: {
        parent: "keywordAnalysis_search_root",
        url: "/topads?webSource&type&selectedCategory&orderBy&search",
        template: `<sw-react
                    component="PlaResearchTableKeywordsContext"
                    props="{type: 'text',
                    emptyStateTitle: 'keyword.analysis.ads.page.empty.title',
                    emptyStateSubTitle: 'keyword.analysis.ads.page.empty.subtitle'}">
                  </sw-react>`,
        fallbackStates: {
            marketresearch: "findSearchTextAds_bykeyword",
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
            subSection: "Keyword Research",
            subSubSection: "Keyword_Analysis/topads",
        },
        reloadOnSearch: true,
        pageTitle: "keywordAnalysis.ads.page.title",
        pageSubtitle: "KeywordAnalysis.ads.title.tooltip",
        homeState: "keywordanalysis_home",
    },
    keywordAnalysis_plaResearch: {
        parent: "keywordAnalysis_search_root",
        url: "/topproducts?webSource&type&selectedCategory&orderBy&search",
        template: `<sw-react
                    component="PlaResearchTableKeywordsContext"
                    props="{type: 'shopping',
                    emptyStateTitle: 'keyword.analysis.plaresearch.page.empty.title',
                    emptyStateSubTitle: 'keyword.analysis.plaresearch.page.empty.subtitle'}">
                  </sw-react>`,
        fallbackStates: {
            marketresearch: "findProductListingAds_bykeyword",
            legacy: "keywordAnalysis-plaResearch",
        },
        configId: "KeywordsAds",
        pageId: {
            section: "keywordAnalysis",
            subSection: "keywordCompetitors",
            subSubSection: "plaResearch",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Keyword Research",
            subSubSection: "Keyword_Analysis/plaResearch",
        },
        reloadOnSearch: true,
        defaultQueryParams: {
            webSource: "Desktop",
        },
        pageTitle: "keywordAnalysis.plaResearch.page.title",
        pageSubtitle: "keyword.analysis.plaResearch.page.subTitle",
        orangeBadgeTitle: "sidenav.new",
        homeState: "keywordanalysis_home",
    },
    keywordAnalysis_total: {
        parent: "keywordAnalysis_search_root",
        url: "/total?webSource",
        template: `<sw-react component="KeywordAnalysisTotalPage" ></sw-react>`,
        configId: "KeywordAnalysisTotal",
        fallbackStates: {
            marketresearch: "marketresearch_keywordmarketanalysis_total",
            legacy: "keywordAnalysis-total",
        },
        pageId: {
            section: "keywordAnalysis",
            subSection: "total",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Keyword Research",
            subSubSection: "Keyword_Analysis/Total",
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
        homeState: "keywordanalysis_home",
    },
};

const findKeywordsConfig = {
    findkeywords_home: {
        parent: "digitalmarketing",
        url: "/findkeywords/home",
        template: `<sw-react component="FindKeywordsHomePage"/></sw-react>`,
        configId: "FindKeywordsHome",

        pageId: {
            section: "Digital Marketing",
            subSection: "Keyword Research",
            subSubSection: "Find_Keywords/homePage",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Keyword Research",
            subSubSection: "Find_Keywords/homePage",
        },
        pageTitle: "digitalmarketing.findkeywords.homepage.title",
        skipDurationCheck: true,
        skipCountryCheck: true,
    },
    findkeywords_bycompetition_root: {
        abstract: true,
        parent: "sw",
        template: `<!-- START research layout --><div ui-view class="sw-layout-module sw-layout-no-scroll-container fadeIn"></div><!-- END research layout -->`,
    },
    findkeywords_bycompetition_websiteanalysis: {
        parent: "digitalmarketing",
        url: "/findkeywords",
        templateUrl: "/app/pages/common-layout/index.html",
        abstract: true,
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
    findkeywords_bycompetition: {
        parent: "findkeywords_bycompetition_websiteanalysis",
        url: `/bycompetition/:key/:isWWW/:country/:duration?webSource?${Object.keys(
            trafficOverviewSearchParams,
        ).join(`?`)}`,
        template: `<sw-react component="WebsiteKeywordsPageForFindKeywordsByCompetitors"/></sw-react>`,
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
            subSection: "Keyword Research",
            subSubSection: "Find_Keywords/competition",
        },
        params: {
            predefinedFiler: String(0),
            gapFilterSelectedTab: String(0),
            isWWW: "*",
            country: "999",
            duration: "3m",
        },
        icon: "sw-icon-search",
        hidePageTitle: true,
        pageLayoutClassName: "sw-layout-page-max-width",
        pageTitle: "digitalmarketing.keywordresearch.find_keywords.competition.page.title",
        searchParams: ["webSource"],
        isUSStatesSupported: true,
        reloadOnSearch: true,
        data: {
            trackPageViewOnSearchUpdate: false,
        },
        childStates: ({ webSource }) => {
            return webSource === "mobileweb"
                ? "TrafficSourceSearchKeywordMobileWeb"
                : "TrafficSourceSearchKeyword";
        },
        homeState: "findkeywords_KeywordGap_home",
        reset: trafficOverviewSearchParams,
        // decides whether to reset when replacing the main site
        resetOnMainSiteChange: true,
    },
    findkeywords_byindustry_root: {
        abstract: true,
        parent: "digitalmarketing",
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
    },
    findkeywords_byindustry_SeasonalKeywords: {
        parent: "findkeywords_byindustry_root",
        url:
            // eslint-disable-next-line max-len
            "/findkeywords/byindustry_SeasonalKeywords/:category/:country/:duration?webSource&months?&channel&includeBranded&includeNoneBranded&excludeBranded&orderBy&search&BooleanSearchTerms?cpcFromValue?cpcToValue?volumeFromValue?volumeToValue",
        template: `<sw-react component="KeywordsSeasonalityPage"/>`,
        configId: "IndustryAnalysisKeywordsSeasonality",
        overrideParams: {
            duration: BasicDurations.LAST_TWELVE_MONTHS,
        },
        pageId: {
            section: "industryAnalysis",
            subSection: "topKeywords",
        },
        params: {
            duration: "12m",
            category: { type: "string", raw: true },
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Keyword Research",
            subSubSection: "Find_Keywords/industry_seasonal",
        },
        icon: "sw-icon-top-keywords",
        notPermittedConfig: {
            image: AssetsService.assetUrl("images/IATopKeywords.png"),
            description: "ia.topkeywords.desc",
        },
        clearSearch: true,
        reloadOnSearch: false,
        pageTitle: "find.keywords.by.industry.seasonal.keywords.page.title",
        pageSubtitle: "industryAnalysis.topKeywords.subtitle",
        defaultQueryParams: {
            webSource: "Desktop",
            duration: BasicDurations.LAST_TWELVE_MONTHS,
        },
        data: {
            filtersConfig: {
                duration: FiltersEnum.DISABLED,
                webSource: FiltersEnum.DISABLED,
            },
        },
        homeState: "findkeywords_SeasonalKeywords_home",
        fallbackStates: {
            legacy: "industryAnalysis-topKeywords",
        },
    },
    findkeywords_byindustry_TopKeywords: {
        parent: "findkeywords_byindustry_root",
        url:
            // eslint-disable-next-line max-len
            "/findkeywords/byindustry_TopKeywords/:category/:country/:duration/:isWWW?webSource&tab&channel&includeBranded&includeNoneBranded&orderBy&search&BooleanSearchTerms?IncludeTrendingKeywords?IncludeNewKeywords?IncludeQuestions?cpcFromValue?cpcToValue?volumeFromValue?volumeToValue",
        templateUrl: "/app/pages/industry-analysis/top-keywords/top-keywords.html",
        configId: "IndustryAnalysisTopKeywords",

        pageId: {
            section: "industryAnalysis",
            subSection: "topKeywords",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Keyword Research",
            subSubSection: "Find_Keywords/industry",
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
        pageTitle: "findKeywords.byIndustry.page.title",
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
            duration: "3m",
            category: { type: "string", raw: true },
        },
        homeState: "findkeywords_TopKeywords_home",
        fallbackStates: {
            legacy: "industryAnalysis-topKeywords",
        },
    },
    findkeywords_keywordGeneratorTool_root: {
        abstract: true,
        parent: "digitalmarketing",
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
        data: {
            getCustomUrlType: () => {
                return "Digital Marketing - Keywords";
            },
        },
    },
    findkeywords_keywordGeneratorTool: {
        parent: "findkeywords_keywordGeneratorTool_root",
        configId: "KeywordsGenerator",
        url:
            "/findkeywords/keyword-generator-tool/:keyword/:country/:duration?webSource?selectedWidgetTab?cpcFromValue?cpcToValue?volumeFromValue?volumeToValue",
        template: `<sw-react component="KeywordGeneratorToolInlinePage"></sw-react>`,
        pageId: {
            section: "keywordAnalysis",
            subSection: "recommendation",
            subSubSection: "generator",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Keyword Research",
            subSubSection: "Find_Keywords/generator-google",
        },
        reloadOnSearch: false,
        data: {
            getCustomUrlType: () => {
                return "Digital Marketing - Keywords";
            },
        },
        pageTitle: "find.keywords.by.industry.keyword.generator.page.title",
        pageLayoutClassName: "sw-layout-page-max-width",
        defaultQueryParams: {
            webSource: "Desktop",
        },
        params: {
            webSource: "Desktop",
        },
        homeState: "findkeywords_KeywordGenerator_home",
    },
    findkeywords_amazonKeywordGenerator: {
        parent: "digitalmarketing",
        configId: "AmazonKeywordsGenerator",
        url:
            "/findkeywords/amazon-keyword-generator/:keyword/:country/:duration?webSource?selectedTab?BooleanSearchTerms",
        templateUrl:
            "/app/pages/digital-marketing/keyword-research/AmazonKeywordResearchTemplate.html",
        controller: ($scope, swNavigator) => {
            $scope.ctrl = {
                backStateUrl: () => {
                    const homeState = swNavigator.current().homeState;
                    const homeStateUrl = swNavigator.href(homeState, null);
                    return homeStateUrl;
                },
                keyword: () => {
                    return swNavigator.getParams().keyword;
                },
            };
        },
        pageId: {
            section: "keywordAnalysis",
            subSection: "recommendation",
            subSubSection: "generator",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Keyword Research",
            subSubSection: "Find_Keywords/generator-amazon",
        },
        pageTitle: "find.keywords.by.industry.amazon.keyword.generator.page.title",
        pageLayoutClassName: "sw-layout-page-max-width",
        params: {
            webSource: "Total",
            duration: "12m",
            country: "999",
            selectedTab: "0",
        },
        defaultQueryParams: {
            webSource: "Total",
            duration: "12m",
            country: "999",
        },
        data: {
            filtersConfig: {
                duration: FiltersEnum.DISABLED,
            },
        },
        isUSStatesSupported: false,
        reloadOnSearch: false,
        homeState: "findkeywords_KeywordGenerator_home",
    },
    findkeywords_youtubeKeywordGenerator: {
        parent: "digitalmarketing",
        configId: "AmazonKeywordsGenerator",
        url:
            "/findkeywords/youtube-keyword-generator/:keyword/:country/:duration?webSource?selectedTab?BooleanSearchTerms",
        templateUrl:
            "/app/pages/digital-marketing/keyword-research/YoutubeKeywordResearchTemplate.html",
        controller: ($scope, swNavigator) => {
            $scope.ctrl = {
                backStateUrl: () => {
                    const homeState = swNavigator.current().homeState;
                    const homeStateUrl = swNavigator.href(homeState, null);
                    return homeStateUrl;
                },
                keyword: () => {
                    return swNavigator.getParams().keyword;
                },
            };
        },
        pageId: {
            section: "keywordAnalysis",
            subSection: "recommendation",
            subSubSection: "generator",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Keyword Research",
            subSubSection: "Find_Keywords/generator-youtube",
        },
        pageTitle: "find.keywords.by.industry.youtube.keyword.generator.page.title",
        pageLayoutClassName: "sw-layout-page-max-width",
        params: {
            webSource: "Total",
            duration: "12m",
            country: "999",
        },
        defaultQueryParams: {
            webSource: "Total",
            duration: "12m",
            country: "999",
        },
        data: {
            filtersConfig: {
                duration: FiltersEnum.DISABLED,
            },
        },
        isUSStatesSupported: false,
        reloadOnSearch: false,
        homeState: "findkeywords_KeywordGenerator_home",
    },
};

const findKeywordsByConfig = {
    findkeywords_KeywordGenerator_home: {
        parent: "digitalmarketing",
        url: "/findkeywords/KeywordGenerator/home",
        template: `<sw-react component="KeywordResearchKeywordGeneratorHomepage" ></sw-react>`,
        configId: "FindKeywordsHome",
        pageId: {
            section: "trafficSearchHome",
            subSection: "home",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Keyword Research",
            subSubSection: "Find_Keywords/homePage/KW Generator",
        },
        pageTitle: "digitalmarketing.findkeywords.homepage.title",
        skipDurationCheck: true,
        skipCountryCheck: true,
    },
    findkeywords_KeywordGap_home: {
        parent: "digitalmarketing",
        url: "/findkeywords/KeywordGap/home?chosenSiteName?chosenSiteFavicon",
        template: `<sw-react component="KeywordResearchKeywordGapHomepage" ></sw-react>`,
        configId: "FindKeywordsHome",
        pageId: {
            section: "trafficSearchHome",
            subSection: "home",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Keyword Research",
            subSubSection: "Find_Keywords/homePage/KW Gap",
        },
        pageTitle: "digitalmarketing.findkeywords.homepage.title",
        skipDurationCheck: true,
        skipCountryCheck: true,
    },
    findkeywords_SeasonalKeywords_home: {
        parent: "digitalmarketing",
        url: "/findkeywords/SeasonalKeywords/home",
        template: `<sw-react component="KeywordResearchTopKeywordsHomepage"
                            props="{section: 'SeasonalTrends',
                            title: 'digitalMarketing.findKeywords.SeasonalKeywords.title',
                            subTitle: 'digitalMarketing.findKeywords.SeasonalKeywords.subTitle'}"></sw-react>`,
        configId: "FindKeywordsHome",
        pageId: {
            section: "trafficSearchHome",
            subSection: "home",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Keyword Research",
            subSubSection: "Find_Keywords/homePage/Seasonal",
        },
        pageTitle: "digitalmarketing.findkeywords.homepage.title",
        skipDurationCheck: true,
        skipCountryCheck: true,
    },
    findkeywords_TopKeywords_home: {
        parent: "digitalmarketing",
        url: "/findkeywords/TopKeywords/home",
        template: `<sw-react component="KeywordResearchTopKeywordsHomepage"
                            props="{section: 'TopKeywords',
                            title: 'digitalMarketing.findKeywords.TopKeywords.title',
                            subTitle: 'digitalMarketing.findKeywords.TopKeywords.subTitle'}"></sw-react>`,
        configId: "FindKeywordsHome",
        pageId: {
            section: "trafficSearchHome",
            subSection: "home",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Keyword Research",
            subSubSection: "Find_Keywords/homePage/Industry",
        },
        pageTitle: "digitalmarketing.findkeywords.homepage.title",
        skipDurationCheck: true,
        skipCountryCheck: true,
    },
    monitorkeywords_root: {
        abstract: true,
        parent: "digitalmarketing",
        templateUrl:
            "/app/pages/digital-marketing/monitor-lists/keywords/MonitorKeywordsTemplate.html",
        configId: "KeywordAnalysis",
        controller: ($scope, swNavigator) => {
            $scope.ctrl = {
                backStateUrl: () => {
                    const homeState = swNavigator.current().homeState;
                    const homeStateUrl = swNavigator.href(homeState, null);
                    return homeStateUrl;
                },
                queryBarProps: () => {
                    const props = swNavigator.getParams();
                    const userGroups = keywordsGroupsService.userGroups;
                    const sharedGroups = keywordsGroupsService.getSharedGroups();
                    const customCategories = [userGroups, sharedGroups];
                    const params = { ...props, customCategories };
                    return adaptKeywordsQueryBarProps(params);
                },
                getArenas: async () => {
                    await marketingWorkspaceApiService.getMarketingWorkspaces().then((res) => {
                        return res[0].arenas;
                    });
                },
            };
        },
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
        data: {
            getCustomUrlType: () => {
                return "Digital Marketing - Keywords";
            },
        },
    },
    monitorkeywords: {
        parent: "monitorkeywords_root",
        url:
            "/findkeywords/keywordGroup/:keywordGroupId/:duration/:country/:webSource?keywordsType?sites?isWWW",
        template: '<sw-react component="MonitorKeywordsPage"></sw-react>',
        trackingId: {
            section: "Digital Marketing",
            subSection: "Keyword Research",
            subSubSection: "Monitor_Keywords_List",
        },
        pageId: {
            section: "Digital Marketing",
            subSection: "Keyword Research",
            subSubSection: "Monitor_Keywords_List",
        },
        pageTitle: "workspaces.marketing.pageTitles.exists",
        reloadOnSearch: true,
        homeState: "monitorkeywords_home",
    },
};

const monitorKeywordsConfig = {
    monitorkeywords_home: {
        parent: "digitalmarketing",
        url: "/monitorkeywords/home",
        template: `<sw-react component="MonitorKeywordsStartPageContainer"></sw-react>`,
        configId: "FindKeywordsHome",
        pageId: {
            section: "digitalmarketing",
            subSection: "keywordresearch",
            subSubSection: "Monitor_Keywords/home",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Keyword Research",
            subSubSection: "Monitor_Keywords_Homepage",
        },
        pageTitle: "digitalmarketing.monitorkeywords.homepage.title",
        skipDurationCheck: true,
        skipCountryCheck: true,
    },
};

export const keywordResearchConfig = {
    ...keywordAnalysisConfig,
    ...findKeywordsConfig,
    ...findKeywordsByConfig,
    ...monitorKeywordsConfig,
};
