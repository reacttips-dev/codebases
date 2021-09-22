import swLog from "@similarweb/sw-log";
import angular, {
    IDocumentService,
    ILocationService,
    IRootScopeService,
    ITimeoutService,
} from "angular";
import {
    RawParams,
    TransitionOptions,
    StateOrName,
    StateService,
    StateParams,
    UrlMatcherFactory,
    UrlRouter,
    HrefOptions,
} from "@uirouter/angularjs";
import { swSettings } from "common/services/swSettings";
import * as _ from "lodash";
import { IRoutingMiddleware } from "routes/middleware/types";
import DurationService from "services/DurationService";
import { IRouterState } from "../../../app/routes/allStates";
import { SearchTypes } from "common/services/searchTypesHelperService";
import { Solutions2Package } from "common/services/solutions2Helper";
import { apiHelper } from "common/services/apiHelper";
import { SwTrack } from "services/SwTrack";

const HISTORY_SIZE = 1;

interface IRouteHistoryEntry {
    state: IRouterState;
    params: any;
}

export class SwNavigator {
    private static isErrorObj(obj) {
        return _.has(obj, "error");
    }

    private static getErrorCode(errorObj) {
        return errorObj.error || (Array.isArray(errorObj) && errorObj[0].error);
    }

    private tmpNextState: IRouterState;
    private tmpNextParams: StateParams;
    private swSettings = swSettings;
    private routeHistory: IRouteHistoryEntry[] = new Array(HISTORY_SIZE).fill(null); // 0 index is last, and so on
    // When getting state params and merging them with defaultQuery params results in default params overriding state params.
    // Params in this array will take precidence over default params. This case only when there are state param and default param present.
    private lockedStateParams = ["duration"];

    constructor(
        private $state: StateService,
        private $stateParams: StateParams,
        private $urlRouter: UrlRouter,
        private $urlMatcherFactory: UrlMatcherFactory,
        private $location: ILocationService,
        private $injector: angular.auto.IInjectorService,
        private $rootScope: IRootScopeService,
        private $document: IDocumentService,
        private $timeout: ITimeoutService,
        private appAnalysisConfig,
        private allStates: IRouterState[],

        private routingMiddleware: IRoutingMiddleware,
    ) {
        this.initEvents();
    }

