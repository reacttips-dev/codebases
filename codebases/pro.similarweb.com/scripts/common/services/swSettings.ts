/* eslint:disable:radix */
import swLog from "@similarweb/sw-log";
import { allMetrics } from "components/widget/widget-config/metrics/@types/IMetric";
import widgetConfig from "components/widget/widget-config/widget.config";
import { i18nFilter } from "filters/ngFilters";
import { getDiffCustomRangeParam } from "helpers/duration/customRange";
import _ from "lodash";
import dayjs, { Dayjs } from "dayjs";
import CountryService from "services/CountryService";
import { DefaultFetchService, NoCacheHeaders } from "services/fetchService";
import { defaultParams, monthIntervals, monthIntervalsShort, weekIntervals } from "Shared/modules";
import { ISwSettings, ISwSites, ISwUrls } from "../../../app/@types/ISwSettings";
import UserDataWorker from "../../../single-spa/UserDataWorker";
import PageVisibilityManager, { IPageVisibilityManager } from "./pageVisibilityManager";
import { isAvailable } from "common/services/pageClaims";
import { customRangeFormat, fullMonthAndYear } from "constants/dateFormats";

declare const window;

const modulesConfig = {
    Home: {
        order: 1,
        homeOrder: 1,
    },
    Dashboard: {
        order: 2,
        homeOrder: 2,
    },
    DeepInsights: {
        order: 3,
        homeOrder: 3,
    },
    WebAnalysis: {
        order: 5,
        homeOrder: 5,
    },
    IndustryAnalysis: {
        order: 6,
        homeOrder: 6,
    },
    KeywordAnalysis: {
        order: 7,
        homeOrder: 7,
    },
    AppAnalysis: {
        order: 8,
        homeOrder: 8,
    },
    AppKeywordAnalysis: {
        order: 10,
        homeOrder: 9,
    },
    TopApps: {
        order: 9,
        homeOrder: 10,
    },
};

const INTERNAL_USER_PLAN_NAME = "Internal Full Access";

interface IDataComponent {
    resources: {
        LastAvailableSnapshotData: string;
        LastAvailableWindowData: string;
    };
}

export class SWSettings implements ISwSettings {
    public static readonly DATA_COMPONENT_NAME = "DataSettings";
    public static readonly PING_INTERVAL = 30 * 60 * 1000;
    public static compareDates(component1, component2, field): boolean {
        const date1 = dayjs(component1.resources[field]);
        const date2 = dayjs(component2.resources[field]);
        return date1.isSame(date2, "day");
    }

    public components: any;
    public user: any;
    public swsites: ISwSites;
    public swurls: ISwUrls;
    public current: any;
    public widgets: any;
    public modules: any;
    public version: string;

    private dataComponent: IDataComponent;
    private fetchService = DefaultFetchService.getInstance();
    private worker = new UserDataWorker();
    private pvm: IPageVisibilityManager = new PageVisibilityManager();
    private pingDataComponentIntervalId;
    private visibilityRegistrationId;
    private lastHiddenTime = Date.now();

    constructor(
        private $window,
        private defaultParams,
        private monthIntervals,
        private monthIntervalsShort,
        private weekIntervals = weekIntervals,
    ) {
        try {
            this.init();
            this.initDataComponentPing();
            this.initPackageProperties();
            if (window.userDataWorker) {
                window.userDataWorker.addEventListener(
                    "message",
                    (e) => {
                        if (e.data.key === "getSettings") {
                            swLog.log("Refreshing swSettings...");
                            this.refresh(e.data.value.settings);
                        }
                    },
                    { capture: true },
                );
            }
        } catch (e) {
            swLog.error("swSettings: error initializing settings: " + e.message, e);
            swLog.serverLogger("swSettings: error initializing settings: " + e.message, e);
            throw Error("swSettings: error initializing settings: " + e.message);
        }
    }

