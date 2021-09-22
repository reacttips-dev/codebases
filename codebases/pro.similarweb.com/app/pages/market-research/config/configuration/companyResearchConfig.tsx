/* eslint-disable @typescript-eslint/camelcase */
import { Highcharts } from "libraries/reactHighcharts";
import { FiltersEnum } from "components/filters-bar/utils";
import _ from "lodash";
import { AssetsService } from "services/AssetsService";
import { SecondaryBarType } from "reducers/_reducers/SecondaryBarReducer";
import { swSettings } from "common/services/swSettings";
import { PdfExportService } from "services/PdfExportService";
import {
    segmentsAnalysisController,
    segmentsRootController,
} from "pages/segments/config/segmentsConfigHelpers";
import SegmentsQueryBar from "pages/segments/SegmentsQueryBar";
import { fetchAndUpdateBetaBranchPrefrence } from "routes/websiteStateConfig";
import { chosenItems } from "common/services/chosenItems";
import { apiHelper } from "common/services/apiHelper";
import BetaBranchGreenBadgeComponent from "pages/website-analysis/TrafficAndEngagement/BetaBranch/BetaBranchGreenBadgeComponent";
import { SwTrack } from "services/SwTrack";
import { AppsResourceService } from "services/AppsResourceService";
import { AppInfoService } from "../../../../../scripts/common/services/appInfoService";
import { KeywordsResource } from "../../../../../scripts/common/resources/keywordsResource";

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

function getWorldMaps() {
    return () => {
        return new Promise((resolve, reject) => {
            if (Highcharts["maps"]["custom/world-lowres"]) {
                resolve(true);
            } else {
                fetch(window["assetsRoot"] + "/images/world-lowres.json").then((response) => {
                    response.json().then((data) => {
                        Highcharts["maps"]["custom/world-lowres"] = data;
                        resolve(true);
                    });
                });
            }
        });
    };
}

const appInfoResolver = [
    "$stateParams",
    "$filter",
    ($stateParams, $filter) => {
        let params = apiHelper.transformParamsForAPI($stateParams);
        params = _.pick(params, ["appId", "store"]);
        return AppInfoService.getInfo(params.appId, params.store).then((data) => {
            const apps = params.appId.split(",");
            const mainAppId = apps.shift();
            const mainApp = data[mainAppId] || null;
            const tail = [];
            if (chosenItems.$first().$set) {
                chosenItems.$first().$set(mainApp);
            }
            apps.forEach((appId) => {
                tail.push(data[appId]);
            });
            chosenItems.$tail(tail);
            // because similarApps API only works with one app ID
            params.appId = mainAppId;
            AppsResourceService.similarApps(params, (data) => {
                chosenItems.similarApps = data.slice(0, 5);
            });
            document.title =
                mainApp != null
                    ? $filter("i18n")("titleTag.mobileapps.analysis", { app: mainApp.Title })
                    : "";

            return data;
        });
    },
];