    public initEvents() {
        this.$rootScope.$on(
            "$stateChangeSuccess",
            (event, toState, toParams, fromState, fromParams) => {
                // track intercom events
                this.tmpNextState = null;
                this.tmpNextParams = null;
                SwTrack.intercom.trackEvent(
                    "Navigation",
                    JSON.stringify({
                        nav_to: toState.name,
                        nav_from: fromState.name || null,
                    }),
                    "",
                );
                SwTrack.intercom.runCustomAction("update");

                // push route to stored history
                this.routeHistory = [
                    { state: fromState, params: fromParams },
                    ...this.routeHistory.slice(0, HISTORY_SIZE - 1),
                ];
                /* artem.maksimenko: Disabled when moved to UI router 1.0 couldnt find alternative, should be rewritten
                if (this.isWebsiteAnalysis()) {
                    // this code searches all resolved  values for website pages, and searches for error objects.
                    // if an error is found a 'navChangeError' is $broadcast
                    const resolve = this.$state.current.resolve;
                    const resolveKeys = _.keys(resolve.$$promises);
                    const resolveValues = _.values(_.pick(resolve.$$values, resolveKeys));

                    const errorObj = _.filter(resolveValues, _.isObject);
                    let shouldBroadcastError = false;
                    if (resolve.$$values.resolvePartial) {
                        // find if all of the resolves contains an error
                        shouldBroadcastError = _.every(errorObj, SwNavigator.isErrorObj);
                    } else {
                        // find if one of the resolves contains an error
                        shouldBroadcastError = _.some(errorObj, SwNavigator.isErrorObj);
                    }

                    if (shouldBroadcastError) {
                        this.$rootScope.$broadcast(
                            "navChangeError",
                            toState,
                            toParams,
                            fromState,
                            fromParams,
                            SwNavigator.getErrorCode(errorObj),
                            "state",
                        );
                        return;
                    }
                }
*/
                this.routingMiddleware.run(
                    "afterTransition",
                    event,
                    toState,
                    toParams,
                    fromState,
                    fromParams,
                );

                this.$rootScope.$broadcast(
                    "navChangeSuccess",
                    toState,
                    toParams,
                    fromState,
                    fromParams,
                    "state",
                );
            },
        );

        this.$rootScope.$on(
            "$stateChangeStart",
            (event, toState, toParams, fromState, fromParams, options, $transition$) => {
                this.routingMiddleware.run(
                    "beforeTransition",
                    event,
                    toState,
                    toParams,
                    fromState,
                    fromParams,
                );

                if (!event.defaultPrevented) {
                    const toConfigId = this.getConfigIdFromStateConfig(toState, toParams);
                    const innerEvent = this.$rootScope.$broadcast(
                        "navChangeStart",
                        toState,
                        toParams,
                        fromState,
                        fromParams,
                        toConfigId,
                        $transition$,
                    );
                    if (innerEvent.defaultPrevented) {
                        event.preventDefault();
                    } else {
                        this.tmpNextState = toState;
                        this.tmpNextParams = toParams;
                    }
                }
            },
        );

        // consolidating routeUpdate event. It occurs only when the searc/query param has changed.
        // in ng-route there is a builtin $routeUpdate, but in ui-router we need to implement it.
        this.$rootScope.$on("$locationChangeSuccess", (event, newLocation, oldLocation) => {
            if (newLocation === oldLocation || !oldLocation) {
                return;
            } else {
                if (_.includes(oldLocation, "#") && _.includes(newLocation, "#")) {
                    const oldPath = oldLocation.split("#")[1].split("?")[0];
                    const newPath = newLocation.split("#")[1].split("?")[0];
                    if (newPath === oldPath) {
                        // the timeout is needed because we don;t have the new state params now.
                        this.$timeout(() =>
                            this.$rootScope.$broadcast(
                                "navUpdate",
                                this.tmpNextState || this.current(),
                                this.tmpNextParams || this.getParams(),
                                "state",
                            ),
                        );
                    }
                }
            }
        });

        // error handling
        this.$rootScope.$on(
            "$stateChangeError",
            (event, toState, toParams, fromState, fromParams, error) => {
                const innerEvent = this.$rootScope.$broadcast(
                    "navChangeError",
                    toState,
                    toParams,
                    fromState,
                    fromParams,
                    error,
                    "state",
                );
                if (innerEvent.defaultPrevented) {
                    event.preventDefault();
                }
            },
        );
    }

    // Recursive function to get state configId if present, otherwise get parent's state configId
    public getConfigId(state, params?) {
        if (!state || (!state.configId && !state.parent)) {
            return null;
        }
        if (!state.configId) {
            if (state.parent) {
                return this.getConfigId(this.getState(state.parent));
            } else {
                swLog.error('Missing "configId" property in "' + state.name + '" state?');
                return null;
            }
        } else {
            if (_.isFunction(state.configId)) {
                return this.$injector.invoke(state.configId, null, {
                    toState: state,
                    toParams: params,
                });
            } else {
                return state.configId;
            }
        }
    }

    /**
     * Recursivley search through the state tree to find the nearest parent
     * state that contains a "secondaryBarType" field. this is used by the
     * Pro Secondary Bar to resolve what its type should be.
     */
    public getNearestStateWithSecondaryBarType(state: IRouterState): IRouterState {
        // In case the current state contains this field - then the search is over <3
        if (state.secondaryBarType) {
            return state;
        }

        // otherwise - search through the state tree upwards, untill a state with the bar type field
        // is found, or until we reached the top of the tree without finding any such state.
        const stateParent = state.parent ? this.getState(state.parent) : null;
        return stateParent ? this.getNearestStateWithSecondaryBarType(stateParent) : null;
    }