    public filterCountries(allowedCountries = [], excludeChildren): boolean {
        const countries = _.cloneDeep(CountryService.countries);
        return countries.filter((country, index) => {
            if (country.states && country.states.length) {
                countries[index].children = country.states.filter((country) => {
                    return _.includes(allowedCountries, country.id);
                });
            }
            if (excludeChildren) {
                country.states = country.children = [];
            }
            return _.includes(allowedCountries, country.id);
        });
    }

    public init(): void {
        Object.assign(this, this.transformConfig(this.$window.similarweb.settings));
        // Set widget's country and date settings according to it's component settings
        Object.keys(this.widgets.metrics).forEach((metricId) => {
            const metric = this.widgets.metrics[metricId];
            const component = this.components[metric.properties.component];
            if (!component) {
                swLog
                    // tslint:disable-next-line: max-line-length
                    .error(
                        `${metric.properties.component} is not defined on your global scope. Please merge your sandbox with master, deploy, then try again.`,
                    );
            }
            try {
                metric.properties.minDate = component.startDate;
                metric.properties.maxDate = component.endDate;
                metric.properties.datePickerPresets = _.map(
                    component.datePickerPresets,
                    (preset) => {
                        const elem: any = { ...preset };
                        elem.buttonText =
                            (elem.buttonText.indexOf("Last") === -1 ? "Last " : "") +
                            elem.buttonText;
                        return elem;
                    },
                );
                metric.properties.countries = component.allowedCountries;
            } catch (e) {
                swLog.error(
                    `Failed to load component ${metric.properties.component}! Error message: ${e.message}`,
                );
            }
        });
    }

    public initDataComponentPing(): void {
        // check every interval
        this.visibilityRegistrationId = this.pvm.registerCallback(
            this.handlePageVisibilityChange.bind(this),
        );
    }

    public handlePageVisibilityChange(isVisible: boolean): void {
        if (isVisible) {
            // in case the page has been hidden longer than a single interval
            // we want to ping the data component immediately
            swLog.log("Page is visible");
            if (Date.now() - this.lastHiddenTime >= SWSettings.PING_INTERVAL) {
                swLog.log("Page has been hidden longer than an interval. Pinging data component");
                this.pingDataComponent();
            }

            // then register the listener
            this.pingDataComponentIntervalId = setInterval(
                () => this.pingDataComponent(),
                SWSettings.PING_INTERVAL,
            );
        } else if (this.pingDataComponentIntervalId) {
            swLog.log("Page is not visible");
            // update the last hidden time
            // so we know if it's been longer than an interval when the page becomes visible again
            this.lastHiddenTime = Date.now();
            clearInterval(this.pingDataComponentIntervalId);
        }
    }

    public initPackageProperties(): void {
        this.user.hasProductOrClaimsOverride = this.hasOverriddenProductOrClaims();
        this.user.isSimilarWebUser = this.isSimilarWebUserWithoutOverride();
        this.user.hasDM = isAvailable(this.components.CompetitiveAnalysisHome);
        this.user.hasMR = isAvailable(this.components.WebMarketAnalysisOverviewHome);
        this.user.hasSI = this.components.SalesWorkspace?.resources?.SalesSolution2Enabled ?? false;
        this.user.hasSolution2 = this.user.hasDM || this.user.hasMR || this.user.hasSI;
        this.user.hasProductBoardAccess = isAvailable(this.components.ProductBoard);
        this.user.hasPptExport = isAvailable(this.components.ExportToPPT);
    }

    public momentFromString(yearMonthString) {
        const [year, month, day] = yearMonthString.split(".");
        // year + month + day
        if (day) {
            return dayjs
                .utc()
                .year(parseInt(year))
                .month(parseInt(month) - 1)
                .date(parseInt(day));
        }
        // year + month only
        else {
            return dayjs
                .utc()
                .year(parseInt(year))
                .month(parseInt(month) - 1);
        }
    }

    public setCurrent(component): void {
        this.current = this.components[component];
    }

