/* eslint-disable @typescript-eslint/camelcase */
import { Highcharts } from "libraries/reactHighcharts";
import { Injector } from "common/ioc/Injector";
import { FiltersEnum } from "components/filters-bar/utils";
import _ from "lodash";
import { PdfExportService } from "services/PdfExportService";
import { TechnographicsSubNav } from "pages/website-analysis/technographics/TechnographicsSubNav";
import * as React from "react";
import { DefaultFetchService } from "services/fetchService";
import queryString from "querystring";
import { apiHelper } from "common/services/apiHelper";
import swLog from "@similarweb/sw-log";
import { StateDeclaration } from "@uirouter/angularjs";
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

function websiteResource(name: string, params: any, getParams?) {
    return (s_ViewGroup, $stateParams) => {
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
                (response) => {
                    return response;
                },
                (error) => {
                    return { error };
                },
            );
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
    ranking: null,
};

const baseConfig = {
    competitiveanalysis_home: {
        parent: "digitalmarketing",
        url: "/competitiveanalysis/home",
        template: '<sw-react component="CompetitiveAnalysisHomepage"></sw-react>',
        configId: "CompetitiveAnalysisHome",
        pageId: {
            section: "digitalmarketing",
            subSection: "companyresearch",
            subSubSection: "analyzewebsites",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Competitive Analysis",
            subSubSection: "Home",
        },
        pageTitle: "digitalmarketing.competitive_analysis.homepage.title",
    },
    "competitiveanalysis-root": {
        abstract: true,
        url: "/competitiveanalysis",
        parent: "digitalmarketing",
        template: `<!-- START research layout --><div ui-view class="sw-layout-module sw-layout-no-scroll-container fadeIn"></div><!-- END research layout -->`,
    },
    competitiveanalysis_website: {
        parent: "competitiveanalysis-root",
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
};

const socialGroupConfig = {
    // V
    competitiveanalysis_website_social_overview: {
        parent: "competitiveanalysis_website",
        url: "/social/overview/:key/:isWWW/:country/:duration?selectedTab?social_filters&webSource",
        templateUrl(params) {
            return getSingleOrCompare(params, "/partials/websiteAnalysis/traffic/social");
        },
        controller: "TrafficSocialCtrl",
        fallbackStates: {
            legacy: "websites-trafficSocial",
        },
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
            section: "Digital Marketing",
            subSection: "Competitive Analysis",
            subSubSection: "socialOverview",
        },
        icon: "sw-icon-social",
        pageTitle: "analysis.social.overview.title",
        pageSubtitle: "analysis.social.overview.title.info",
        isUSStatesSupported: true,
        reloadOnSearch: false,
        homeState: "competitiveanalysis_home",
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

const displayGroupConfig = {
    // V
    competitiveanalysis_website_display: {
        parent: "competitiveanalysis_website",
        url:
            "/display/:key/:isWWW/:country/:duration?selectedTab&webSource&websites_filters&source",
        templateUrl: "/app/pages/website-analysis/traffic-sources/ads/deAds.html",
        controller: "adsCtrl as displayAdsPage",
        fallbackStates: {
            legacy: "websites-trafficDisplay",
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
            section: "Digital Marketing",
            subSection: "Competitive Analysis",
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
        homeState: "competitiveanalysis_home",
    },
    competitiveanalysis_website_display_overview: {
        parent: "competitiveanalysis_website",
        url: "/display-overview/:key/:isWWW/:country/:duration?webSource",
        template: `<sw-react component="DisplayAdsOverviewPage"></sw-react>`,
        fallbackStates: {
            legacy: "websites.trafficDisplay.overview",
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
            section: "Digital Marketing",
            subSection: "Competitive Analysis",
            subSubSection: "displayOverview",
        },
        icon: "sw-icon-display-ads",
        pageTitle: "analysis.display.overview.page.title",
        searchParams: ["webSource"],
        defaultQueryParams: {
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
        homeState: "competitiveanalysis_home",
    },
    competitiveanalysis_website_display_creatives: {
        parent: "competitiveanalysis_website",
        url: "/display-creatives/:key/:isWWW/:country/:duration?webSource&sort&domain",
        template: `<sw-react component="CreativesContainer"></sw-react>`,
        fallbackStates: {
            marketresearch: "findpublishers_bycompetition",
            legacy: "websites-trafficDisplay-creatives",
        },
        configId: "WebsiteAdsIntelDisplay",
        resolve: {
            siteInfo: siteInfo(),
        },
        overrideDatepickerPreset: ["1m", "28d", "3m", "6m", "12m", "18m"],
        pageId: {
            section: "website",
            subSection: "traffic",
            subSubSection: "display",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Competitive Analysis",
            subSubSection: "Creatives",
        },
        icon: "sw-icon-display-ads",
        pageTitle: "analysis.display.creatives.title",
        pageSubtitle: "analysis.display.creatives.sub.title",
        searchParams: ["webSource"],
        isUSStatesSupported: true,
        data: {
            trackPageViewOnSearchUpdate: false,
        },
        homeState: "competitiveanalysis_home",
    },
    competitiveanalysis_website_display_videos: {
        parent: "competitiveanalysis_website",
        url: "/display-videos/:key/:isWWW/:country/:duration?webSource&sort&domain",
        template: `<sw-react component="VideosContainer"></sw-react>`,
        fallbackStates: {
            legacy: "websites-trafficDisplay-videos",
        },
        configId: "WebsiteAdsIntelVideo",
        resolve: {
            siteInfo: siteInfo(),
        },
        overrideDatepickerPreset: ["1m", "28d", "3m", "6m", "12m", "18m"],
        pageId: {
            section: "website",
            subSection: "traffic",
            subSubSection: "display",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Competitive Analysis",
            subSubSection: "Videos",
        },
        icon: "sw-icon-display-ads",
        pageTitle: "analysis.source.ads.tabs.videos.title",
        pageSubtitle: "analysis.source.ads.tabs.videos.tooltip",
        searchParams: ["webSource"],
        data: {
            trackPageViewOnSearchUpdate: false,
        },
        homeState: "competitiveanalysis_home",
    },
    competitiveanalysis_website_display_ad_networks: {
        parent: "competitiveanalysis_website",
        url: "/display-ad-networks/:key/:isWWW/:country/:duration?webSource&sort&page&adNetwork",
        template: `<sw-react component="AdNetworksContainer"></sw-react>`,
        fallbackStates: {
            legacy: "websites-trafficDisplay-adNetworks",
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
            section: "Digital Marketing",
            subSection: "Competitive Analysis",
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
};

const referralGroupConfig = {
    // V
    competitiveanalysis_website_referrals_incomingtraffic: {
        parent: "competitiveanalysis_website",
        url:
            // eslint-disable-next-line max-len
            "/referrals/incoming-traffic/:key/:isWWW/:country/:duration?webSource?referralsCategory?limits?orderBy?engagementTypeFilter?IncludeNewReferrals?IncludeTrendingReferrals?ExcludeUrls?IncludeUrls",
        templateUrl(params) {
            return getSingleOrCompare(params, "/partials/websiteAnalysis/traffic/referrals");
        },
        fallbackStates: {
            legacy: "websites-trafficReferrals",
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
            section: "Digital Marketing",
            subSection: "Competitive Analysis",
            subSubSection: "incomingTraffic",
        },
        defaultQueryParams: {
            webSource: "Total",
            duration: "3m",
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
        pageSubtitle: "analysis.referrals.incoming.title.info",
        isUSStatesSupported: true,
        searchParams: ["webSource"],
        reloadOnSearch: false,
        data: {
            trackPageViewOnSearchUpdate: false,
        },
        homeState: "competitiveanalysis_home",
        reset: {
            ExcludeUrls: null,
            IncludeUrls: null,
        },
    },
    competitiveanalysis_website_referrals_outgoingtraffic: {
        parent: "competitiveanalysis_website",
        url:
            "/referrals/outgoing-traffic/:key/:isWWW/:country/:duration?outagoing_filters?selectedSite?outagoing_orderby",
        template: `<sw-react component="OutgoingTrafficPage"></sw-react>`,
        fallbackStates: {
            legacy: "websites-outgoing",
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
            section: "Digital Marketing",
            subSection: "Competitive Analysis",
            subSubSection: "outgoingTraffic",
        },
        icon: "sw-icon-bounce-rate",
        hidePageTitle: true,
        pageTitle: "analysis.referrals.outgoing.title",
        pageSubtitle: "analysis.referrals.outgoing.title.info",
        defaultQueryParams: {
            webSource: "Desktop",
        },
        params: {
            webSource: "Desktop",
        },
        reloadOnSearch: true,
        homeState: "competitiveanalysis_home",
    },
};

const organicSearchGroupConfig = {
    // V
    competitiveanalysis_website_organic_search_overview: {
        parent: "competitiveanalysis_website",
        url: `/organic-overview/:key/:isWWW/:country/:duration?webSource?${Object.keys(
            trafficOverviewSearchParams,
        ).join(`?`)}`,
        template: `<search-tab-overview></search-tab-overview>`,
        fallbackStates: {
            legacy: "websites-trafficSearch",
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
            section: "Digital Marketing",
            subSection: "Competitive Analysis",
            subSubSection: "overview",
        },
        defaultQueryParams: {
            webSource: "Desktop",
            duration: "3m",
        },
        icon: "sw-icon-search",
        hidePageTitle: true,
        searchParams: ["webSource"],
        pageTitle: "competitors.organic.search.overview.page.title",
        pageSubtitle: "competitors.organic.search.overview.page.title.info",
        isUSStatesSupported: true,
        reloadOnSearch: true,
        childStates: ({ webSource }) => {
            return webSource === "mobileweb" ? "MobileWebSearch" : "WebAnalysis";
        },
        data: {
            trackPageViewOnSearchUpdate: false,
        },
        homeState: "competitiveanalysis_home",
    },
    competitiveanalysis_website_search_keyword: {
        parent: "competitiveanalysis_website",
        url: `/keyword/:key/:isWWW/:country/:duration?webSource?${Object.keys(
            trafficOverviewSearchParams,
        ).join(`?`)}`,
        template: `<sw-react component="WebsiteKeywordsPage" class=sw-section-traffic-search"></sw-react>`,
        fallbackStates: {
            legacy: "websites-trafficSearch-keywords",
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
            section: "Digital Marketing",
            subSection: "Competitive Analysis",
            subSubSection: "keyword",
        },
        defaultQueryParams: {
            webSource: "Desktop",
            duration: "3m",
        },
        params: {
            isWWW: "*",
            country: "999",
            duration: "3m",
        },
        icon: "sw-icon-search",
        hidePageTitle: true,
        pageTitle: "competitors.search.keywords.page.title",
        pageSubtitle: "competitors.search.keywords.page.title.info",
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
        homeState: "competitiveanalysis_home",
        reset: trafficOverviewSearchParams,
        // decides whether to reset when replacing the main site
        resetOnMainSiteChange: true,
    },
    competitiveanalysis_website_search_phrases: {
        parent: "competitiveanalysis_website",
        url: `/phrases/:key/:isWWW/:country/:duration?webSource?${Object.keys(
            trafficOverviewSearchParams,
        ).join(`?`)}`,
        template: `<sw-react component="Phrases" class="bordered-panel"></sw-react>`,
        fallbackStates: {
            legacy: "websites-trafficSearch",
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
            section: "Digital Marketing",
            subSection: "Competitive Analysis",
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
        pageSubtitle: "competitors.search.phrases.page.title.info",
        isUSStatesSupported: true,
        reloadOnSearch: true,
        data: {
            trackPageViewOnSearchUpdate: false,
        },
        childStates: ({ webSource }) => {
            return webSource === "mobileweb" ? "MobileWebSearch" : "WebAnalysis";
        },
        homeState: "competitiveanalysis_home",
    },
    competitiveanalysis_website_search_organic_competitors: {
        parent: "competitiveanalysis_website",
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
        fallbackStates: {
            legacy: "websites-competitorsOrganicKeywords",
        },
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
            section: "Digital Marketing",
            subSection: "Competitive Analysis",
            subSubSection: "keywordCompetitors",
        },
        icon: "sw-icon-search-competitors",
        pageTitle: "analysis.search.organic.competitors.title",
        pageSubtitle: "analysis.search.organic.competitors.title.tooltip",
        searchParams: ["selectedSite"],
        isVirtualSupported: false,
        isUSStatesSupported: true,
        reloadOnSearch: false,
        homeState: "competitiveanalysis_home",
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
    competitiveanalysis_website_organiclandingpages: {
        parent: "competitiveanalysis_website",
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
            duration: "1m",
        },
        params: {
            isWWW: "*",
            country: "999",
            duration: "3m",
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
        homeState: "competitiveanalysis_home",
    },
};

const paidSearchGroupConfig = {
    // V
    competitiveanalysis_website_paid_search_overview: {
        parent: "competitiveanalysis_website",
        url: `/paid-overview/:key/:isWWW/:country/:duration?webSource?${Object.keys(
            trafficOverviewSearchParams,
        ).join(`?`)}`,
        template: `<sw-react component="PaidSearchOverview"></sw-react>`,
        fallbackStates: {
            legacy: "websites-trafficSearch",
        },
        resolve: {
            legendItems: siteInfo(),
        },
        isNew: true,
        orangeBadgeTitle: "sidenav.new",
        pageId: {
            section: "website",
            subSection: "traffic",
            subSubSection: "paid-search-overview",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Competitive Analysis",
            subSubSection: "paid-overview",
        },
        defaultQueryParams: {
            webSource: "Desktop",
            duration: "3m",
        },
        icon: "sw-icon-search",
        hidePageTitle: true,
        configId: "PaidSearchOverview",
        searchParams: ["webSource"],
        pageTitle: "competitors.paid.search.overview.page.title",
        pageSubtitle: "competitors.paid.search.overview.page.tooltip",
        isUSStatesSupported: true,
        reloadOnSearch: true,
        data: {
            trackPageViewOnSearchUpdate: false,
        },
        homeState: "competitiveanalysis_home",
    },
    competitiveanalysis_website_search_ranking_distribution: {
        parent: "competitiveanalysis_website",
        url: `/ranking-distribution/:key/:isWWW/:country/:duration?webSource?${Object.keys(
            trafficOverviewSearchParams,
        ).join(`?`)}`,
        template: `<sw-react component="RankingDistribution"></sw-react>`,
        redirectTo: (transition) => {
            // SIM-35217
            // this resolve function is used to redirect the user to the
            // country with the most ranking data, which is resolved from a backend call
            return new Promise(async (resolve, reject) => {
                const params = { ...transition.params() };
                const countryCode = Number(params.country);
                if (countryCode === 999) {
                    const filtered = Object.fromEntries(
                        Object.entries(params).filter(([key, value]) => value),
                    );
                    const paramsForApi = apiHelper.transformParamsForAPI(filtered);
                    const queryStringParams = queryString.stringify(paramsForApi);
                    const redirectResult = {
                        state: "competitiveanalysis_website_search_ranking_distribution",
                        params,
                    };
                    try {
                        const topCountryCode = await DefaultFetchService.getInstance().get(
                            `/api/RankDistribution/TopCountry?${queryStringParams}`,
                        );
                        redirectResult.params.country = topCountryCode;
                        resolve(redirectResult);
                    } catch (e) {
                        swLog.error(e);
                        resolve(true);
                    } finally {
                    }
                } else {
                    resolve(true);
                }
            });
        },
        resolve: {
            legendItems: siteInfo(),
        },
        isBeta: true,
        pinkBadgeTitle: "sidenav.beta",
        pageId: {
            section: "website",
            subSection: "traffic",
            subSubSection: "search-ranknig-distribution",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Competitive Analysis",
            subSubSection: "Ranking Distribution",
        },
        defaultQueryParams: {
            webSource: "Desktop",
        },
        icon: "sw-icon-search",
        hidePageTitle: true,
        searchParams: ["webSource"],
        pageTitle: "competitors.search.ranking.distribution.page.title",
        pageSubtitle: "competitors.search.ranking.distribution.page.subtitle",
        isUSStatesSupported: true,
        reloadOnSearch: false,
        data: {
            trackPageViewOnSearchUpdate: false,
        },
        configId: "RankingDistribution",
        homeState: "competitiveanalysis_home",
        reset: trafficOverviewSearchParams,
        // decides whether to reset when replacing the main site
        resetOnMainSiteChange: true,
    },
    competitiveanalysis_website_search_ads: {
        parent: "competitiveanalysis_website",
        url: `/ads/:key/:isWWW/:country/:duration?webSource?${Object.keys(
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
            subSubSection: "search-ads",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Competitive Analysis",
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
        pageSubtitle: "competitors.search.ads.page.title.info",
        reloadOnSearch: true,
        isUSStatesSupported: false,
        data: {
            trackPageViewOnSearchUpdate: false,
        },
        childStates: ({ webSource }) => {
            return webSource === "mobileweb" ? "MobileWebSearch" : "SearchAds";
        },
        homeState: "competitiveanalysis_home",
        params: {
            isWWW: "*",
            country: "999",
            duration: "3m",
        },
    },
    competitiveanalysis_website_search_plaResearch: {
        parent: "competitiveanalysis_website",
        url: `/plaResearch/:key/:isWWW/:country/:duration?webSource?${Object.keys(
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
            subSubSection: "search-plaResearch",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Competitive Analysis",
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
        pageSubtitle: "competitors.search.plaResearch.page.title.info",
        isUSStatesSupported: false,
        reloadOnSearch: true,
        data: {
            trackPageViewOnSearchUpdate: false,
        },
        childStates: ({ webSource }) => {
            return webSource === "mobileweb" ? "MobileWebSearch" : "ProductAds";
        },
        homeState: "competitiveanalysis_home",
        reset: trafficOverviewSearchParams,
    },
    competitiveanalysis_website_search_paid_competitors: {
        parent: "competitiveanalysis_website",
        url:
            "/search/competitors-paid-keywords/:key/:isWWW/:country/:duration?webSource&orderby?selectedSite?websiteType?paidSearchType?risingCompetitors?newCompetitors?category?search",
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
        fallbackStates: {
            legacy: "websites-competitorsPaidKeywords",
        },
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
            section: "Digital Marketing",
            subSection: "Competitive Analysis",
            subSubSection: "keywordCompetitors",
        },
        icon: "sw-icon-search-competitors",
        pageTitle: "analysis.search.paid.competitors.title",
        pageSubtitle: "analysis.search.paid.competitors.title.tooltip",
        searchParams: ["selectedSite"],
        isVirtualSupported: false,
        isUSStatesSupported: true,
        reloadOnSearch: false,
        homeState: "competitiveanalysis_home",
        params: {
            duration: "3m",
            isWWW: "*",
        },
        data: {
            filtersConfig: {
                duration: FiltersEnum.DISABLED,
            },
        },
    },
};

const overviewGroupConfig = {
    // V
    competitiveanalysis_website_overview_websiteperformance: {
        params: {
            isWWW: "*",
            country: "999",
            duration: "3m",
        },
        fallbackStates: {
            marketresearch: "companyresearch_website_websiteperformance",
            legacy: "websites-worldwideOverview",
        },
        parent: "competitiveanalysis_website",
        url: "/overview/website-performance/:key/:isWWW/:country/:duration?webSource",
        templateUrl(params) {
            if (params.key.split(",").length > 1) {
                return "/app/pages/website-analysis/templates/competitiveAnalysis-WorldwideOverview-compare.html";
            } else {
                return "/app/pages/website-analysis/templates/competitiveAnalysisWorldwideOverview.html";
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
            section: "Digital Marketing",
            subSection: "Competitive Analysis",
            subSubSection: "websitePerformance",
        },
        icon: "sw-icon-overview",
        pageTitle: "analysis.overview.performance.title",
        pageSubtitle: "analysis.overview.performance.title.info",
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
        homeState: "competitiveanalysis_home",
    },
    // V
    competitiveanalysis_website_overview_marketingchannels: {
        parent: "competitiveanalysis_website",
        fallbackStates: {
            marketresearch: "companyresearch_website_marketingchannels",
            legacy: "websites-trafficOverview",
        },
        params: {
            comparedDuration: "",
        },
        // The URL Is Overwritten later in file Pay attention
        url:
            "/overview/marketing-channels/:key/:isWWW/:country/:duration/:comparedDuration?overviewTable_filters&category&webSource?channelAnalysisMtd?channelAnalysisGranularity?channelAnalysisChannel?channelAnalysisMetric",
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
            section: "Digital Marketing",
            subSection: "Competitive Analysis",
            subSubSection: "marketingChannels",
        },
        icon: "sw-icon-overview",
        pageTitle: "analysis.traffic.marketing.channels.title",
        pageSubtitle: "analysis.traffic.marketing.channels.title.info",
        pageMenuTitle: "analysis.traffic.marketing.channels.title",
        navTitle: "analysis.sources.mmx.navTitle",
        isUSStatesSupported: true,
        hidePageTitle: true,
        reloadOnSearch: false,
        defaultQueryParams: {
            category: "no-category",
            webSource: "Desktop",
        },
        childStates: {
            desktop: {
                configId: "MarketingMixComparePeriodOverPeriod",
            },
            mobileweb: {
                configId: "MarketingMixMobile",
            },
        },
        homeState: "competitiveanalysis_home",
    },
    competitiveanalysis_websites_technographicsOverview: {
        parent: "competitiveanalysis_website",
        url: "/technologies-overview/:key/:isWWW?category",
        template: `<div ng-if="ctrl.technographicsRoot" sw-react component="ctrl.technographicsRoot"></div>`,
        controller: "technographicsCtrl as ctrl",
        periodOverPeriodEnabled: false,
        configId: "WebTechnographics",
        pageId: {
            section: "Digital Marketing",
            subSection: "Competitive Analysis",
            subSubSection: "technographics",
        },
        trackingId: {
            section: "Digital Marketing",

            subSection: "Competitive Analysis",
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
            <TechnographicsSubNav numberOfComparedItems={numberOfComparedItems} homeUrl={homeUrl} />
        ),
        hidePageTitle: true,
        reloadOnSearch: false,
        isUSStatesSupported: false,
        skipDurationCheck: true,
        skipCountryCheck: true,
        homeState: "competitiveanalysis_home",
    },
};

export const competitiveAnalysisConfig = {
    ...baseConfig,
    ...overviewGroupConfig,
    ...organicSearchGroupConfig,
    ...paidSearchGroupConfig,
    ...referralGroupConfig,
    ...displayGroupConfig,
    ...socialGroupConfig,
};
