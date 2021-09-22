import angular from "angular";
import * as _ from "lodash";
import { swSettings } from "../../scripts/common/services/swSettings";
import { chosenItems } from "../../scripts/common/services/chosenItems";
import { apiHelper } from "../../scripts/common/services/apiHelper";
import { SwTrack } from "../services/SwTrack";
import { AppsResourceService } from "../services/AppsResourceService";
import { KeywordsResource } from "../../scripts/common/resources/keywordsResource";
import { AppInfoService } from "../../scripts/common/services/appInfoService";

angular.module("sw.common").constant(
    "appAnalysisConfig",
    (function () {
        /**
         * resolver
         */
        const appInfoResolver = [
            "$stateParams",
            "$filter",
            function ($stateParams, $filter) {
                let params = apiHelper.transformParamsForAPI($stateParams);
                params = _.pick(params, ["appId", "store"]);
                return AppInfoService.getInfo(params.appId, params.store).then(function (data) {
                    const apps = params.appId.split(","),
                        mainAppId = apps.shift(),
                        mainApp = data[mainAppId] || null,
                        tail = [];
                    if (chosenItems.$first().$set) {
                        chosenItems.$first().$set(mainApp);
                    }
                    apps.forEach(function (appId) {
                        tail.push(data[appId]);
                    });
                    chosenItems.$tail(tail);
                    // because similarApps API only works with one app ID
                    params.appId = mainAppId;
                    AppsResourceService.similarApps(params, function (data) {
                        chosenItems.similarApps = data.slice(0, 5);
                    });
                    document.title =
                        mainApp != null
                            ? $filter("i18n")("titleTag.mobileapps.analysis", {
                                  app: mainApp.Title,
                              })
                            : "";

                    return data;
                });
            },
        ];

        const appsConfig = {
            "apps-root": {
                abstract: true,
                parent: "research",
                configId: "AppAnalysis",
                templateUrl: "/app/pages/market-research/root.html",
                secondaryBarType: "AppResearch",
                packageName: "legacy",
            },
            apps: {
                abstract: true,
                parent: "research",
                url: "/apps",
                menuId: "apps",
                templateUrl: "/partials/apps/navigation.html",
                controller: "appsNavigationCtrl",
                configId: "AppAnalysis",
                data: {
                    menuId: "apps",
                    menuKbItems: function (state) {
                        let section;
                        if (state.name == "apps-ranking") {
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
                secondaryBarType: "AppResearch",
                packageName: "legacy",
            },
            "apps-home": {
                parent: "apps-root",
                url: "^/apps/home",
                templateUrl: "/app/pages/app-analysis/home/home.html",
                controller: "appHomeCtrl",
                configId: "AppAnalysisHome",
                isHomePage: true,
                data: {
                    menuId: "",
                    menuKbItems: "mobile-home",
                    showAvailableAppsIntro: true,
                },
                pageId: {
                    section: "apps",
                    subSection: "home",
                },
                trackingId: {
                    section: "appAnalysis",
                    subSection: "home",
                    subsubSection: "",
                },
                pageTitle: "apps.home.title",
                clearSearch: true,
            },
            "apps-ranking": {
                parent: "apps",
                url: "/ranking/:appId/:country/:duration?category?device?mode?orderby?tab",
                templateUrl: "/app/pages/app-analysis/app-overview/app-ranking/ranking.html",
                controller: "appsRankingMainCtrl",
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
                    category: "", //Value determined in runtime. Solves problem from double tracking SIM-14371
                },
                reloadOnSearch: false,
                homeState: "apps-home",
                legacy: {
                    marketresearch: "companyresearch_app_appranking",
                    salesIntelligence: "salesIntelligence-apps-ranking",
                },
                fallbackStates: {
                    marketresearch: "companyresearch_app_appranking",
                },
            },
            "apps-performance": {
                parent: "apps",
                url: "/performance/:appId/:country/:duration/",
                templateUrl: "/app/pages/app-analysis/app-overview/app-performance/index.html",
                configId: "AppPerformanceReport",
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
                legacy: {
                    marketresearch: "companyresearch_app_appperformance",
                    salesIntelligence: "salesIntelligence-apps-performance",
                },
                fallbackStates: {
                    marketresearch: "companyresearch_app_appperformance",
                },
                homeState: "apps-home",
            },
            "apps-engagement": {
                abstract: true,
                parent: "apps",
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
                homeState: "apps-home",
            },
            "apps-engagementoverview": {
                parent: "apps-engagement",
                configId: "AppEngagementOverview",
                url: "/engagementoverview/:appId/:country/:duration?tab?granularity", //?dataMode'
                template: `<sw-react component="AppEngagementOverviewRedirect"></sw-react>`,
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
                    subSection: "overview",
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
                legacy: {
                    marketresearch: "companyresearch_app_appengagementoverview",
                    salesIntelligence: "salesIntelligence-apps-engagementoverview",
                },
                fallbackStates: {
                    marketresearch: "companyresearch_app_appengagementoverview",
                },
                homeState: "apps-home",
            },
            "apps-appaudienceinterests": {
                parent: "apps-engagement",
                trackNavUpdate: false,
                configId: "AppAudienceInterests",
                url: "/affinity/:appId/:country/:duration?orderby?page?filter?compare",
                templateUrl:
                    "/app/pages/app-analysis/app-audience/audience-interests/affinity.html",
                controller: "affinityCtrl",
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
                legacy: {
                    marketresearch: "companyresearch_app_appinterests",
                    salesIntelligence: "salesIntelligence-apps-appaudienceinterests",
                },
                fallbackStates: {
                    marketresearch: "companyresearch_app_appinterests",
                },
                homeState: "apps-home",
            },
            "apps-demographics": {
                parent: "apps-engagement",
                configId: "AppAudienceDemographics",
                url: "/demographics/:appId/:country/:duration",
                templateUrl:
                    "/app/pages/app-analysis/app-audience/app-demographics/app-demographics.html",
                controllerAs: "ctrl",
                controller: "appDemographicsCtrl",
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
                legacy: {
                    marketresearch: "companyresearch_app_appdmg",
                    salesIntelligence: "salesIntelligence-apps-demographics",
                },
                fallbackStates: {
                    marketresearch: "companyresearch_app_appdmg",
                },
                homeState: "apps-home",
            },
            "apps-sneakpeekQuery": {
                parent: "apps",
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
            "apps-sneakpeekResults": {
                parent: "apps",
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
        };
        return appsConfig;
    })(),
);
