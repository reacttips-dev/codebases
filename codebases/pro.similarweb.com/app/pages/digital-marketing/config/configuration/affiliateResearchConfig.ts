/* eslint-disable @typescript-eslint/camelcase */
import { Highcharts } from "libraries/reactHighcharts";
import { FiltersEnum } from "components/filters-bar/utils";
import { AssetsService } from "services/AssetsService";
import { marketingWorkspaceApiService } from "services/marketingWorkspaceApiService";
import { PdfExportService } from "services/PdfExportService";
import { UserCustomCategoryService } from "services/category/userCustomCategoryService";

function getSingleOrCompare(params, path): string {
    const key = params.key.split(",");
    if (key.length <= 1) {
        return path + "/single.html";
    } else {
        return path + "/compare.html";
    }
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

const findAffiliatesConfig = {
    findaffiliates_home: {
        parent: "digitalmarketing",
        url: "/findaffiliates/home",
        template: `<sw-react component="FindAffiliatesStartPage"></sw-react>`,
        configId: "FindAffiliatesHome",
        pageId: {
            section: "digitalmarketing",
            subSection: "findaffiliates",
            subsubsection: "home",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Affiliate Research",
            subsubsection: "Find_Affiliates/Home",
        },
        pageTitle: "digitalmarketing.affiliateresearch.find_affiliates.homepage.title",
        skipDurationCheck: true,
        skipCountryCheck: true,
    },
    findaffiliate_root: {
        abstract: true,
        parent: "digitalmarketing",
        url: "/findaffiliates",
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
    findaffiliates_bycompetition_homepage: {
        parent: "digitalmarketing",
        configId: "FindAffiliatesHome",
        url: "/findaffiliates/bycompetition",
        template: `<sw-react component="FindAffiliateByCompetitionHomePageContainer"></sw-react>`,
        pageId: {
            section: "Digital Marketing",
            subSection: "Affiliate Research",
            subSubSection: "Find_Affiliates/Competition",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Affiliate Research",
            subSubSection: "Find_Affiliates/Competition",
        },
        pageTitle: "findaffiliates.bycompetition.title",
        pageSubtitle: "findaffiliates.bycompetition.title.info",
        skipDurationCheck: true,
        skipCountryCheck: true,
    },
    findaffiliates_bycompetition: {
        parent: "findaffiliate_root",
        url:
            "/bycompetition/:key/:isWWW/:country/:duration?webSource?referralsCategory?limits?orderBy?engagementTypeFilter?IncludeTrendingReferrals?IncludeNewReferrals?ExcludeUrls?IncludeUrls",
        templateUrl(params) {
            return getSingleOrCompare(params, "/partials/affiliates/bycompetition");
        },
        resolve: {
            legendItems: siteInfo(),
        },
        fallbackStates: {
            marketresearch: "competitiveanalysis_website_referrals_incomingtraffic",
            legacy: "websites-trafficReferrals",
        },
        pageId: {
            section: "website",
            subSection: "traffic",
            subSubSection: "referrals",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Affiliate Research",
            subSubSection: "Find_Affiliates/Competition",
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
        defaultQueryParams: {
            limits: "ReferralOpportunities",
            ExcludeUrls: null,
            IncludeUrls: null,
        },
        hidePageTitle: true,
        pageTitle: "affiliates.research.competition",
        isUSStatesSupported: true,
        searchParams: ["webSource"],
        reloadOnSearch: false,
        data: {
            trackPageViewOnSearchUpdate: false,
        },
        homeState: "findaffiliates_bycompetition_homepage",
        reset: {
            ExcludeUrls: null,
            IncludeUrls: null,
        },
    },
    finaaffiliate_byindustry_root: {
        abstract: true,
        parent: "digitalmarketing",
        url: "/findaffiliates",
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
    findaffiliates_byindustry_homepage: {
        parent: "digitalmarketing",
        configId: "FindAffiliatesHome",
        url: "/findaffiliates/byindustry",
        template: `<sw-react component="FindAffiliateByIndustryHomePageContainer"></sw-react>`,
        pageId: {
            section: "Digital Marketing",
            subSection: "Affiliate Research",
            subSubSection: "Find_Affiliates/Industry",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Affiliate Research",
            subSubSection: "Find_Affiliates/Industry",
        },
        skipDurationCheck: true,
        skipCountryCheck: true,
        pageTitle: "findaffiliates.byindustry.title",
    },
    findaffiliates_byindustry: {
        parent: "finaaffiliate_byindustry_root",
        params: {
            category: { type: "string", raw: true },
        },
        url:
            "/byindustry/:category/:country/:duration?webSource?selectedCategory?searchValue?funcFlag",
        template: '<sw-react component="FindAffiliateByIndustryOverview"></sw-react>',
        configId: "IndustryAnalysisGeneral",
        pageId: {
            section: "industryAnalysis",
            subSection: "traffic",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Affiliate Research",
            subSubSection: "Find_Affiliates/Industry",
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
        pageTitle: "affiliate.research.find.affiliate.by.industry.page.title",
        pageSubtitle: "affiliate.research.find.affiliate.by.industry.page.subtitle",
        defaultQueryParams: {
            webSource: "Desktop",
        },
        data: {
            filtersConfig: {
                webSource: FiltersEnum.DISABLED,
            },
        },
        overrideDatepickerPreset: ["3m", "1m", "28d", "6m", "12m"],
        hideCalendar: true,
        homeState: "findaffiliates_byindustry_homepage",
    },
    findaffiliates_bykeywords_root: {
        abstract: true,
        parent: "digitalmarketing",
        url: "/findaffiliates",
        templateUrl:
            "/app/pages/digital-marketing/find-affiliate/by-keywords/findAffiliateByKeywordsTemplate.html",
        configId: "KeywordAnalysis",
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
            section: "Digital Marketing",
            subSection: "Affiliate Research",
            subSubSection: "Find_Affiliates/Keyword",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Affiliate Research",
            subSubSection: "Find_Affiliates/Keyword",
        },
    },
    findaffiliates_bykeywords_homepage: {
        parent: "digitalmarketing",
        configId: "FindAffiliatesHome",
        url: "/findaffiliates/bykeywords",
        template: `<sw-react component="FindAffiliateByKeywordsHomePageContainer"></sw-react>`,
        pageId: {
            section: "Digital Marketing",
            subSection: "Affiliate Research",
            subSubSection: "Find_Affiliates/Keyword",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Affiliate Research",
            subSubSection: "Find_Affiliates/Keyword",
        },
        pageTitle: "findaffiliates.bykeywords.title",
        pageSubtitle: "findaffiliates.bykeywords.title.info",
        skipDurationCheck: true,
        skipCountryCheck: true,
    },
    findaffiliates_bykeywords: {
        parent: "findaffiliates_bykeywords_root",
        url:
            "/bykeywords/:country/:duration/:keyword?webSource?search?orderBy?category?websiteType",
        template: '<sw-react component="FindAffiliateByKeywordsTable"></sw-react>',
        configId: "PartnerOpportunitiesbasedonKeywords",
        pageId: {
            section: "Digital Marketing",
            subSection: "Affiliate Research",
            subSubSection: "Find_Affiliates/Keyword",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Affiliate Research",
            subSubSection: "Find_Affiliates/Keyword",
        },
        reloadOnSearch: true,
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
        hideCalendar: true,
        overrideDatepickerPreset: ["3m", "1m"],
        pageTitle:
            "aquisitionintelligence.affiliateresearch.findaffiliates.byopportunities.homepage.title",
        defaultQueryParams: {
            webSource: "Desktop",
            duration: "3m",
        },
        data: {
            filtersConfig: {
                webSource: FiltersEnum.DISABLED,
            },
        },
        homeState: "findaffiliates_bykeywords_homepage",
    },
};

const affiliateAnalysis = {
    affiliateanalysis_home: {
        parent: "digitalmarketing",
        url: "/affiliateanalysis/home",
        template: '<sw-react component="AffiliateResearchAnalyzeAffiliateHomepage"></sw-react>',
        configId: "AffiliateAnalysisHome",
        pageId: {
            section: "digitalmarketing",
            subSection: "findaffiliates",
            subsubsection: "home",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Affiliate Research",
            subsubsection: "Affiliate_Analysis/Home",
        },
        pageTitle: "digitalmarketing.affiliateresearch.analyze_affiliates.homepage.title",
    },
    affiliateanalysis: {
        abstract: true,
        parent: "sw",
        template: `<!-- START research layout --><div ui-view class="sw-layout-module sw-layout-no-scroll-container fadeIn"></div><!-- END research layout -->`,
    },
    affiliateanalysis_root: {
        parent: "digitalmarketing",
        url: "/affiliateanalysis",
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
    affiliateanalysis_performanceoverview: {
        parent: "affiliateanalysis_root",
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
            marketresearch: "competitiveanalysis_website_referrals_incomingtraffic",
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
            section: "Digital Marketing",
            subSection: "Affiliate Research",
            subSubSection: "Affiliate_Analysis/websiteOverview",
        },
        icon: "sw-icon-overview",
        pageTitle: "analysis.overview.performance.title",
        pageSubtitle: "affiliate.analysis.overview.performance.title.info",
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
        homeState: "affiliateanalysis_home",
    },
    affiliateanalysis_outgoinglinks: {
        parent: "affiliateanalysis_root",
        url:
            "/outgoing-links/:key/:isWWW/:country/:duration?outagoing_filters?selectedSite?outagoing_orderby",
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
            section: "Digital Marketing",
            subSection: "Affiliate Research",
            subSubSection: "Affiliate_Analysis/outgoingTraffic",
        },
        icon: "sw-icon-bounce-rate",
        pageTitle: "analysis.referrals.outgoing.title",
        pageSubtitle: "affiliates.analysis.referrals.outgoing.title.info",
        isUSStatesSupported: true,
        reloadOnSearch: true,
        homeState: "affiliateanalysis_home",
        fallbackStates: {
            legacy: "websites-outgoing",
        },
    },
    affiliateanalysis_similarsites: {
        parent: "affiliateanalysis_root",
        url:
            "/similar-sites/:key/:isWWW/:country/:duration?similarsites_filters&similarsites_orderby&selectedSite",
        template: `<sw-react component="CompetitiveLandscapePage"></sw-react>`,
        resolve: {
            siteInfo: siteInfo(),
        },
        fallbackStates: {
            legacy: "websites-similarsites",
        },
        pageId: {
            section: "marketing",
            subSection: "affiliates",
            subSubSection: "similarsites",
        },
        trackingId: {
            section: "marketing",
            subSection: "affiliates",
            subSubSection: "similarsites",
        },
        icon: "sw-icon-similarsites",
        pageTitle: "affiliateresearch.affiliateanalysis.similarsites",
        pageSubtitle: "affiliateresearch.affiliateanalysis.similarsites.info",
        isVirtualSupported: false,
        isUSStatesSupported: true,
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
        homeState: "affiliateanalysis_home",
    },
};

const monitorPartnersConfig = {
    monitorpartners_home: {
        parent: "digitalmarketing",
        url: "/monitorpartners/home",
        template: `<sw-react component="MonitorPartnersStartPageContainer"></sw-react>`,
        configId: "FindAffiliatesHome",
        pageId: {
            section: "digitalmarketing",
            subSection: "affiliateresearch",
            subsubsection: "Monitor_Partners/home",
        },
        trackingId: {
            section: "Digital Marketing",
            subSection: "Affiliate Research",
            subsubsection: "Monitor_Partners_Homepage",
        },
        pageTitle: "digitalmarketing.affiliateresearch.monitor_partners.homepage.title",
        skipDurationCheck: true,
        skipCountryCheck: true,
    },
    monitorpartners_root: {
        abstract: true,
        parent: "digitalmarketing",
        templateUrl:
            "/app/pages/digital-marketing/monitor-lists/partners/MonitorPartnersTemplate.html",
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
                    const userPartners = UserCustomCategoryService.getCustomCategoriesRecords();
                    const selectedItem = userPartners.find(
                        (item) => item.id === props.partnerListId,
                    );
                    const queryProps = { userPartners, id: props.partnerListId };
                    return queryProps;
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
    },
    monitorpartners: {
        parent: "monitorpartners_root",
        url: "/findkeywords/websiteGroup/:partnerListId/:duration/:country/:webSource?sites?isWWW",
        template: '<sw-react component="MonitorPartnersPage"></sw-react>',
        trackingId: {
            section: "Digital Marketing",
            subSection: "Affiliate Research",
            subSubSection: "Monitor_partners_List",
        },
        pageId: {
            section: "Digital Marketing",
            subSection: "Affiliate Research",
            subSubSection: "Monitor_partners_List",
        },
        data: {
            getCustomUrlType: () => {
                return "Digital Marketing - Keywords";
            },
        },
        pageTitle: "digitalmarketing.affiliateresearch.monitor_partners.page.title",
        reloadOnSearch: true,
        homeState: "monitorpartners_home",
    },
};

export const affiliateResearchConfig = {
    ...findAffiliatesConfig,
    ...affiliateAnalysis,
    ...monitorPartnersConfig,
};
