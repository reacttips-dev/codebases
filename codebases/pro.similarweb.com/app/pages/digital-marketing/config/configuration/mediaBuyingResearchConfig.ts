/* eslint-disable @typescript-eslint/camelcase */
import { AssetsService } from "services/AssetsService";
import { FiltersEnum } from "components/filters-bar/utils";
import { Highcharts } from "libraries/reactHighcharts";
import { Injector } from "common/ioc/Injector";
import _ from "lodash";
import { PdfExportService } from "services/PdfExportService";

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

const findPublishersConfig = {
    findpublishers_home: {
        parent: "digitalmarketing",
        url: "/mediabuyingresearch/findpublishers/home",
        template: `<sw-react component="MediaBuyingStartPageContainer"></sw-react>`,
        configId: "FindPublishersHome",
        pageId: {
            section: "digitalmarketing",
            subSection: "mediabuyingresearch",
            subsubsection: "home",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Media Buying Research",
            subsubsection: "Find_Publishers/Home",
        },
        pageTitle: "digitalmarketing.mediabuyingresearch.homepage.title",
    },
    findpublishers_bycompetition_root: {
        abstract: true,
        parent: "digitalmarketing_root",
        url: "/findpublishers",
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
    findpublishers_bycompetition: {
        params: {
            isWWW: "",
            country: "999",
            duration: "3m",
        },
        parent: "findpublishers_bycompetition_root",
        url:
            "/bycompetition/:key/:isWWW/:country/:duration?selectedTab&webSource&websites_filters&source",
        templateUrl: "/app/pages/digital-marketing/find-publishers/publishers.html",
        controller: "adsCtrl as displayAdsPage",
        fallbackStates: {
            legacy: "websites-trafficDisplay",
        },
        configId: (toState, toParams) => {
            if (toParams) {
                if (toParams.selectedTab === "videos") {
                    return "WebsiteAdsIntelVideo";
                }
                if (toParams.selectedTab === "creatives") {
                    return "WebsiteAdsIntelDisplay";
                }
            }
            return "WebAnalysis";
        },
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
            subSection: "Media Buying Research",
            subSubSection: "Find_Publishers/Competition",
        },
        icon: "sw-icon-display-ads",
        pageTitle: "analysis.display.publishers.title",
        pageSubtitle: "analysis.display.publishers.title.info",
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
        homeState: "findpublishers_home",
    },
    findpublishers_byindustry_root: {
        abstract: true,
        parent: "digitalmarketing",
        url: "/findpublishers",
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
    findpublishers_byindustry: {
        params: {
            duration: "3m",
            category: { type: "string", raw: true },
        },
        parent: "findpublishers_byindustry_root",
        url:
            "/byindustry/:category/:country/:duration?webSource?selectedCategory?selectedSourceType?searchValue",
        template: '<sw-react component="TrafficSourcesOverviewTable"></sw-react>',
        configId: "IndustryAnalysisGeneral",
        pageId: {
            section: "industryAnalysis",
            subSection: "traffic",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Media Buying Research",
            subSubSection: "Find_Publishers/Industry",
        },
        icon: "sw-icon-traffic-sources",
        filters: {
            duration: true,
            country: true,
            category: true,
        },
        notPermittedConfig: {
            image: AssetsService.assetUrl("images/IATrafficSources.png"),
            description: "ia.trafficsources.desc",
        },
        clearSearch: true,
        reloadOnSearch: true,
        pageTitle: "find.publishers.by.industry.page.title",
        pageSubtitle: "find.publishers.by.industry.page.title.info",
        defaultQueryParams: {
            webSource: "Desktop",
        },
        data: {
            filtersConfig: {
                webSource: FiltersEnum.DISABLED,
            },
        },
        homeState: "findpublishers_home",
    },
};

const findAdNetwordsConfig = {
    findadnetworks_home: {
        parent: "digitalmarketing",
        url: "/mediabuyingresearch/findadnetworks/home",
        template: '<sw-react component="MediaBuyingAdNetworksStartPageContainer"></sw-react>',
        configId: "FindAdNetworksHome",
        pageId: {
            section: "digitalmarketing",
            subSection: "mediabuyingresearch",
            subsubsection: "home",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Media Buying Research",
            subsubsection: "Find_AdNetworks/Home",
        },
        pageTitle: "digitalmarketing.mediabuyingresearch.adnetworks.homepage.title",
        skipDurationCheck: true,
        skipCountryCheck: true,
    },
    findadnetworks_byindustry_root: {
        abstract: true,
        parent: "digitalmarketing",
        url: "/findadnetworks",
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
    findadnetworks_byindustry: {
        params: {
            duration: "3m",
            category: { type: "string", raw: true },
        },
        parent: "findadnetworks_byindustry_root",
        url:
            "/byindustry/:category/:country/:duration?webSource?selectedCategory?selectedSourceType?searchValue?orderBy",
        template: '<sw-react component="FindAdNetworksByIndustryTable"></sw-react>',
        configId: "IndustryAnalysisGeneral",
        pageId: {
            section: "industryAnalysis",
            subSection: "traffic",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Media Buying Research",
            subSubSection: "Find_AdNetworks/Industry",
        },
        icon: "sw-icon-traffic-sources",
        filters: {
            duration: true,
            country: true,
            category: true,
        },
        notPermittedConfig: {
            image: AssetsService.assetUrl("images/IATrafficSources.png"),
            description: "ia.trafficsources.desc",
        },
        clearSearch: true,
        reloadOnSearch: true,
        pageTitle: "find.ad.networks.by.industry.page.title",
        pageSubtitle: "find.ad.networks.by.industry.page.title.info",
        defaultQueryParams: {
            webSource: "Desktop",
        },
        data: {
            filtersConfig: {
                webSource: FiltersEnum.DISABLED,
            },
        },
        homeState: "findadnetworks_home",
    },
    findadnetworks_bycompetition_root: {
        abstract: true,
        parent: "digitalmarketing_root",
        url: "/findadnetworks",
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
    findadnetworks_bycompetition: {
        params: {
            isWWW: "",
            country: "999",
            duration: "3m",
        },
        parent: "findadnetworks_bycompetition_root",
        url:
            "/bycompetition/:key/:isWWW/:country/:duration?selectedTab&webSource&sort&page&adNetwork",
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
            subSection: "Media Buying Research",
            subSubSection: "Find_AdNetworks/Competition",
        },
        icon: "sw-icon-display-ads",
        pageTitle: "find.ad.networks.page.title",
        pageSubtitle: "find.ad.networks.page.title.info",
        searchParams: ["selectedTab", "webSource"],
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
        homeState: "findadnetworks_home",
    },
};

const analyzePublishersConfig = {
    analyzepublishers_home: {
        parent: "digitalmarketing",
        url: "/mediabuyingresearch/analyzepublishers/home",
        template: '<sw-react component="MediaBuyingResearchAnalyzePublisherHomepage"></sw-react>',
        configId: "PublishersAnalysisHome",
        pageId: {
            section: "digitalmarketing",
            subSection: "mediabuyingresearch",
            subsubsection: "home",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Media Buying Research",
            subsubsection: "Analyze_Publishers/Home",
        },
        pageTitle: "digitalmarketing.mediabuyingresearch.analyze_publishers.homepage.title",
        skipDurationCheck: true,
        skipCountryCheck: true,
    },
    analyzepublishers_root: {
        parent: "digitalmarketing_root",
        url: "/analyzepublishers",
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
    analyzepublishers_performanceoverview: {
        parent: "analyzepublishers_root",
        url: "/overview/:key/:isWWW/:country/:duration?webSource",
        templateUrl(params) {
            if (params.key.split(",").length > 1) {
                return "/app/pages/website-analysis/templates/worldwideOverview-compare.html";
            } else {
                return "/app/pages/website-analysis/templates/worldwideOverview.html";
            }
        },
        controller: "worldwideOverviewCtrl as ctrl",
        fallbackStates: {
            marketresearch: "companyresearch_website_websiteperformance",
            legacy: "websites-worldwideOverview",
        },
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
            section: "Digital Marketing",
            subSection: "Media Buying Research",
            subSubSection: "Analyze_Publishers/Overview",
        },
        icon: "sw-icon-overview",
        pageTitle: "analysis.overview.performance.title",
        pageSubtitle: "publishers.analysis.overview.performance.title.info",
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
        homeState: "analyzepublishers_home",
    },
    analyzepublishers_monitizationnetworks: {
        parent: "analyzepublishers_root",
        url:
            "/monitizationnetworks/:key/:isWWW/:country/:duration?selectedTab?advertisers_filters?AdNetwork_filters",
        templateUrl: "/partials/websiteAnalysis/traffic/paidoutgoing.html",
        controller: "TrafficDestinationPaidOutgoingCtrl",
        fallbackStates: {
            legacy: "websites-paidoutgoing",
        },
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
            section: "Digital Marketing",
            subSection: "Media Buying Research",
            subSubSection: "Analyze_Publishers/monetizationNetworks",
        },
        icon: "sw-icon-paid-outgoing",
        pageTitle: "analysis.display.user_acquisition.title",
        pageSubtitle: "analysis.display.user_acquisition.title.info",
        hidePageTitle: true,
        searchParams: ["selectedTab"],
        isUSStatesSupported: true,
        reloadOnSearch: false,
        data: {
            trackPageViewOnSearchUpdate: false,
        },
        homeState: "analyzepublishers_home",
    },
    analyzepublishers_advertisers: {
        parent: "analyzepublishers_root",
        url:
            "/advertisers/:key/:isWWW/:country/:duration?selectedTab?advertisers_filters?AdNetwork_filters",
        templateUrl: "/partials/websiteAnalysis/traffic/paidoutgoing.html",
        controller: "TrafficDestinationPaidOutgoingCtrl",
        fallbackStates: {
            legacy: "websites-paidoutgoing",
            salesIntelligence: "accountreview_website_paidoutgoing",
        },
        legacy: {
            salesIntelligence: "accountreview_website_paidoutgoing",
        },
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
            section: "Digital Marketing",
            subSection: "Media Buying Research",
            subSubSection: "Analyze_Publishers/Advertisers",
        },
        icon: "sw-icon-paid-outgoing",
        pageTitle: "digitalmarketing.mediabuyingresearch.advertisers.title",
        pageSubtitle: "digitalmarketing.mediabuyingresearch.advertisers.title.info",
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
        defaultQueryParams: {
            selectedTab: "advertisers",
            webSource: "Desktop",
        },
        homeState: "analyzepublishers_home",
    },
    analyzepublishers_outgoinglinks: {
        parent: "analyzepublishers_root",
        url:
            "/outgoing-links/:key/:isWWW/:country/:duration?outagoing_filters?selectedSite?outagoing_orderby",
        template: `<sw-react component="OutgoingTrafficPage"></sw-react>`,
        fallbackStates: {
            legacy: "websites-outgoing",
        },
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
            section: "Digital Marketing",
            subSection: "Media Buying Research",
            subSubSection: "Analyze_Publishers/outgoingTraffic",
        },
        trackingId: {
            section: "websiteAnalysis",
            subSection: "referralTraffic",
            subSubSection: "outgoingTraffic",
        },
        icon: "sw-icon-bounce-rate",
        pageTitle: "analysis.referrals.outgoing.title",
        pageSubtitle: "publishers.analysis.referrals.outgoing.title.info",
        isUSStatesSupported: true,
        reloadOnSearch: true,
        homeState: "analyzepublishers_home",
    },
};

export const mediaBuyingResearchConfig = {
    ...analyzePublishersConfig,
    ...findPublishersConfig,
    ...findAdNetwordsConfig,
};
