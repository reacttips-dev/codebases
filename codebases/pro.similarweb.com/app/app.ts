import { ETabsTypes } from "pages/website-analysis/traffic-sources/search/components/keywordsGapVennFilter/types";
import { devicesTypes } from "UtilitiesAndConstants/Constants/DevicesTypes";
import { EFiltersTypes } from "UtilitiesAndConstants/Constants/keywordsIntersectionFiltersMD";
import {
    getLegacyState,
    hasAccessToState,
    getFallbackState,
    getRestrictionsPathForSI,
} from "./../scripts/common/services/solutions2Helper";
import fetchContactUsData from "@similarweb/contact-us/lib/utils/fetchData";
import { Highcharts } from "libraries/reactHighcharts";
import {
    onUnsupportedCountryRedirect,
    onUnsupportedWebSourceRedirect,
    swSettingsReady,
} from "actions/commonActions";
import { startImpersonation } from "actions/impersonateActions";
import { applyCurrentPage, setIsPageTransitioning, urlChange } from "actions/routingActions";
import {
    setAllStatesCompareStatusAction,
    setUserCompareStatusAction,
} from "actions/userData/userEngagementActions";
import angular, {
    auto,
    ICompileProvider,
    IHttpProvider,
    ILocationProvider,
    ILocationService,
    IRootScopeService,
    ITimeoutService,
    IWindowService,
} from "angular";
import {
    StateProvider,
    UrlRouterProvider,
    Ng1StateDeclaration,
    BuilderFunction,
} from "@uirouter/angularjs";
import { getActiveSibling, getHomePage } from "common/services/moduleService";
import { OLD_TO_NEW_CATEGORIES_MAP } from "common/services/oldToNewCategoriesMap";
import { canNavigate } from "common/services/pageClaims";
import { SwNavigator } from "common/services/swNavigator";
import { swSettings } from "common/services/swSettings";
import { getAllStatesCompareStatus, getUserCompareStatue } from "components/compare/QueryBarUtils";
import {
    getAvailableWebSource,
    isSubdomainsFilterDisabled,
    showWebSourceTooltip,
} from "components/filters-bar/utils";
import * as $ from "jquery";
import * as _ from "lodash";
import ngRedux from "ng-redux";
import { ApiManagementService } from "pages/account/api-management/apiManagementService";
import { digitalMarketingConfig } from "pages/digital-marketing/config/configuration/digitalMarketingConfig";
import { productBoardConfig } from "pages/product-board/productBoardConfig";
import { conversionConfig } from "pages/conversion/config/conversionConfig";
import {
    saveStateOnNavChangeStart,
    stateName,
} from "pages/keyword-analysis/keyword-generator-tool/keywordGeneratorToolService";
import { marketResearchConfig } from "pages/market-research/config/configuration/marketResearchConfig";
import { segmentsConfig } from "pages/segments/config/segmentsConfig";
import { industryAnalysisConfig } from "routes/industryAnalysisConfig";
import { insigthsConfig } from "routes/insightsConfig";
import { IRoutingMiddleware, RoutingMiddlewareHandler } from "routes/middleware/types";
import { useCaseScreenConfig } from "routes/useCaseScreenConfig";
import { getWorkspaceConfig } from "routes/workspaceConfig";
import VWOService from "services/ABService";
import { KeywordAdvancedFilterService } from "services/AdvancedFilterService/KeywordsAdvancedFilters";
import { AssetsService } from "services/AssetsService";
import { CIG_UPDATE_LINK_WITH_TOKEN, getCigLinkWithToken } from "services/CIGService";
import { IConnectedAccountsService } from "services/connectedAccounts.service";
import CountryService from "services/CountryService";
import DurationService from "services/DurationService";
import { openStateUnlockModal } from "services/ModalService";
import { mixpanelTracker } from "services/track/track";
import growHomepageConfig from "./pages/grow-homepage/growHomepageConfig";
import appCategoryConfig from "./routes/appCategoryConfig";
import cigConfig from "./routes/cigConfig";
import dashboardConfig from "./routes/dashboardConfig";
import homeConfig from "./routes/homeConfig";
import keywordAnalysisConfig from "./routes/keywordAnalysisConfig";
import researchHomepageConfig from "./routes/researchHomepageConfig";
import { NT_AFFILIATE_MARKETING_PRODUCT_KEY } from "constants/ntProductKeys";
import swLog from "@similarweb/sw-log";
import NgRedux from "ng-redux";
import { salesIntelligenceConfig } from "pages/sales-intelligence/legacy-router-config/configuration/salesIntelligenceConfig";
import {
    DYNAMIC_LIST_PAGE_ROUTE,
    HOME_PAGE_ROUTE,
    SI_ROOT_ROUTE_URL,
    STATIC_LIST_PAGE_ROUTE,
} from "pages/sales-intelligence/constants/routes";
import { chosenItems } from "common/services/chosenItems";
import { keywordService } from "pages/keyword-analysis/keywordService";
import { organicLandingPagesValidator } from "pages/website-analysis/traffic-sources/organic-landing-pages/stateValidate";
import { DEFAULT_HOMEPAGE_PREFERENCE_KEY } from "components/moadls/DefaultHomePageModal";
import { abortAllPendingRequests } from "services/fetchService";
import { PreferencesService } from "services/preferences/preferencesService";
import { periodOverPeriodService } from "services/PeriodOverPeriodService";
import { SwTrack } from "services/SwTrack";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";
import { RecentService } from "services/recent/recentService";

declare const SW_ENV: { debug: boolean };
declare const window;
export const DEFAULT_HOMEPAGE = "research";

export interface Ng1StateDeclarationHybrid extends Omit<Ng1StateDeclaration, "component"> {
    component?: React.ReactNode | string;
}
export declare class StateProviderHybrid {
    decorator(name: string, func: BuilderFunction): Function | this;
    state(name: string, definition: Ng1StateDeclarationHybrid): StateProviderHybrid;
    state(definition: Ng1StateDeclarationHybrid): StateProviderHybrid;
}