    public getPropertyValueFromHierarchy(stateOrName: string | IRouterState, property: string) {
        if (!stateOrName) {
            return null;
        }
        const pageState = this.getState(stateOrName);
        return (
            pageState[property] ?? this.getPropertyValueFromHierarchy(pageState.parent, property)
        );
    }

    public getNearestStateWithSecondaryOpenStatus(state: IRouterState): IRouterState {
        if (state.isSecondaryBarOpen) {
            return state;
        }

        const stateParent = state.parent ? this.getState(state.parent) : null;
        return stateParent ? this.getNearestStateWithSecondaryOpenStatus(stateParent) : null;
    }

    public getPackageName(state: IRouterState): Solutions2Package {
        // In case the current state contains this field - then the search is over <3
        if (state.packageName) {
            return state.packageName;
        }

        // otherwise - search through the state tree upwards, untill a state with the bar type field
        // is found, or until we reached the top of the tree without finding any such state.
        const stateParent = state.parent ? this.getState(state.parent) : null;
        return stateParent ? this.getPackageName(stateParent) : null;
    }

    public getConfigIdFromStateConfig(toState, toParams) {
        let configId = typeof toState.name === "string" ? this.getState(toState.name).configId : "";
        if (!configId || typeof configId === "function") {
            // try from childStates
            configId = this.getConfigIdFromChildStates(
                toState.childStates,
                toParams.webSource,
                toParams.selectedTab,
            );
            if (!configId) {
                // read from state itself
                configId = this.getConfigId(toState, toParams);
                // possible sub component
                configId = this.getAppStoreSubComponent(configId, toParams);
            }
        }
        return configId;
    }

    /* Public */

    /**
     * @ngdoc function
     * get the current state/route params, including query params
     * @returns {{}}
     */
    public getParams() {
        return angular.copy(this.$state.params);
    }

    /**
     * @ngdoc function
     * get AppStore from passed params object or from current state params
     * @returns {string} possible return values: 'IOS'/'Android'/''
     */
    public getComponentAppStoreSuffix(toParams) {
        const params = toParams || this.$state.params;
        if (params.appId) {
            return params.appId.charAt(0) === "1" ? "IOS" : "Android";
        }
        return "";
    }

    /**
     * @ngdoc function
     * update state/route query params (those which are after the '?' in the URL)
     * @param {obj} obj object with the data to update, as key/value pairs
     * @param {options} options
     * @param {boolean} replaceHistory flag to replace the browser history
     */
    public updateQueryParams(obj, options, replaceHistory) {
        const defaultOptions = {
            location: true,
            reload: true,
        };
        options = [defaultOptions, options].reduce(Object.assign, {});
        this.$state.go(this.$state.current.name, Object.assign(this.$stateParams, obj), options);
        if (replaceHistory) {
            this.$location.replace();
        }
    }

    /**
     * @ngdoc function
     * get the state/route params transformed to match the API
     * @returns {{}}
     */
    public getApiParams(params?) {
        const rawParams = params || this.getParams();
        return apiHelper.transformParamsForAPI(rawParams);
    }

    /**
     * get an instance of a ApiParamsBuilder for the current params
     * @returns {ApiParamsBuilder}
     */
    public getApiParamsBuilder() {
        const rawParams = this.getParams();
        return apiHelper.getApiParamsBuilder(rawParams);
    }

    /**
     * @ngdoc function
     * update state/route params
     * @param {obj} params object with the data to update, as key/value pairs
     */
    public updateParams(params, options?) {
        if (params.isVirtual && params.key) {
            params.key = "*" + params.key;
        }
        return this.$state.go(this.$state.current.name, params, {
            inherit: true,
            ...options,
        });
    }