export const config = {
    companyresearch_websiteanalysis_home: {
        parent: "marketresearch",
        url: "/companyresearch/websiteanalysis/home",
        templateUrl: "/app/pages/market-research/website-analysis-home.html",
        configId: "WebCompanyAnalysisOverviewHome",
        pageId: {
            section: "marketresearch",
            subSection: "companyresearch",
            subSubSection: "analyzewebsites",
        },
        trackingId: {
            section: "Market Research",
            subSection: "Company Research",
            subSubSection: "Analyze Websites",
        },
        pageTitle: "companyintelligence.analyzewebsites.homepage.title",
    },
    "companyresearch_websiteanalysis-root": {
        abstract: true,
        parent: "sw",
        packageName: "marketresearch",
        secondaryBarType: "MarketResearch" as SecondaryBarType,
        template: `<!-- START research layout --><div ui-view class="sw-layout-module sw-layout-no-scroll-container fadeIn"></div><!-- END research layout -->`,
        fallbackStates: {
            marketresearch: "marketresearch-home",
            digitalmarketing: "digitalmarketing-home",
            legacy: "websites_root-home",
        },
    },
    companyresearch_website: {
        parent: "companyresearch_websiteanalysis-root",
        url: "/companyresearch/websiteanalysis",
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
    companyresearch_website_websiteperformance: {
        parent: "companyresearch_website",
        url: "/overview/website-performance/:key/:isWWW/:country/:duration?webSource",
        templateUrl(params) {
            if (params.key.split(",").length > 1) {
                return "/app/pages/website-analysis/templates/worldwideOverview-compare.html";
            } else {
                return "/app/pages/website-analysis/templates/worldwideOverview.html";
            }
        },
        configId: "WorldwideOverviewPage",
        controller: "worldwideOverviewCtrl as ctrl",
        fallbackStates: {
            digitalmarketing: "competitiveanalysis_website_overview_websiteperformance",
            legacy: "websites-worldwideOverview",
        },
        data: {
            gaSupport: true,
        },
        worldwideOnly: true,
        pageId: {
            section: "website",
            subSection: "worldwideOverview",
            subSubSection: null,
        },
        trackingId: {
            section: "websiteAnalysis",
            subSection: "overview",
            subSubSection: "websitePerformance",
        },
        icon: "sw-icon-overview",
        pageTitle: "analysis.overview.performance.title",
        isPdfDownloadButton: true,
        pdfDownloadsMethod: () =>
            PdfExportService.downloadPdfFedService("wwo.report.link", "wwo.report.title"),
        resolve: {
            siteInfo: siteInfo(),
            map: getWorldMaps(),
        },
        hidePageTitle: true,
        defaultQueryParams: {
            webSource: "Total",
        },
        reloadOnSearch: false,
        isUSStatesSupported: true,
        homeState: "companyresearch_websiteanalysis_home",
    },
    companyresearch_website_competitivelandscape: {
        parent: "companyresearch_website",
        url:
            "/overview/competative-landscape/:key/:isWWW/:country/:duration?similarsites_filters&similarsites_orderby&selectedSite",
        template: `<sw-react component="CompetitiveLandscapePage"></sw-react>`,
        resolve: {
            siteInfo: siteInfo(),
        },
        fallbackStates: {
            legacy: "websites-similarsites",
        },
        pageId: {
            section: "website",
            subSection: "competitors",
            subSubSection: "similarsites",
        },
        trackingId: {
            section: "websiteAnalysis",
            subSection: "overview",
            subSubSection: "competitiveLandscape",
        },
        icon: "sw-icon-similarsites",
        pageTitle: "analysis.overview.competitors.similarsites.title",
        isVirtualSupported: false,
        isUSStatesSupported: true,
        configId: "WebsiteCompetitors",
        reloadOnSearch: true,
        hideCalendar: true,
        overrideDatepickerPreset: ["3m"],
        minDurationRange: 3,
        defaultQueryParams: {
            duration: "3m",
        },
        data: {
            filtersConfig: {
                duration: FiltersEnum.DISABLED,
                country: FiltersEnum.DISABLED,
            },
        },
        homeState: "companyresearch_websiteanalysis_home",
    },
    companyresearch_website_trafficandengagement: {
        parent: "companyresearch_website",
        url:
            "/traffic-engagement/:key/:isWWW/:country/:duration:comparedDuration?webSource?selectedWidgetTab",
        params: {
            mtd: "true",
            comparedDuration: "",
        },
        templateUrl: "/partials/websiteAnalysis/audience/overview/newOverview.html",
        controller: "newAudienceOverviewCtrl as ctrl",
        fallbackStates: {
            legacy: "websites-audienceOverview",
        },
        periodOverPeriodEnabled: true,
        childStates: {
            desktop: {
                configId: "AudienceOverview",
            },
            mobileweb: {
                configId: "AudienceOverview",
            },
            total: {
                configId: "AudienceOverview",
            },
        },
        pageId: {
            section: "website",
            subSection: "audience",
            subSubSection: "overview",
        },
        trackingId: {
            section: "websiteAnalysis",
            subSection: "traffic",
            subSubSection: "trafficAndEngagement",
        },
        icon: "sw-icon-overview",
        pageTitle: "analysis.traffic.engagement.title",
        resolve: {
            siteInfo: siteInfo(),
            fetchAndUpdateBetaBranchStorePreference: () => fetchAndUpdateBetaBranchPrefrence(),
        },
        getGreenBadgeTitleComponent: () => {
            return (
                <BetaBranchGreenBadgeComponent
                    text={"sub.nav.webanalysis.traffic.and.engagement.green.badge.title"}
                />
            );
        },
        data: {
            gaSupport: true,
            trackPageViewOnSearchUpdate: false,
        },
        hidePageTitle: true,
        reloadOnSearch: true,
        isUSStatesSupported: true,
        homeState: "companyresearch_websiteanalysis_home",
    },
    companyresearch_website_new_vs_returning: {
        parent: "companyresearch_website",
        url: "/new-vs-returning/:key/:isWWW/:country/:duration:comparedDuration?webSource",
        template: `<sw-react component="NewVsReturningWebAnalysisPage"></sw-react>`,
        periodOverPeriodEnabled: false,
        configId: "WebNewVsReturning",
        pageId: {
            section: "websiteAnalysis",
            subSection: "traffic",
            subSubSection: "newVsReturning",
        },
        trackingId: {
            section: "websiteAnalysis",
            subSection: "traffic",
            subSubSection: "newVsReturning",
        },
        icon: "sw-icon-overview",
        pageTitle: "analysis.new.vs.returning.title",
        resolve: {
            siteInfo: siteInfo(),
        },
        data: {
            filtersConfig: {
                webSource: FiltersEnum.DISABLED,
            },
        },
        params: {
            webSource: "Desktop",
        },
        defaultQueryParams: {
            webSource: "Desktop",
            country: 840,
        },
        reloadOnSearch: false,
        isUSStatesSupported: false,
        homeState: "companyresearch_websiteanalysis_home",
    },
    companyresearch_website_marketingchannels: {
        parent: "companyresearch_website",
        // The URL Is Overwritten later in file Pay attention
        url:
            // eslint-disable-next-line max-len
            "/traffic-overview/:key/:isWWW/:country/:duration?search?overviewTable_filters&category&webSource?channelAnalysisMtd?channelAnalysisGranularity?channelAnalysisChannel?channelAnalysisMetric",
        templateUrl: "/app/pages/website-analysis/traffic-sources/mmx/mmx.html",
        controller: "MmxPageController as ctrl",
        fallbackStates: {
            digitalmarketing: "competitiveanalysis_website_overview_marketingchannels",
            legacy: "websites-trafficOverview",
        },
        params: {
            comparedDuration: "",
        },
        periodOverPeriodEnabled: true,
        resolve: {
            siteInfo: siteInfo(),
        },
        pageId: {
            section: "website",
            subSection: "traffic",
            subSubSection: "overview",
        },
        trackingId: {
            section: "websiteAnalysis",
            subSection: "traffic",
            subSubSection: "marketingChannels",
        },
        icon: "sw-icon-overview",
        pageTitle: "analysis.traffic.marketing.channels.title",
        pageMenuTitle: "analysis.traffic.marketing.channels.title",
        navTitle: "analysis.sources.mmx.navTitle",
        isUSStatesSupported: true,
        hidePageTitle: true,
        reloadOnSearch: false,
        defaultQueryParams: {
            category: "no-category",
        },
        childStates: {
            desktop: {
                configId: "MarketingMixComparePeriodOverPeriod",
            },
            mobileweb: {
                configId: "MarketingMixMobile",
            },
        },
        homeState: "companyresearch_websiteanalysis_home",
    },
    companyresearch_website_geography: {
        parent: "companyresearch_website",
        url: "/audience-geography/:key/:isWWW/:country/:duration?geography_filters",
        // templateUrl: "/partials/websiteAnalysis/audience/geography.html",
        // controller: "AudienceGeographyCtrl",
        template: '<sw-react component="WebAnalysisGeographyContainer"></sw-react>',
        fallbackStates: {
            legacy: "websites-audienceGeography",
        },
        resolve: {
            siteInfo: siteInfo(),
        },
        pageId: {
            section: "website",
            subSection: "audience",
            subSubSection: "geography",
        },
        trackingId: {
            section: "websiteAnalysis",
            subSection: "audience",
            subSubSection: "geography",
        },
        icon: "sw-icon-geography",
        pageTitle: "analysis.audience.geo.title",
        isUSStatesSupported: false,
        reloadOnSearch: false,
        data: {
            filtersConfig: {
                country: FiltersEnum.DISABLED,
            },
        },
        homeState: "companyresearch_websiteanalysis_home",
    },
    companyresearch_website_demographics: {
        parent: "companyresearch_website",
        url: "/audience-demographics/:key/:isWWW/:country/:duration?webSource",
        template: '<sw-react component="WebAnalysisDemographics"></sw-react>',
        fallbackStates: {
            legacy: "websites-audienceGeography",
        },
        // configId: 'WebDemographics',
        hidePageTitle: true,
        resolve: {
            siteInfo: siteInfo(),
        },
        pageId: {
            section: "website",
            subSection: "audience",
            subSubSection: "demographics",
        },
        trackingId: {
            section: "websiteAnalysis",
            subSection: "audience",
            subSubSection: "demographics",
        },
        defaultQueryParams: {
            isWWW: "*",
            // webSource: 'Desktop'
        },
        params: {
            webSource: "Desktop",
        },
        childStates: {
            desktop: {
                configId: "WebDemographics",
            },
            mobileweb: {
                configId: "MobileWebDemographics",
            },
            total: {
                configId: "WebDemographics",
            },
        },
        icon: "sw-icon-demographics",
        pageTitle: "analysis.audience.demo.title",
        isUSStatesSupported: false,
        reloadOnSearch: false,
        homeState: "companyresearch_websiteanalysis_home",
    },
    companyresearch_website_audienceInterests: {
        parent: "companyresearch_website",
        url:
            // eslint-disable-next-line max-len
            "/audience-interests/:key/:isWWW/:country/:duration?webSource?search?audienceInterestsTable_filters&orderBy&audienceCategory&customCategory&selectedSite",
        template: '<sw-react component="AudienceInterests"></sw-react>',
        fallbackStates: {
            legacy: "websites-audienceInterests",
        },
        resolve: {
            siteInfo: siteInfo(),
        },
        pageId: {
            section: "website",
            subSection: "audience",
            subSubSection: "interests",
        },
        trackingId: {
            section: "websiteAnalysis",
            subSection: "audience",
            subSubSection: "audienceInterests",
        },
        icon: "sw-icon-audience",
        pageTitle: "analysis.audience.interests.title",
        isVirtualSupported: false,
        isUSStatesSupported: true,
        reloadOnSearch: true,
        hideCalendar: true,
        overrideDatepickerPreset: ["3m", "6m", "12m", "18m", "24m"],
        minDurationRange: 3,
        params: {
            webSource: "Desktop",
        },
        data: {
            filtersConfig: {
                webSource: FiltersEnum.DISABLED,
            },
        },
        homeState: "companyresearch_websiteanalysis_home",
    },
    companyresearch_website_audienceOverlap: {
        parent: "companyresearch_website",
        url: "/audience-overlap/:key/:isWWW/:country/:duration?webSource",
        template: '<sw-react component="AudienceOverlap"></sw-react>',
        configId: "WebAudienceOverlap",
        fallbackStates: {
            legacy: "websites-audienceOverlap",
        },
        resolve: {
            siteInfo: siteInfo(),
        },
        pageId: {
            section: "website",
            subSection: "audience",
            subSubSection: "overlap",
        },
        trackingId: {
            section: "websiteAnalysis",
            subSection: "audience",
            subSubSection: "overlap",
        },
        icon: "sw-icon-audience",
        pageTitle: "analysis.audience.overlap.title",
        pageSubtitle: "analysis.audience.overlap.subtitle",
        // pinkBadgeTitle: "sidenav.beta",
        isNew: true,
        isVirtualSupported: false,
        isUSStatesSupported: true,
        reloadOnSearch: false,
        // promoteCompareForStateTitle: "analysis.audience.loyalty.promotion.bubble.title",
        // promoteCompareForStateSubtitle: "analysis.audience.loyalty.promotion.bubble.subtitle",
        hideCalendar: false,
        overrideDatepickerPreset: ["1m", "3m", "6m", "12m", "18m", "24m"],
        minDurationRange: 1,
        params: {
            webSource: "Desktop",
        },
        data: {
            filtersConfig: {
                webSource: FiltersEnum.DISABLED,
            },
        },
        homeState: "companyresearch_websiteanalysis_home",
    },
    companyresearch_website_subdomains: {
        parent: "companyresearch_website",
        url: "/content-subdomains/:key/:isWWW/:country/:duration?webSource&selectedSite",
        template: '<sw-react component="WebAnalysisSubdomainsContainer"></sw-react>',
        fallbackStates: {
            legacy: "websites-subdomains",
        },
        resolve: {
            siteInfo: siteInfo(),
        },
        pageId: {
            section: "website",
            subSection: "content",
            subSubSection: "subdomains",
        },
        trackingId: {
            section: "websiteAnalysis",
            subSection: "content",
            subSubSection: "subdomains",
        },
        icon: "sw-icon-subdomains",
        pageTitle: "analysis.content.subdomains.title",
        hidePageTitle: true,
        childStates: {
            desktop: {
                configId: "WebAnalysis",
            },
            mobileweb: {
                configId: "SubDomainsMobile",
            },
        },
        searchParams: ["webSource"],
        reloadOnSearch: false,
        isVirtualSupported: false,
        isUSStatesSupported: true,
        data: {
            trackPageViewOnSearchUpdate: false,
        },
        homeState: "companyresearch_websiteanalysis_home",
    },
    companyresearch_website_popular: {
        parent: "companyresearch_website",
        url: "/content-popular/:key/:country/:duration?webSource?selectedTab&selectedSite",
        templateUrl: "/app/pages/website-analysis/templates/popular.html",
        controller: "popularPagesCtrl as ctrl",
        fallbackStates: {
            legacy: "websites-popular",
        },
        hidePageTitle: true,
        configId: "PopularPages",
        resolve: {
            siteInfo: siteInfo(),
        },
        pageId: {
            section: "website",
            subSection: "content",
            subSubSection: "popular",
        },
        trackingId: {
            section: "websiteAnalysis",
            subSection: "content",
            subSubSection: "pages",
        },
        icon: "sw-icon-page-views",
        notPermittedConfig: {
            image: AssetsService.assetUrl("images/popularPagesHook.png"),
            description: "website.popular.pages.desc",
        },
        defaultQueryParams: {
            webSource: "Total",
        },
        params: {
            webSource: "Total",
            isWWW: "*",
            comparedDuration: "",
        },
        pageTitle: "analysis.content.popular.title2",
        searchParams: ["state"],
        isVirtualSupported: false,
        isUSStatesSupported: true,
        reloadOnSearch: false,
        data: {
            filtersConfig: {
                webSource: FiltersEnum.DISABLED,
            },
        },
        homeState: "companyresearch_websiteanalysis_home",
    },
    companyresearch_website_folders: {
        parent: "companyresearch_website",
        url: "/content-folders/:key/:isWWW/:country/:duration?webSource?selectedSite",
        templateUrl: "/app/pages/website-analysis/templates/folders.html",
        controller: "leadingFoldersCtrl as ctrl",
        fallbackStates: {
            legacy: "websites-folders",
        },
        hidePageTitle: true,
        configId: "PopularPages",
        resolve: {
            siteInfo: siteInfo(),
        },
        pageId: {
            section: "website",
            subSection: "content",
            subSubSection: "folders",
        },
        trackingId: {
            section: "websiteAnalysis",
            subSection: "content",
            subSubSection: "folders",
        },
        icon: "sw-icon-tabs-leading-folders",
        notPermittedConfig: {
            image: AssetsService.assetUrl("images/popularPagesHook.png"),
            description: "website.popular.pages.desc",
        },
        pageTitle: "analysis.content.folders.title",
        searchParams: ["state"],
        isVirtualSupported: false,
        isUSStatesSupported: true,
        reloadOnSearch: false,
        data: {
            filtersConfig: {
                webSource: FiltersEnum.DISABLED,
            },
        },
        homeState: "companyresearch_websiteanalysis_home",
    },
    companyresearch_website_sneakpeekQuery: {
        parent: "companyresearch_website",
        url: "/sneakpeek/query/:key/:isWWW/:country/:duration?editedId",
        templateUrl: "/app/pages/sneakpeek/sneakpeek-query.html",
        configId: "WebSiteSneakpeek",
        pageId: {
            section: "website",
            subSection: "sneakpeek",
            subSubSection: "query",
        },
        trackingId: {
            section: "websiteAnalysis",
            subSection: "sneakpeek",
            subSubSection: "query",
        },
        icon: "sw-icon-overview",
        pageTitle: "Create Data Prototype",
        resolve: {
            siteInfo: siteInfo(),
        },
        hidePageTitle: true,
        reloadOnSearch: false,
        isUSStatesSupported: true,
    },
    companyresearch_website_sneakpeekResults: {
        parent: "companyresearch_website",
        url: "/sneakpeek/results/:key/:isWWW/:country/:duration?queryId",
        templateUrl: "/app/pages/sneakpeek/sneakpeek-results.html",
        configId: "WebSiteSneakpeek",
        pageId: {
            section: "website",
            subSection: "sneakpeek",
            subSubSection: "results",
        },
        trackingId: {
            section: "websiteAnalysis",
            subSection: "sneakpeek",
            subSubSection: "results",
        },
        icon: "sw-icon-overview",
        pageTitle: "Data Prototype Results",
        resolve: {
            siteInfo: siteInfo(),
        },
        hidePageTitle: true,
        reloadOnSearch: false,
        isUSStatesSupported: true,
    },
    companyresearch_appanalysis_home: {
        parent: "marketresearch",
        url: "/companyresearch/appanalysis/home",
        templateUrl: "/app/pages/market-research/app-analysis-home.html",
        configId: "Solutions2AppAnalysisHome",
        pageId: {
            section: "marketresearch",
            subSection: "companyresearch",
            subSubSection: "analyzeapps",
        },
        trackingId: {
            section: "Market Research",
            subSection: "Company Research",
            subSubSection: "Analyze Apps",
        },
        pageTitle: "companyintelligence.analyzeapps.homepage.title",
    },
    companyresearch_app: {
        parent: "marketresearch_root",
        abstract: true,
        url: "/companyresearch/appanalysis",
        controller: "appsNavigationCtrl",
        configId: "AppAnalysis",
        templateUrl: "/partials/apps/navigation.html",
        data: {
            menuId: "apps",
            menuKbItems(state) {
                let section;
                if (state.name === "apps-ranking") {
                    section = "overview";
                } else {
                    switch (state.parent) {
                        case "apps.storepageanalysis":
                            section = "storepage";
                            break;
                        case "apps.engagement":
                            section = "engagement";
                            break;
                    }
                }
                return ["app", section, state.name.split(".").pop()].join("-");
            },
            showConnectedAccountsGlobalHook: true,
            showConnectedAccountsOnPageHook: false,
            showAvailableAppsIntro: false,
        },
        homeState: "companyresearch_appanalysis_home",
    },
    companyresearch_app_appperformance: {
        parent: "companyresearch_app",
        url: "/performance/:appId/:country/:duration/",
        templateUrl: "/app/pages/market-research/app-performance.html",
        configId: "AppPerformanceReport",
        fallbackStates: {
            legacy: "apps-performance",
        },
        resolve: {
            appInfo: appInfoResolver,
        },
        pageId: {
            section: "apps",
            subSection: "overview",
            subSubSection: "performance",
        },
        trackingId: {
            section: "appAnalysis",
            subSection: "overview",
            subSubSection: "appPerformance",
        },
        data: {
            menuKbItems: null,
        },
        pageTitle: "mobileAppsAnalysis.overview.performance.titleNew",
        reloadOnSearch: false,
        homeState: "companyresearch_appanalysis_home",
    },
    companyresearch_app_appranking: {
        parent: "companyresearch_app",
        url: "/ranking/:appId/:country/:duration?category?device?mode?orderby?tab",
        templateUrl: "/app/pages/app-analysis/app-overview/app-ranking/ranking.html",
        controller: "appsRankingMainCtrl",
        fallbackStates: {
            legacy: "apps-ranking",
        },
        controllerAs: "ranking",
        configId: "AppRanks",
        resolve: {
            appInfo: appInfoResolver,
        },
        pageId: {
            section: "apps",
            subSection: "overview",
            subSubSection: "ranking",
        },
        trackingId: {
            section: "appAnalysis",
            subSection: "overview",
            subSubSection: "ranking",
        },
        data: {
            menuKbItems: null,
        },
        pageTitle: "mobileAppsAnalysis.overview.ranking.titleNew",
        defaultQueryParams: {
            tab: "history",
            category: "",
        },
        reloadOnSearch: false,
        homeState: "companyresearch_appanalysis_home",
    },
    companyresearch_appsengagement_root: {
        abstract: true,
        parent: "companyresearch_app",
        templateUrl: "/partials/apps/engagement.html",
        controller: "appEngagementCtrl",
        resolve: {
            categories: [
                function () {
                    return KeywordsResource.getCategories().then(function (response) {
                        return response;
                    });
                },
            ],
        },
        data: {
            showAvailableAppsIntro: true,
            showConnectedAccountsGlobalHook: false,
            trackPageViewOnSearchUpdate: false,
        },
    },
    companyresearch_app_appengagementoverview: {
        parent: "companyresearch_appsengagement_root",
        configId: "AppEngagementOverview",
        url: "/engagementoverview/:appId/:country/:duration?tab?granularity",
        template: `<sw-react component="AppEngagementOverviewRedirect"></sw-react>`,
        fallbackStates: {
            legacy: "apps-engagementoverview",
        },
        permission: "MobEngagementOverview",
        resolve: {
            appInfo: appInfoResolver,
        },
        pageId: {
            section: "apps",
            subSection: "engagement",
            subSubSection: "overview",
        },
        trackingId: {
            section: "appAnalysis",
            subSection: "usageAndDownloads",
            subSubSection: "engagement",
        },
        icon: "sw-icon-overview",
        pageTitle: "mobileAppAnalysis.usageAndDownloads.engagement.title",
        pageSubtitle: "apps.engagementoverview.subtitle",
        pinkBadgeTitle: "sidenav.beta",
        data: {
            getCustomUrlType: function (toState) {
                return "connectedAccounts";
            },
            showConnectedAccountsOnPageHook: true,
            showConnectedAccountsGlobalHook: false,
        },
        defaultQueryParams: {
            granularity: "Daily",
        },
        reloadOnSearch: false,
        homeState: "companyresearch_appanalysis_home",
    },
    companyresearch_app_appdmg: {
        parent: "companyresearch_appsengagement_root",
        configId: "AppAudienceDemographics",
        url: "/demographics/:appId/:country/:duration",
        templateUrl: "/app/pages/app-analysis/app-audience/app-demographics/app-demographics.html",
        controllerAs: "ctrl",
        controller: "appDemographicsCtrl",
        fallbackStates: {
            legacy: "apps-demographics",
        },
        permission: "MobEngagementAudienceInterests",
        resolve: {
            appInfo: appInfoResolver,
        },
        pageId: {
            section: "apps",
            subSection: "audience",
            subSubSection: "demographics",
        },
        trackingId: {
            section: "appAnalysis",
            subSection: "audience",
            subSubSection: "demographics",
        },
        icon: "sw-icon-demographics",
        pageTitle: "apps.audience.demographics.pageTitle",
        pinkBadgeTitle: "sidenav.beta",
        data: {
            showAvailableAppsIntro: true,
            showConnectedAccountsOnPageHook: true,
            showConnectedAccountsGlobalHook: false,
            pageViewTracking: function (toParams, toState) {
                if (swSettings.current.isAllowed) {
                    SwTrack.trackPageView(toState, toParams);
                }
            },
        },
        homeState: "companyresearch_appanalysis_home",
    },
    companyresearch_app_appinterests: {
        parent: "companyresearch_appsengagement_root",
        trackNavUpdate: false,
        configId: "AppAudienceInterests",
        url: "/affinity/:appId/:country/:duration?orderby?page?filter?compare",
        templateUrl: "/app/pages/app-analysis/app-audience/audience-interests/affinity.html",
        controller: "affinityCtrl",
        fallbackStates: {
            legacy: "apps-appaudienceinterests",
        },
        permission: "MobEngagementAudienceInterests",
        resolve: {
            appInfo: appInfoResolver,
        },
        pageId: {
            section: "apps",
            subSection: "audience",
            subSubSection: "affinity",
        },
        trackingId: {
            section: "appAnalysis",
            subSection: "audience",
            subSubSection: "interests",
        },
        icon: "sw-icon-audience",
        pageTitle: "apps.engagement.affinity.title",
        pageSubtitle: "apps.engagementaffinity.subTitle",
        data: {
            showAvailableAppsIntro: true,
            showConnectedAccountsOnPageHook: true,
            showConnectedAccountsGlobalHook: false,
            pageViewTracking: function (toParams, toState) {
                if (swSettings.current.isAllowed) {
                    SwTrack.trackPageView(toState, toParams);
                }
            },
        },
        homeState: "companyresearch_appanalysis_home",
    },
    companyresearch_app_sneakpeekQuery: {
        parent: "companyresearch_app",
        url: "/sneakpeek/query/:appId/:country/:duration?editedId",
        templateUrl: "/app/pages/sneakpeek/sneakpeek-query.html",
        configId: "AppSneakpeek",
        pageId: {
            section: "apps",
            subSection: "sneakpeek",
            subSubSection: "query",
        },
        trackingId: {
            section: "appAnalysis",
            subSection: "sneakpeek",
            subSubSection: "query",
        },
        icon: "sw-icon-overview",
        pageTitle: "Create Data Prototype",
        resolve: {
            appInfo: appInfoResolver,
        },
        hidePageTitle: true,
        reloadOnSearch: false,
        isUSStatesSupported: true,
    },
    companyresearch_app_sneakpeekResults: {
        parent: "companyresearch_app",
        url: "/sneakpeek/results/:appId/:country/:duration?queryId",
        templateUrl: "/app/pages/sneakpeek/sneakpeek-results.html",
        configId: "AppSneakpeek",
        pageId: {
            section: "apps",
            subSection: "sneakpeek",
            subSubSection: "results",
        },
        trackingId: {
            section: "appAnalysis",
            subSection: "sneakpeek",
            subSubSection: "results",
        },
        icon: "sw-icon-overview",
        pageTitle: "Data Prototype Results",
        resolve: {
            appInfo: appInfoResolver,
        },
        hidePageTitle: true,
        reloadOnSearch: false,
        isUSStatesSupported: true,
    },
    companyresearch_segments: {
        parent: "marketresearch",
        name: "segments",
        abstract: true,
        url: "/segments",
        templateUrl: "/app/pages/segments/segmentsRoot.html",
        configId: "CustomSegments",
        controllerAs: "ctrl",
        controller: segmentsRootController,
    },
    "companyresearch_segments-homepage": {
        parent: "companyresearch_segments",
        url: "/home?tab",
        name: "segments.homepage",
        templateUrl: "/app/pages/segments/segmentsHomepage.html",
        configId: "CustomSegments",
        pageId: {
            section: "segments",
            subSection: "homepage",
        },
        trackingId: {
            section: "segments",
            subSection: "homepage",
            subSubSection: "",
        },
        pageTitle: "segments.homepage.title",
        reloadOnSearch: false,
    },
    "companyresearch_segments-analysis": {
        parent: "companyresearch_segments",
        name: "segments.analysis",
        url: "/analysis",
        templateUrl: "/app/pages/segments/segmentsAnalysis.html",
        abstract: true,
        controllerAs: "ctrl",
        controller: segmentsAnalysisController("companyresearch_segments-analysis"),
    },
    "companyresearch_segments-analysis-traffic": {
        parent: "companyresearch_segments-analysis",
        name: "segments.analysis.traffic",
        periodOverPeriodEnabled: true,
        url: "/:mode/:id/:country/:duration?comparedDuration",
        templateUrl: "/app/pages/segments/segmentsAnalysisTraffic.html",
        configId: "CustomSegments",
        pageId: {
            section: "segments",
            subSection: "analysis",
            subSubSection: "traffic",
        },
        trackingId: {
            section: "segments",
            subSection: "analysis",
            subSubSection: (params) => (params.mode === "group" ? "comparison" : "traffic"),
        },
        pageTitle: "segments.analysis.traffic.title",
        leftSubNav: SegmentsQueryBar,
    },
    "companyresearch_segments-analysis-marketingChannels": {
        parent: "companyresearch_segments-analysis",
        name: "segments.analysis.marketingChannels",
        periodOverPeriodEnabled: false,
        url: "/traffic-channels/:mode/:id/:country/:duration",
        templateUrl: "/app/pages/segments/segmentsAnalysisMarketingChannels.html",
        configId: "CustomSegments",
        pageId: {
            section: "segments",
            subSection: "analysis",
            subSubSection: "marketing Channels",
        },
        trackingId: {
            section: "segments",
            subSection: "analysis",
            subSubSection: "marketing Channels",
        },
        pageTitle: "segments.analysis.marketingChannels.title",
        leftSubNav: SegmentsQueryBar,
    },
    "companyresearch_segments-analysis-geography": {
        parent: "companyresearch_segments-analysis",
        name: "segments.analysis.geography",
        periodOverPeriodEnabled: false,
        url: "/geography/:mode/:id/:country/:duration",
        templateUrl: "/app/pages/segments/segmentsGeography.html",
        configId: "CustomSegments",
        pageId: {
            section: "segments",
            subSection: "analysis",
            subSubSection: "geography",
        },
        trackingId: {
            section: "segments",
            subSection: "analysis",
            subSubSection: "geography",
        },
        pageTitle: "segments.analysis.geography.title",
        leftSubNav: SegmentsQueryBar,
        data: {
            filtersConfig: {
                country: FiltersEnum.HIDDEN,
            },
        },
    },
    "companyresearch_segments-wizard": {
        parent: "companyresearch_segments",
        url: "/wizard?sid?country?createNew",
        template: `<div class="sw-layout-scrollable-element use-sticky-css-rendering" auto-scroll-top>
            <sw-react component="SegmentWizard"></sw-react>
        </div>`,
        configId: "CustomSegments",
        pageId: {
            section: "segments",
            subSection: "wizard",
        },
        trackingId: {
            section: "segments",
            subSection: "wizard",
        },
        pageTitle: "segments.wizard.title",
        secondaryBarType: "None" as SecondaryBarType,
    },
};

config["companyresearch_website_marketingchannels_duplicate"] = {
    ...config["companyresearch_website_marketingchannels"],
    redirectTo: "companyresearch_website_marketingchannels",
};
config["companyresearch_website_marketingchannels"].url =
    "/traffic-overview/:key/:isWWW/:country/:duration/:comparedDuration?search?overviewTable_filters&category&webSource?channelAnalysisMtd?channelAnalysisGranularity?channelAnalysisChannel?channelAnalysisMetric";

config["companyresearch_website_trafficandengagement_duplicate"] = {
    ...config["companyresearch_website_trafficandengagement"],
    redirectTo: "companyresearch_website_trafficandengagement",
};
config["companyresearch_website_trafficandengagement"].url =
    "/traffic-engagement/:key/:isWWW/:country/:duration/:comparedDuration?webSource?selectedWidgetTab";

export const companyResearchConfig = config;
