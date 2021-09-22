/* eslint-disable @typescript-eslint/camelcase */
import React from "react";
import { Highcharts } from "libraries/reactHighcharts";
import { Injector } from "common/ioc/Injector";
import { FiltersEnum } from "components/filters-bar/utils";
import { PdfExportService } from "services/PdfExportService";
import { TechnographicsSubNav } from "pages/website-analysis/technographics/TechnographicsSubNav";
import { SecondaryBarType } from "reducers/_reducers/SecondaryBarReducer";
import clone from "lodash/clone";
import isFunction from "lodash/isFunction";

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
        return new Promise((resolve) => {
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

function getSingleOrCompare(params, path): string {
    const key = params.key.split(",");
    if (key.length <= 1) {
        return path + "/single.html";
    } else {
        return path + "/compare.html";
    }
}

function websiteResource(name: string, params: any, getParams?) {
    return function (s_ViewGroup, $stateParams) {
        let proccessedParams;
        if (isFunction(getParams)) {
            proccessedParams = Injector.invoke(getParams, null, {
                $stateParams: clone($stateParams),
            });
        } else {
            proccessedParams = { ...$stateParams };
        }
        //SIM-24722
        if (proccessedParams["limits"]) {
            delete proccessedParams["limits"];
        }
        return s_ViewGroup
            .get(
                "websiteanalysis/" +
                    (name === "GetTrafficSourcesSearch"
                        ? proccessedParams.webSource === "MobileWeb"
                            ? "GetTrafficSourcesMobileWebSearch"
                            : name
                        : name),
                proccessedParams,
                params,
                false,
            )
            .then(
                function (response) {
                    return response;
                },
                function (error) {
                    return { error };
                },
            );
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
    limits: null,
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
};

const baseConfig = {
    "accountreview-root": {
        abstract: true,
        url: "/account-review",
        parent: "salesIntelligence",
        template: `<!-- START research layout --><div ui-view class="sw-layout-module sw-layout-no-scroll-container fadeIn"></div><!-- END research layout -->`,
    },
    accountreview_website: {
        parent: "accountreview-root",
        templateUrl: "/app/pages/common-layout/index.html",
        abstract: true,
        controller: "salesWebsiteAnalysisModuleCtrl as ctrl",
        configId: "WebAnalysis", // TODO
        data: {
            menuId: "websites",
            filtersConfig: {
                duration: FiltersEnum.ENABLED,
                country: FiltersEnum.ENABLED,
                webSource: FiltersEnum.ENABLED,
            },
        },
        secondaryBarType: "SalesIntelligenceAccountReview" as SecondaryBarType,
        isSecondaryBarOpen: true,
        fallbackStates: {
            workspace: "salesWorkspace",
        },
    },
};

const overviewGroupConfig = {
    accountreview_website_overview_websiteperformance: {
        parent: "accountreview_website",
        url: "/overview/website-performance/:key/:isWWW/:country/:duration?webSource",
        templateUrl(params) {
            if (params.key.split(",").length > 1) {
                return "/app/pages/website-analysis/templates/worldwideOverview-compareSI.html";
            } else {
                return "/app/pages/website-analysis/templates/worldwideOverviewSI.html";
            }
        },
        controller: "worldwideOverviewCtrl as ctrl",
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
            section: "Account Review",
            subSection: "overview",
            subSubSection: "websitePerformance",
        },
        icon: "sw-icon-overview",
        pageTitle: "analysis.overview.performance.title", // TODO: welcome to change this if you want
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
            duration: "3m",
        },
        reloadOnSearch: false,
        isUSStatesSupported: true,
        homeState: "salesIntelligence-home",
        fallbackStates: {
            workspace: "salesWorkspace",
        },
    },
    accountreview_website_competitivelandscape: {
        parent: "accountreview_website",
        url:
            "/overview/competative-landscape/:key/:isWWW/:country/:duration?similarsites_filters&similarsites_orderby&selectedSite",
        template: `<sw-react component="CompetitiveLandscapePage"></sw-react>`,
        resolve: {
            siteInfo: siteInfo(),
        },
        pageId: {
            section: "website",
            subSection: "competitors",
            subSubSection: "similarsites",
        },
        trackingId: {
            section: "Account Review",
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
        homeState: "salesIntelligence-home",
        fallbackStates: {
            workspace: "salesWorkspace",
        },
    },
    accountreview_website_technologies: {
        params: {
            comparedDuration: "",
            isWWW: "*",
        },
        parent: "accountreview_website",
        url: "/technologies/:key?category",
        template: `<div ng-if="ctrl.technographicsRoot" sw-react component="ctrl.technographicsRoot"></div>`,
        controller: "technographicsCtrl as ctrl",
        periodOverPeriodEnabled: false,
        configId: "WebTechnographics",
        pageId: {
            section: "website",
            subSection: "overview",
            subSubSection: "technographics",
        },
        trackingId: {
            section: "Account Review",
            subSection: "overview",
            subSubSection: "technographics",
        },
        icon: "sw-icon-overview",
        pageTitle: "analysis.overview.technographics.title",
        pageSubtitle: "analysis.overview.technographics.subtitle",
        resolve: {
            siteInfo: siteInfo(),
        },
        data: {
            gaSupport: false,
            trackPageViewOnSearchUpdate: false,
        },
        // eslint-disable-next-line react/display-name
        getSubNav: (numberOfComparedItems: number, homeUrl: string) => (
            <TechnographicsSubNav numberOfComparedItems={numberOfComparedItems} homeUrl={homeUrl} />
        ),
        hidePageTitle: true,
        reloadOnSearch: false,
        isUSStatesSupported: false,
        skipDurationCheck: true,
        skipCountryCheck: true,
        homeState: "salesIntelligence-home",
        fallbackStates: {
            workspace: "salesWorkspace",
        },
    },
    accountreview_website_trafficandengagement: {
        parent: "accountreview_website",
        url:
            "/traffic-engagement/:key/:isWWW/:country/:duration/:comparedDuration?webSource?selectedWidgetTab",
        params: {
            mtd: "true",
            comparedDuration: "",
        },
        templateUrl: "/partials/websiteAnalysis/audience/overview/newOverview.html",
        controller: "newAudienceOverviewCtrl as ctrl",
        periodOverPeriodEnabled: true,
        fallbackStates: {
            workspace: "salesWorkspace",
        },
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
            section: "Account Review",
            subSection: "overview",
            subSubSection: "trafficAndEngagement",
        },
        icon: "sw-icon-overview",
        pageTitle: "analysis.traffic.engagement.title",
        resolve: {
            siteInfo: siteInfo(),
        },
        data: {
            gaSupport: true,
            trackPageViewOnSearchUpdate: false,
        },
        hidePageTitle: true,
        reloadOnSearch: false,
        isUSStatesSupported: true,
        homeState: "salesIntelligence-home",
    },
    accountreview_website_marketingchannels: {
        params: {
            comparedDuration: "",
        },
        parent: "accountreview_website",
        url:
            // eslint-disable-next-line max-len
            "/traffic-overview/:key/:isWWW/:country/:duration/:comparedDuration?overviewTable_filters&category&webSource?channelAnalysisMtd?channelAnalysisGranularity?channelAnalysisChannel?channelAnalysisMetric",
        templateUrl: "/app/pages/website-analysis/traffic-sources/mmx/mmx.html",
        controller: "MmxPageController as ctrl",
        periodOverPeriodEnabled: true,
        fallbackStates: {
            workspace: "salesWorkspace",
        },
        resolve: {
            siteInfo: siteInfo(),
        },
        pageId: {
            section: "website",
            subSection: "traffic",
            subSubSection: "overview",
        },
        trackingId: {
            section: "Account Review",
            subSection: "overview",
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
        homeState: "salesIntelligence-home",
    },
    accountreview_website_audience_geography: {
        parent: "accountreview_website",
        url: "/audience-geography/:key/:isWWW/:country/:duration?geography_filters",
        templateUrl: "/partials/websiteAnalysis/audience/geography.html",
        controller: "AudienceGeographyCtrl",
        fallbackStates: {
            workspace: "salesWorkspace",
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
            section: "Account Review",
            subSection: "overview",
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
        homeState: "salesIntelligence-home",
    },
    accountreview_website_audience_demographics: {
        parent: "accountreview_website",
        url: "/audience-demographics/:key/:isWWW/:country/:duration?webSource",
        template: '<sw-react component="WebAnalysisDemographics"></sw-react>',
        // configId: 'WebDemographics',
        hidePageTitle: true,
        fallbackStates: {
            workspace: "salesWorkspace",
        },
        resolve: {
            siteInfo: siteInfo(),
        },
        pageId: {
            section: "website",
            subSection: "audience",
            subSubSection: "demographics",
        },
        trackingId: {
            section: "Account Review",
            subSection: "overview",
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
        homeState: "salesIntelligence-home",
    },
    accountreview_website_audience_interests: {
        parent: "accountreview_website",
        url:
            "/audience-interests/:key/:isWWW/:country/:duration?webSource?audienceInterestsTable_filters&orderBy&audienceCategory&customCategory&selectedSite",
        template: '<sw-react component="AudienceInterests"></sw-react>',
        fallbackStates: {
            workspace: "salesWorkspace",
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
            section: "Account Review",
            subSection: "overview",
            subSubSection: "audienceInterests",
        },
        icon: "sw-icon-audience",
        pageTitle: "analysis.audience.interests.title",
        isVirtualSupported: false,
        isUSStatesSupported: true,
        reloadOnSearch: true,
        promoteCompareForStateTitle: "analysis.audience.interests.promotion.bubble.title",
        promoteCompareForStateSubtitle: "analysis.audience.interests.promotion.bubble.subtitle",
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
        homeState: "salesIntelligence-home",
    },
};

const searchGroupConfig = {
    accountreview_website_search_overview: {
        parent: "accountreview_website",
        url: `/overview/:key/:isWWW/:country/:duration?webSource?${Object.keys(
            trafficOverviewSearchParams,
        ).join(`?`)}`,
        template: `<search-tab-overview></search-tab-overview>`,
        fallbackStates: {
            workspace: "salesWorkspace",
        },
        resolve: {
            legendItems: siteInfo(),
        },
        pageId: {
            section: "website",
            subSection: "traffic",
            subSubSection: "search-overview",
        },
        trackingId: {
            section: "Account Review",
            subSection: "search",
            subSubSection: "overview",
        },
        defaultQueryParams: {
            webSource: "Desktop",
            duration: "3m",
        },
        icon: "sw-icon-search",
        hidePageTitle: true,
        searchParams: ["webSource"],
        pageTitle: "competitors.search.overview.page.title",
        isUSStatesSupported: true,
        reloadOnSearch: true,
        data: {
            trackPageViewOnSearchUpdate: false,
        },
        childStates: ({ webSource }) => {
            return webSource === "mobileweb" ? "MobileWebSearch" : "WebAnalysis";
        },
        homeState: "salesIntelligence-home",
    },
    accountreview_website_search_keyword: {
        parent: "accountreview_website",
        url: `/keyword/:key/:isWWW/:country/:duration?webSource?${Object.keys(
            trafficOverviewSearchParams,
        ).join(`?`)}`,
        template: `<sw-react component="WebsiteKeywordsPage" class=sw-section-traffic-search"></sw-react>`,
        fallbackStates: {
            workspace: "salesWorkspace",
        },
        resolve: {
            legendItems: siteInfo(),
        },
        pageId: {
            section: "website",
            subSection: "traffic",
            subSubSection: "search-keywords",
        },
        trackingId: {
            section: "Account Review",
            subSection: "search",
            subSubSection: "keyword",
        },
        defaultQueryParams: {
            webSource: "Desktop",
            duration: "3m",
        },
        icon: "sw-icon-search",
        hidePageTitle: true,
        pageTitle: "competitors.search.keywords.page.title",
        searchParams: ["selectedTab", "webSource"],
        isUSStatesSupported: true,
        reloadOnSearch: true,
        pageLayoutClassName: "sw-layout-page-max-width",
        data: {
            trackPageViewOnSearchUpdate: false,
        },
        childStates: ({ webSource }) => {
            return webSource === "mobileweb"
                ? "TrafficSourceSearchKeywordMobileWeb"
                : "TrafficSourceSearchKeyword";
        },
        homeState: "salesIntelligence-home",
    },
    accountreview_website_search_phrases: {
        parent: "accountreview_website",
        url: `/phrases/:key/:isWWW/:country/:duration?webSource?${Object.keys(
            trafficOverviewSearchParams,
        ).join(`?`)}`,
        template: `<sw-react component="Phrases" class="bordered-panel"></sw-react>`,
        fallbackStates: {
            marketresearch: "findSearchTextAds_bycompetitor",
            legacy: "websites-trafficSearch",
            workspace: "salesWorkspace",
        },
        resolve: {
            legendItems: siteInfo(),
        },
        pageId: {
            section: "website",
            subSection: "traffic",
            subSubSection: "search-phrases",
        },
        trackingId: {
            section: "Account Review",
            subSection: "search",
            subSubSection: "phrases",
        },
        defaultQueryParams: {
            webSource: "Desktop",
            duration: "3m",
        },
        icon: "sw-icon-search",
        hidePageTitle: true,
        searchParams: ["webSource"],
        pageTitle: "competitors.search.phrases.page.title",
        isUSStatesSupported: true,
        reloadOnSearch: true,
        data: {
            trackPageViewOnSearchUpdate: false,
        },
        childStates: ({ webSource }) => {
            return webSource === "mobileweb" ? "MobileWebSearch" : "WebAnalysis";
        },
        homeState: "salesIntelligence-home",
    },
    accountreview_website_search_ads: {
        parent: "accountreview_website",
        url: `/ads/:key/:isWWW/:country/:duration?webSource?${Object.keys(
            trafficOverviewSearchParams,
        ).join(`?`)}`,
        template: `<sw-react component="PlaResearchTableWebsiteContext" props="{type: 'text'}" class="bordered-panel"></sw-react>`,
        fallbackStates: {
            marketresearch: "findSearchTextAds_bycompetitor",
            legacy: "websites-trafficSearch",
            workspace: "salesWorkspace",
        },
        resolve: {
            legendItems: siteInfo(),
        },
        pageId: {
            section: "website",
            subSection: "traffic",
            subSubSection: "search-ads",
        },
        trackingId: {
            section: "Account Review",
            subSection: "search",
            subSubSection: "ads",
        },
        defaultQueryParams: {
            webSource: "Desktop",
            duration: "3m",
        },
        icon: "sw-icon-search",
        hidePageTitle: true,
        searchParams: ["webSource"],
        pageTitle: "competitors.search.ads.page.title",
        isUSStatesSupported: true,
        reloadOnSearch: true,
        data: {
            trackPageViewOnSearchUpdate: false,
        },
        childStates: ({ webSource }) => {
            return webSource === "mobileweb" ? "MobileWebSearch" : "WebAnalysis";
        },
        homeState: "salesIntelligence-home",
    },
    accountreview_website_search_plaResearch: {
        parent: "accountreview_website",
        url: `/plaResearch/:key/:isWWW/:country/:duration?webSource?${Object.keys(
            trafficOverviewSearchParams,
        ).join(`?`)}`,
        template: `<sw-react component="PlaResearchTableWebsiteContext" props="{type: 'shopping'}" class="bordered-panel"></sw-react>`,
        fallbackStates: {
            marketresearch: "findSearchTextAds_bycompetitor",
            legacy: "websites-trafficSearch",
            workspace: "salesWorkspace",
        },
        resolve: {
            legendItems: siteInfo(),
        },
        pageId: {
            section: "website",
            subSection: "traffic",
            subSubSection: "search-plaResearch",
        },
        trackingId: {
            section: "Account Review",
            subSection: "search",
            subSubSection: "plaResearch",
        },
        defaultQueryParams: {
            webSource: "Desktop",
            duration: "3m",
        },
        icon: "sw-icon-search",
        hidePageTitle: true,
        searchParams: ["webSource"],
        pageTitle: "competitors.search.plaResearch.page.title",
        isUSStatesSupported: true,
        reloadOnSearch: true,
        data: {
            trackPageViewOnSearchUpdate: false,
        },
        childStates: ({ webSource }) => {
            return webSource === "mobileweb" ? "MobileWebSearch" : "WebAnalysis";
        },
        homeState: "salesIntelligence-home",
        reset: trafficOverviewSearchParams,
    },
    accountreview_website_search_paid_competitors: {
        parent: "accountreview_website",
        url:
            "/competitors-paid-keywords/:key/:isWWW/:country/:duration?webSource&orderby?selectedSite?websiteType?paidSearchType?risingCompetitors?newCompetitors?category?search",
        reset: {
            orderby: null,
            selectedSite: null,
            websiteType: null,
            paidSearchType: null,
            risingCompetitors: null,
            newCompetitors: null,
            category: null,
            search: null,
        },
        template: `<sw-react component="KeywordCompetitorsPaidPage"></sw-react>`,
        resolve: {
            siteInfo: siteInfo(),
        },
        configId: "SearchCompetitors",
        pageId: {
            section: "website",
            subSection: "competitors",
            subSubSection: null,
        },
        trackingId: {
            section: "Account Review",
            subSection: "search",
            subSubSection: "competitors",
        },
        icon: "sw-icon-search-competitors",
        pageTitle: "analysis.search.paid.competitors.title",
        pageSubtitle: "analysis.search.paid.competitors.title.tooltip",
        searchParams: ["selectedSite"],
        isVirtualSupported: false,
        isUSStatesSupported: true,
        reloadOnSearch: false,
        homeState: "salesIntelligence-home",
        legacy: {
            digitalmarketing: "competitiveanalysis_website_search_paid_competitors",
        },
        fallbackStates: {
            digitalmarketing: "competitiveanalysis_website_search_paid_competitors",
        },
        params: {
            duration: "3m",
        },
        data: {
            filtersConfig: {
                duration: FiltersEnum.DISABLED,
            },
        },
    },
    accountreview_website_search_organic_competitors: {
        parent: "accountreview_website",
        url:
            "/competitors-organic-keywords/:key/:isWWW/:country/:duration?webSource&orderby?selectedSite?websiteType?organicSearchType?risingCompetitors?newCompetitors?category?search",
        reset: {
            orderby: null,
            selectedSite: null,
            websiteType: null,
            organicSearchType: null,
            risingCompetitors: null,
            newCompetitors: null,
            category: null,
            search: null,
        },
        template: `<sw-react component="KeywordCompetitorsOrganicPage"></sw-react>`,
        resolve: {
            siteInfo: siteInfo(),
        },
        configId: "SearchCompetitors",
        pageId: {
            section: "website",
            subSection: "competitors",
            subSubSection: null,
        },
        trackingId: {
            section: "Account Review",
            subSection: "search",
            subSubSection: "competitors",
        },
        icon: "sw-icon-search-competitors",
        pageTitle: "analysis.search.organic.competitors.title",
        pageSubtitle: "analysis.search.organic.competitors.title.tooltip",
        searchParams: ["selectedSite"],
        isVirtualSupported: false,
        isUSStatesSupported: true,
        reloadOnSearch: false,
        homeState: "salesIntelligence-home",
        legacy: {
            digitalmarketing: "competitiveanalysis_website_search_organic_competitors",
        },
        fallbackStates: {
            digitalmarketing: "competitiveanalysis_website_search_organic_competitors",
        },
        params: {
            duration: "3m",
        },
        data: {
            filtersConfig: {
                duration: FiltersEnum.DISABLED,
            },
        },
    },
};

const referralGroupConfig = {
    accountreview_website_referrals_incomingtraffic: {
        parent: "accountreview_website",
        url:
            // eslint-disable-next-line max-len
            "/referrals/incoming-traffic/:key/:isWWW/:country/:duration?webSource?referralsCategory?limits?orderBy?engagementTypeFilter?IncludeNewReferrals?IncludeTrendingReferrals?ExcludeUrls?IncludeUrls",
        templateUrl(params) {
            return getSingleOrCompare(params, "/partials/websiteAnalysis/traffic/referrals");
        },
        fallbackStates: {
            marketresearch: "findaffiliates_bycompetition",
            legacy: "websites-trafficReferrals",
            workspace: "salesWorkspace",
        },
        resolve: {
            legendItems: siteInfo(),
        },
        pageId: {
            section: "website",
            subSection: "traffic",
            subSubSection: "referrals",
        },
        trackingId: {
            section: "Account Review",
            subSection: "referral",
            subSubSection: "incomingTraffic",
        },
        defaultQueryParams: {
            webSource: "Total",
            duration: "3m",
            ExcludeUrls: null,
            IncludeUrls: null,
        },
        icon: "sw-icon-referrals",
        childStates: {
            desktop: {
                configId: "WebAnalysis",
            },
            mobileweb: {
                configId: "MobileWebReferrals",
            },
            total: {
                configId: "TotalWebReferrals",
            },
        },
        hidePageTitle: true,
        pageTitle: "analysis.referrals.incoming.title",
        isUSStatesSupported: true,
        searchParams: ["webSource"],
        reloadOnSearch: false,
        data: {
            trackPageViewOnSearchUpdate: false,
        },
        homeState: "salesIntelligence-home",
        reset: {
            ExcludeUrls: null,
            IncludeUrls: null,
        },
    },
    accountreview_website_outgoingtraffic: {
        parent: "accountreview_website",
        url:
            "/traffic-outgoing/:key/:isWWW/:country/:duration?outagoing_filters?selectedSite?outagoing_orderby",
        template: `<sw-react component="OutgoingTrafficPage"></sw-react>`,
        resolve: {
            legendItems: siteInfo(),
        },
        defaultQueryParams: {
            webSource: "Desktop",
        },
        params: {
            webSource: "Desktop",
        },
        pageId: {
            section: "website",
            subSection: "destination",
            subSubSection: "outgoing",
        },
        trackingId: {
            section: "Account Review",
            subSection: "referral",
            subSubSection: "outgoingTraffic",
        },
        icon: "sw-icon-bounce-rate",
        pageTitle: "analysis.referrals.outgoing.title",
        isUSStatesSupported: true,
        reloadOnSearch: true,
        homeState: "salesIntelligence-home",
        fallbackStates: {
            workspace: "salesWorkspace",
        },
    },
};

const displayGroupConfig = {
    accountreview_website_display: {
        parent: "accountreview_website",
        url:
            "/display/:key/:isWWW/:country/:duration?selectedTab&webSource&websites_filters&source",
        templateUrl: "/app/pages/website-analysis/traffic-sources/ads/deAds.html",
        controller: "adsCtrl as displayAdsPage",
        configId: "WebAnalysis",
        resolve: {
            siteInfo: siteInfo(),
        },
        pageId: {
            section: "website",
            subSection: "traffic",
            subSubSection: "display",
        },
        trackingId: {
            section: "Account Review",
            subSection: "display",
            subSubSection: (params) =>
                `display${params.selectedTab[0].toUpperCase()}${params.selectedTab.slice(1)}`,
        },
        icon: "sw-icon-display-ads",
        pageTitle: "analysis.display.overview.page.title",
        searchParams: ["selectedTab", "webSource"],
        defaultQueryParams: {
            selectedTab: "overview",
            webSource: "Desktop",
        },
        isUSStatesSupported: true,
        hidePageTitle: true,
        reloadOnSearch: true,
        data: {
            trackPageViewOnSearchUpdate: false,
            filtersConfig: {
                webSource: FiltersEnum.DISABLED,
            },
        },
        homeState: "salesIntelligence-home",
        fallbackStates: {
            workspace: "salesWorkspace",
        },
    },
    accountreview_website_display_overview: {
        parent: "accountreview_website",
        url: "/display-overview/:key/:isWWW/:country/:duration?webSource",
        template: `<sw-react component="DisplayAdsOverviewPage"></sw-react>`,
        configId: "WebAnalysis",
        resolve: {
            siteInfo: siteInfo(),
        },
        pageId: {
            section: "website",
            subSection: "traffic",
            subSubSection: "display",
        },
        trackingId: {
            section: "Account Review",
            subSection: "display",
            subSubSection: "displayOverview",
        },
        icon: "sw-icon-display-ads",
        pageTitle: "analysis.display.overview.page.title",
        pageSubtitle: "analysis.display.overview.sub.title",
        searchParams: ["webSource"],
        defaultQueryParams: {
            webSource: "Desktop",
        },
        isUSStatesSupported: true,
        data: {
            trackPageViewOnSearchUpdate: false,
            filtersConfig: {
                webSource: FiltersEnum.DISABLED,
            },
        },
        homeState: "salesIntelligence.home",
        fallbackStates: {
            workspace: "salesWorkspace",
        },
    },
    accountreview_website_display_creatives: {
        parent: "accountreview_website",
        url: "/display-creatives/:key/:isWWW/:country/:duration?webSource&sort&domain",
        template: `<sw-react component="CreativesContainer"></sw-react>`,
        configId: "WebsiteAdsIntelDisplay",
        resolve: {
            siteInfo: siteInfo(),
        },
        pageId: {
            section: "website",
            subSection: "traffic",
            subSubSection: "display",
        },
        trackingId: {
            section: "Account Review",
            subSection: "display",
            subSubSection: "creatives",
        },
        icon: "sw-icon-display-ads",
        pageTitle: "analysis.display.creatives.title",
        pageSubtitle: "analysis.display.creatives.sub.title",
        searchParams: ["webSource"],
        isUSStatesSupported: true,
        overrideDatepickerPreset: ["1m", "28d", "3m", "6m", "12m", "18m"],
        reloadOnSearch: false,
        data: {
            trackPageViewOnSearchUpdate: false,
        },
        fallbackStates: {
            workspace: "salesWorkspace",
        },
        homeState: "salesIntelligence-home",
    },
    accountreview_website_display_videos: {
        parent: "accountreview_website",
        url: "/display-videos/:key/:isWWW/:country/:duration?webSource&sort&domain",
        template: `<sw-react component="VideosContainer"></sw-react>`,
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
            section: "Account Review",
            subSection: "display",
            subSubSection: "videos",
        },
        icon: "sw-icon-display-ads",
        pageTitle: "analysis.source.ads.tabs.videos.title",
        pageSubtitle: "analysis.source.ads.tabs.videos.tooltip",
        searchParams: ["webSource"],
        isUSStatesSupported: true,
        overrideDatepickerPreset: ["1m", "28d", "3m", "6m", "12m", "18m"],
        data: {
            trackPageViewOnSearchUpdate: false,
        },
        fallbackStates: {
            workspace: "salesWorkspace",
        },
        homeState: "salesIntelligence.home",
    },
    accountreview_website_display_ad_networks: {
        parent: "accountreview_website",
        url: "/display-ad-networks/:key/:isWWW/:country/:duration?webSource&sort&adNetwork&page",
        template: `<sw-react component="AdNetworksContainer"></sw-react>`,
        configId: "WebAnalysis",
        resolve: {
            siteInfo: siteInfo(),
        },
        pageId: {
            section: "website",
            subSection: "traffic",
            subSubSection: "display",
        },
        trackingId: {
            section: "Account Review",
            subSection: "display",
            subSubSection: "displayMediators",
        },
        icon: "sw-icon-display-ads",
        pageTitle: "analysis.display.mediators.title",
        pageSubtitle: "analysis.source.ads.tabs.mediators.tooltip",
        searchParams: ["webSource"],
        data: {
            trackPageViewOnSearchUpdate: false,
            filtersConfig: {
                webSource: FiltersEnum.DISABLED,
            },
        },
        fallbackStates: {
            workspace: "salesWorkspace",
        },
        homeState: "salesIntelligence.home",
    },
};

const socialGroupConfig = {
    // V
    accountreview_website_social_overview: {
        parent: "accountreview_website",
        url: "/social/overview/:key/:isWWW/:country/:duration?selectedTab?social_filters&webSource",
        templateUrl(params) {
            return getSingleOrCompare(params, "/partials/websiteAnalysis/traffic/social");
        },
        controller: "TrafficSocialCtrl",
        resolve: {
            trafficSocial: websiteResource("GetTrafficSocial", {
                page: 1,
                orderby: "Share desc",
            }),
        },
        pageId: {
            section: "website",
            subSection: "traffic",
            subSubSection: "social",
        },
        trackingId: {
            section: "Account Review",
            subSection: "social",
            subSubSection: "socialOverview",
        },
        icon: "sw-icon-social",
        pageTitle: "analysis.social.overview.title",
        isUSStatesSupported: true,
        reloadOnSearch: false,
        homeState: "salesIntelligence-home",
        fallbackStates: {
            workspace: "salesWorkspace",
        },
        data: {
            filtersConfig: {
                webSource: FiltersEnum.DISABLED,
            },
        },
        defaultQueryParams: {
            webSource: "Desktop",
        },
    },
};

const contentGroupConfig = {
    accountreview_website_subdomains: {
        parent: "accountreview_website",
        url: "/content-subdomains/:key/:isWWW/:country/:duration?webSource&selectedSite",
        template: '<sw-react component="WebAnalysisSubdomainsContainer"></sw-react>',
        fallbackStates: {
            legacy: "websites-subdomains",
            workspace: "salesWorkspace",
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
            section: "Account Review",
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
        homeState: "salesIntelligence-home",
    },
};

const adNetworksGroupConfig = {
    accountreview_website_paidoutgoing: {
        parent: "accountreview_website",
        url:
            "/traffic-paid-outgoing/:key/:isWWW/:country/:duration?selectedTab?advertisers_filters?AdNetwork_filters&webSource",
        templateUrl: "/partials/websiteAnalysis/traffic/paidoutgoing.html",
        controller: "TrafficDestinationPaidOutgoingCtrl",
        resolve: {
            paidOutgoing: websiteResource("GetTrafficDisplayPaidOutgoing", {
                params: {
                    page: 1,
                    orderby: "Share desc",
                },
            }),
            adNetworks: websiteResource("GetTrafficDisplayPaidOutgoingAdsTable", {
                params: {
                    page: 1,
                    orderby: "TotalShare desc",
                },
            }),
        },
        pageId: {
            section: "website",
            subSection: "destination",
            subSubSection: "paidoutgoing",
        },
        trackingId: {
            section: "Account Review",
            subSection: "adnetworks",
            subSubSection: (params) => params.selectedTab,
        },
        icon: "sw-icon-paid-outgoing",
        pageTitle: "analysis.monetization.title",
        hidePageTitle: true,
        searchParams: ["selectedTab"],
        isUSStatesSupported: true,
        reloadOnSearch: false,
        data: {
            trackPageViewOnSearchUpdate: false,
            filtersConfig: {
                webSource: FiltersEnum.DISABLED,
            },
        },
        homeState: "salesIntelligence-home",
        fallbackStates: {
            workspace: "salesWorkspace",
        },
        defaultQueryParams: {
            webSource: "Desktop",
        },
    },
};

export const accountReviewConfig = {
    ...baseConfig,
    ...overviewGroupConfig,
    ...searchGroupConfig,
    ...referralGroupConfig,
    ...displayGroupConfig,
    ...socialGroupConfig,
    ...contentGroupConfig,
    ...adNetworksGroupConfig,
};