    public getCurrentModule(): any {
        const component = this.getCurrentComponent();
        return _.find(this.modules, { id: component.componentId });
    }

    public getCurrentComponent() {
        return this.current.resources.Home
            ? this.current
            : this.components[this.current.resources.module] ||
                  this.components[this.current.componentId];
    }

    public getNavigationModule() {
        const component = this.getCurrentComponent();
        let componentId = component.componentId;
        if (componentId === "Dashboard") {
            componentId = "Home";
        }
        return _.find(this.modules, { id: componentId });
    }
    public isCustomDuration(duration) {
        const customDuration = duration ? duration.split("-") : [];
        return customDuration.length > 1;
    }

    public allowedDuration(duration, componentId?) {
        const component = (componentId && this.components[componentId]) || this.current;
        let start: Dayjs;
        let end: Dayjs;
        let returnedValue;
        if (component.resources.CustomDurations) {
            return component.resources.CustomDurations.indexOf(duration) > -1;
        }
        const isCustomDuration = this.isCustomDuration(duration);

        // custom duration
        if (isCustomDuration) {
            const customDuration = duration ? duration.split("-") : [];
            const [from, to] = customDuration;
            const isWeekly = from.split(".").length === 3 && to.split(".").length === 3;
            const granularity = isWeekly ? "isoWeek" : "month";
            start = this.momentFromString(from).startOf(granularity).clone();
            end = this.momentFromString(to).endOf(granularity).clone();
            const componentStartDate = isWeekly ? component.dailyStartDate : component.startDate;
            const componentEndDate = isWeekly ? component.dailyEndDate : component.endDate;

            returnedValue =
                (start.isAfter(componentStartDate, granularity) ||
                    start.isSame(componentStartDate, granularity)) &&
                (end.isBefore(componentEndDate, granularity) ||
                    end.isSame(componentEndDate, granularity));
        }
        // preset
        else {
            const monthlyPreset: any = component.datePickerPresets.find(
                (preset) => preset.value === duration,
            );
            const weeklyPreset: any = component.weeklyDatePickerPresets.find(
                (preset) => preset.value === duration,
            );
            if (monthlyPreset) {
                returnedValue = monthlyPreset.enabled && !monthlyPreset.locked;
            } else if (weeklyPreset) {
                returnedValue = weeklyPreset.enabled && !weeklyPreset.locked;
            }
        }
        return returnedValue;
    }

    public allowedCountry(countryId, componentId = null) {
        const component = (componentId && this.components[componentId]) || this.current;
        return _.isArray(component.resources.Countries)
            ? component.resources.Countries.indexOf(parseInt(countryId, 10)) > -1
            : false;
    }

    public allowedStore(store, componentId): boolean {
        const component = (componentId && this.components[componentId]) || this.current;
        if (!component.resources.Stores) {
            return false;
        }
        return component.resources.Stores.indexOf(store) > -1;
    }

    // public canClaim(claim): boolean {
    //     if (!this.components["ProductClaims"]) {
    //         return false;
    //     }
    //     if (this.components["ProductClaims"].resources.hasOwnProperty(claim)) {
    //         return this.components["ProductClaims"].resources[claim];
    //     }
    //     return false;
    // }

    public async refresh(workerSettings = null): Promise<void> {
        let settings;
        if (!workerSettings) {
            settings = await this.fetchService.get<{ data: any }>("/settings", null, {
                headers: NoCacheHeaders,
                preventAutoCancellation: true,
            });
            this.$window.similarweb.settings = settings.data;
        } else {
            this.$window.similarweb.settings = workerSettings;
        }
        this.init();
    }