    /**
     * @ngdoc function
     * update state/route params and apply a digest loop
     * @param {obj} params object with the data to update, as key/value pairs
     */
    public applyUpdateParams(params, options?) {
        this.$rootScope.$apply(() => {
            this.updateParams(params, options);
        });
    }

    /**
     * checks the params, modifies them if required, and returns the modified object if modified, and null if not.
     * TODO: this should be per param per module
     *
     * @param origPrams
     * @returns {{} | null}
     */
    public validateParams(origPrams, state) {
        const params = angular.copy(origPrams);
        let propName;
        let testedValue;
        const configId = this.getConfigId(state);
        const configObj = configId && this.swSettings.components[configId];
        if (params.key) {
            propName = "key";
            testedValue = params.key;
        }
        if (params.appId) {
            propName = "appId";
            testedValue = params.appId;
        }
        if (state && state.minDurationRange) {
            const { from, to } = DurationService.getDurationData(
                origPrams.duration,
                undefined,
                configId,
            ).forAPI;
            const diffSymbol = DurationService.getDiffSymbol(from, to);
            const diffNumber = parseInt(diffSymbol.replace("m"), 10);
            if (diffNumber < state.minDurationRange) {
                params["duration"] = configObj.defaultParams["duration"];
                return params;
            }
        }

        if (testedValue) {
            const parts = testedValue.split(",");
            const mainPart = parts[0];
            switch (propName) {
                case "key":
                    if (configObj && configObj.isDemo && mainPart !== configObj.demo.website) {
                        params[propName] = configObj.demo.website;
                        return params;
                    }
                    break;
                case "appId":
                    if (configObj && configObj.isDemo && mainPart !== configObj.demo.appId) {
                        params[propName] = configObj.demo.appId;
                        return params;
                    }
                    break;
            }
            const allowedCompetitorsCount = Number(configObj.resources.AllowedCompetitorsCount);
            if (parts.length > allowedCompetitorsCount + 1) {
                params[propName] = _.take(parts, allowedCompetitorsCount + 1).join();
                return params;
            } else {
                return null;
            }
        }
        return null;
    }

    /**
     * @ngdoc function
     * returns the state and params from the history
     * @param {number} index?
     */
    public getRouteHistory(index?: number) {
        return index === undefined ? this.routeHistory : this.routeHistory[index];
    }

    /**
     * @ngdoc function
     * check if the current state is a app analysis state
     * @returns {boolean}
     */
    public isAppAnalysis(state) {
        state = state || this.$state.current;

        return (
            state.parent &&
            (!!state.parent.match(/^apps|companyresearch_app/) ||
                state.parent.includes("salesIntelligence-apps"))
        );
    }

    /**
     * @ngdoc function
     * check if the current state is a app category state
     * @returns {boolean}
     */
    public isAppCategory(state) {
        state = state || this.$state.current;
        return (
            state.parent &&
            (!!state.parent.match(/^appcategory|marketresearch_appmarketanalysis/) ||
                state.parent.includes("salesIntelligence-appcategory"))
        );
    }

    /**
     * @ngdoc function
     * check if the current state is a app engagementoverview state
     * @returns {boolean}
     */
    public isAppEngagementOverview(state) {
        state = state || this.$state.current;
        return (
            state.name === this.appAnalysisConfig["apps-engagementoverview"].name ||
            state.name === "companyresearch_app_appengagementoverview"
        );
    }

    /**
     * @ngdoc function
     * check if the current state is a app home state
     * @returns {boolean}
     */
    public isAppHome(state?: IRouterState) {
        state = state || this.current();
        return state.name === this.appAnalysisConfig["apps-home"].name;
    }

