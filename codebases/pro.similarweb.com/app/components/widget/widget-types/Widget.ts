import angular, { resource } from "angular";
import swLog from "@similarweb/sw-log";
import * as _ from "lodash";
import DurationService, { IDurationData } from "services/DurationService";
import SWWidget from "./widget.reg";
import { IDataFetcher, IDataFetcherFactory } from "../widget-fetchers/IDataFetcher";
import { WidgetExporter } from "exporters/WidgetExporter";
import CountryService from "services/CountryService";
import widgetSettings from "components/dashboard/WidgetSettings";
import { IPptSlideExportRequest } from "services/PptExportService/PptExportServiceTypes";
import { UserCustomCategoryService } from "services/category/userCustomCategoryService";
import categoryService from "common/services/categoryService";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";

export enum WidgetState {
    EMPTY,
    LOADING,
    LOADED,
    ERROR,
}

export interface SWItem {
    id?: string;
    appKey?: string;
    store?: string;
    category?: string;
    name: string;
    image: string;
    isVirtual?: boolean;
}

export type IWidgetModelTypesWebSource = "Desktop" | "Total" | "Mobile";
export type IWidgetModelTypesType =
    | "BarChart"
    | "Graph"
    | "PieChart"
    | "SingleMetric"
    | "Table"
    | "ComparedBar"
    | "ComparedLine"
    | "IndustryKeywordsDashboardTable"
    | "IndustryReferralsDashboardTable"
    | "TopSitesTable"
    | "BarChartDemographics"
    | "BarChartMMXDashboard"
    | "PieChartMMXDashboard"
    | "BarChartDemographicsGender"
    | "AppEngagementMetricsDashboardGraph"
    | "LeaderBySourceTable";
export type IWidgetModelTypesFamily = "Website" | "Mobile";

export interface IWidgetKeyBase {
    name: string; //App name | website url | keyword | category etc.
    type: IWidgetModelTypesFamily;
    image?: string;
    icon?: string;
    url?: string;
    id?: string;
}

export interface IWidgetWebsiteKey extends IWidgetKeyBase {
    isVirtual: boolean;
}

export interface IWidgetMobileKey extends IWidgetKeyBase {
    id: string; //app's store id
    store: string; //google|apple
    appKey: string; //[0|1]_{id}
}

export interface IWidgetKeywordsKey extends IWidgetKeyBase {
    keyword?: boolean;
}

export interface IWidgetIndustryKey extends IWidgetKeyBase {
    category?: boolean;
}

export interface IWidgetModelFilters {
    orderBy?: string;
    timeGranularity?: "Daily" | "Weekly" | "Monthly";
    filter?: string;
    IncludeBranded?: string;
    IncludeOrganic?: string;
    IncludePaid?: string;
    isEvergreen?: boolean;
    sites?: string;
    FuncFlag?: string;
}

export interface IWidgetModel {
    dataMode?: string;
    country: number; //999, 840
    duration: string; //730d, 3m
    comparedDuration?: string | boolean;
    selectedChannel?: string;
    family?: IWidgetModelTypesFamily;
    type: IWidgetModelTypesType;
    webSource: IWidgetModelTypesWebSource;
    metric: string;
    key: Array<
        IWidgetWebsiteKey | IWidgetMobileKey | IWidgetIndustryKey | IWidgetKeywordsKey
    > | null;
    filters?: IWidgetModelFilters;
    ShouldGetVerifiedData?: boolean;
    width?: 1 | 2 | 3 | 4;
    customAsset?: boolean;
}

export interface IWidgetViewData {
    title: string;
    tooltip: string;
    country: string;
    duration: string;
    store?: string;
    key: Array<SWItem>;
}

export interface IWidgetParams {
    metric?: string;
    keys?: string;
    country?: number;
    from?: string;
    to?: string;
    isWindow?: boolean;
    store?: string;
    orderBy?: string;
    includeSubDomains?: boolean;
    timeGranularity?: "Daily" | "Weekly" | "Monthly";
    page?: number;
    webSource?: string;
    pageSize?: string;
    includeBranded?: boolean;
    device?: string;
    appMode?: string;
    terms?: string;
    ShouldGetVerifiedData?: boolean;
    filter?: string;
    isUtm?: boolean;
}

interface IWidgetProperties {
    title: string;
    type: string;
    metric: string;
    family: string;
    width: number;
    height: number;
    country: number;
    from: string;
    to: string;
    isWindow: boolean;
    keys: string;
    store?: string;
    forcedDuration?: string;
}

interface IMetricProperties {
    // should be extended by widget title property
    title: string;
    // should be inherited by widget
    family: string;
    component: string; //@todo: rename to componentId
    keyPrefix: string;
    state: string; //@todo: rename to stateName
    // Properties used only in widgetWizard
    dashboard: boolean; //@todo: rename to stateName
    order: number;
    androidOnly: boolean;
    dynamicSettings: boolean;
    disableDatepicker: boolean;
    hideMarkersOnDaily?: boolean;
}

export interface IWidgetViewOptions {
    cssClass?: string;
    loadingSize: number;
    showIndex?: boolean;
    showTitle: boolean;
    showTitleTooltip: boolean;
    showSubtitle: boolean;
    showLegend: boolean;
    legendAlign: string;
    showFrame: boolean;
    showSettings: boolean;
    showTopLine: boolean;
    titleType: string;
}

export interface IWidget<T> {
    // properties
    widgetState: WidgetState;
    type: string;
    data: any;
    metadata: any;
    utilityGroups: any;
    // getters/setters
    apiParams: IWidgetParams;
    viewData: IWidgetViewData;
    viewOptions: IWidgetViewOptions;
    templateUrl: string;