    public async pingDataComponent(): Promise<void> {
        // To avoid cyclic dependency.
        try {
            const { components } = await this.fetchService.get<{ components: any }>(
                "/settings",
                { module: SWSettings.DATA_COMPONENT_NAME },
                { headers: NoCacheHeaders, preventAutoCancellation: true },
            );
            try {
                const fetchedDataComponent: IDataComponent =
                    components[SWSettings.DATA_COMPONENT_NAME];
                this.dataComponent = this.dataComponent || fetchedDataComponent;
                if (
                    !SWSettings.compareDates(
                        this.dataComponent,
                        fetchedDataComponent,
                        "LastAvailableSnapshotData",
                    ) ||
                    !SWSettings.compareDates(
                        this.dataComponent,
                        fetchedDataComponent,
                        "LastAvailableWindowData",
                    )
                ) {
                    this.worker.clearCache(() => {
                        location.reload(true);
                    });
                }
            } catch (e) {
                swLog.serverLogger("Error in pingDataComponent", e);
            }
        } catch (error) {
            // do not log when status is -1 (request aborted by the client)
            if (error.status !== -1) {
                const msg = `Call failed with status ${error.status} ${
                    error.headers("SW-AuthNeedRefresh") === "true" ? "and auth refresh header" : ""
                }: "${error.data}"`;
                swLog.serverLogger("Error in pingDataComponent", new Error(msg));
            }
        }
    }

    public getDataIndicators = (dataType) => {
        const dataTypes = {
            MOBILE_WEB_ALGO_CHANGE: this.components.Home.resources["MobileWebAlgoChangeDate"],
            APPS_ALGO_CHANGE:
                this.components.Home.resources["MobileAppsAlgoChangeDate"] || "2020-11-01",
            KEYWORDS_ALGO_CHANGE: this.components.Home.resources["KeywordsAlgoChangeDate"],
            KEYWORDS_MOBILE_ALGO_CHANGE: "2020-01-01",
            MOBILE_WEB_DATA_START: "2018-08-01",
        };
        return dataTypes[dataType];
    };

    private hasOverriddenProductOrClaims = (): boolean => {
        const hasProductsOverwritten = this.components.Home.resources.ProductsOverwritten;
        const hasClaimsOverwritten = this.components.Home.resources.ClaimsOverwritten;

        return hasProductsOverwritten || hasClaimsOverwritten;
    };

    private isSimilarWebUserWithoutOverride = (): boolean => {
        const isSimilarWebUser = this.user.plan === INTERNAL_USER_PLAN_NAME;

        // a SW user without any claims manipulation
        return isSimilarWebUser && !this.hasOverriddenProductOrClaims();
    };

    private filterTotalCountries(totalCountries, addUSstates, supportedUsStates) {
        const countries = _.cloneDeep(CountryService.countries);
        return countries.filter((country, index) => {
            if (country.states && country.states.length) {
                countries[index].children = country.states.filter((state) => {
                    return addUSstates
                        ? _.includes(supportedUsStates, state.id)
                        : _.includes(totalCountries, state.id);
                });
            }
            if (!addUSstates) {
                country.states = country.children = [];
            }
            return _.includes(totalCountries, country.id);
        });
    }