    /**
     * @ngdoc function
     * check if the current state is a website analysis state
     * @returns {boolean}
     */
    public isWebsiteAnalysis(state?: IRouterState) {
        state = state || this.current();
        return (
            state.parent &&
            !!state.parent.match(
                /^website|competitiveanalysis_website|companyresearch_website|affiliateanalysis_root|findaffiliate_root|analyzepublishers_root|findpublishers_bycompetition_root|findDisplayAds_bycompetitor_root|findVideoAds_bycompetitor_root|findadnetworks_bycompetition|findSearchTextAds_bycompetitor_root|findProductListingAds_bycompetitor|findkeywords_bycompetition_websiteanalysis|accountreview_website/,
            )
        );
    }

    /**
     * @ngdoc function
     * check if the current state is an industry analysis state
     * @returns {boolean}
     */
    public isIndustryAnalysis(state?: IRouterState) {
        state = state || this.current();
        return (
            (state.parent &&
                !!state.parent.match(
                    /^industry|marketresearch_webmarketanalysis|finaaffiliate_byindustry_root|findpublishers_byindustry_root|findadnetworks_byindustry_root|findkeywords_byindustry_root/,
                )) ||
            state.name.includes("salesIntelligence-findLeads-industry-result")
        );
    }

    /**
     * @ngdoc function
     * check if the current state is an old sales
     * @returns {boolean}
     */
    public isOldSales(state?: IRouterState) {
        // @Vitaliy Chernyavskyi, look like it can be replaced with existing isWorkSpace function, no?
        const _state = state || this.current();
        return (
            _state.name === "salesWorkspace" && _state.absoluteUrl?.includes("/workspace/sales?")
        );
    }

    /**
     * @ngdoc function
     * check if the current state is a Google keywords analysis state
     * @returns {boolean}
     */
    public isGooglePlayKeywordAnalysis(state?: IRouterState) {
        state = state || this.current();
        return state.parent && state.parent.includes("keywords");
    }

    /**
     * @ngdoc function
     * check if the current state is a keywords analysis state
     * @returns {boolean}
     */
    public isKeywordAnalysis(state?: IRouterState) {
        state = state || this.current();
        return (
            (state?.parent && state?.parent?.includes("keywordAnalysis")) ||
            state?.parent?.includes("findkeywords_keywordGeneratorTool_root") ||
            state.name.match(/marketresearch_keywordmarketanalysis/) ||
            state.name.includes("findaffiliates_bykeywords") ||
            state.name.includes("findkeywords_amazonKeywordGenerator") ||
            state.name.includes("findkeywords_youtubeKeywordGenerator") ||
            state.name.includes("salesIntelligence-findLeads-keyword-results")
        );
    }

    public isWorkSpace(state: IRouterState = this.current()) {
        return state && /workspace/i.test(state.name);
    }

    /**
     * @ngdoc function
     * check if the current state is a home page
     * @returns {boolean}
     */
    public isHomePage(state?: IRouterState) {
        state = state || this.current();
        return (state.parent && !!state.parent.match(/^home/)) || !!state.name.match(/home/);
    }

    /**
     * @ngdoc function
     * returns home state for research
     * @returns {obj}
     */
    public getResearchHomeState() {
        return this.getState("proModules");
    }

    /**
     * @ngdoc function
     * check if the current state is a dashboard
     * @returns {boolean}
     */
    public isDashboard(state?: IRouterState) {
        state = state || this.current();
        return (
            (state.parent && !!state.parent.match(/^dashboard/)) || !!state.name.match(/dashboard/)
        );
    }

    /**
     * @ngdoc function
     * check if the current state is grow homepage
     * @returns {boolean}
     */
    public isGrowHome(state?: IRouterState) {
        state = state || this.current();
        return (state.parent && !!state.parent.match(/^grow/)) || !!state.name.match(/grow/);
    }

    /**
     * @ngdoc function
     * returns home state for grow
     * @returns {obj}
     */
    public getGrowHomeState() {
        return this.getState("growHomepage");
    }

    /**
     * @ngdoc function
     * check if the current state is grow homepage
     * @returns {boolean}
     */
    public isLeadGenerator(state?: IRouterState) {
        state = state || this.current();
        return (
            (state.parent && !!state.parent.match(/^leadGenerator/)) ||
            !!state.name.match(/leadGenerator/)
        );
    }