    isPptSupported?: () => boolean;
    getDataForPpt?: () => IPptSlideExportRequest;

    // methods
    getClass(): any;

    getWidgetConfig(): any;

    getWidgetMetricConfig(): any;

    getDataFetcher(): IDataFetcher<T>;

    onWidgetMount(...args: any[]): void;

    getData<T>(): void;

    onNewDataReceived(response: any): void;

    callbackOnGetData(response: any): void;

    initWidget(widgetConfig: any, context: string): void;

    initWidgetWithConfigs(config: any, context: string): void;

    runWidget(): void;

    getWidgetModel(): IWidgetModel;

    getWidgetFilters?(): IWidgetModelFilters;

    getExporter(): any;

    getProperties();

    canAddToDashboard(): boolean;

    hasShowMoreButton(): boolean;

    isDashboard(): boolean;

    handleUtilityAction(utility: any, value: any): void;

    findUtility(utilityName: string, group: number): any;

    updateApiParams(paramsToAdd: any): void;

    clearApiParams(paramsToDelete: any): void;

    on(eventName: string, ...args: any[]): void;

    emit(eventName: string, ...args: any[]): void;
}

export interface IWidgetResource {
    websiteAppsResource: resource.IResourceMethod<any>;
    resourceByController: resource.IResourceMethod<any>;
}

export interface IWidgetConfig {
    type: string;
    properties: any;
}

const defaultWidgetHeight = "200px";

export const SOURCES_TEXT = {
    websites: {
        Total: "All Traffic",
        Combined: "All Traffic",
        MobileWeb: "Mobile Web Only",
        "Mobile Web": "Mobile Web Only",
        Desktop: "Desktop Only",
    },
    industryAnalysis: {
        Desktop: "Desktop Only",
    },
    apps: {
        Google: "Google Play",
        Apple: "Apple Store",
        google: "Google Play",
        apple: "Apple Store",
    },
    keywords: {
        Google: "Google Play",
    },
    keywordAnalysis: {
        Desktop: "Desktop Only",
    },
};

export const getKeyForApi = function (key: SWItem[]) {
    if (key.length < 1) return { keys: "" };
    let store = key[0].store;
    let returnValue: any = {
        keys: key
            .map((item) => item.id || (item.isVirtual ? "*" + item.name : item.name))
            .join(","),
    };
    if (store) {
        returnValue.store = store.charAt(0).toUpperCase() + store.substr(1);
    }
    if (key[0].category) {
        returnValue.keys = key[0].category;
    }
    return returnValue;
};

export const emptyWidget = {
    id: null,
    pos: {},
    properties: {
        country: null,
        duration: null,
        comparedDuration: null,
        family: "Website",
        filters: {},
        key: [],
        metric: null,
        type: null,
    },
    getProperties: function (clone = false) {
        return clone ? angular.copy(this.properties) : this.properties;
    },
};

// Default widget view options are for custom dashboard widgets
const defaultViewOptions: IWidgetViewOptions = {
    cssClass: "swTable--simple",
    loadingSize: 5,
    showTitle: true,
    showTitleTooltip: false,
    showSubtitle: true,
    showLegend: true,
    legendAlign: "right",
    showFrame: true,
    showSettings: true,
    showTopLine: true,
    titleType: "link",
};

export abstract class Widget implements IWidget<any> {
    protected _params: any = {};
    protected _viewOptions: any = {};
    protected _viewData: any = {};
    protected _utilitiesData: any = {};
    protected _metricConfig: any;
    protected _metricTypeConfig: any;
    protected _widgetConfig: any;
    protected _widgetModel: IWidgetModel;
    protected _durationService = DurationService;
    protected _defaultFetcherFactory: IDataFetcherFactory<any>;
    protected _sitesResource: any;
    protected _swProfiler: any;

    _swNavigator: any;
    widgetConfig: any;
    private _widgetCacheService: any;
    private _i18nFilter: any;
    private _apiController: string;
    private _context: string;
    protected _autoFetchData: boolean = true;
    protected _$timeout: any;
    protected _$swNgRedux: any;
    protected _$injector: any;
    protected _dataFetcher: IDataFetcher<any>;

    id: string;
    nrInteraction: any;
    dashboardId: string;
    widgetState: number = WidgetState.LOADING;
    type: string;
    data: any;
    originalData: any;
    metadata: any;
    utilityGroups: any;
    titleUtility: any;
    bottomUtilities: any;
    pos: any;
    width: any;
    webSource: string;
    legendItems: any;
    durationObject: IDurationData;
    protected errorConfig: any = {
        icon: "no-data",
        messageTop: "home.dashboards.widget.table.error1",
        messageBottom: "home.dashboards.widget.table.error2",
        wide: true,
    };
    container: string;

    titleTemplates = {
        i18nKey: () => {
            return this._i18nFilter(
                this._widgetConfig.properties.title || this._metricConfig.title,
            );
        },
        i18nKeyDurationPrefix: () =>
            this.titleTemplates.i18nKey() + " (" + this._viewData.duration + ")",
        custom: () => this._widgetConfig.properties.title,
    };

