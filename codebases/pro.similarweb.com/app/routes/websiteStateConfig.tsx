/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable react/display-name */
import { Highcharts } from "libraries/reactHighcharts";
import { FiltersEnum } from "components/filters-bar/utils";
import * as _ from "lodash";
import * as React from "react";
import { AssetsService } from "services/AssetsService";
import { PdfExportService } from "services/PdfExportService";
import { Injector } from "../../scripts/common/ioc/Injector";
import { TechnographicsSubNav } from "../pages/website-analysis/technographics/TechnographicsSubNav";
import { SecondaryBarType } from "reducers/_reducers/SecondaryBarReducer";
import NgRedux from "ng-redux";
import { betaVsLiveSwitchToggle } from "actions/commonActions";
import swLog from "@similarweb/sw-log";
import BetaBranchGreenBadgeComponent from "pages/website-analysis/TrafficAndEngagement/BetaBranch/BetaBranchGreenBadgeComponent";
import { PreferencesService } from "services/preferences/preferencesService";
import { SwTrack } from "services/SwTrack";

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
    serp: null,
};

export const USE_BETA_BRANCH_DATA_PREF_KEY = "useBetaBranchData";

function getWebsiteStateConfigInternal({}: /*flags list e.g., hasFlag1,hasFlag2*/ any) {
    const websiteConfig: any = {
        research: {
            abstract: true,
            parent: "sw",
            template: `<!-- START research layout --><div ui-view class="sw-layout-module sw-layout-no-scroll-container fadeIn"></div><!-- END research layout -->`,
            fallbackStates: {
                marketresearch: "marketresearch-home",
                digitalmarketing: "digitalmarketing-home",
                legacy: "websites_root-home",
            },
        },
        "websites-root": {
            abstract: true,
            parent: "research",
            configId: "WebAnalysis",
            templateUrl: "/app/pages/market-research/root.html",
            secondaryBarType: "WebsiteResearch" as SecondaryBarType,
            packageName: "legacy",
        },
        "websites_root-home": {
            parent: "websites-root",
            url: "^/website/home",
            templateUrl: "/app/pages/website-analysis/home/home.html",
            data: { menuKbItems: "website-analysis" },
            configId: "WorldwideOverviewPage",
            pageId: {
                section: "website",
                subSection: "home",
            },
            trackingId: {
                section: "websiteAnalysis",
                subSection: "home",
            },
            clearSearch: true,
            pageTitle: "websites.home.pageTitle",
            skipDurationCheck: true,
            skipCountryCheck: true,
        },
        websites: {
            abstract: true,
            parent: "research",
            url: "/website",
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
            secondaryBarType: "WebsiteResearch" as SecondaryBarType,
            packageName: "legacy",
        },
        "websites-worldwideOverview": {
            parent: "websites",
            url: "/worldwide-overview/:key/:isWWW/:country/:duration?webSource",
            templateUrl(params) {
                if (params.key.split(",").length > 1) {
                    return "/app/pages/website-analysis/templates/worldwideOverview-compare.html";
                } else {
                    return "/app/pages/website-analysis/templates/worldwideOverview.html";
                }
            },
            controller: "worldwideOverviewCtrl as ctrl",
            configId: "WorldwideOverviewPage",
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
            legacy: {
                digitalmarketing: "competitiveanalysis_website_overview_websiteperformance",
                marketresearch: "companyresearch_website_websiteperformance",
                salesIntelligence: "accountreview_website_overview_websiteperformance",
            },
            fallbackStates: {
                digitalmarketing: "competitiveanalysis_website_overview_websiteperformance",
                marketresearch: "companyresearch_website_websiteperformance",
                salesIntelligence: "accountreview_website_overview_websiteperformance",
            },
            homeState: "websites_root-home",
        },
        "websites-audienceOverview": {
            parent: "websites",
            url: "/audience-overview/:key/:isWWW/:country/:duration?webSource",
            params: {
                mtd: "true",
                comparedDuration: "",
            },
            templateUrl: "/partials/websiteAnalysis/audience/overview/newOverview.html",
            controller: "newAudienceOverviewCtrl as ctrl",
            periodOverPeriodEnabled: true,
            resolve: {
                fetchAndUpdateBetaBranchStorePreference: () => fetchAndUpdateBetaBranchPrefrence(),
                siteInfo: siteInfo(),
            },
            getGreenBadgeTitleComponent: () => {
                return (
                    <BetaBranchGreenBadgeComponent
                        text={"sub.nav.webanalysis.traffic.and.engagement.green.badge.title"}
                    />
                );
            },
            configId: "AudienceOverview",
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
            data: {
                gaSupport: true,
                trackPageViewOnSearchUpdate: false,
            },
            hidePageTitle: true,
            reloadOnSearch: false,
            isUSStatesSupported: true,
            legacy: {
                marketresearch: "companyresearch_website_trafficandengagement",
                salesIntelligence: "accountreview_website_trafficandengagement",
            },
            fallbackStates: {
                marketresearch: "companyresearch_website_trafficandengagement",
                salesIntelligence: "accountreview_website_trafficandengagement",
            },
            homeState: "websites_root-home",
        },
        "websites-newVsReturning": {
            parent: "websites",
            url: "/new-vs-returning/:key/:isWWW/:country/:duration:comparedDuration?webSource",
            template: `<sw-react component="NewVsReturningWebAnalysisPage"></sw-react>`,
            configId: "WebNewVsReturning",
            periodOverPeriodEnabled: false,
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
            defaultQueryParams: {
                webSource: "Desktop",
                country: 840,
            },
            reloadOnSearch: false,
            isUSStatesSupported: false,
            homeState: "websites_root-home",
            params: {
                comparedDuration: "",
            },
        },
        "websites-technographicsOverview": {
            parent: "websites",
            url: "/technologies-overview/:key/:isWWW?category",
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
                section: "websiteAnalysis",
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
            getSubNav: (numberOfComparedItems: number, homeUrl: string) => (
                <TechnographicsSubNav
                    numberOfComparedItems={numberOfComparedItems}
                    homeUrl={homeUrl}
                />
            ),
            hidePageTitle: true,
            reloadOnSearch: false,
            isUSStatesSupported: false,
            skipDurationCheck: true,
            skipCountryCheck: true,
            homeState: "websites_root-home",
            legacy: {
                salesIntelligence: "accountreview_website_technologies",
                digitalmarketing: "competitiveanalysis_websites_technographicsOverview",
            },
            fallbackStates: {
                salesIntelligence: "accountreview_website_technologies",
                digitalmarketing: "competitiveanalysis_websites_technographicsOverview",
            },
        },
        "pro-iframe-sf": {
            url: "/sf/convert/:isWWW/:key",
            pageId: {
                section: "sfiframe",
                subSection: "convert",
            },
            icon: "sw-icon-home",
            clearSearch: true,
            trackingId: {
                section: "sfiframe",
                subSection: "convert",
            },
            data: {
                getCustomUrlType(toState) {
                    // website | apps | keywords | industryAnalysis
                    return this.getTrackId(toState).section;
                },
                getTrackId(toState) {
                    return toState.trackingId || toState.pageId;
                },
                pageViewTracking(toParams, toState, event) {
                    // event param was added in order to differentiate between navChangeSuccess to navUpdate
                    SwTrack.trackPageView(toState, toParams);
                },
            },
            params: {
                isWWW: "*",
            },
            configId: "WebAnalysis",
            pageTitle: "swhome.page.title",
            skipDurationCheck: true,
            skipCountryCheck: true,
            controller: "sfConvertCtrl as ctrl",
            hideFromRecents: true,
            template: `<div ng-if="ctrl.sfconvertRoot" sw-react component="ctrl.sfconvertRoot"></div>`,
        },
        "websites-audienceOverviewMobileWeb": {
            parent: "websites",
            url:
                "/audience-overview-mobile/:key/:isWWW/:country/:duration?selectTrendLine?aggDuration?showSeries",
            redirectTo: "websites-audienceOverview",
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
            homeState: "websites_root-home",
        },
        "websites-audienceGeography": {
            parent: "websites",
            url: "/audience-geography/:key/:isWWW/:country/:duration?geography_filters",
            template: '<sw-react component="WebAnalysisGeographyContainer"></sw-react>',
            // remove
            // templateUrl: "/partials/websiteAnalysis/audience/geography.html",
            // controller: "AudienceGeographyCtrl",
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
            legacy: {
                marketresearch: "companyresearch_website_geography",
                salesIntelligence: "accountreview_website_audience_geography",
            },
            fallbackStates: {
                marketresearch: "companyresearch_website_geography",
                salesIntelligence: "accountreview_website_audience_geography",
            },
            homeState: "websites_root-home",
        },
        "websites-audienceDemographics": {
            parent: "websites",
            url: "/audience-demographics/:key/:isWWW/:country/:duration?webSource",
            template: '<sw-react component="WebAnalysisDemographics"></sw-react>',
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
            homeState: "websites_root-home",
            legacy: {
                marketresearch: "companyresearch_website_demographics",
                salesIntelligence: "accountreview_website_audience_demographics",
            },
            fallbackStates: {
                marketresearch: "companyresearch_website_demographics",
                salesIntelligence: "accountreview_website_audience_demographics",
            },
        },
        "websites-audienceInterests": {
            parent: "websites",
            url:
                // eslint-disable-next-line max-len
                "/audience-interests/:key/:isWWW/:country/:duration?webSource?search?audienceInterestsTable_filters&orderBy&audienceCategory&customCategory&selectedSite",
            template: '<sw-react component="AudienceInterests"></sw-react>',
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
            homeState: "websites_root-home",
            legacy: {
                marketresearch: "companyresearch_website_audienceInterests",
                salesIntelligence: "accountreview_website_audience_interests",
            },
            fallbackStates: {
                marketresearch: "companyresearch_website_audienceInterests",
                salesIntelligence: "accountreview_website_audience_interests",
            },
        },
        "websites-audienceOverlap": {
            parent: "websites",
            url: "/audience-overlap/:key/:isWWW/:country/:duration?webSource",
            template: '<sw-react component="AudienceOverlap"></sw-react>',
            configId: "WebAudienceOverlap",
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
            isNew: true,
            isVirtualSupported: false,
            isUSStatesSupported: true,
            reloadOnSearch: false,
            // promoteCompareForStateTitle: "analysis.audience.loyalty.promotion.bubble.title",
            // promoteCompareForStateSubtitle: "analysis.audience.loyalty.promotion.bubble.subtitle",
            hideCalendar: false,
            overrideDatepickerPreset: ["1m", "3m", "6m", "12m", "18m", "24m"],
            params: {
                webSource: "Desktop",
            },
            data: {
                filtersConfig: {
                    webSource: FiltersEnum.DISABLED,
                },
            },
            homeState: "websites_root-home",
            fallbackStates: {
                marketresearch: "companyresearch_website_audienceOverlap",
            },
        },
        "websites-trafficOverview": {
            ...getTrafficOverviewConfig(),
            legacy: {
                digitalmarketing: "competitiveanalysis_website_overview_marketingchannels",
                marketresearch: "companyresearch_website_marketingchannels",
                salesIntelligence: "accountreview_website_marketingchannels",
            },
            fallbackStates: {
                digitalmarketing: "competitiveanalysis_website_overview_marketingchannels",
                marketresearch: "companyresearch_website_marketingchannels",
                salesIntelligence: "accountreview_website_marketingchannels",
            },
        },
        "websites-trafficReferrals": {
            parent: "websites",
            url:
                "/traffic-referrals/:key/:isWWW/:country/:duration?webSource?referralsCategory?limits?orderBy?engagementTypeFilter?IncludeTrendingReferrals?IncludeNewReferrals?ExcludeUrls?IncludeUrls",
            reset: {
                ExcludeUrls: null,
                IncludeUrls: null,
            },
            defaultQueryParams: {
                ExcludeUrls: null,
                IncludeUrls: null,
            },
            templateUrl(params) {
                return getSingleOrCompare(params, "/partials/websiteAnalysis/traffic/referrals");
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
                section: "websiteAnalysis",
                subSection: "referralTraffic",
                subSubSection: "incomingTraffic",
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
            legacy: {
                digitalmarketing: "competitiveanalysis_website_referrals_incomingtraffic",
                marketresearch: "competitiveanalysis_website_referrals_incomingtraffic",
                salesIntelligence: "accountreview_website_referrals_incomingtraffic",
            },
            fallbackStates: {
                digitalmarketing: "competitiveanalysis_website_referrals_incomingtraffic",
                marketresearch: "competitiveanalysis_website_referrals_incomingtraffic",
                salesIntelligence: "accountreview_website_referrals_incomingtraffic",
            },
            homeState: "websites_root-home",
        },
        "websites-home": {
            //temp entry point state
            parent: "websites-root",
            url: "^/website/kwhome",
            template: `<sw-react component="TrafficSearchStartPageContainer"></sw-react>`,
            configId: "TrafficSourceSearchKeyword", //todo
            pageId: {
                section: "trafficSearchHome",
                subSection: "home",
            },
            trackingId: {
                section: "trafficSearchHome",
                subSection: "home",
            },
            pageTitle: "analysis.sources.search.home.title", //todo
            skipDurationCheck: true,
            skipCountryCheck: true,
        },
        "websites-home-affiliates": {
            //temp entry point state
            parent: "websites-root",
            url: "^/website/affiliateshome",
            template: `<sw-react component="FindAffiliatesStartPage"></sw-react>`,
            configId: "IndustryAnalysisGeneral", //todo
            pageId: {
                section: "affiliateResearch",
                subSection: "home",
            },
            trackingId: {
                section: "affiliateResearch",
                subSection: "home",
            },
            pageTitle: "analysis.sources.search.home.title", //todo
            skipDurationCheck: true,
            skipCountryCheck: true,
        },
        "websites-home-mediaBuying": {
            //temp entry point state
            parent: "websites-root",
            url: "^/website/mediabyinghome",
            template: `<sw-react component="MediaBuyingStartPageContainer"></sw-react>`,
            configId: "WebAnalysis", //todo
            pageId: {
                section: "affiliateResearch",
                subSection: "home",
            },
            trackingId: {
                section: "affiliateResearch",
                subSection: "home",
            },
            pageTitle: "analysis.sources.search.home.title", //todo
            skipDurationCheck: true,
            skipCountryCheck: true,
        },
        "websites-home-findTextAds": {
            //temp entry point state
            parent: "websites-root",
            url: "^/website/findtextadshome",
            template: `<sw-react component="FindTextAdsPageContainer"></sw-react>`,
            configId: "WebAnalysis", //todo
            pageId: {
                section: "affiliateResearch",
                subSection: "home",
            },
            trackingId: {
                section: "affiliateResearch",
                subSection: "home",
            },
            pageTitle: "analysis.sources.search.home.title", //todo
            skipDurationCheck: true,
            skipCountryCheck: true,
        },
        "websites-home-mediaBuyingAdNetworks": {
            //temp entry point state
            parent: "websites-root",
            url: "^/website/mediabyingadnetworkshome",
            template: `<sw-react component="MediaBuyingAdNetworksStartPageContainer"></sw-react>`,
            configId: "WebAnalysis", //todo
            pageId: {
                section: "affiliateResearch",
                subSection: "home",
            },
            trackingId: {
                section: "affiliateResearch",
                subSection: "home",
            },
            pageTitle: "analysis.sources.search.home.title", //todo
            skipDurationCheck: true,
            skipCountryCheck: true,
        },
        "websites-home-findProductListingAds": {
            //temp entry point state
            parent: "websites-root",
            url: "^/website/findproductlistingadspagehome",
            template: `<sw-react component="FindProductListingAdsPageContainer"></sw-react>`,
            configId: "WebAnalysis", //todo
            pageId: {
                section: "affiliateResearch",
                subSection: "home",
            },
            trackingId: {
                section: "affiliateResearch",
                subSection: "home",
            },
            pageTitle: "analysis.sources.search.home.title", //todo
            skipDurationCheck: true,
            skipCountryCheck: true,
        },
        "websites-trafficSearch": {
            ...getTrafficOverviewSearch15Config(),
            legacy: {
                digitalmarketing: "competitiveanalysis_website_search",
                marketresearch: "findSearchTextAds_bycompetitor",
            },
            fallbackStates: {
                digitalmarketing: "competitiveanalysis_website_search",
                marketresearch: "findSearchTextAds_bycompetitor",
            },
        },
        "websites-trafficSocial": {
            parent: "websites",
            url:
                "/traffic-social/:key/:isWWW/:country/:duration?selectedTab?social_filters&webSource",
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
                section: "websiteAnalysis",
                subSection: "socialTraffic",
                subSubSection: "overview",
            },
            icon: "sw-icon-social",
            pageTitle: "analysis.social.overview.title2",
            isUSStatesSupported: true,
            reloadOnSearch: false,
            legacy: {
                digitalmarketing: "competitiveanalysis_website_social_overview",
                marketresearch: "competitiveanalysis_website_social_overview",
                salesIntelligence: "accountreview_website_social_overview",
            },
            fallbackStates: {
                digitalmarketing: "competitiveanalysis_website_social_overview",
                marketresearch: "competitiveanalysis_website_social_overview",
                salesIntelligence: "accountreview_website_social_overview",
            },
            homeState: "websites_root-home",
            data: {
                filtersConfig: {
                    webSource: FiltersEnum.DISABLED,
                },
            },
            defaultQueryParams: {
                webSource: "Desktop",
            },
        },
        "websites-trafficSearch-overview": {
            parent: "websites",
            url: `/traffic-search-overview/:key/:isWWW/:country/:duration?webSource?${Object.keys(
                trafficOverviewSearchParams,
            ).join(`?`)}`,
            template: `<search-tab-overview></search-tab-overview>`,
            resolve: {
                legendItems: siteInfo(),
            },
            pageId: {
                section: "website",
                subSection: "traffic",
                subSubSection: "search-overview",
            },
            trackingId: {
                section: "websiteAnalysis",
                subSection: "searchTraffic",
                subSubSection: "overview",
            },
            icon: "sw-icon-search",
            hidePageTitle: true,
            pageTitle: "competitors.search.overview.page.title",
            searchParams: ["webSource"],
            isUSStatesSupported: true,
            reloadOnSearch: true,
            data: {
                trackPageViewOnSearchUpdate: false,
            },
            childStates: ({ webSource }) => {
                return webSource === "mobileweb" ? "MobileWebSearch" : "WebAnalysis";
            },
            legacy: {
                digitalmarketing: "competitiveanalysis_website_organic_search_overview",
                marketresearch: "competitiveanalysis_website_organic_search_overview",
                salesIntelligence: "accountreview_website_search_overview",
            },
            fallbackStates: {
                digitalmarketing: "competitiveanalysis_website_organic_search_overview",
                marketresearch: "competitiveanalysis_website_organic_search_overview",
                salesIntelligence: "accountreview_website_search_overview",
            },
            homeState: "websites_root-home",
        },
        "websites-trafficSearch-adspend": {
            parent: "websites",
            url: `/traffic-search-ad-spend/:key/:isWWW/:country/:duration?webSource?`,
            template: `<sw-react component="AdSpendPage"></sw-react>`,
            resolve: {
                legendItems: siteInfo(),
            },
            configId: "AdSpend",
            isBeta: true,
            pageId: {
                section: "website",
                subSection: "traffic",
                subSubSection: "search_adspend",
            },
            trackingId: {
                section: "websiteAnalysis",
                subSection: "searchTraffic",
                subSubSection: "adspend",
            },
            defaultQueryParams: {
                webSource: "Desktop",
            },
            icon: "sw-icon-search",
            pageTitle: "competitors.search.adspend.page.title",
            pageSubtitle: "competitors.search.adspend.page.title.tooltip",
            searchParams: ["webSource"],
            pinkBadgeTitle: "sidenav.beta",
            isUSStatesSupported: false,
            reloadOnSearch: true,
            pageLayoutClassName: "sw-layout-page-max-width",
            data: {
                trackPageViewOnSearchUpdate: false,
                filtersConfig: {
                    webSource: FiltersEnum.DISABLED,
                },
            },
            homeState: "websites_root-home",
        },
        "websites-trafficSearch-keywords": {
            parent: "websites",
            url: `/traffic-search-keywords/:key/:isWWW/:country/:duration?webSource?${Object.keys(
                trafficOverviewSearchParams,
            ).join(`?`)}`,
            template: `<sw-react component="WebsiteKeywordsPage"></sw-react>`,
            resolve: {
                legendItems: siteInfo(),
            },
            pageId: {
                section: "website",
                subSection: "traffic",
                subSubSection: "search-keywords",
            },
            trackingId: {
                section: "websiteAnalysis",
                subSection: "searchTraffic",
                subSubSection: "overview",
            },
            defaultQueryParams: {
                isWWW: "*",
                webSource: "Desktop",
            },
            icon: "sw-icon-search",
            hidePageTitle: true,
            pageTitle: "competitors.search.keywords.page.title",
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
            legacy: {
                digitalmarketing: "competitiveanalysis_website_search_keyword",
                marketresearch: "findSearchTextAds_bycompetitor",
                salesIntelligence: "accountreview_website_search_keyword",
            },
            fallbackStates: {
                digitalmarketing: "competitiveanalysis_website_search_keyword",
                marketresearch: "findSearchTextAds_bycompetitor",
                salesIntelligence: "accountreview_website_search_keyword",
            },
            homeState: "websites_root-home",
        },
        "websites-trafficSearch-phrases": {
            parent: "websites",
            url: `/traffic-search-phrases/:key/:isWWW/:country/:duration?webSource?${Object.keys(
                trafficOverviewSearchParams,
            ).join(`?`)}`,
            template: `<sw-react component="Phrases" class="bordered-panel"></sw-react>`,
            resolve: {
                legendItems: siteInfo(),
            },
            pageId: {
                section: "website",
                subSection: "traffic",
                subSubSection: "search-phrases",
            },
            trackingId: {
                section: "websiteAnalysis",
                subSection: "searchTraffic",
                subSubSection: "phrases",
            },
            icon: "sw-icon-search",
            hidePageTitle: true,
            pageTitle: "competitors.search.phrases.page.title",
            searchParams: ["webSource"],
            isUSStatesSupported: true,
            reloadOnSearch: true,
            data: {
                trackPageViewOnSearchUpdate: false,
            },
            childStates: ({ webSource }) => {
                return webSource === "mobileweb" ? "MobileWebSearch" : "WebAnalysis";
            },
            legacy: {
                digitalmarketing: "competitiveanalysis_website_search_phrases",
                marketresearch: "findSearchTextAds_bycompetitor",
                salesIntelligence: "accountreview_website_search_phrases",
            },
            fallbackStates: {
                digitalmarketing: "competitiveanalysis_website_search_phrases",
                marketresearch: "findSearchTextAds_bycompetitor",
                salesIntelligence: "accountreview_website_search_phrases",
            },
            homeState: "websites_root-home",
        },
        "websites-trafficSearch-ads": {
            parent: "websites",
            url: `/traffic-search-ads/:key/:isWWW/:country/:duration?webSource?${Object.keys(
                trafficOverviewSearchParams,
            ).join(`?`)}`,
            template: `<sw-react component="PlaResearchTableWebsiteContext" props="{type: 'text'}" class="bordered-panel"></sw-react>`,
            resolve: {
                legendItems: siteInfo(),
            },
            pageId: {
                section: "website",
                subSection: "traffic",
                subSubSection: "search-ads",
            },
            trackingId: {
                section: "websiteAnalysis",
                subSection: "searchTraffic",
                subSubSection: "ads",
            },
            icon: "sw-icon-search",
            hidePageTitle: true,
            pageTitle: "competitors.search.ads.page.title",
            searchParams: ["webSource"],
            isUSStatesSupported: false,
            reloadOnSearch: true,
            data: {
                trackPageViewOnSearchUpdate: false,
            },
            childStates: ({ webSource }) => {
                return webSource === "mobileweb" ? "MobileWebSearch" : "SearchAds";
            },
            legacy: {
                digitalmarketing: "competitiveanalysis_website_search_ads",
                marketresearch: "findSearchTextAds_bycompetitor",
                salesIntelligence: "accountreview_website_search_ads",
            },
            fallbackStates: {
                digitalmarketing: "competitiveanalysis_website_search_ads",
                marketresearch: "findSearchTextAds_bycompetitor",
                salesIntelligence: "accountreview_website_search_ads",
            },
            homeState: "websites_root-home",
        },
        "websites-trafficSearch-plaResearch": {
            parent: "websites",
            url: `/traffic-search-plaResearch/:key/:isWWW/:country/:duration?webSource?${Object.keys(
                trafficOverviewSearchParams,
            ).join(`?`)}`,
            template: `<sw-react component="PlaResearchTableWebsiteContext" props="{type: 'shopping'}" class="bordered-panel"></sw-react>`,
            resolve: {
                legendItems: siteInfo(),
            },
            pageId: {
                section: "website",
                subSection: "traffic",
                subSubSection: "search-plaResearch",
            },
            trackingId: {
                section: "websiteAnalysis",
                subSection: "searchTraffic",
                subSubSection: "plaResearch",
            },
            icon: "sw-icon-search",
            hidePageTitle: true,
            pageTitle: "competitors.search.plaResearch.page.title",
            searchParams: ["webSource"],
            reloadOnSearch: true,
            data: {
                trackPageViewOnSearchUpdate: false,
            },
            isUSStatesSupported: false,
            childStates: ({ webSource }) => {
                return webSource === "mobileweb" ? "MobileWebSearch" : "ProductAds";
            },
            legacy: {
                digitalmarketing: "competitiveanalysis_website_search_plaResearch",
                marketresearch: "findSearchTextAds_bycompetitor",
                salesIntelligence: "accountreview_website_search_plaResearch",
            },
            fallbackStates: {
                digitalmarketing: "competitiveanalysis_website_search_plaResearch",
                marketresearch: "findSearchTextAds_bycompetitor",
                salesIntelligence: "accountreview_website_search_plaResearch",
            },
            homeState: "websites_root-home",
        },
        "websites-trafficDisplay": {
            legacy: {
                digitalmarketing: "competitiveanalysis_website_display",
                marketresearch: "competitiveanalysis_website_display",
                salesIntelligence: "accountreview_website_display",
            },
            fallbackStates: {
                digitalmarketing: "competitiveanalysis_website_display",
                marketresearch: "competitiveanalysis_website_display",
                salesIntelligence: "accountreview_website_display",
            },
            ...getDisplayAdsConfig(),
        },
        "websites-trafficDisplay-overview": {
            parent: "websites",
            url: "/traffic-display-overview/:key/:isWWW/:country/:duration?webSource",
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
                section: "websiteAnalysis",
                subSection: "displayTraffic",
                subSubSection: "overview",
            },
            pageTitle: "analysis.display.overview.page.title",
            pageSubtitle: "analysis.display.overview.sub.title",
            searchParams: ["webSource"],
            isUSStatesSupported: true,
            data: {
                trackPageViewOnSearchUpdate: false,
                filtersConfig: {
                    webSource: FiltersEnum.DISABLED,
                },
            },
            homeState: "websites-root.home",
            legacy: {
                digitalmarketing: "competitiveanalysis_website_display_overview",
                marketresearch: "competitiveanalysis_website_display_overview",
                salesIntelligence: "accountreview_website_display_overview",
            },
            fallbackStates: {
                digitalmarketing: "competitiveanalysis_website_display_overview",
                marketresearch: "competitiveanalysis_website_display_overview",
                salesIntelligence: "accountreview_website_display_overview",
            },
        },
        "websites-trafficDisplay-creatives": {
            parent: "websites",
            url: "/traffic-display-creatives/:key/:isWWW/:country/:duration?webSource&sort&domain",
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
                section: "websiteAnalysis",
                subSection: "displayTraffic",
                subSubSection: "creatives",
            },
            icon: "sw-icon-display-ads",
            pageTitle: "analysis.display.creatives.title",
            pageSubtitle: "analysis.display.creatives.sub.title",
            searchParams: ["webSource"],
            overrideDatepickerPreset: ["1m", "28d", "3m", "6m", "12m", "18m"],
            data: {
                trackPageViewOnSearchUpdate: false,
            },
            legacy: {
                digitalmarketing: "competitiveanalysis_website_display_creatives",
                salesIntelligence: "accountreview_website_display_creatives",
            },
            fallbackStates: {
                digitalmarketing: "competitiveanalysis_website_display_creatives",
                salesIntelligence: "accountreview_website_display_creatives",
            },
            homeState: "websites_root-home",
        },
        "websites-trafficDisplay-videos": {
            parent: "websites",
            url: "/traffic-display-videos/:key/:isWWW/:country/:duration?webSource&sort&domain",
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
                section: "websiteAnalysis",
                subSection: "displayTraffic",
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
            legacy: {
                digitalmarketing: "competitiveanalysis_website_display_creatives",
                salesIntelligence: "accountreview_website_display_creatives",
            },
            fallbackStates: {
                digitalmarketing: "competitiveanalysis_website_display_creatives",
                salesIntelligence: "accountreview_website_display_creatives",
            },
            homeState: "websites-root.home",
        },
        "websites-trafficDisplay-adNetworks": {
            parent: "websites",
            url:
                "/traffic-display-ad-networks/:key/:isWWW/:country/:duration?webSource&sort&page&adNetwork",
            template: `<sw-react component="AdNetworksContainer"></sw-react>`,
            fallbackStates: {
                digitalmarketing: "competitiveanalysis_website_display_ad_networks",
                salesIntelligence: "accountreview_website_display_ad_networks",
            },
            legacy: {
                digitalmarketing: {
                    analyzepublishers: "findadnetworks_bycompetition",
                    competitiveanalysis: "competitiveanalysis_website_display_ad_networks",
                },
                salesIntelligence: "accountreview_website_display_ad_networks",
            },
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
                section: "websiteAnalysis",
                subSection: "displayTraffic",
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
            homeState: "competitiveanalysis_home",
        },
        "websites-organicLandingPages": getOrganicLandingPagesConfig(),
        "websites-outgoing": {
            parent: "websites",
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
                section: "websiteAnalysis",
                subSection: "referralTraffic",
                subSubSection: "outgoingTraffic",
            },
            icon: "sw-icon-bounce-rate",
            pageTitle: "analysis.referrals.outgoing.title",
            isUSStatesSupported: true,
            reloadOnSearch: true,
            legacy: {
                digitalmarketing: {
                    affiliateanalysis: "affiliateanalysis_outgoinglinks",
                    analyzepublishers: "analyzepublishers_outgoinglinks",
                    competitiveanalysis: "competitiveanalysis_website_referrals_outgoingtraffic",
                },
                salesIntelligence: "accountreview_website_outgoingtraffic",
            },
            fallbackStates: {
                digitalmarketing: "competitiveanalysis_website_referrals_outgoingtraffic",
                salesIntelligence: "accountreview_website_outgoingtraffic",
            },
            homeState: "websites_root-home",
        },
        "websites-paidoutgoing": {
            parent: "websites",
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
                section: "websiteAnalysis",
                subSection: "adMonetization",
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
            legacy: {
                digitalmarketing: "analyzepublishers_monitizationnetworks",
                salesIntelligence: "accountreview_website_paidoutgoing",
            },
            fallbackStates: {
                digitalmarketing: "analyzepublishers_monitizationnetworks",
                salesIntelligence: "accountreview_website_paidoutgoing",
            },
            homeState: "websites_root-home",
            defaultQueryParams: {
                webSource: "Desktop",
            },
        },
        "websites-subdomains": {
            parent: "websites",
            url: "/content-subdomains/:key/:isWWW/:country/:duration?webSource&selectedSite",
            template: '<sw-react component="WebAnalysisSubdomainsContainer"></sw-react>',
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
            homeState: "websites_root-home",
            legacy: {
                marketresearch: "companyresearch_website_subdomains",
                salesIntelligence: "accountreview_website_subdomains",
            },
            fallbackStates: {
                marketresearch: "companyresearch_website_subdomains",
                salesIntelligence: "accountreview_website_subdomains",
            },
        },
        "websites-popular": getPopularPagesConfig(),
        "websites-folders": {
            parent: "websites",
            url: "/content-folders/:key/:isWWW/:country/:duration?webSource?selectedSite",
            templateUrl: "/app/pages/website-analysis/templates/folders.html",
            controller: "leadingFoldersCtrl as ctrl",
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
            legacy: {
                marketresearch: "companyresearch_website_folders",
            },
            fallbackStates: {
                marketresearch: "companyresearch_website_folders",
            },
            homeState: "websites_root-home",
        },
        "websites-similarsites": {
            parent: "websites",
            url:
                "/competitors-similarsites/:key/:isWWW/:country/:duration?similarsites_filters&similarsites_orderby&selectedSite",
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
            homeState: "websites_root-home",
            legacy: {
                marketresearch: "companyresearch_website_competitivelandscape",
                salesIntelligence: "accountreview_website_competitivelandscape",
            },
            fallbackStates: {
                marketresearch: "companyresearch_website_competitivelandscape",
                salesIntelligence: "accountreview_website_competitivelandscape",
            },
        },
        "websites-competitorsOrganicKeywords": {
            parent: "websites",
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
                section: "websiteAnalysis",
                subSection: "searchTraffic",
                subSubSection: "competitors",
            },
            icon: "sw-icon-search-competitors",
            pageTitle: "analysis.search.organic.competitors.title",
            pageSubtitle: "analysis.search.organic.competitors.title.tooltip",
            searchParams: ["selectedSite"],
            isVirtualSupported: false,
            isUSStatesSupported: true,
            reloadOnSearch: false,
            homeState: "websites_root-home",
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
        "websites-competitorsPaidKeywords": {
            parent: "websites",
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
                section: "websiteAnalysis",
                subSection: "searchTraffic",
                subSubSection: "competitors",
            },
            icon: "sw-icon-search-competitors",
            pageTitle: "analysis.search.paid.competitors.title",
            pageSubtitle: "analysis.search.paid.competitors.title.tooltip",
            searchParams: ["selectedSite"],
            isVirtualSupported: false,
            isUSStatesSupported: true,
            reloadOnSearch: false,
            homeState: "websites_root-home",
            legacy: {
                digitalmarketing: "competitiveanalysis_website_search_paid_competitors",
            },
            fallbackStates: {
                digitalmarketing: "competitiveanalysis_website_search_paid_competitors",
            },
            params: {
                duration: "3m",
                isWWW: "*",
                country: "999",
            },
            data: {
                filtersConfig: {
                    duration: FiltersEnum.DISABLED,
                },
            },
        },
        "websites-sneakpeekQuery": {
            parent: "websites",
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
        "websites-sneakpeekResults": {
            parent: "websites",
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
    };

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
            if (_.isFunction(getParams)) {
                proccessedParams = Injector.invoke(getParams, null, {
                    $stateParams: _.clone($stateParams),
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
    function getOrganicLandingPagesConfig() {
        return {
            parent: "websites",
            url:
                "/organic-landing-pages/:key/:isWWW/:country/:duration?webSource?pagesFilter?selectedDomain?IncludeTrendingPages?IncludeNewPages",
            template: `<sw-react component="OrganicLandingPages"></sw-react>`,
            configId: "WebsiteOrganicLandingPages",
            resolve: {
                legendItems: siteInfo(),
            },
            isBeta: true,
            pageId: {
                section: "website",
                subSection: "traffic",
                subSubSection: "organicLandingPages",
            },
            trackingId: {
                section: "websiteAnalysis",
                subSection: "searchTraffic",
                subSubSection: "organicLandingPages",
            },
            pageTitle: "analysis.search-traffic.organic.landing.pages.title",
            pageSubtitle: "analysis.search-traffic.organic.landing.pages.subtitle",
            pinkBadgeTitle: "sidenav.beta",
            pageMenuTitle: "analysis.search-traffic.organic.landing.pages.title",
            navTitle: "analysis.search-traffic.organic.landing.pages.navTitle",
            defaultQueryParams: {
                webSource: "Desktop",
                isWWW: "*",
                duration: "1m",
            },
            hideCalendar: true,
            overrideDatepickerPreset: ["1m", "3m", "6m", "12m"],
            minDurationRange: 1,
            isUSStatesSupported: true,
            data: {
                filtersConfig: {
                    webSource: FiltersEnum.DISABLED,
                },
            },
            homeState: "websites_root-home",
        };
    }

    function getTrafficOverviewConfig() {
        return {
            params: {
                comparedDuration: "",
            },
            parent: "websites",
            // The URL Is Overwritten later in file Pay attention
            url:
                // eslint-disable-next-line max-len
                "/traffic-overview/:key/:isWWW/:country/:duration?overviewTable_filters&category&webSource?channelAnalysisMtd?channelAnalysisGranularity?channelAnalysisChannel?channelAnalysisMetric",
            templateUrl: "/app/pages/website-analysis/traffic-sources/mmx/mmx.html",
            controller: "MmxPageController as ctrl",
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
            homeState: "websites_root-home",
        };
    }

    function getTrafficOverviewSearch15Config() {
        return {
            parent: "websites",
            url: `/traffic-search/:key/:isWWW/:country/:duration?webSource?selectedTab?${Object.keys(
                trafficOverviewSearchParams,
            ).join(`?`)}`,
            templateUrl: "/app/pages/website-analysis/traffic-sources/search/search.html",
            controller: "SearchPageController as ctrl",
            resolve: {
                // data: websiteResource("GetTrafficSourcesSearch", {
                //     page: 1,
                //     orderby: "Visits desc"
                // }),
                legendItems: siteInfo(),
            },
            pageId: {
                section: "website",
                subSection: "traffic",
                subSubSection: "search",
            },
            trackingId: {
                section: "websiteAnalysis",
                subSection: "searchTraffic",
                subSubSection: (params) => params.selectedTab,
            },
            icon: "sw-icon-search",
            hidePageTitle: true,
            pageTitle: "analysis.sources.search.title",
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
            homeState: "websites_root-home",
            reset: trafficOverviewSearchParams,
        };
    }

    function getDisplayAdsConfig() {
        return {
            parent: "websites",
            url:
                "/traffic-display/:key/:isWWW/:country/:duration?selectedTab&webSource&websites_filters&source",
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
                section: "websiteAnalysis",
                subSection: "displayTraffic",
                subSubSection: (params) => params.selectedTab,
            },
            icon: "sw-icon-display-ads",
            pageTitle: "analysis.sources.ads.title",
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
            homeState: "websites_root-home",
        };
    }

    function getPopularPagesConfig() {
        return {
            parent: "websites",
            url: "/content-popular/:key/:country/:duration?webSource?selectedTab&selectedSite",
            templateUrl: "/app/pages/website-analysis/templates/popular.html",
            controller: "popularPagesCtrl as ctrl",
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
            legacy: {
                marketresearch: "companyresearch_website_popular",
            },
            fallbackStates: {
                marketresearch: "companyresearch_website_popular",
            },
        };
    }

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

    const oldAudienceOverview: any = _.clone(websiteConfig["websites-audienceOverview"]);
    oldAudienceOverview.redirectTo = "websites-audienceOverview";

    // in order to make trailing space optional
    websiteConfig["websites-audienceOverview"].url =
        "/audience-overview/:key/:isWWW/:country/:duration/:comparedDuration?webSource?selectedWidgetTab&mtd";
    websiteConfig["websites-audienceOverviewOld"] = oldAudienceOverview;

    // in order to make trailing space optional
    websiteConfig["websites-trafficOverviewDuplicate"] = {
        ...websiteConfig["websites-trafficOverview"],
        redirectTo: "websites-trafficOverview",
    };
    websiteConfig["websites-trafficOverview"].url =
        // eslint-disable-next-line max-len
        "/traffic-overview/:key/:isWWW/:country/:duration/:comparedDuration?overviewTable_filters&category&webSource?channelAnalysisMtd?channelAnalysisGranularity?channelAnalysisChannel?channelAnalysisMetric";

    return websiteConfig;
}

function getSettingsFlags() {
    // put any flags you need from the settings here
    // let hasNewDisplayAdsPage = false;
    // try {
    //     hasNewDisplayAdsPage = similarweb.settings.components.TrafficSourcesDisplayAds.resources.hasNewDisplayAdsPage;
    // } catch (e) {

    //}
    return {
        //hasNewDisplayAdsPage
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

export async function fetchAndUpdateBetaBranchPrefrence() {
    try {
        const $ngRedux = Injector.get<NgRedux.INgRedux>("$ngRedux");
        const showBetaBranchData = PreferencesService.get(USE_BETA_BRANCH_DATA_PREF_KEY);
        if (showBetaBranchData) {
            $ngRedux.dispatch(betaVsLiveSwitchToggle(showBetaBranchData, false));
        }
        return true;
    } catch (e) {
        swLog.error("request userdata beta branch preference failed", e);
        return true;
    }
}

export default function getWebsiteStateConfig() {
    const settingsFlags = getSettingsFlags();
    return getWebsiteStateConfigInternal(settingsFlags);
}

export const ignoreWebsiteAnalysisParams = {
    ...trafficOverviewSearchParams,
};