    /**
     * @ngdoc function
     * check if the current state is a idustry conversion state
     * @returns {boolean}
     */
    public isIndustryConversion(state) {
        state = state || this.$state.current;
        return (
            (state.parent && !!state.parent.match(/^conversion/)) ||
            (state.name && !!state.name.match(/^conversion/))
        );
    }

    /**
     * @ngdoc function
     * check if the current state is a custom segments state
     * @returns {boolean}
     */
    public isCustomSegments(state) {
        state = state || this.$state.current;
        return state.name && !!state.name.match(/^segments/);
    }
    /**
     * @ngdoc function
     * get the pageId object of the current state/route, as defined in the state/route definition object
     * @returns {obj}
     */
    public getCurrentPageId() {
        return this.current().pageId;
    }

    /**
     * @ngdoc function
     * get the category of the current state/route
     * @returns {string}
     */
    public getPageCategory() {
        return this.getCurrentPageId().section;
    }

    /**
     * @ngdoc function
     * get the module of the current state
     * @returns {string}
     */
    public getCurrentModule() {
        const currModule = this.current().name;
        if (currModule && currModule.indexOf(".") > 0) {
            return currModule.split(".")[0];
        }
        if (currModule && currModule.indexOf("-") > 0) {
            return currModule.split("-")[0];
        }

        // The newer option is _ separation
        return currModule.split("_")[0];
    }

    /**
     * @ngdoc function
     * get the module of the state
     * @returns {string}
     */
    public getStateModule(state: IRouterState) {
        const moduleName = state.name.split(state.name.indexOf(".") > 0 ? "." : "_")[0];
        if (moduleName.endsWith("-root")) {
            return moduleName.replace("-root", "");
        }
        return moduleName;
    }

    public go(stateOrName: StateOrName, params?: RawParams, options?: TransitionOptions) {
        return this.$state.go(stateOrName as any, params, options);
    }

    /**
     * @ngdoc function
     * check if the current state is equal to the given state name/object
     * @param stateOrName {string | IState}
     * @param params
     * @param options
     * @returns {boolean}
     */
    public currentStateIncludes(
        stateOrName: StateOrName,
        params?: RawParams,
        options?: TransitionOptions,
    ) {
        return this.$state.includes(stateOrName as any, params, options);
    }

    /**
     * @ngdoc function
     * check if the current state is  equal or it's a child of a given state name/object
     * @param stateOrName {string | IState}
     * @param params
     * @returns {boolean}
     */
    public currentStateIs(stateOrName: StateOrName, params?: {}) {
        return this.$state.is(stateOrName as any, params);
    }

    public currentSearchTypeFromState() {
        if (this.currentStateIncludes("websites")) {
            return SearchTypes.WEBSITE;
        }

        if (this.currentStateIncludes("apps")) {
            return SearchTypes.MOBILE;
        }

        if (this.currentStateIncludes("keywords")) {
            return SearchTypes.PLAYKEYWORD;
        }

        return SearchTypes.UNIVERSAL;
    }

    /**
     * @ngdoc function
     * generate a url for the given state name
     * @param stateOrName
     * @param {Object} params
     * @param {Object} [options]
     * @returns {string}
     */
    public href(stateOrName: StateOrName, params?: RawParams, options?: HrefOptions) {
        return this.$state.href(stateOrName as any, params, options);
    }

    /**
     * @ngdoc function
     * get the current state/route
     * @returns {obj}
     */
    public current(): IRouterState {
        return (this.$state.current || {}) as IRouterState;
    }

    /**
     * @ngdoc function
     * get the state/route object for a given name
     * @returns {obj}
     * @param stateOrName
     * @param type object type {route|state}
     */
    public getState(stateOrName: StateOrName): IRouterState {
        return this.$state.get(stateOrName) as IRouterState;
    }