    static register() {
        let clazz = this;
        let name = clazz.toString().match(/^function\s*([^\s(]+)/)[1];
        if (!name) {
            console.error(`Failed to register ${clazz}: missing name`);
        } else {
            SWWidget[name] = clazz;
        }
    }

    static $inject = [
        "swNavigator",
        "widgetCacheService",
        "i18nFilter",
        "defaultFetcherFactory",
        "$timeout",
        "sitesResource",
        "swProfiler",
        "$swNgRedux",
        "$injector",
    ];

    /*
     * Here _componentId is used to build the API endpoint url, in  the new method of '/api/componentId/metric/method'
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}

    /**
     * Static methods
     */
    /**
     * @ngdoc Classes
     * @module shared
     * @class Widget
     * @method parseKeyString
     * @static
     * @description used to set widget key from page url param
     * @todo temporary, key should be set from chosenItems service and not from url
     */
    static getWidgetResponsiveWidth(width: number) {
        const DASHBOARD_COLS = 12,
            RESPONSIVE_RATIO = 1.5;
        width = width * RESPONSIVE_RATIO;
        return width > DASHBOARD_COLS ? DASHBOARD_COLS : width;
    }

    static filterParse(filterString): Record<string, { operator: string; value: string }> {
        let filterObject = {};
        if (typeof filterString === "string" && filterString !== "") {
            filterString.split(",").forEach((filterString) => {
                let filterArray = filterString.split(";");
                filterObject[filterArray[0]] = {
                    operator: filterArray[1],
                    value: filterArray[2],
                };
            });
        }
        return filterObject;
    }

    static getWidgetMetadataType() {
        return "Base";
    }

    static getWidgetResourceType() {
        return "Base";
    }

    static filterStringify(filterObject) {
        let filterArray = [];
        _.each(filterObject, (filter, key) => {
            filterArray.push(`${key};${filter.operator};${filter.value}`);
        });
        return filterArray.join(",");
    }

    protected static toBoolean(value) {
        if (_.isString(value)) {
            return value.toLowerCase() === "true";
        }
        if (_.isBoolean(value)) {
            return value;
        }
        return false;
    }

    /**
     * Private methods
     */
    private _setUtilities() {
        let utilityGroups = widgetSettings.getWidgetUtilities(this._widgetConfig.utilityGroups);
        let utilityGroupsPartition = _.partition(
            utilityGroups,
            (utilityGroup: any) => utilityGroup.properties.className === "titleRowLeft",
        );
        this.utilityGroups = utilityGroupsPartition[1];
        // for container tabs
        if (utilityGroupsPartition[0].length) {
            this.titleUtility = utilityGroupsPartition[0][0]["utilities"][0];
        }

        // this code is for utilities below the widget-component section
        let groups = _.partition(
            this.utilityGroups,
            (utilityGroup: any) => utilityGroup.properties.className === "tableBottom",
        );
        if (groups[0].length) {
            this.bottomUtilities = groups[0];
        }
        this.utilityGroups = groups[1];
    }

    private _appendDurationToTitle() {
        let widgetProp = this._widgetConfig.properties;
        return widgetProp.title === "__ADD_DATE RANGE__" || widgetProp.appendDurationToTitle;
    }

    private _setInitialParams(widgetModelFilters) {
        let params: any = {};
        let widgetProp = this._widgetConfig.properties;
        let metricProp = this._metricConfig;
        let _isCompare = widgetProp.key.length > 1;
        let _metricFilters = widgetSettings.getMetricWidgetFilters(
            widgetProp.metric,
            widgetProp.type,
            _isCompare,
            true,
        );
        const _model = this._widgetConfig.properties;

        if (!_.isEmpty(_metricFilters)) {
            widgetProp.filters = Object.assign(_metricFilters || {}, widgetProp.filters || {});
        }
        widgetProp.duration = widgetProp.forcedDuration
            ? widgetProp.forcedDuration
            : widgetProp.duration;

        let widgetCustomApiParams = Object.assign(
            {},
            widgetSettings.getWidgetCustomApiParams(widgetProp, widgetProp.metric),
            widgetProp.apiParams,
            metricProp.apiParams,
            widgetModelFilters,
        );
        // use period over period only in supported metrics
        if (
            _.result(this._metricTypeConfig, "properties.periodOverPeriodSupport", false) ||
            _.result(this._widgetConfig, "properties.periodOverPeriodSupport", false)
        ) {
            this.durationObject = this._durationService.getDurationData(
                widgetProp.duration,
                widgetProp.comparedDuration,
                this._metricConfig.component,
            );
        } else {
            this.durationObject = this._durationService.getDurationData(
                widgetProp.duration,
                null,
                this._metricConfig.component,
            );
        }
        let widgetCache = this._getWidgetCache();
        let store = widgetProp.key.length > 0 && getKeyForApi(widgetProp.key).store;

        params.country = widgetProp.country;
        params.device = widgetProp.device;
        params.store = widgetProp.store;
        params.appMode = widgetProp.appMode || widgetProp.mode;
        params.terms = widgetProp.terms;
        params.metric = widgetSettings.getMetricId(widgetProp.metric);
        params.includeSubDomains = widgetProp.isWWW !== "-";
        params.webSource =
            _model.family === "Mobile"
                ? undefined
                : _.result(this._metricTypeConfig, "properties.options.desktopOnly", false)
                ? "Desktop"
                : widgetProp.webSource;

        if (widgetProp.categoryHash) {
            params.categoryHash = widgetProp.categoryHash;
        }

        if (widgetProp.customAsset) {
            const assetKey: any = _model.key;
            switch (widgetProp.customAsset) {
                case "Industry":
                    const customCategory = categoryService.getCategory(`*${assetKey[0].name}`);
                    if (customCategory) {
                        params.categoryHash = customCategory.categoryHash;
                    } else {
                        params.categoryHash = undefined;
                    }
                    break;
                case "Keyword":
                    const keywordsGroup: any = keywordsGroupsService.findGroupByName(
                        `${assetKey[0].name}`,
                    );
                    params.GroupHash = keywordsGroup.GroupHash;
            }
        }

        if (widgetProp.category) {
            params.category = categoryService.categoryQueryParamToCategoryObject(
                widgetProp.category,
            )?.forDisplayApi;
        }

        if (widgetProp.disableBrowserCache) {
            params.timestamp = Math.floor(Date.now());
        }

        //default for missing params
        if (widgetProp.filters && params.metric === "AppRanks") {
            widgetProp.filters.appmode = widgetProp.filters.appmode || "Top Free";
            widgetProp.filters.device =
                widgetProp.filters.device || (store === "Google" ? "AndroidPhone" : "iPhone");
        }

        if (widgetProp.duration === "28d") {
            let module = this._swNavigator
                .current()
                .name.substring(0, this._swNavigator.current().name.indexOf("."));
            params.timeGranularity = module === "industryAnalysis" ? "Monthly" : "Daily";
            if (widgetCache && widgetCache.timeGranularity) {
                widgetCache.timeGranularity = "Daily";
            }
        } else {
            params.timeGranularity = this._metricConfig.timeGranularity || "Monthly";
        }
        // backward compatibility for TimeGranularity param
        if (widgetProp.filters && widgetProp.filters.hasOwnProperty("TimeGranularity")) {
            widgetProp.filters.timeGranularity = widgetProp.filters.TimeGranularity;
            delete widgetProp.filters.TimeGranularity;
        }

        //This solution verifies keywords groups and custom categories API calls in custom dashboards widget
        //have the unique hash in order to force request when the custom asset content has been updated.
        if (widgetProp.key.length > 0 && _model.key[0]["id"]) {
            if (
                this.dashboardId &&
                ["Keyword", "Industry"].indexOf(_model.family) > -1 &&
                _model.key[0]["id"].indexOf(_model.key[0]["name"]) === -1 &&
                _model.key[0]["id"].indexOf("~") === -1
            ) {
                const customAssetId = _model.key[0]["id"];
                if (_model.family == ("Keyword" as IWidgetModelTypesFamily)) {
                    const keywordGroup = keywordsGroupsService.findGroupById(customAssetId);
                    if (keywordGroup) {
                        params.GroupHash = keywordGroup.GroupHash;
                    }
                } else if (_model.family == ("Industry" as IWidgetModelTypesFamily)) {
                    const customCategory = UserCustomCategoryService.getCustomCategoryById(
                        customAssetId,
                    );
                    if (customCategory) {
                        params.categoryHash = customCategory.categoryHash;
                    }
                }
            }
        }

        _.merge(
            this._params,
            params,
            this.durationObject.forAPI,
            widgetProp.filters,
            getKeyForApi(
                this._widgetConfig.properties.ignoreCompareMode
                    ? [_.head(widgetProp.key)]
                    : widgetProp.key,
            ),
            widgetCustomApiParams,
            widgetCache,
        );
    }

    private _setFilterParam(filterParamString) {
        // deconstruct filterParamString to object
        let filterParamObject = Widget.filterParse(filterParamString);
        // deconstruct existing _params.filter to object
        let filterObject = Widget.filterParse(this._params.filter);
        _.merge(filterObject, filterParamObject);
        // check for filters with empty strings and delete them
        _.each(filterObject, (filter: any, key) => {
            if (filter.value === '""' || filter.value === "null" || filter.value === "") {
                delete filterObject[key];
            }
        });
        if (_.isEmpty(filterObject)) {
            delete this._params.filter;
        } else {
            this._params.filter = Widget.filterStringify(filterObject);
        }
        // on each filter always reset the page number
        delete this._params.page;
    }

    protected _removePrefix(value, keyPrefix) {
        if (value && value.length > 0 && value.indexOf(keyPrefix) == 0) {
            return value.substring(1, value.length);
        }
        return value;
    }

    public getProUrl(rowParams?) {
        let state;
        if (this.apiParams.webSource === "MobileWeb" && this._metricConfig.mobileState) {
            state = this._metricConfig.mobileState;
        } else {
            state = rowParams
                ? this._metricConfig.state || ""
                : this._metricConfig.titleState || this._metricConfig.state || "";
        }
        let result = Object.assign(
            this._getProUrlParams(),
            this._metricConfig.stateParams,
            rowParams,
        );
        if (typeof state === "undefined") {
            return this._swNavigator.href("home", {}, {}, "state");
        }
        return this._swNavigator.href(state, result, {});
    }

    protected _getProUrlParams() {
        const isApp = this._viewData.family === "Mobile";
        const isIndustry = this._metricConfig.family === "Industry";
        const isKeywordAnalysis = this._metricConfig.family === "Keyword";
        const keyObject = getKeyForApi(this._viewData.key);
        const result: any = {
            isWWW:
                this.apiParams.includeSubDomains === undefined ||
                this.apiParams.includeSubDomains === true ||
                this.apiParams.includeSubDomains === "true"
                    ? "*"
                    : "-",
            duration: this._widgetConfig.properties.duration,
            comparedDuration: this._widgetConfig.properties.comparedDuration,
            country: (this._viewData.country && this._viewData.country.id) || 999,
            webSource: this._widgetConfig.properties.webSource,
        };
        const _model: IWidgetModel = this.getWidgetModel();
        if (isApp) {
            result.appId =
                ((keyObject.store || "").toLowerCase() === "google" ? "0" : "1") +
                "_" +
                keyObject["keys"];
        } else if (isIndustry && _model.key[0]) {
            if (keyObject["keys"].indexOf("$") > -1) {
                result.category = this._removePrefix(keyObject["keys"], "$");
            } else {
                const categoryId = _model.key[0].id;
                const category = UserCustomCategoryService.getCustomCategoryById(categoryId);
                result.category = category?.forUrl;
            }
        } else if (isKeywordAnalysis && _model.key[0]) {
            if (_model.key[0].id && _model.key[0].id != _model.key[0].name) {
                result.keyword =
                    Object.keys(keywordsGroupsService.findGroupById(_model.key[0].id)).length > 0
                        ? `*${keywordsGroupsService.findGroupById(_model.key[0].id).Id}`
                        : `*${_model.key[0].id}`;
            } else {
                result.keyword = _model.key[0].name;
            }
        } else {
            result.key = keyObject["keys"];
        }
        return result;
    }

    private _getDuration() {
        return this._durationService.getDurationData(
            this._widgetConfig.properties.duration,
            null,
            this._metricConfig.component,
        ).forWidget;
    }

    protected _getExcelEndPoint() {
        const ctrl = this._apiController || this._widgetConfig._apiController;
        if (ctrl) {
            const excelMetric =
                this._widgetConfig.properties.excelMetric || this._widgetConfig.properties.metric;
            return `/widgetApi/${ctrl}/${excelMetric}/Excel?`;
        } else {
            return `/api/WidgetKpis/GetExcel?`;
        }
    }

    protected handleDataError(statusCode: number) {
        switch (statusCode) {
            case 400:
            case 404:
            case 500:
            default:
                break;
        }
        // remove bottom message on non-dashboard widgets
        if (!this.dashboardId) {
            delete this.errorConfig.messageBottom;
        }
    }

    private _getHash() {
        let context = this._context || "";
        return `${context}_${this._widgetConfig.properties.metric}_${this._widgetConfig.type}`;
    }

    protected _updateWidgetCache() {
        // cache only specified params
        let cachedParams = _.pick(this._params, this._widgetConfig.properties.cachedParams);
        if (!_.isEmpty(cachedParams)) {
            this._widgetCacheService.put(this._getHash(), cachedParams);
        }
    }

    protected mergeGAVerifiedFlag(response, dataRecords?) {
        const keys = this._params.keys.split(",");
        if (!response.KeysDataVerification) return;

        const _swConnectedAccountsService = this._$injector.get("swConnectedAccountsService");
        const _mainKey = keys[0];

        //Add isGAVerified flag on the widget.data object if at least one key is verified.

        this.data = this.data || {};

        this.data.isGAVerified = false;
        for (let i = 0; i < keys.length; i++) {
            if (response.KeysDataVerification[keys[i]]) {
                this.data.isGAVerified = true;
                break;
            }
        }

        //Add isGAPrivate flag on the widget.data object only if the first key us Private.
        this.data.isGAPrivate = _swConnectedAccountsService.isDomainInGoogleAnalyticsAccountPrivateSites(
            _mainKey,
        );

        if (this.isCompare()) {
            //Compare mode - add isGAVerified flag for each of the widget.key objects and widget.legendItem objects.
            _.each(response.KeysDataVerification, (isGAVerified, domain) => {
                let _dataObj: any =
                    _.find(dataRecords, { Domain: domain }) ||
                    response.Data[domain] ||
                    _.find(response.Data, { Domain: domain });

                //Add isGAVerified falg to the widget's data object.
                if (_dataObj) {
                    _dataObj.isGAVerified = isGAVerified;
                    _dataObj.isGAPrivate = _swConnectedAccountsService.isDomainInGoogleAnalyticsAccountPrivateSites(
                        domain,
                    );
                }

                //Add isGAVerified to the widget's legend object.
                let _legendObj: any =
                    this.legendItems[domain] || _.find(this.legendItems, { name: domain });
                if (_legendObj) {
                    _legendObj.isGAVerified = isGAVerified;
                    _legendObj.isGAPrivate = _swConnectedAccountsService.isDomainInGoogleAnalyticsAccountPrivateSites(
                        domain,
                    );
                    _legendObj.metric = this.apiParams.metric;
                }
            });
        }
    }

    protected isCompare() {
        return this.getProperties().key.length > 1;
    }

    private _getWidgetCache() {
        return this._widgetCacheService.get(this._getHash());
    }

    /**
     * Getter/Setter methods
     */
    get apiParams() {
        return this._params;
    }

    // Object passed to this setter extends _params
    set apiParams(params: any) {
        let newParams = (this._params = Object.assign({}, this._params));
        for (let param in params) {
            if (param === "filter") {
                this._setFilterParam(params[param]);
            } else {
                newParams[param] = params[param];
            }
        }
        if (this._apiController) {
            this.initFetcherFromConfig();
        }
        this.broadcast("widgetUpdated", this);
        this.getData();
    }

    public updateApiParams(paramsToAdd: any) {
        Object.assign(this._params, paramsToAdd);
    }

    public clearApiParams(paramsToDelete: any) {
        paramsToDelete && paramsToDelete.forEach((param) => delete this._params[param]);
    }

    get viewData() {
        return this._viewData.getterCompleted ? this._viewData : this.getViewData();
    }

    set viewData(params: any) {
        swLog.error("Using viewData setter is deprecated");
        this.mergeViewData(params);
    }

    getViewData() {
        let widgetProp = this._widgetConfig.properties;
        let viewData: any = this._viewData;
        let viewOptions: any = this._viewOptions;
        viewData.customSubtitle = this._i18nFilter(
            widgetProp.subtitle || this._metricConfig.subtitle,
        );
        viewData.key = widgetProp.key;
        viewData.family = this._metricConfig.family;
        viewData.country =
            CountryService.countriesById[viewOptions.overrideCountry || widgetProp.country];
        viewData.duration = viewData.duration || this._getDuration();
        viewData.forcedDuration = widgetProp.forcedDuration;
        viewData.title = viewData.title || this._getTitle();
        viewData.titleClass = viewData.titleClass || "";
        viewData.tooltip = viewData.tooltip || this._getTooltip();
        viewData.proUrl = viewData.proUrl || this.getProUrl();
        viewData.height = widgetProp.height || defaultWidgetHeight;
        viewData.errorHeight = widgetProp.errorHeight || viewData.height;
        viewData.width =
            parseInt(widgetProp.width || widgetSettings.getDefaultWidgetSize(this.type)) || 4;
        viewData.widthSmallScreen = Widget.getWidgetResponsiveWidth(viewData.width);
        viewData.legendsColorSource = this._viewOptions.newColorPalette
            ? "compareMainColors"
            : this._viewOptions.audienceOverviewColors
            ? "audienceOverview"
            : null;
        viewData.legendContainerClass = this._viewOptions.legendContainerClass || "";
        viewData.titleIcon = this.getTitleIcon();
        // set loading height on widgets with height:'auto'
        viewData.loadingHeight = widgetProp.loadingHeight || widgetProp.height;
        viewData.getterCompleted = true;
        viewData.trackName = viewOptions.trackName = widgetProp.trackName;
        viewData.desktopOnly = this._viewOptions.desktopOnly;
        viewData.addToDashboardIconClass = this._viewOptions.addToDashboardIconClass || "";
        return viewData;
    }

    // Object passed to this setter extends _viewData
    mergeViewData(params: any) {
        Object.assign(this._viewData, params);
    }

    get viewOptions() {
        return this._viewOptions;
    }

    get templateUrl() {
        const {
            widgetTemplateUrl = `/app/components/widget/widget-templates/${this.type.toLowerCase()}.html`,
        } = this._widgetConfig.properties;
        return widgetTemplateUrl;
    }

    getLegendItems(data?: any) {
        return this._widgetConfig.properties.key;
    }

    public get excelUrl() {
        const newParams: any = _.merge({}, this._params);
        if (newParams.metric) {
            delete newParams.metric;
        }
        const excelParams = _.reduce(
            newParams,
            (paramString, paramVal: any, paramKey) => {
                if (paramVal !== undefined) {
                    return `${paramString}${paramKey}=${encodeURIComponent(paramVal)}&`;
                } else {
                    return paramString;
                }
            },
            "",
        );

        return this._getExcelEndPoint() + _.trimEnd(excelParams, "&");
    }

    /**
     * Protected Methods
     */
    protected initFetcherFromConfig() {
        //check if metric has support for custom fetcher and widget is not in dashboard
        if (this._metricConfig.customFetcherFactory && !this.dashboardId) {
            let fetcherFactory: IDataFetcherFactory<any> = this._$injector.get(
                this._metricConfig.customFetcherFactory.factoryName,
            );
            this._dataFetcher = fetcherFactory.create(
                this,
                this._metricConfig.customFetcherFactory.path,
            );
        } else {
            let fetcherFactory: IDataFetcherFactory<any> =
                this._widgetConfig.widgetDataFetcher ||
                this._widgetConfig.properties.widgetDataFetcher ||
                this.getFetcherFactory();
            this._dataFetcher = fetcherFactory.create(this);
        }
    }

    protected getFetcherFactory() {
        return this._defaultFetcherFactory;
    }

    public getDataFetcher() {
        return this._dataFetcher;
    }

    public getWidgetConfig() {
        return this._widgetConfig;
    }

    public getWidgetMetricConfig() {
        return this._metricConfig;
    }

    /**
     * Static methods
     */

    static decorateWidgetConfig(widgetConfig) {
        const widgetProps = widgetConfig.properties;
        return {
            ...widgetConfig,
            properties: {
                ...widgetProps,
                options: widgetProps.options || {},
                tooltip: widgetProps.tooltip
                    ? widgetProps.tooltip
                    : widgetProps.title
                    ? widgetProps.title + ".tooltip"
                    : "",
            },
        };
    }

    static decorateWidgetMetricConfig(widgetProps, metricProps, _widgetConfig, _metricTypeConfig) {
        // Override metric default properties used by multiple widgets // for example engagementVisits has different titles for different widgets in dashboards
        if (_.result(_metricTypeConfig, "properties.modules")) {
            return Object.assign(
                metricProps,
                _metricTypeConfig.properties.modules[widgetProps.family],
            );
        }
        return {
            ...metricProps,
            component: _.result(_widgetConfig, "properties.component", metricProps.component),
            tooltip: metricProps.title ? metricProps.title + ".tooltip" : "",
        };
    }

    /**
     * Public methods
     */

    public getClass(): any {
        return this.constructor;
    }

    initWidget(widgetConfig, context) {
        // edit references to support existing (wrong behavior) - will be removed when this function will be removed
        widgetConfig.properties.options = widgetConfig.properties.options || {};
        widgetConfig = Widget.decorateWidgetConfig(widgetConfig);
        const widgetProps = widgetConfig.properties;
        const widgetSettingsService = widgetSettings;
        const metricProps = widgetSettingsService.getMetricProperties(
            widgetProps.metric,
            widgetProps.family,
        );
        const metricTypeConfig = widgetSettingsService.getMetricWidgetMetadata(
            widgetProps.metric,
            widgetProps.type,
            widgetProps.key.length > 1,
        );
        const metricConfig = Widget.decorateWidgetMetricConfig(
            widgetProps,
            metricProps,
            widgetConfig,
            metricTypeConfig,
        );
        const apiController = widgetConfig.properties.apiController || metricConfig.apiController;
        const viewOptions = _.merge(
            {},
            this._viewOptions,
            defaultViewOptions,
            widgetSettings.getWidgetOptions(widgetProps, widgetProps.metric),
        );

        this.initWidgetInternal(
            widgetConfig,
            metricConfig,
            metricTypeConfig,
            apiController,
            viewOptions,
            context,
        );
    }

    initWidgetWithConfigs(config, context) {
        const widgetSettingsService = widgetSettings;
        config.metricConfig = {
            ...config.metricConfig,
            ...widgetSettingsService.getMetricProperties(
                config.metricConfig.metric,
                config.metricConfig.family,
            ),
        };
        this.initWidgetInternal(
            config.widgetConfig,
            config.metricConfig,
            config.metricTypeConfig,
            config.apiController,
            config.viewOptions,
            context,
        );
    }

    private initWidgetInternal(
        widgetConfig,
        metricConfig,
        metricTypeConfig,
        apiController,
        viewOptions,
        context,
    ) {
        const widgetProps = widgetConfig.properties;
        this._context = context;
        this.container = widgetProps.container;
        this.id = widgetConfig.id;
        this.dashboardId = widgetConfig.dashboardId;
        this.pos = widgetConfig.pos;
        this.width = widgetProps.width;
        this.type = widgetProps.type;
        this.webSource = widgetProps.webSource;
        this._metricTypeConfig = metricTypeConfig;
        this._widgetConfig = widgetConfig;
        this._metricConfig = metricConfig;
        this._apiController = apiController;
        if (widgetProps.clearWidgetCache) {
            this.clearWidgetCache();
        }
        this._setInitialParams(widgetProps.filters);
        this._setUtilities();
        this._viewOptions = viewOptions;
        this.initFetcherFromConfig();
        this.legendItems = this.getLegendItems();
        this._autoFetchData = angular.isDefined(widgetProps.autoFetchData)
            ? widgetProps.autoFetchData
            : this._autoFetchData;
    }

    runWidget() {
        if (this._autoFetchData) {
            this.getData();
        }
        this.setMetadata();
        this.getLegendImage();
    }

    getLegendImage() {
        //Fallback if legendItems not defined!
        if (!this.legendItems) return;
        this.legendItems.forEach((legendItem) => {
            if (!this.getIcon(legendItem)) {
                this._sitesResource.GetWebsiteImage({ website: legendItem.id }, function (data) {
                    legendItem.image = data.image;
                });
            }
        });
    }

    getIcon(item) {
        return item.icon || item.Icon || item.image;
    }

    onNewDataReceived(response) {
        let dataValid;
        try {
            dataValid = this.validateData(response?.Data);
        } catch (e) {
            console.error(`Data Validation failed: %O`, response?.Data, e);
        }
        if (!dataValid) {
            this.widgetState = WidgetState.ERROR;
            this.handleDataError(404);
            // console.warn(`Widget has empty data: %O`, response.Data);
            return;
        }

        this.widgetState = WidgetState.LOADED;

        this.originalData = response.Data;
        this.callbackOnGetData((this._widgetConfig.processResponse || _.identity)(response));
    }

    getData() {
        const that = this;
        that._updateWidgetCache();
        that.widgetState = WidgetState.LOADING;
        let requestParams = this._params;

        return this._$timeout(() => {
            // fix #SIM-12998 - force async call in case the response is already cached.
            // this will make sure to kick start the ng-if of highchart directive in graph.html.
            // we must have this ng-if because ng-highcharts is extending our config object only when
            // the link function is invoked.
            return this._dataFetcher
                .fetch()
                .then((response) => {
                    this.emit("widgetGetDataSuccess", response);
                    if (requestParams === that._params) {
                        // response data might not reflect the latest API params!!!
                        return this.onNewDataReceived(response);
                    } else {
                        // we can't be sure if this response is the latest and overiding a previous correct response
                        // or just irrelevant any.
                        // so to be 100% sure we will issue the request again with the latest params.
                        return this.getData();
                    }
                })
                .catch((reason) => {
                    this.emit("widgetGetDataFail", reason);
                    that.widgetState = WidgetState.ERROR;
                    that.handleDataError(reason.status);
                    swLog.error(`Error getting widget data: ${reason.statusText}`);
                });
        });
    }

    public getProperties(clone = false) {
        return clone ? angular.copy(this._widgetConfig.properties) : this._widgetConfig.properties;
    }

    getDBPresentation() {
        return {
            id: this.id,
            dashboardId: this.dashboardId,
            pos: angular.toJson(this.pos),
            properties: angular.toJson(this.getProperties()),
        };
    }

    setUtilityData(utilityId: string, utilityData: any) {
        this._utilitiesData[utilityId] = utilityData;
    }

    clearWidgetCache() {
        this._widgetConfig.properties.clearWidgetCache = false;
        this._widgetCacheService.remove(this._getHash());
    }

    protected _getTitle() {
        const titleTemplate = this._widgetConfig.properties.titleTemplate || "i18nKey";
        return this.titleTemplates[titleTemplate]();
    }

    private _getTooltip() {
        return this._i18nFilter(
            this._widgetConfig.properties.tooltip || this._metricConfig.tooltip,
        );
    }

    public getExporter(): any {
        return WidgetExporter;
    }

    /**
     * Abstract methods
     */
    abstract callbackOnGetData(response: any, comparedItemKeys?: any[]): void;

    protected onWidgetRemoval(): void {}

    protected abstract setMetadata();

    protected abstract validateData(response: any): boolean;

    abstract onResize(): void;

    public handleUtilityAction(utility: any, value: string) {
        let utilityId = utility.id;
        let name = `${_.camelCase(utilityId)}UtilityAction`;
        let fn: Function = this[name] || (() => {});
        fn.apply(this, [utility, value]);
    }

    protected timeGranularityUtilityAction(utility, value) {
        let paramsObject = {};
        paramsObject["timeGranularity"] = value;

        // update widget api params only if at least one param has really changed
        if (!_.isEqual(_.pick(this.apiParams, _.keys(paramsObject)), paramsObject)) {
            this.apiParams = paramsObject;
        }
    }

    public findUtility(utilityName: string, group: number) {
        return _.find(this.utilityGroups[group].utilities, (utility: any) => {
            return utility.type == utilityName;
        });
    }

    public getWidgetModel(): IWidgetModel {
        let _props = this.getProperties();
        this._widgetModel = {
            country: _props.country,
            duration: _props.duration,
            comparedDuration: _props.comparedDuration,
            family: _props.family,
            type: _props.type,
            metric: _props.metric,
            webSource: _props.webSource,
            key: this.reduceKeys(_props.key, this.apiParams.keys),
            ShouldGetVerifiedData: this.apiParams.ShouldGetVerifiedData,
            customAsset: _props.customAsset,
        };
        return this._widgetModel;
    }

    public getWidgetFilters(): IWidgetModelFilters {
        return {};
    }

    private reduceKeys(propsKeys: any, apiParamsKeys: any): any {
        if (apiParamsKeys == undefined || propsKeys.length === 1) {
            return propsKeys;
        }
        let keysArr = apiParamsKeys.split(",");
        if (propsKeys.length == keysArr.length) {
            return propsKeys;
        }
        return propsKeys.filter(function (key) {
            return _.includes(keysArr, key.name);
        });
    }

    /**
     * Shows a2d button if returned true
     * @returns {boolean}
     */
    public canAddToDashboard() {
        if (this._viewOptions.hasOwnProperty("canAddToDashboard")) {
            return this._viewOptions.canAddToDashboard;
        }
        if (!this._metricConfig.hasWebSource && this.webSource === "MobileWeb") {
            return false;
        }
        if (
            this.getWidgetModel().metric === "EngagementDesktopVsMobileVisits" &&
            this.getWidgetModel().webSource != "Total"
        ) {
            return false;
        }
        return this._metricConfig.dashboard == "true";
    }

    /**
     * Shows 'showMore' button if metric config property 'showMoreButtonItems' greater then number of data records.
     * @returns {boolean}
     */
    public hasShowMoreButton() {
        if (this._metricTypeConfig && this._metricTypeConfig.properties) {
            const metricTypeProps = this._metricTypeConfig.properties;
            if (metricTypeProps.showMoreButton) {
                return true;
            }
            if (this.data && this.data.Records && metricTypeProps.showMoreButtonItems) {
                return this.data.Records.length > metricTypeProps.showMoreButtonItems;
            }
        }
        return false;
    }

    public isDashboard() {
        return (
            this._widgetConfig &&
            this._widgetConfig.dashboardId &&
            this._widgetConfig.dashboardId.length
        );
    }

    public on(eventName: string, ...args: any[]) {
        /*no-op. defined in widget-container.component in order to access $scope*/
    }

    public emit(eventName: string, ...args: any[]) {
        /*no-op. defined in widget-container.component in order to access $scope*/
    }

    public broadcast(eventName, data) {
        /*no-op. defined in widget-container.component in order to access $scope*/
    }

    public onWidgetMount(...args: any[]) {}

    public getTitleTemplate() {
        return (
            this.viewOptions.titleTemplate || "/app/components/widget/containers/widget-title.html"
        );
    }

    /**
     * Monitor UI render time after data returned - to be executed in the AJAX callback function
     */
    public runProfiling() {
        //this._swProfiler.startEndOnNextTick(this.type + ' Widget');
        if (this.nrInteraction) {
            this._swProfiler.endInteraction(this.nrInteraction);
        }
        return;
    }

    protected cleanup() {
        this.emit("widgetCleanup");
        _.isFunction(this._dataFetcher.destroy) && this._dataFetcher.destroy();
    }

    /**
     * To define the parameter used to filter results with free text.
     * @returns {string}
     */
    protected getSearchKey() {
        return "SearchTerm";
    }

    /**
     * Return title icon according to web source. Relevant for IA and WA only at the moment.
     * @returns {any}
     */
    public getTitleIcon() {
        const webSrcIconMap = { total: "combined", mobileweb: "mobile-web", desktop: "desktop" };

        if (this._viewData.family != "Mobile") {
            const webSource = this._params.webSource ? this._params.webSource.toLowerCase() : false;

            if (
                this.isDashboard() &&
                this._widgetConfig.properties.metric === "TopReferrals" &&
                this._params.webSource
            ) {
                return webSrcIconMap[webSource] || "desktop";
            } else if (this.isDashboard() && this._metricConfig.hasWebSource) {
                return webSrcIconMap[webSource] || "combined";
            }
        }
    }
}