    private transformConfig(config) {
        const isNoTouch = config.components.Home.resources.IsNoTouchUser;
        const isFro = config.components.Home.resources.IsCommonUser;
        const isShortMonthIntervalsUser = isNoTouch || isFro;
        config.user.isNoTouch = isNoTouch;
        config.user.isFro = isFro;
        config.user.isShortMonthIntervalsUser = isShortMonthIntervalsUser;

        let module: any;
        config.modules = [];

        Object.keys(config.components).forEach((componentId) => {
            const component = config.components[componentId];
            let monthInterval = component.resources.SnapshotInterval;
            const windowInterval = component.resources.WindowInterval;
            const dailyInterval = component.resources.DailyInterval;

            // HOTFIX 25/05/2017 by Yoav.Shmaria - Pro is not loading when TopApps.resources.SnapshotInterval is not defined
            if (monthInterval === undefined) {
                monthInterval = config.components["Home"].resources.SnapshotInterval;
            }

            const supportedDuration = component.resources.SupportedDuration || monthInterval.count;

            /* Some FRO users get old data, we should lock presets for those */
            const isFreshData =
                !isFro ||
                Math.abs(dayjs.utc(monthInterval.enddate).diff(dayjs.utc(), "days")) <=
                    dayjs.utc().daysInMonth();

            if (!component.resources.type) {
                // not a WebComponent
                return;
            }

            // id
            component.componentId = componentId;

            // expose startdate and enddate per component
            component.startDate = dayjs.utc(monthInterval.startdate);
            component.endDate = dayjs.utc(monthInterval.enddate);

            component.lastSupportedDailyDate = dayjs.utc(
                component.resources.LastSupportedDailyDate,
            );

            // set allowed countries
            component.allowedCountries = this.filterCountries(
                component.resources.Countries,
                !component.resources.USStateSupported,
            );
            component.totalCountries = this.filterTotalCountries(
                component.resources.TotalCountries,
                component.resources.USStateSupported,
                component.resources.UsStates,
            );

            // set allowed stores
            component.allowedStores = component.resources.Stores;

            // set properties for compare competitors popup
            component.totalCompetitorsCount = component.resources.TotalCompetitorsCount;
            component.allowedCompetitorsCount = component.resources.AllowedCompetitorsCount;

            // set properties for each mode
            component.isBeta = component.resources.IsBeta;
            component.isHaveBanner = component.resources.IsHaveBanner;

            component.isDemo = component.resources.IsDemo;
            component.IsPaymentRequired = component.resources.IsPaymentRequired;
            component.durationPaymentHook = component.resources.DurationPaymentHook;
            component.tableResults = component.resources.TableResults;
            component.isDisabled = component.resources.IsDisabled;
            // component.isInactive = component.resources.IsInactiveAccountUser;

            component.isAllowed = !component.isDisabled;
            component.disabledDomains = {
                includeSubdomains: false,
                mainDomainOnly: component.resources.IsMainDomainDisabled,
            };

            // set presets for date picker
            // if this components defined with fixed duration length, for example: Digital marketing -> Competitive analysis -> ranking distribution,
            // The preset is built depends on the FixedSnapshotRangeLength, Otherwise it built depends on
            // Predefined values (1,3,6,12,18,24 etc);
            if (typeof component.resources.FixedSnapshotRangeLength === "number") {
                component.datePickerPresets = [];

                const range = component.resources.FixedSnapshotRangeLength;
                const ranges = _.chunk(Array.from(Array(monthInterval.count).keys()), range);
                ranges.forEach((currentRange) => {
                    const from = component.endDate
                        .clone()
                        .subtract(currentRange[currentRange.length - 1], "month");
                    const to = component.endDate.clone().subtract(currentRange[0], "month");

                    if (range == 1) {
                        component.datePickerPresets.push({
                            buttonText: from.format(fullMonthAndYear),
                            displayText: from.format(fullMonthAndYear),
                            value: from.format(`${customRangeFormat}-${customRangeFormat}`),
                            enabled: true,
                            locked: false,
                        });
                    } else {
                        component.datePickerPresets.push({
                            buttonText: `${from.format(fullMonthAndYear)}-${to.format(
                                fullMonthAndYear,
                            )}`,
                            displayText: `${from.format(fullMonthAndYear)}-${to.format(
                                fullMonthAndYear,
                            )}`,
                            value: `${from.format(customRangeFormat)}-${to.format(
                                customRangeFormat,
                            )}`,
                            enabled: true,
                            locked: false,
                        });
                    }
                });
                component.datePickerPresets.push({
                    buttonText: "Historical data",
                    displayText: "Historical data",
                    value: "12m",
                    enabled: true,
                    locked: true,
                });
            } else {
                component.datePickerPresets = [];
                const monthIntervals = isShortMonthIntervalsUser
                    ? this.monthIntervalsShort
                    : this.monthIntervals;
                monthIntervals.forEach((val) => {
                    const unit =
                        val > 1
                            ? i18nFilter()("datepicker.units.month.nomerous")
                            : i18nFilter()("datepicker.units.month.single");
                    const presetText = val + " " + unit;
                    const endDate = component.endDate.clone();
                    const endDateText = endDate.format("MMM YYYY");
                    const isEnabled = val <= supportedDuration;

                    component.datePickerPresets.push({
                        buttonText: i18nFilter()("datepicker.lastn", {
                            count: val.toString(),
                            unit,
                        }),
                        displayText:
                            endDate.subtract(val - 1, "month").format("MMM YYYY") +
                            " - " +
                            endDateText +
                            " (" +
                            presetText +
                            ")",
                        value: val + "m",
                        enabled: isEnabled,
                        locked: isEnabled && (!isFreshData || val > monthInterval.count),
                    });
                });
                component.datePickerPresets.unshift({
                    buttonText: i18nFilter()("datepicker.lastn", {
                        count: "28",
                        unit: i18nFilter()("datepicker.units.day.nomerous"),
                    }),
                    displayText: i18nFilter()("datepicker.lastn", {
                        count: "28",
                        unit: i18nFilter()("datepicker.units.day.nomerous"),
                    }),
                    value: "28d",
                    enabled: false,
                    locked: !isFreshData,
                });
            }

            component.graphGranularities = {
                Daily: !component.resources.IsDailyGraphDataForbidden,
                Weekly: true,
                Monthly: true,
            };
            if (
                windowInterval &&
                typeof component.resources.FixedSnapshotRangeLength !== "number"
            ) {
                if (windowInterval !== "Locked") {
                    component.windowStartDate = dayjs.utc(windowInterval.startdate);
                    component.windowEndDate = dayjs.utc(windowInterval.enddate);
                    component.datePickerPresets[0].displayText +=
                        " (As of " + component.windowEndDate.format("MMM DD") + ")";
                } else {
                    component.datePickerPresets[0].locked = true;
                }
                component.datePickerPresets[0].enabled = true;
            }

            // generate weekly data presets
            component.weeklyDatePickerPresets = [];
            if (dailyInterval) {
                component.dailyStartDate = dayjs.utc(dailyInterval.startdate);
                component.dailyEndDate = dayjs.utc(dailyInterval.enddate);
                weekIntervals.forEach((week) => {
                    const unit =
                        week > 1
                            ? i18nFilter()("datepicker.units.week.nomerous")
                            : i18nFilter()("datepicker.units.week.single");
                    const presetText = `${week} ${unit}`;
                    const isoWeekStart = component.dailyEndDate
                        .clone()
                        .subtract(week, "weeks")
                        .isoWeek();
                    const isoWeekEnd = component.dailyEndDate
                        .clone()
                        .subtract(1, "weeks")
                        .isoWeek();
                    const startDateText = dayjs
                        .utc()
                        .isoWeek(isoWeekStart)
                        .startOf("isoWeek")
                        .format("MMM Do, YY");
                    const endDateText = dayjs
                        .utc()
                        .isoWeek(isoWeekEnd)
                        .endOf("isoWeek")
                        .format("MMM Do, YY");
                    component.weeklyDatePickerPresets.push({
                        buttonText: i18nFilter()("datepicker.previousn", {
                            count: week.toString(),
                            unit,
                        }),
                        displayText: `${startDateText} - ${endDateText} (${presetText})`,
                        value: week + "w",
                        // since all users has at least 3 months of data
                        enabled: true,
                        locked: false,
                    });
                });
                component.weeklyDatePickerPresets.unshift({
                    buttonText: i18nFilter()("datepicker.lastn", {
                        count: "7",
                        unit: i18nFilter()("datepicker.units.day.nomerous"),
                    }),
                    displayText: `${i18nFilter()("datepicker.lastn", {
                        count: "7",
                        unit: i18nFilter()("datepicker.units.day.nomerous"),
                    })} (As of ${component.dailyEndDate.format("MMM DD")})`,
                    value: "7d",
                    enabled: true,
                    locked: false,
                });
            }

            // add default route params
            component.defaultParams = Object.assign(
                {},
                this.defaultParams,
                component.resources.InitialDuration
                    ? {
                          duration: isFreshData
                              ? component.resources.InitialDuration +
                                component.resources.DurationUnit
                              : getDiffCustomRangeParam(
                                    dayjs(monthInterval.startdate),
                                    dayjs(monthInterval.enddate),
                                ),
                      }
                    : {},
                component.resources.InitialCountry
                    ? { country: component.resources.InitialCountry }
                    : {},
                component.resources.InitialCategory
                    ? { category: component.resources.InitialCategory }
                    : {},
                component.resources.InitialPage ? { pageUrl: component.resources.InitialPage } : {},
                component.resources.InitialStore ? { store: component.resources.InitialStore } : {},
                component.resources.InitialDevice
                    ? { device: component.resources.InitialDevice }
                    : {},
                component.resources.InitialMode ? { mode: component.resources.InitialMode } : {},
            );

            // create the default duration for components with fixed duration length
            if (typeof component.resources.FixedSnapshotRangeLength === "number") {
                const to = dayjs.utc(monthInterval.enddate).startOf("month");
                const from = to
                    .clone()
                    .subtract(component.resources.FixedSnapshotRangeLength - 1, "month");
                component.defaultParams.duration = `${from.format(customRangeFormat)}-${to.format(
                    customRangeFormat,
                )}`;
            }

            // add demo properties
            component.demo = {};
            if (component.resources.DemoAllowedWebsite) {
                component.demo.website = component.resources.DemoAllowedWebsite;
            }
            if (component.resources.DemoAllowedWebsiteCompetitors) {
                component.demo.websiteCompetitors =
                    component.resources.DemoAllowedWebsiteCompetitors;
            }
            if (component.resources.DemoAllowedAppCompetitors) {
                component.demo.appsCompetitors = component.resources.DemoAllowedAppCompetitors;
            }
            if (component.resources.DemoAllowedApp) {
                component.demo.appId = component.resources.DemoAllowedApp;
            }
            if (component.resources.DemoAllowedKeyword) {
                component.demo.keyword = component.resources.DemoAllowedKeyword;
            }
            if (component.isDemo && component.resources.DemoAllowedCategory) {
                component.demo.category = component.resources.DemoAllowedCategory;
                Object.assign(component.defaultParams, {
                    category: component.resources.DemoAllowedCategory,
                });
            }

            // Populate modules for menu and homepage
            if (component.resources.Home) {
                module = {
                    id: componentId,
                    name: component.resources.name,
                    type: component.resources.type,
                    caption: component.resources.caption,
                    description: i18nFilter()(component.resources.description),
                    order: modulesConfig[componentId] ? modulesConfig[componentId].order : null,
                    homeOrder: modulesConfig[componentId]
                        ? modulesConfig[componentId].homeOrder
                        : null,
                    url: component.resources.defaulturl,
                    isDemo: component.isDemo,
                    isHaveBanner: component.isHaveBanner,
                    isBeta: component.isBeta,
                    disabledDomains: component.disabledDomains,
                    graphGranularities: component.graphGranularities,
                    hasNewBadge: component.resources.HasNewBadge,
                };
                config.modules.push(module);
            }
        });
        config.widgets = widgetConfig.widgets;
        this.dataComponent = config.components[SWSettings.DATA_COMPONENT_NAME];

        // find metrics
        config.widgets.metrics = allMetrics;

        return config;
    }
}

const originalSwSettings = new SWSettings(
    window,
    defaultParams,
    monthIntervals,
    monthIntervalsShort,
    weekIntervals,
);
export let swSettings = originalSwSettings;
export const mockSettings = (mock) => {
    swSettings = mock;
};

export const resetSettings = () => (swSettings = originalSwSettings);