    public getPropertyForState(stateName, property) {
        const state = this.getState(stateName);
        if (state) {
            return state[property];
        } else {
            return "";
        }
    }

    public getStateForPageId(pageId) {
        const state = _.find(this.allStates, {
            section: pageId.section,
            subSection: pageId.subSection,
            subSubSection: pageId.subSubSection,
        });
        return state;
    }

    /**
     * Retreives the current nav item query params, merged with
     * the current state nav params
     */
    public getItemParams(navItem) {
        if (!navItem || (!navItem.state && !navItem.route)) {
            return {};
        }

        const stateParams = this.getParams();

        // delete some params
        delete stateParams.page;
        delete stateParams.filter;
        delete stateParams.orderby;
        delete stateParams.orderBy;

        const stateObj = this.getState(navItem.state);
        const configId = this.getConfigId(stateObj);
        const configObj = configId && this.swSettings.components[configId];

        // fill default params from config, if the key isn't presented in current state params
        if (configObj && configObj.defaultParams) {
            _.defaults(stateParams, configObj.defaultParams);
        }

        // add default query params
        const defaultQueryParams = {};
        if (stateObj && stateObj.defaultQueryParams) {
            Object.assign(defaultQueryParams, stateObj.defaultQueryParams);
        }
        if (navItem && navItem.defaultQueryParams) {
            Object.assign(defaultQueryParams, navItem.defaultQueryParams);
        }
        this.lockedStateParams.map((property) => {
            if (
                stateParams.hasOwnProperty(property) &&
                defaultQueryParams.hasOwnProperty(property)
            ) {
                delete defaultQueryParams[property];
            }
        });

        Object.assign(stateParams, defaultQueryParams);
        _.merge(stateParams, navItem.overrideParams);

        return stateParams;
    }

    /**
     * Used by new sidebar to build dynamic links (given different filters etc.)
     * @param menuItem - single item (child/parent) in a sidebar
     * @returns {string}
     */
    public navLink(menuItem, decodeHref) {
        if (!menuItem || (!menuItem.state && !menuItem.route)) {
            return "";
        }

        const currentState = this.current();
        const stateParams = this.getParams();
        let hrefStr;
        let itemName;

        if (!currentState.pageId) {
            return "";
        }

        if (currentState.pageId.section === "empty") {
            return "javascript:void(0)";
        }

        // delete some params
        delete stateParams.page;
        delete stateParams.filter;
        delete stateParams.orderby;
        delete stateParams.orderBy;

        itemName = menuItem.state;

        const stateObj = this.getState(itemName);
        const configId = this.getConfigId(stateObj);
        const configObj = configId && this.swSettings.components[configId];

        // fill default params from config, if the key isn't presented in current state params
        if (configObj && configObj.defaultParams) {
            _.defaults(stateParams, configObj.defaultParams);
        }

        // add default query params
        const defaultQueryParams = {};
        if (stateObj && stateObj.defaultQueryParams) {
            Object.assign(defaultQueryParams, stateObj.defaultQueryParams);
        }
        if (menuItem && menuItem.defaultQueryParams) {
            Object.assign(defaultQueryParams, menuItem.defaultQueryParams);
        }
        this.lockedStateParams.map((property) => {
            if (
                stateParams.hasOwnProperty(property) &&
                defaultQueryParams.hasOwnProperty(property)
            ) {
                delete defaultQueryParams[property];
            }
        });
        Object.assign(stateParams, defaultQueryParams);

        _.merge(stateParams, menuItem.overrideParams);

        hrefStr = this.href(itemName, stateParams);
        if (decodeHref !== false) {
            hrefStr = decodeURIComponent(hrefStr);
        }

        return hrefStr;
    }

    /**
     * @ngdoc function
     * reload the current state/route.
     * @param {string|object} stateName - A state name or a state object, which is the root of the resolves to be re-resolved.
     * @returns {promise}
     */
    public reload(stateName?) {
        return this.$state.reload(stateName);
    }