window.runSWModule = (appParams) => {
    angular
        .module("sw")
        .config(
            (
                $stateProvider: StateProviderHybrid,
                $urlRouterProvider: UrlRouterProvider,
                $locationProvider: ILocationProvider,
                $httpProvider: IHttpProvider,
                $provide: auto.IProvideService,
                $compileProvider: ICompileProvider,
                $ngReduxProvider: ngRedux.INgReduxProvider,
            ) => {
                // $provide.decorate any controller to check before invoke router state controller if it's the first
                // controller invoked while page transition (meaning, it's the controller of the new page view state).
                // That's good for router states with controllers, but for router states without any controller use
                // $stateProvide.decorate to add default _.noop controller to router view state.
                // This way, in every router state transition the controller of the new page view and its decorator
                // will be invoked, so the transition update will surely occur just before mounting the new page view.

                // global $controller interceptor
                $provide.decorator("$controller", function (
                    $delegate,
                    $ngRedux: NgRedux.INgRedux,
                    $rootScope,
                    $state,
                ) {
                    return function (constructor, locals) {
                        // if controller is of ui-router state
                        if (locals?.$state$?.$$state) {
                            if ($ngRedux.getState().routing.isPageTransitioning) {
                                $rootScope.$broadcast(
                                    "navChangeNewPageView",
                                    $state.current,
                                    $state.params,
                                );
                                $rootScope.$broadcast(
                                    "navChangeComplete",
                                    $state.current,
                                    $state.params,
                                );
                            }
                        }
                        // next, run the controller itself
                        return $delegate.apply(this, arguments);
                    };
                });

                // global router state views interceptor
                $stateProvider.decorator("views", function (state, parent) {
                    let result = {},
                        views = parent(state);
                    // make sure each state view will have a controller (even noop), so it will pass through $controller service provider
                    _.forEach(views, (config, key) => {
                        config.controller = config.controller ?? _.noop;
                        result[key] = config;
                    });
                    return result;
                });

                // [pro] SIM-1578 Chart symbols are squashed: change SVGRenderer for images preserveAspectRatio attribute to 'normal' instead of 'none'
                // https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/preserveAspectRatio
                const origRenderer = Highcharts.Renderer.prototype.image;
                Highcharts.Renderer.prototype.image = function () {
                    // eslint-disable-next-line prefer-rest-params
                    const imageElem = origRenderer.apply(this, arguments);
                    imageElem.attr("preserveAspectRatio", "xMinYMin");
                    return imageElem;
                };

                $httpProvider.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

                // global $http interceptor
                $httpProvider.interceptors.push("globalHttpInterceptor");

                // debug info only in dev
                $compileProvider.debugInfoEnabled(SW_ENV.debug);
                $urlRouterProvider.otherwise(($injector, $location) => {
                    if ($location.path().startsWith("/sspa")) {
                        $location.url("/sspa");
                        return;
                    }

                    if ($location.path().startsWith("/account/")) {
                        window.location =
                            swSettings.swsites.login + "/#" + $location.path().slice(8);
                        return;
                    }

                    const [, externalRedirect] = /^\/redirect=(.+)/i.exec($location.path()) || [
                        "",
                        "",
                    ];
                    if (externalRedirect) {
                        const { stateName, params, serializedState } = JSON.parse(
                            decodeURIComponent(atob(externalRedirect)),
                        );
                        if (stateName) {
                            return $injector
                                .get("swNavigator")
                                .go(stateName, params, { location: "replace" });
                        }
                        if (serializedState && !stateName) {
                            window.location.href = $injector
                                .get("stateService")
                                .deSerializeState(serializedState);
                            return;
                        }
                    }

                    const defaultHomepage = PreferencesService.get(DEFAULT_HOMEPAGE_PREFERENCE_KEY);

                    // default landing pages for new packages
                    if (swSettings.user.hasSI) {
                        return SI_ROOT_ROUTE_URL;
                    }

                    if (swSettings.user.hasMR && swSettings.user.hasDM) {
                        return `/${defaultHomepage || DEFAULT_HOMEPAGE}/home`;
                    }

                    if (swSettings.user.hasMR) {
                        return "/research/home";
                    }

                    const productKey = swSettings.components.Home.resources.ProductKey;
                    if (swSettings.user.hasDM) {
                        if (productKey === NT_AFFILIATE_MARKETING_PRODUCT_KEY) {
                            return "/workspace/marketing/home";
                        } else {
                            return "/marketing/home";
                        }
                    }

                    const workspaces = swSettings.components.Workspaces.resources.WorkspaceType;

                    if (typeof workspaces === "string") {
                        switch (workspaces) {
                            case "Marketing":
                            case "MarketingTrial":
                                return "/workspace/marketing/home";
                            case "Sales":
                                return "/workspace/sales";
                            case "Investors":
                                return "/workspace/investors";
                            case "Hook":
                                return "/workspace/hook";
                            default:
                                return swSettings.components.Home.resources.defaulturl.substr(2);
                        }
                    } else {
                        return swSettings.components.Home.resources.defaulturl.substr(2);
                    }
                });

                _.forEach(homeConfig, (value, key) => {
                    $stateProvider.state(key, value);
                });

                _.forEach(industryAnalysisConfig, (value, key) => {
                    $stateProvider.state(key, value);
                });

                _.forEach(dashboardConfig, (value, key) => {
                    $stateProvider.state(key, value);
                });

                _.forEach(insigthsConfig, (value, key) => {
                    $stateProvider.state(key, value);
                });

                _.forEach(conversionConfig, (value, key) => {
                    $stateProvider.state(key, value);
                });

                _.forEach(marketResearchConfig, (value, key) => {
                    $stateProvider.state(key, value);
                });

                _.forEach(digitalMarketingConfig, (value, key) => {
                    $stateProvider.state(key, value);
                });

                _.forEach(segmentsConfig, (value, key) => {
                    $stateProvider.state(key, value);
                });

                if (window.similarweb.settings.components.KeywordsGenerator.resources.IsDisabled) {
                    delete keywordAnalysisConfig["keywordAnalysis-keywordGeneratorTool"];
                }

                _.forEach(keywordAnalysisConfig, (value, key) => {
                    $stateProvider.state(key, value);
                });

                _.forEach(appCategoryConfig, (value, key) => {
                    $stateProvider.state(key, value);
                });

                _.forEach(researchHomepageConfig, (value, key) => {
                    $stateProvider.state(key, value);
                });

                _.forEach(growHomepageConfig, (value, key) => {
                    $stateProvider.state(key, value);
                });

                _.forEach(cigConfig, (value, key) => {
                    $stateProvider.state(key, value);
                });

                _.forEach(useCaseScreenConfig, (value, key) => {
                    $stateProvider.state(key, value);
                });

                _.forEach(getWorkspaceConfig(), (value, key) => {
                    $stateProvider.state(key, value);
                });

                _.forEach(salesIntelligenceConfig, (value, key) => {
                    $stateProvider.state(key, value);
                });

                _.forEach(productBoardConfig, (value, key) => {
                    $stateProvider.state(key, value);
                });

                $ngReduxProvider.provideStore(appParams.store);

                if (window.mobileViewPage && window.mobileViewPage.length > 0) {
                    window.mobileViewPage.forEach((item) => {
                        if (item.event === "trackEvent") {
                            mixpanelTracker.trackEvent(
                                item.params[0],
                                item.params[1],
                                item.params[2],
                            );
                        } else if (item.event === "trackPageView") {
                            mixpanelTracker.trackPageView(item.params);
                        }
                    });
                    delete window.mobileViewPage;
                }

                keywordsGroupsService.setup();
            },
        )
        .run(
            (
                $rootScope: IRootScopeService,
                swNavigator: SwNavigator,
                i18nFilter: (key: string, params?: {}) => string,
                $timeout: ITimeoutService,
                // eslint-disable-next-line @typescript-eslint/camelcase
                s_ViewGroup,
                chosenSites,
                swRoute,
                $location: ILocationService,
                chosenDataGetter,
                columnsMutator,
                dashboardService,
                $window: IWindowService,
                $ngRedux: ngRedux.INgRedux,
                $injector: auto.IInjectorService,
                $state,
                swConnectedAccountsService: IConnectedAccountsService,
                swProfiler,
                $interval,
                routingMiddleware: IRoutingMiddleware,
                enforceUseCaseScreen: RoutingMiddlewareHandler,
                enforceNewArena: RoutingMiddlewareHandler,
                useCaseScreenSeenStateHandler: RoutingMiddlewareHandler,
            ) => {
                /* Init */
                const window: any = angular.element($window);
                swSettings.setCurrent("Home");
                const SIXTY_MINUTES = 60 * 60 * 1000; // in ms

                // dispatch an event with swSettings so settings will be available in redux reducers
                setTimeout(() => {
                    $ngRedux.dispatch(swSettingsReady(swSettings));

                    if (swSettings.components.CigReportGenerator.resources.IsDisabled) {
                        $ngRedux.dispatch({
                            type: CIG_UPDATE_LINK_WITH_TOKEN,
                            cigLink: "/#/tools/cig",
                        });
                    } else {
                        // Get cig full link based on available API token. Refresh every 60 minutes.
                        $ngRedux.dispatch<any>(getCigLinkWithToken(new ApiManagementService()));
                        $interval(() => {
                            if (!document.hidden) {
                                // Check that tab is active. Not reason to refresh token if not
                                $ngRedux.dispatch<any>(
                                    getCigLinkWithToken(new ApiManagementService()),
                                );
                            }
                        }, SIXTY_MINUTES);
                    }
                }, 100);

                SwTrack.init();

                // track healthChecks timeout
                setTimeout(() => {
                    SwTrack.healthChecks();
                }, 50000);

                $rootScope.$on("content-resize", () => {
                    $(window).resize();
                });

                chosenDataGetter.get = () => {
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    return s_ViewGroup;
                };

                $window.similarweb.app.columnMutator = columnsMutator;

                fetchContactUsData(swSettings.swsites.light);

                function hasDefaultQueryParams(toState, toParams): boolean {
                    // checks if a url's query params contains a state's default query params
                    if (toState.defaultQueryParams) {
                        let returnFlag = true;
                        for (const key in toState.defaultQueryParams) {
                            if (_.isUndefined(toParams[key])) {
                                returnFlag = false;
                                break;
                            }
                        }
                        return returnFlag;
                    }
                    return true;
                }

                function webSourceNavChangeHandler(event, toState, toParams, fromParams?) {
                    /*
                WebSource Logic:
                */
                    const webSourceFromUrl = toParams.webSource;
                    let webSource;
                    const pageWebSourcesFn = getAvailableWebSource(toState, toParams);
                    const selectedWebSource: any = _.find(pageWebSourcesFn, {
                        id: webSourceFromUrl,
                    });
                    const firstEnabledWebSource: any = _.find(pageWebSourcesFn, {
                        disabled: false,
                    });

                    if (_.isUndefined(firstEnabledWebSource)) {
                        // no webSource on page
                        return;
                    }
                    if (_.isUndefined(selectedWebSource) || selectedWebSource.disabled) {
                        webSource = firstEnabledWebSource.id;
                        // fire event only if there is a webSource in URL
                        // if there isn't, we don't need to show a tooltip to the user.
                        const reload = _.isEmpty(fromParams)
                            ? true
                            : fromParams.webSource !== toParams.webSource;
                        if (webSourceFromUrl && showWebSourceTooltip(toState)) {
                            setTimeout(() => {
                                $ngRedux.dispatch(onUnsupportedWebSourceRedirect());
                            }, 100);
                        }
                        event.preventDefault();
                        const goToParams = Object.assign({}, toParams, { webSource });
                        $timeout(() => {
                            swNavigator.go(toState, goToParams, { reload });
                        }, 0);
                        return true;
                    }
                }
                function isCustomDurationAllowed(hideCalendar) {
                    return !hideCalendar;
                }

                /* Events */

                // Routing middleware
                [enforceUseCaseScreen, enforceNewArena].forEach((handler) =>
                    routingMiddleware.on("beforeTransition", handler),
                );
                routingMiddleware.on("beforeTransition", enforceUseCaseScreen);
                routingMiddleware.on("beforeTransition", enforceNewArena);
                routingMiddleware.on("afterTransition", useCaseScreenSeenStateHandler);

                $rootScope.$on(
                    "navChangeStart",
                    (
                        evt,
                        toState,
                        toParamsArg,
                        fromState,
                        fromParams,
                        toConfigId,
                        $transition$,
                    ) => {
                        const toParams = { ...toParamsArg };
                        // Abort all pending requests when navigating
                        abortAllPendingRequests();

                        /**
                         * In case the user navigated to the a legacy state (a state that belongs to a legacy package) from
                         * a solutions 2.0 state, reroute the navigation to an aquivalent state in solutions 2.0
                         */
                        const packageName = swNavigator.getPackageName(fromState);
                        let legacyState = getLegacyState(toState, [packageName]);
                        if (legacyState) {
                            if (typeof legacyState === "object") {
                                const innerPackageLevel = Object.keys(legacyState).find((value) =>
                                    fromState.parent.includes(value),
                                );
                                legacyState = legacyState[innerPackageLevel];
                            }

                            evt.preventDefault();
                            swNavigator.go(legacyState, toParams, { location: "replace" });
                            return;
                        }

                        /**
                         * In case the user has link to old Sales Workspace redirect to SI 2.0 for Sales 2.0 users
                         */
                        const typePath = swSettings.user.hasSI && getRestrictionsPathForSI(toState);

                        if (typePath) {
                            evt.preventDefault();

                            if (typePath === "home_page") {
                                swNavigator.go(HOME_PAGE_ROUTE, {}, { location: "replace" });
                                return;
                            }
                            if (typePath === "workspace") {
                                if (!toParams.searchId && !toParams.listId) {
                                    swNavigator.go(HOME_PAGE_ROUTE, {}, { location: "replace" });
                                    return;
                                }
                                // static list
                                if (!toParams.searchId && toParams.listId) {
                                    swNavigator.go(
                                        STATIC_LIST_PAGE_ROUTE,
                                        {
                                            id: toParams.listId,
                                            showRecommendations: toParams.showRecommendations,
                                        },
                                        { location: "replace" },
                                    );
                                    return;
                                }
                                // dynamic list
                                if (toParams.searchId) {
                                    swNavigator.go(
                                        DYNAMIC_LIST_PAGE_ROUTE,
                                        {
                                            id: toParams.searchId,
                                            excludeUserLeads: toParams.excludeUserLeads,
                                            newLeadsOnly: toParams.newLeadsOnly,
                                        },
                                        { location: "replace" },
                                    );
                                    return;
                                }
                            }
                        }

                        /**
                         * In case the user is trying to navigate to a state that belongs to a package which the user has no access to
                         * (say, a state that belongs to aquisitionIntelligence/marketingIntelligence package)
                         * try to reroute the state to an aquivalent state in a package that the user HAS access to.
                         */
                        if (!hasAccessToState(toState, swNavigator)) {
                            const fallbackState = getFallbackState(toState, swNavigator);
                            if (fallbackState) {
                                evt.preventDefault();
                                swNavigator.go(fallbackState, toParams, {
                                    relative: null,
                                    location: "replace",
                                });
                                return;
                            }
                        }

                        swProfiler.startInteraction(toState.name);
                        swProfiler.setCurrentRouteName(toState.name);

                        if (toParams.duration && toParams.duration.indexOf("&") > 0) {
                            // eslint:disable-next-line:variable-name
                            const _splitDuration = toParams.duration.split("&");
                            toParams.duration = _splitDuration[0];
                        }
                        let newParams;
                        let unsupportedDuration;
                        let unsupportedCountry;
                        let unSupportedOldCategoryNewMapping;
                        let unsupportedStore;
                        let unsupportedDomain;

                        const modifiedPrams = swNavigator.validateParams(toParams, toState);
                        /* restrict # of apps to be less than 6 */

                        if (modifiedPrams) {
                            evt.preventDefault();
                            swNavigator.go(toState, modifiedPrams);
                            return;
                        }

                        $rootScope.isHomePage = toState.isHomePage;
                        // Fetch config object according to state's configId
                        const toComponentName = swNavigator.getConfigIdFromStateConfig(
                            toState,
                            toParams,
                        );

                        if (!toComponentName) {
                            evt.preventDefault();
                            return;
                        }
                        const toComponent = swSettings.components[toComponentName];

                        const homeComponent = swSettings.components.Home;

                        // redirect on failed payment
                        if (
                            homeComponent.resources.IsPaymentRequired &&
                            homeComponent.resources.IsGracePeriodPassed &&
                            !toState.name.match(/account/)
                        ) {
                            evt.preventDefault();
                            $window.location.href = `${swSettings.swsites.login}/#/updatebilling`;
                            return;
                        }

                        const navigate = canNavigate(toState, toParams);
                        const connectedAccountState = swConnectedAccountsService.getUiOptions(
                            toState,
                        );

                        if (!navigate && !connectedAccountState.showAvailableAppsIntro) {
                            openStateUnlockModal(toState, toParams);

                            if (fromState.name === "") {
                                const nextState =
                                    getActiveSibling(toState, toParams) ||
                                    getHomePage(toState, toParams);
                                evt.preventDefault();
                                setTimeout(() => swNavigator.go(nextState, toParams), 0);
                                return;
                            }

                            if (!connectedAccountState.IsAvailableOnPage) {
                                evt.preventDefault();
                                return;
                            }
                        }

                        // set current component config to target config
                        swSettings.setCurrent(toComponentName);

                        // Redirect rules for unsupported durations and countries in apps module
                        const isGooglePlayKeywordsState = toState.name.match(/keywords\./);
                        const isAppsState =
                            toState.name.match(/apps-/) ||
                            toState.name.match(/companyresearch_app_/);
                        const isMobileState =
                            (isAppsState ||
                                isGooglePlayKeywordsState ||
                                toState.name === "appcategory-topkeywords") &&
                            !toState.name.match(/\.home/);
                        const isDashboardState = toState.name.indexOf("dashboard") === 0;
                        const isLeadGeneratorState = toState.name.indexOf("leadGenerator") === 0;
                        const isWebsiteState =
                            toState.name.match(/websites-/) ||
                            toState.name.match(/findpublishers_bycompetition/) ||
                            toState.name.match(/findadnetworks_bycompetition/) ||
                            toState.name.match(/findaffiliates_bycompetition/) ||
                            toState.name.match(/affiliateanalysis_performanceoverview/) ||
                            toState.name.match(/affiliateanalysis_outgoinglinks/) ||
                            toState.name.match(/findkeywords_bycompetition/) ||
                            toState.name.match(/findSearchTextAds_bycompetitor/) ||
                            toState.name.match(/findProductListingAds_bycompetitor/) ||
                            toState.name.match(/findDisplayAds_bycompetitor/) ||
                            toState.name.match(/findVideoAds_bycompetitor/) ||
                            toState.name.match(/affiliateanalysis_performanceoverview/) ||
                            toState.name.match(/companyresearch_website_/) ||
                            toState.name.match(/accountreview_website_/) ||
                            toState.name.match(/competitiveanalysis_website_/) ||
                            toState.name.match(/salesIntelligence-findLeads-competitors-result/) ||
                            toState.name.match(/analyzepublishers_/);
                        const isIndustryAnaysisState =
                            toState.name.match(/industryAnalysis-/) ||
                            toState.name.match(/marketresearch_webmarketanalysis_mapping/) ||
                            toState.name.match(/findpublishers_byindustry/) ||
                            toState.name.match(/findadnetworks_byindustry/) ||
                            toState.name.match(/findaffiliates_byindustry/) ||
                            toState.name.match(/findkeywords_byindustry/) ||
                            toState.name.match(/salesIntelligence-findLeads-industry-result/) ||
                            toState.name.match(/findadnetworks_byindustry_root/) ||
                            toState?.parent?.match(/marketresearch_webmarketanalysis/);
                        const isKeywordsAnalysisState =
                            toState.name.match(/keywordAnalysis-(?!home)/) ||
                            toState.name.match(/keywordAnalysis_/) ||
                            toState.name.match(/findSearchTextAds_bykeyword/) ||
                            toState.name.match(/findaffiliates_bykeywords/) ||
                            toState.name.match(/marketresearch_keywordmarketanalysis/) ||
                            toState.name.match(/findProductListingAds_bykeyword/) ||
                            toState.name.match(/monitorkeywords/) ||
                            toState.name.match(/monitorpartners/);
                        const isAppCategoryAnalysisState = toState.name.match(/appcategory-/);
                        const isWebsiteReferralState = toState.name === "websites-trafficReferrals";
                        const isWebsiteTrafficSearchState =
                            toState.name === "websites-trafficSearch" ||
                            toState.name === "competitiveanalysis_search";
                        const isConversionSegmentModuleState = toState.name.match(
                            /conversion-customsegement/,
                        );
                        const isToKeywordGeneratorTool = toState.name === stateName;
                        const isAppsDemographicsState =
                            toState.name === "apps-demographics" ||
                            toState.name === "companyresearch_app_appdmg";

                        const isWorkspace = ["marketingWorkspace-exists", "workspace"].includes(
                            toState.parent,
                        );
                        if (isWorkspace) {
                            const { duration, country } = toParams;
                            const isSupportedDuration = duration
                                ? swSettings.allowedDuration(duration, toComponentName)
                                : true;
                            if (!isSupportedDuration) {
                                setTimeout(() =>
                                    swNavigator.go(toState.name, {
                                        ...toParams,
                                        duration: toComponent.defaultParams.duration,
                                    }),
                                );
                                return;
                            }
                            const isSupportedCountry = country
                                ? swSettings.allowedCountry(country, toState.name)
                                : true;
                            if (!isSupportedCountry) {
                                setTimeout(() =>
                                    swNavigator.go(toState.name, {
                                        ...toParams,
                                        country: swSettings.current.resources.InitialCountry,
                                    }),
                                );
                            }
                        }

                        // KeywordGeneratorTool saves origin state in order to return to that state in the end of the group creation process
                        if (isToKeywordGeneratorTool) {
                            saveStateOnNavChangeStart(fromState, fromParams);
                        }
                        if (isMobileState) {
                            if (isGooglePlayKeywordsState) {
                                if (
                                    !swSettings.allowedCountry(
                                        toParams.country,
                                        "AppKeywordAnalysis",
                                    )
                                ) {
                                    evt.preventDefault();
                                    swNavigator.go(
                                        toState,
                                        Object.assign(toParams, {
                                            country: swSettings.current.resources.InitialCountry,
                                        }),
                                    );
                                    return;
                                } else if (!toParams.category) {
                                    evt.preventDefault();
                                    swNavigator.go(
                                        toState,
                                        Object.assign(toParams, {
                                            category: swSettings.current.defaultParams.category,
                                        }),
                                    );
                                    return;
                                }
                            }

                            unsupportedDuration = !swSettings.allowedDuration(
                                toParams.duration,
                                toComponentName,
                            );
                            unsupportedCountry = !swSettings.allowedCountry(
                                toParams.country,
                                toComponentName,
                            );
                            unsupportedStore =
                                toParams.store &&
                                !swSettings.allowedStore(toParams.store, toComponentName);

                            if (unsupportedCountry) {
                                swNavigator.go(
                                    toState,
                                    Object.assign(toParams, {
                                        country: toComponent.resources.InitialCountry,
                                    }),
                                );
                                return;
                            }

                            // for top keywords
                            if (unsupportedStore) {
                                if (toComponent.isDemo) {
                                    evt.preventDefault();
                                    swNavigator.go(
                                        toState,
                                        Object.assign(
                                            {},
                                            toComponent.defaultParams,
                                            toState.defaultQueryParams,
                                        ),
                                    );
                                    return;
                                } else {
                                    $rootScope.unsupportedFilter = {
                                        type: "store",
                                    };
                                    $rootScope.viewLoaded = true;
                                    return;
                                }
                            } else {
                                $rootScope.unsupportedFilter = false;
                            }

                            if (unsupportedDuration || unsupportedCountry) {
                                evt.preventDefault();
                                $timeout(() => {
                                    swNavigator.go(
                                        toState,
                                        Object.assign(
                                            {},
                                            toParams,
                                            unsupportedDuration
                                                ? {
                                                      duration: toComponent.defaultParams.duration,
                                                  }
                                                : {},
                                            unsupportedCountry
                                                ? {
                                                      country: toComponent.defaultParams.country,
                                                  }
                                                : {},
                                            toState.defaultQueryParams,
                                        ),
                                    );
                                });
                                return;
                            }
                            // Clear universal search on mobile apps
                            if (toState.clearSearch) {
                                chosenSites.clear(toParams);
                            }
                        } else {
                            if (isDashboardState) {
                                const userHasDashboards = dashboardService.dashboards.length > 0;
                                switch (toState.name) {
                                    case "dashboard":
                                        evt.preventDefault();
                                        if (userHasDashboards) {
                                            swNavigator.go("dashboard-exist", {
                                                dashboardId: dashboardService.getFirstDashboard()
                                                    .id,
                                            });
                                        } else if (
                                            swSettings.components.Dashboard.resources.IsReadonly
                                        ) {
                                            setTimeout(
                                                () => swNavigator.go("trackHomepage", toParams),
                                                0,
                                            );
                                            openStateUnlockModal(toState);
                                        } else {
                                            swNavigator.go("dashboard-gallery");
                                        }
                                        return;
                                    case "dashboard-new":
                                    case "dashboard-gallery":
                                        if (swSettings.components.Dashboard.resources.IsReadonly) {
                                            evt.preventDefault();
                                            setTimeout(
                                                () => swNavigator.go("trackHomepage", toParams),
                                                0,
                                            );
                                            openStateUnlockModal(toState);
                                            return;
                                        }
                                        break;
                                    default:
                                        break;
                                }
                            }

                            if (isLeadGeneratorState) {
                                if (toState.name === "leadGenerator") {
                                    evt.preventDefault();
                                    setTimeout(() => swNavigator.go("leadGenerator.all"), 0);
                                    return;
                                }
                            }

                            $rootScope.unsupportedFilter = false;
                        }
                        if (isWebsiteState) {
                            // eslint-disable-next-line @typescript-eslint/camelcase
                            s_ViewGroup.cancelAll();

                            // check if route is supported
                            const isNotVirtualSupported =
                                chosenSites.getPrimarySite().isVirtual &&
                                toState.isVirtualSupported === false;
                            const isPeriodOverPeriod = toState.periodOverPeriodEnabled;
                            if (isNotVirtualSupported) {
                                evt.preventDefault();
                                swNavigator.go("websites-audienceOverview", toParams);
                                return;
                            } else if (isPeriodOverPeriod && toParams.comparedDuration) {
                                const isPeriodOverPeriodAllowed = periodOverPeriodService.periodOverPeriodEnabled(
                                    toParams.duration,
                                    toParams.comparedDuration,
                                    toParams.key,
                                    toComponentName,
                                );
                                // don't allow compare to previous year
                                if (!isPeriodOverPeriodAllowed) {
                                    evt.preventDefault();
                                    newParams = _.clone(toParams);
                                    newParams.comparedDuration = undefined;
                                    swNavigator.go(toState, newParams);
                                    return;
                                }
                            }

                            //
                            if (webSourceNavChangeHandler(evt, toState, toParams, fromParams)) {
                                return;
                            }

                            // Redirect logic, according to component settings
                            unsupportedDuration =
                                !toState.skipDurationCheck &&
                                !swSettings.allowedDuration(toParams.duration, toComponentName);
                            unsupportedCountry =
                                !toState.skipCountryCheck &&
                                !swSettings.allowedCountry(toParams.country, toComponentName);
                            unsupportedDomain =
                                isSubdomainsFilterDisabled(toParams, toState) &&
                                toParams.isWWW === "-";

                            $rootScope.global.unsupportedFilter = false;

                            const isState =
                                CountryService.countriesById[toParams.country] &&
                                !!CountryService.countriesById[toParams.country].parent;
                            const isNotStatesSupported = isState && !toState.isUSStatesSupported;
                            // checking whether the country is valid for the module but not for the page
                            if (
                                (unsupportedCountry && !toState.worldwideOnly) ||
                                isNotStatesSupported
                            ) {
                                if (
                                    _.find(swSettings.components.WebAnalysis.allowedCountries, {
                                        id: Number(toParams.country),
                                    })
                                ) {
                                    $rootScope.global.unsupportedFilter = {
                                        type: "country",
                                    };
                                    return;
                                }
                            }
                            // if the page won't have the calendar we don't want to allow custom duration SIM-32894
                            if (
                                !unsupportedDuration &&
                                !isCustomDurationAllowed(toState.hideCalendar) &&
                                swSettings.isCustomDuration(toParams.duration)
                            ) {
                                unsupportedDuration = true;
                            }
                            if (
                                unsupportedDuration &&
                                toParams.webSource === "MobileWeb" &&
                                (isWebsiteReferralState || isWebsiteTrafficSearchState)
                            ) {
                                // When moving to websource = mobileWeb, if the duration isn't supported,
                                // use the maximum available range
                                toParams.duration = DurationService.getDiffCustomRangeParam(
                                    swSettings.current.startDate,
                                    swSettings.current.endDate,
                                );
                                evt.preventDefault();
                                swNavigator.go(toState, Object.assign({}, toParams));
                                return;
                            }
                            if (unsupportedDuration || unsupportedCountry || unsupportedDomain) {
                                const newToParams = { ...toParams };
                                newToParams.duration = unsupportedDuration
                                    ? swSettings.current.defaultParams.duration
                                    : toParams.duration;
                                newToParams.country = unsupportedCountry
                                    ? swSettings.current.defaultParams.country
                                    : toParams.country;
                                newToParams.isWWW = unsupportedDomain ? "*" : toParams.isWWW ?? "*";
                                evt.preventDefault();
                                swNavigator.go(toState, newToParams);
                                return;
                            }

                            if (toState.name === "websites-worldwideOverview") {
                                if (
                                    toParams.country === "999" &&
                                    toParams.duration !== "1m" &&
                                    !swSettings.allowedCountry(toParams.country, "WebAnalysis")
                                ) {
                                    swNavigator.go(
                                        toState,
                                        Object.assign(toParams, { duration: "1m" }),
                                    );
                                    return;
                                }
                            }

                            // run validation on 'limits' param in search keywords page
                            if (toState.name === "websites-trafficSearch") {
                                const isCustomFilter = KeywordAdvancedFilterService.isCustomFilter(
                                    toParams.limits,
                                );
                                if (toParams.key && fromParams.key) {
                                    const newMainWebsite = toParams.key.split(",")[0];
                                    const oldMainWebsite = fromParams.key.split(",")[0];
                                    // clear limits param when main domain has changed
                                    if (newMainWebsite !== oldMainWebsite) {
                                        if (toParams.limits) {
                                            evt.preventDefault();
                                            swNavigator.go(
                                                toState,
                                                Object.assign({ ...toParams, limits: null }),
                                            );
                                        }
                                    }
                                }
                                // only run validation on custom filter
                                if (isCustomFilter) {
                                    const isValid = KeywordAdvancedFilterService.validateParamAgainstKeys(
                                        toParams.limits,
                                        toParams.key.split(","),
                                    );
                                    if (!isValid) {
                                        evt.preventDefault();
                                        swNavigator.go(
                                            toState,
                                            Object.assign({ ...toParams, limits: null }),
                                        );
                                    }
                                }
                            }
                            if (
                                [
                                    "companyresearch_website_marketingchannels",
                                    "websites-trafficOverview",
                                    "competitiveanalysis_website_overview_marketingchannels",
                                    "accountreview_website_marketingchannels",
                                ].includes(toState.name)
                            ) {
                                //MobileWeb doesnt support those params, resetting.
                                if (toParams.webSource === "MobileWeb") {
                                    delete toParams.channelAnalysisMetric;
                                    delete toParams.channelAnalysisGranularity;
                                    delete toParams.channelAnalysisChannel;
                                    delete toParams.channelAnalysisMtd;
                                }
                            }
                            $rootScope.global.sidebarVisible = false;
                            $rootScope.global.loading = true;

                            let icon;
                            let image;
                            if (toParams.key in chosenSites.listInfo) {
                                const siteInfo = chosenSites.listInfo[toParams.key];
                                icon = siteInfo.icon;
                                image = siteInfo.image;
                            } else {
                                image = icon = AssetsService.assetUrl("/images/bg_c.png");
                            }

                            $rootScope.global.site.icon = icon;
                            $rootScope.global.site.image = image;

                            // update title
                            document.title = "SimilarWeb PRO - " + $rootScope.global.site.name;
                            // Clear universal search on website analysis
                            if (toState.clearSearch) {
                                chosenItems.$clear();
                            }
                        }
                        if (isIndustryAnaysisState) {
                            unSupportedOldCategoryNewMapping =
                                OLD_TO_NEW_CATEGORIES_MAP[toParams.category];
                            if (unSupportedOldCategoryNewMapping) {
                                swNavigator.go(
                                    toState,
                                    _.merge(toParams, {
                                        category: unSupportedOldCategoryNewMapping,
                                    }),
                                );
                            }
                            unsupportedCountry =
                                toState.name === "industryAnalysis-geo" ||
                                toState.name === "marketresearch_webmarketanalysis_geography" ||
                                toState.name === "findaffiliates_byindustry_homepage" ||
                                toState.name === "marketresearch_webmarketanalysis_geography"
                                    ? false
                                    : !swSettings.allowedCountry(toParams.country, toComponentName);
                            unsupportedDuration =
                                !toState.skipCountryCheck &&
                                !swSettings.allowedDuration(toParams.duration, toComponentName);
                            if (unsupportedCountry) {
                                $rootScope.showCountryTooltip = true;
                                setTimeout(() => {
                                    $ngRedux.dispatch(onUnsupportedCountryRedirect());
                                }, 100);
                                evt.preventDefault();
                                swNavigator.go(toState, {
                                    ...toParams,
                                    country: toComponent.defaultParams.country,
                                });
                            } else if (unsupportedDuration) {
                                evt.preventDefault();
                                swNavigator.go(toState, {
                                    ...toParams,
                                    duration: toComponent.defaultParams.duration,
                                });
                            }

                            if (webSourceNavChangeHandler(evt, toState, toParams, fromParams)) {
                                return;
                            }
                            //Remove once Loyalty can support custom categories
                            // if(isCategotyLoyaltyState && toParams?.category?.startsWith("*")) {
                            //     evt.preventDefault();
                            //     swNavigator.go('industryAnalysis-overview',toParams);
                            // }
                        }
                        if (isKeywordsAnalysisState) {
                            unsupportedDuration =
                                toParams.duration &&
                                !swSettings.allowedDuration(toParams.duration, toComponentName);
                            if (unsupportedDuration) {
                                evt.preventDefault();
                                swNavigator.go(toState, {
                                    ...toParams,
                                    duration: toComponent.defaultParams.duration,
                                });
                            } else if (!keywordService.canNavigate(toState)) {
                                const locals = {
                                    toState,
                                    toParams: Object.assign(toParams, { notPermitted: true }),
                                    event: evt,
                                };
                                try {
                                    $injector.invoke(
                                        toState.data.pageViewTracking,
                                        toState.data,
                                        locals,
                                    );
                                } catch (e) {
                                    swLog.exception("Error invoking pageViewTracking", e);
                                }

                                evt.preventDefault();
                                setTimeout(
                                    () => swNavigator.go("keywordAnalysis-unauthorized", toParams),
                                    0,
                                );
                                openStateUnlockModal(toState);
                            }
                            if (webSourceNavChangeHandler(evt, toState, toParams, fromParams)) {
                                return;
                            }
                        }
                        if (isAppCategoryAnalysisState) {
                            if (!swSettings.allowedCountry(toParams.country, toComponentName)) {
                                newParams = {
                                    ...toParams,
                                    country: toComponent.defaultParams.country,
                                };
                                swNavigator.go(toState, newParams);
                            }
                        }
                        if (isConversionSegmentModuleState) {
                            const isPeriodOverPeriodAllowed = periodOverPeriodService._periodOverPeriodEnabled(
                                toParams.duration,
                                toParams.comparedDuration,
                                [],
                                toComponentName,
                            );
                            // don't allow compare to previous year
                            if (toParams.comparedDuration && !isPeriodOverPeriodAllowed) {
                                evt.preventDefault();
                                newParams = _.clone(toParams);
                                newParams.comparedDuration = undefined;
                                setTimeout(() => swNavigator.go(toState, newParams), 0);
                                return;
                            }
                        }
                        if (isAppsDemographicsState) {
                            unsupportedDuration = toParams.duration !== "1m";
                            if (unsupportedDuration) {
                                evt.preventDefault(); // SIM-27932 - prevent reload when duration is not 1m
                                setTimeout(() => {
                                    swNavigator.applyUpdateParams({ ...toParams, duration: "1m" });
                                }, 100);
                                $rootScope.viewLoaded = true;
                                return;
                            }
                        }

                        $rootScope.viewLoaded = false;
                    },
                );

                $rootScope.$on(
                    "navChangeError",
                    (evt, toState, toParams, fromState, fromParams, error) => {
                        $rootScope.viewLoaded = true;
                        const isWebsiteState = toState.name.match(/websites\./);
                        if (isWebsiteState) {
                            $rootScope.global.cssSection = (
                                toState.pageId.subSection +
                                (toState.pageId.subSubSection
                                    ? "/" + toState.pageId.subSubSection
                                    : "")
                            ).replace("/", "-");
                            $rootScope.global.loading = false;

                            // track error
                            SwTrack.all.trackEvent(
                                "PageError",
                                $location.path(),
                                error || "No Status",
                            );
                            swLog.error("error loading page " + (error || "No Status"));

                            if (error >= 500) {
                                $rootScope.global.pageStatus = "error";
                            } else if (error >= 400) {
                                switch (error) {
                                    case 401:
                                        $window.location.href = "/website";
                                        break;
                                    case 403:
                                        // already handled by globalHttpInterceptor
                                        // window.location = swSettings.swsites.login_handler;
                                        break;
                                    case 404:
                                        $rootScope.global.pageStatus = "notfound";
                                        break;
                                    case 406:
                                        $window.location.href =
                                            swSettings.current.resources.defaulturl;
                                        // $modal.open({
                                        //  templateUrl: 'demoModal.html',
                                        //  controller: 'demoModalInstanceCtrl'
                                        // });
                                        break;
                                    default:
                                        $rootScope.global.pageStatus = "error";
                                }
                            } else {
                                $rootScope.global.pageStatus = "error";
                            }
                            $rootScope.global.loading = false;
                        }
                    },
                );

                $rootScope.$on("navChangeSuccess", (evt, toState, toParams, fromState) => {
                    // once transitioning is successful, set a flag that page is transitioning
                    $ngRedux.dispatch(setIsPageTransitioning(true));
                    $timeout(() => {
                        // After navChangeSuccess completes (using timeout), if page is still in transition and
                        // didn't yet applied current page (by controller decorator), then apply current page.
                        if ($ngRedux.getState().routing.isPageTransitioning) {
                            $ngRedux.dispatch<any>(applyCurrentPage());
                        }
                    }); // postpone page transitioning end to allow angular render and link template elements

                    if (
                        toState.name === "insights-reports" &&
                        fromState.name === "insightsHome" &&
                        toParams.types
                    ) {
                        const groupNames = Object.keys(
                            swSettings.components.DeepInsightsGroups.resources,
                        );
                        let type = null;
                        let tile = null;
                        groupNames.forEach((gr) => {
                            const keys = Object.keys(swSettings.components[gr].resources);
                            const items = keys.filter((t) => t === "ReportType_" + toParams.types);
                            if (items.length) {
                                type = swSettings.components.DeepInsightsGroups.resources[gr];
                                const reportType =
                                    swSettings.components[gr].resources[
                                        "ReportType_" + toParams.types
                                    ];
                                tile = JSON.parse(reportType.replace(new RegExp("'", "gi"), '"'));
                                return false;
                            }
                        });

                        const typeLabel = type || toParams.types;
                        SwTrack.all.trackEvent(
                            "Deep Insights Solutions",
                            "click",
                            `${typeLabel}/${tile.Name}`,
                        );
                    }

                    if (toState.hasOwnProperty("pageTitle")) {
                        if (typeof toState.pageTitle === "function") {
                            document.title = i18nFilter(toState.pageTitle(toParams));
                        } else {
                            document.title = i18nFilter(toState.pageTitle);
                        }
                    }
                    if (hasDefaultQueryParams(toState, toParams)) {
                        // hasDefaultQueryParams(...) is meant to avoid page-view track event when query params are'nt contained in the url's query params SIM-14364
                        const locals = {
                            toState,
                            toParams,
                            event: evt,
                        };
                        setTimeout(() => {
                            const toStateData = locals.toState.data;
                            $injector.invoke(toStateData.pageViewTracking, toStateData, locals);
                        }, 100);
                    }
                    $rootScope.viewLoaded = true;

                    RecentService.addCurrentPageToRecent();

                    SwTrack.setRecordingStatus(!toState.data.disableRecording);

                    // apps title is updated in the appInfoResolver because app name is not known from the toParams
                    if (
                        toState.name !== "findaffiliates_bykeywords" &&
                        toState.name.indexOf("keywords") > -1
                    ) {
                        let title = i18nFilter("titleTag.keywords");
                        if (toState.name === "keywords-analysis") {
                            // title = i18nFilter('titleTag.keywords-analysis'
                            title = i18nFilter("titleTag.organic.analysis", {
                                keyword: toParams.keyword,
                            });
                        }
                        document.title = title;
                    }

                    if (toState.name === "findkeywords_bycompetition") {
                        const isValidLimitsQueryParams = (queryParams, chosenItems) => {
                            const { limitsUsingAndOperator } = queryParams;
                            const LIMITIS_DEFAULT_SEPARATOR = ";";
                            const isValidLimitsUsingAndOperator = limitsUsingAndOperator
                                ? limitsUsingAndOperator.split(LIMITIS_DEFAULT_SEPARATOR).length <=
                                  chosenItems.length
                                : true;
                            return isValidLimitsUsingAndOperator;
                        };

                        const returnToInitiateState = () => {
                            swNavigator.applyUpdateParams({
                                limitsUsingAndOperator: undefined,
                                selectedIntersection: undefined,
                                predefinedFiler: EFiltersTypes.ALL_KEYWORDS,
                                gapFilterSelectedTab: ETabsTypes.ALL_TRAFFIC,
                            });
                        };

                        if (
                            !isValidLimitsQueryParams(toParams, toParams.key.split(",")) ||
                            (toParams.webSource === devicesTypes.MOBILE &&
                                toParams.gapFilterSelectedTab !== String(ETabsTypes.ALL_TRAFFIC))
                        ) {
                            // setTimeout in order to prevent the "$digest already in progress" error
                            // by moving the returnToInitiateState function execution to the end of the queue
                            setTimeout(returnToInitiateState, 0);
                            return;
                        }
                    }
                    if (toState.name === "competitiveanalysis_website_organiclandingpages") {
                        const isValidState = organicLandingPagesValidator(toParams, swNavigator);
                        if (!isValidState) return;
                    }

                    const isWebsiteState =
                        toState.name.match(/websites[-_]/) ||
                        toState.name.match(/findkeywords_bycompetition/) ||
                        toState.name.match(/findpublishers_bycompetition/) ||
                        toState.name.match(/findDisplayAds_bycompetitor/) ||
                        toState.name.match(/findVideoAds_bycompetitor/) ||
                        toState.name.match(/findadnetworks_bycompetition/) ||
                        toState.name.match(/findSearchTextAds_bycompetitor/) ||
                        toState.name.match(/findProductListingAds_bycompetitor/) ||
                        toState.name.match(/findkeywords_bycompetition/) ||
                        toState.name.match(/affiliateanalysis_performanceoverview/) ||
                        toState.name.match(/affiliateanalysis_outgoinglinks/) ||
                        toState.name.match(/analyzepublishers_monitizationnetworks/) ||
                        toState.name.match(/analyzepublishers_advertisers/) ||
                        toState.name.match(/companyresearch_website_/) ||
                        toState.name.match(/accountreview_website_/) ||
                        toState.name.match(/competitiveanalysis_website_/) ||
                        toState.name.match(/findaffiliates_bycompetition/) ||
                        toState.name.match(/analyzepublishers_/);

                    const isMobileState =
                        (toState.name.match(/apps-/) ||
                            toState.name.match(/companyresearch_app_/) ||
                            toState.name.match(/keywords-/) ||
                            toState.name === "appcategory-topkeywords") &&
                        !toState.name.match(/-home/);

                    if (isWebsiteState) {
                        // enable filters (they might be disabled by individual controllers
                        if ($rootScope.global.unsupportedFilter) {
                            $rootScope.global.pageStatus = "error";
                        } else {
                            $rootScope.global.pageStatus = "success";
                        }

                        $rootScope.global.cssSection = (
                            toState.pageId.subSection +
                            (toState.pageId.subSubSection ? "/" + toState.pageId.subSubSection : "")
                        ).replace("/", "-");
                        // make loader appear even after cache.

                        // Clear universal search on web analysis
                        chosenItems.$clear();

                        $timeout(() => {
                            $rootScope.global.loading = false;
                        }, 400);
                    }

                    if (isMobileState) {
                        // clear universal search for mobile apps
                        chosenSites.clear(toParams);
                    }

                    // Clear universal search on homepage and dashboard
                    if (toState.clearSearch) {
                        chosenItems.$clear();
                        chosenSites.clear(toParams);
                    }
                });

                // updating routing state just before rendering the new page view (before its controller is invoked)
                $rootScope.$on("navChangeNewPageView", () => {
                    $ngRedux.dispatch<any>(applyCurrentPage());
                });

                $rootScope.getSelectedMenuName = () => {
                    const current = swNavigator.current();
                    return current.menuId || current.name;
                };

                $rootScope.getSelectedMenuTitle = () => {
                    return swNavigator.current().pageTitle;
                };

                $rootScope.hidePageTitle = () => {
                    return swNavigator.current().hidePageTitle;
                };

                $rootScope.global.rtgTopBar = window.width() <= 960 ? "false" : "true";

                // TopBar track link param
                window.VWOService = new VWOService();

                $rootScope.$on("navUpdate", (event, toState, toParams) => {
                    $ngRedux.dispatch(
                        urlChange({
                            toParams,
                            stateConfig: toState,
                        }),
                    );
                    // update config object according to state's configId
                    const component = swNavigator.getConfigIdFromStateConfig(toState, toParams);
                    if (component) {
                        swSettings.setCurrent(component);
                    } else {
                        swLog.error("Cannot find component after navUpdate");
                    }

                    if (
                        toState.name !== "appcategory-leaderboard" &&
                        toState.name.indexOf("leadGenerator") === -1 &&
                        toState.name.indexOf("Workspace") === -1
                    ) {
                        // TODO : LIOR - remove once this section is not needed
                        const unsupportedDuration = !swSettings.allowedDuration(toParams.duration);
                        const unsupportedCountry = !swSettings.allowedCountry(toParams.country);
                        const unsupportedDomain =
                            (toParams.webSource === "MobileWeb" ||
                                toState.pageId.subSection + "/" + toState.pageId.subSubSection ===
                                    "content/subdomains") &&
                            toParams.isWWW === "-";
                        if (unsupportedDuration || unsupportedCountry || unsupportedDomain) {
                            return;
                        }
                    }
                    // end part

                    if (webSourceNavChangeHandler(event, toState, toParams)) {
                        return;
                    }

                    const trackPageViewOnSearchUpdate =
                        toState.data && angular.isDefined(toState.data.trackPageViewOnSearchUpdate)
                            ? toState.data.trackPageViewOnSearchUpdate
                            : true;
                    if (!trackPageViewOnSearchUpdate) {
                        return;
                    }
                    const locals = {
                        toState,
                        toParams,
                        event,
                    };

                    $injector.invoke(toState.data.pageViewTracking, toState.data, locals);
                });

                window.on("resize", () => {
                    $rootScope.global.rtgTopBar = window.width() <= 960 ? "false" : "true";
                    if (!$rootScope.$$phase) {
                        $rootScope.$digest();
                    }
                    $rootScope.$broadcast("windowResize");
                    // $ngRedux.dispatch(windowResizeAction(window.width(), window.height()));
                });

                setTimeout(() => {
                    getUserCompareStatue().then((userCompareStatus) => {
                        $ngRedux.dispatch(setUserCompareStatusAction(userCompareStatus));
                    });
                    getAllStatesCompareStatus().then((allStatesCompareStatus) => {
                        $ngRedux.dispatch(setAllStatesCompareStatusAction(allStatesCompareStatus));
                    });
                    if (swSettings.components.Home.resources.Impersonates) {
                        let showImpersonationTooltip;
                        try {
                            showImpersonationTooltip = JSON.parse(
                                $window.localStorage.getItem("impersonationRequested"),
                            );
                            if (showImpersonationTooltip) {
                                $window.localStorage.removeItem("impersonationRequested");
                            }
                        } catch (e) {
                            swLog.error("Error: cannot get item in local storage");
                        }
                        $ngRedux.dispatch(startImpersonation(showImpersonationTooltip));
                    }
                });
            },
        );
};