    public getStateUrl(state, params) {
        let newPath = this.$state.href(state, params);
        if (!newPath) {
            // This is a solution for when there is no $state configured
            let stateObj = this.getState(state);
            if (!stateObj) {
                swLog.error("Could not find state object for %s", state);
                return "";
            }
            let url = stateObj.url as string;
            // append state parents
            while (stateObj && stateObj.parent) {
                stateObj = stateObj["parentObj"] as IRouterState;
                // stateObj = getState(stateObj.parent, 'state');
                if (stateObj && stateObj.url) {
                    url = (stateObj.url as string) + url;
                }
            }
            const urlMatcher = this.$urlMatcherFactory.compile(url);
            newPath = this.$urlRouter.href(urlMatcher, params, { absolute: true });
        }

        return decodeURIComponent(newPath);
    }

    public validateResloves() {
        return _.some(arguments, SwNavigator.isErrorObj);
    }

    public getModuleStates(module) {
        return _.filter(
            this.allStates,
            (state: IRouterState) => state.pageTitle && state.name.indexOf(module) !== -1,
        );
    }

    /**
     * ported from similarweb.utils
     * used for website search in sw-universal-search directive
     * @param searchTerm
     * @returns {*}
     */
    public getValidSearchTerm(searchTerm, shouldAddCom) {
        const dots = searchTerm.split(".").length - 1;
        if (!searchTerm) {
            return "";
        }
        const invalidDomainChars = /[\s,!@#$%^&*()_=+]+/g;
        /*                if (invalidDomainChars.test(searchTerm)) {
            return null;
            }*/
        searchTerm = searchTerm.replace(invalidDomainChars, "");
        searchTerm = searchTerm.trim().toLowerCase();
        const q = searchTerm.indexOf("?");
        if (q !== -1) {
            searchTerm = searchTerm.substr(0, q);
        }
        if (searchTerm.indexOf("http://") === 0) {
            searchTerm = searchTerm.substr(7);
        }
        if (searchTerm.indexOf("https://") === 0) {
            searchTerm = searchTerm.substr(8);
        }
        const directories = searchTerm.indexOf("/");
        if (directories !== -1) {
            searchTerm = searchTerm.substr(0, directories);
        }
        if (dots === 0 && !!shouldAddCom) {
            searchTerm += ".com";
        }
        if (searchTerm.slice(-1) === "." && dots === 1) {
            searchTerm += "com";
        }
        if (searchTerm.toLowerCase().indexOf("www.") === 0) {
            searchTerm = searchTerm.replace("www.", "");
        }

        return searchTerm;
    }

    private getConfigIdFromChildStates(configObj, webSource, selectedTab) {
        webSource = _.isString(webSource) ? webSource.toLowerCase() : "desktop";
        selectedTab = _.isString(selectedTab) ? selectedTab.toLowerCase() : "pages";
        if (typeof configObj === "function") {
            return configObj({ webSource, selectedTab });
        }
        // childStates configObj is { webSource: { configId: "id" } } or { webSource: { selectedTab: { configId: "id" } } }
        if (_.isObject(configObj)) {
            // try webSource
            if (webSource in configObj) {
                configObj = configObj[webSource];
            }
            // try selectedTab
            if (selectedTab in configObj) {
                configObj = configObj[selectedTab];
            }
            // error
            if (!configObj || !configObj.configId) {
                swLog.error("Could not find configId from childStates");
                return null;
            }
            return configObj.configId;
        }
        return null;
    }

    private getAppStoreSubComponent(configId, toParams) {
        const appStore = this.getComponentAppStoreSuffix(toParams);
        if (!appStore) {
            return configId;
        }
        const subComponent = configId + appStore;
        if (subComponent in this.swSettings.components) {
            return subComponent;
        }
        return configId;
    }
}

angular.module("sw.common").service("swNavigator", SwNavigator);
