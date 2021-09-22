import WeeklyCalendarLocked from "@similarweb/ui-components/dist/duration-selector/src/weekly-calendar/WeeklyCalendarLocked";
import { ISidebarListItem } from "@similarweb/ui-components/dist/sidebar";
import autobind from "autobind-decorator";
import { preparePresets } from "components/dashboard/widget-wizard/components/DashboardWizardDuration";
import GaFilter from "components/filters-bar/ga-filter/GaFilter";
import { SubDomainsFilter } from "components/filters-bar/subdomains-filter/SubDomainsFilter";
import * as utils from "components/filters-bar/utils";
import { FiltersEnum } from "components/filters-bar/utils";
import { WebSourceFilter } from "components/filters-bar/websource-filter/WebSourceFilter";
import { Pill } from "components/Pill/Pill";
import { FiltersBar, IFilter } from "components/React/FiltersBar/FiltersBar";
import { FiltersMenu } from "components/React/FiltersBar/FiltersMenu";
import { i18nFilter } from "filters/ngFilters";
import _ from "lodash";
import dayjs, { Dayjs } from "dayjs";
import { isWeeklyKeywordsAvailable } from "pages/keyword-analysis/common/UtilityFunctions";
import { DurationSelectorPresetOriented } from "components/duration-selectors/DurationSelectedPresetOriented";
import { DurationSelectorSimple } from "pages/website-analysis/DurationSelectorSimple";
import { connect } from "react-redux";
import DurationService from "services/DurationService";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import styled from "styled-components";
import UnlockModalConfig, {
    IUnlockModalConfigTypes,
} from "../../../.pro-features/components/Modals/src/UnlockModal/unlockModalConfig";
import { Injector } from "../../../scripts/common/ioc/Injector";
import {
    estimatedVsGaSwitchToggle,
    hideWebsourceTooltip,
    toggleResetBetaBranchModal,
} from "../../actions/commonActions";
import { CountryFilter } from "../../components/filters-bar/country-filter/CountryFilter";
import { FiltersBase, IFiltersBaseState } from "../../components/filters-bar/FiltersBase";
import UnlockModal from "../../components/React/UnlockModalProvider/UnlockModalProvider";
import { IConnectedAssetsService } from "../../services/ConnectedAssetsService";
import { allTrackers } from "../../services/track/track";
import { colorsPalettes } from "@similarweb/styles";
import { openUnlockModalV2 } from "services/ModalService";
import { devicesTypes } from "UtilitiesAndConstants/Constants/DevicesTypes";

import { FixedDurationsSelector } from "pages/website-analysis/FixedDurationsSelector";
import { swSettings } from "common/services/swSettings";
import { periodOverPeriodService } from "services/PeriodOverPeriodService";

const i18n = i18nFilter();

const StyledPill = styled(Pill)`
    margin-left: 6px;
`;

const StyledSwitcherItem = styled(FlexRow)`
    display: inline-flex;
    font-weight: 500;
`;

const DAILY_DATA_INCLUDE_SUBDOMAINS_FROM = dayjs.utc("2020/05/29");

interface IAppStateParams {
    /* Countries */
    availableCountries: any[];
    selectedCountry: any;
    /* Websources */
    availableWebsource: any[];
    selectedWebSource: any;
    /* Duration */
    minDate: Dayjs;
    maxDate: Dayjs;
    minDailyDate: Dayjs;
    maxDailyDate: Dayjs;
    selectedDuration: string;
    selectedComparedDuration: string;
    durationSelectorPresets: any;
    durationSelectorWeeklyPresets: any;
    /* Include subdomains */
    includeSubDomains: any;
    isSubDomainsFilterDisabled: boolean;
    includeSubDomainsDisabledTooltip?: string;
    comparedDurationItems: boolean;
}

interface IWebsiteAnalysisFiltersState extends IAppStateParams, IFiltersBaseState {
    componentName: string;
    keys: string;
    showInvalidDurationTooltip: boolean;
    invalidDurationTooltipMessage: string;
    periodOverPeriodDisabled: boolean;
    countryFilterDisabled: boolean;
    countryFilterAvailable: boolean;
    durationSelectorDisabled: boolean;
    durationSelectorAvailable: boolean;
    webSourceFilterAvailable: boolean;
    webSourceFilterDisabled: boolean;
    compareToPlaceholder: string;
    comparedDurationAllowed: boolean;
    isShowEstimationsVsGaToggle: boolean;
    durationPaymentHook: boolean;
    mainWebsiteIsSubDomain: boolean;
    showWebSourceTooltip?: boolean;
    showBetaBranchData?: { isUpdating: boolean; value: boolean };
    hideWebSourceTooltipDispatch?: () => void;
    isCountryHookOpen: boolean;
    isWebSourceHookOpen: boolean;
    openResetBetaBranchModal?: () => void;
}

const hideTooltipDelay = 10000;

class WebsiteAnalysisFilters extends FiltersBase<any, IWebsiteAnalysisFiltersState> {
    private stateChangeSuccessHandler;
    private stateChangeStartHandler;
    private navUpdateHandler;

    constructor(props, context) {
        super(props, context);
        this.services = {
            ...this.services,
            periodOverPeriod: periodOverPeriodService,
            swConnectedAssetsService: Injector.get<IConnectedAssetsService>(
                "swConnectedAssetsService",
            ),
        };

        const params = this.services.swNavigator.getParams();
        const state = this.services.swNavigator.current();

        const stateParams = this.getStateParams(params, state);
        const periodOverPeriodDisabled = this.isPeriodOverPeriodDisabled(
            stateParams.comparedDurationItems,
        );
        const countryFilterDisabled = this.isCountryDropDownDisabled(state);
        const countryFilterAvailable = this.isCountryFilterAvailable(state);
        const durationSelectorAvailable = this.isDurationSelectorAvailable(state);
        const durationSelectorDisabled = this.isDurationSelectorDisabled(params, state);
        const webSourceFilterAvailable = this.isWebSourceFilterAvailable(state);
        const webSourceFilterDisabled = this.isWebSourceFilterDisabled(state);

        this.state = {
            isSideBarOpen: false,
            componentName: this.services.swSettings.current.componentId,
            keys: params.key,
            compareToPlaceholder: i18n("compared.duration.dropdown.empty"),
            showInvalidDurationTooltip: false,
            invalidDurationTooltipMessage: "",
            ...stateParams,
            periodOverPeriodDisabled,
            countryFilterDisabled,
            countryFilterAvailable,
            durationSelectorDisabled,
            durationSelectorAvailable,
            webSourceFilterAvailable,
            webSourceFilterDisabled,
            comparedDurationAllowed: state.periodOverPeriodEnabled === true,
            isShowEstimationsVsGaToggle: false,
            durationPaymentHook: this.services.swSettings.current.durationPaymentHook,
            mainWebsiteIsSubDomain: this.services.rootScope.global.site.isSubDomain,
            isCountryHookOpen: false,
            isWebSourceHookOpen: false,
        };

        this.updateGAToggleState(params.key);
    }

    public componentDidMount() {
        this.stateChangeSuccessHandler = this.services.rootScope.$on(
            "navChangeComplete",
            this.onStateChangeSuccess,
        );
        this.stateChangeStartHandler = this.services.rootScope.$on(
            "navChangeStart",
            this.onStateChangeStart,
        );
        this.navUpdateHandler = this.services.rootScope.$on("navUpdate", this.onNavUpdate);
        setTimeout(() => {
            this.props.hideWebSourceTooltipDispatch && this.props.hideWebSourceTooltipDispatch();
        }, hideTooltipDelay);
    }

    public componentWillUnmount() {
        this.stateChangeSuccessHandler();
        this.stateChangeStartHandler();
        this.navUpdateHandler();
    }

    public componentDidUpdate(prevProps, prevState) {
        if (prevState.showWebSourceTooltip === true) {
            setTimeout(() => {
                this.props.hideWebSourceTooltipDispatch &&
                    this.props.hideWebSourceTooltipDispatch();
            }, hideTooltipDelay);
        }

        if (prevState.showInvalidDurationTooltip === true) {
            setTimeout(() => {
                this.setState({
                    ...this.state,
                    showInvalidDurationTooltip: false,
                    invalidDurationTooltipMessage: "",
                });
            }, hideTooltipDelay);
        }
    }

    public render() {
        return (
            <div className="react-filters-container">
                <FiltersBar filters={this.getFilters()} />
                {this.getCompactFilters().length > 0 && (
                    <FiltersMenu
                        compactFilters={this.getCompactFilters()}
                        isSideBarOpen={this.state.isSideBarOpen}
                        toggleSidebar={this.toggleSidebar}
                        onSidebarToggle={this.onSideBarToggle}
                    />
                )}
            </div>
        );
    }

    @autobind
    private getFilters(): IFilter[] {
        const selectedCountryId = utils.getSelectedId(this.state.selectedCountry);
        const selectedWebSource = utils.getSelectedId(this.state.selectedWebSource);
        const showDurationFilter = this.state.durationSelectorAvailable;
        const showCountryFilter = this.state.countryFilterAvailable;
        const showWebSourceFilter =
            this.state.availableWebsource.length > 0 && this.state.webSourceFilterAvailable;
        const filters = [];

        if (showCountryFilter) {
            filters.push({
                id: "country",
                key: "country",
                filter: (
                    <div key="filter-country">
                        <CountryFilter
                            availableCountries={this.state.availableCountries}
                            changeCountry={this.onCountryChange}
                            selectedCountryIds={selectedCountryId}
                            height={60}
                            appendTo="body"
                            disabled={this.state.countryFilterDisabled}
                            onToggle={this.trackFilterDropDownStatus("Header/Country Filter")}
                            itemWrapper={(props) => (
                                <div
                                    onClick={() => {
                                        if (this.services.swSettings.user.hasSolution2) {
                                            openUnlockModalV2("WebCountry");
                                        } else {
                                            this.setState({ isCountryHookOpen: true });
                                        }
                                        allTrackers.trackEvent(
                                            "hook/Contact Us/Pop Up",
                                            "click",
                                            `Country Filter/${props.text}`,
                                        );
                                    }}
                                >
                                    {props.children}
                                </div>
                            )}
                        />
                        <UnlockModal
                            isOpen={this.state.isCountryHookOpen}
                            onCloseClick={() => {
                                this.setState({ isCountryHookOpen: false });
                            }}
                            activeSlide={"Countries" as IUnlockModalConfigTypes["CountryFilters"]}
                            location="Hook PRO/Website Analysis/Country Filter"
                            {...UnlockModalConfig().CountryFilters}
                        />
                    </div>
                ),
            });
        }

        if (showDurationFilter) {
            filters.unshift({
                id: "duration",
                key: "duration",
                filter: this.getDurationSelectorComponent(this.state.showInvalidDurationTooltip),
            });
        }

        if (showWebSourceFilter && selectedWebSource) {
            filters.push({
                id: "webSource",
                key: "webSource",
                filter: this.getWebSourceFilterComponent(
                    this.props.showWebSourceTooltip,
                    selectedWebSource,
                ),
            });
        }
        return filters;
    }

    @autobind
    private getWebSourceFilterComponent(wrapWithTooltip = false, selectedWebSource) {
        const activeSlide: IUnlockModalConfigTypes["DeviceFilters"] = "Devices";
        const component = (
            <div key="filter-websource">
                <WebSourceFilter
                    items={this.state.availableWebsource}
                    onChange={this.onWebSourceChange}
                    selectedIds={selectedWebSource}
                    height={60}
                    appendTo="body"
                    disabled={
                        this.state.webSourceFilterDisabled ||
                        this.state.availableWebsource.length == 1
                    }
                    onToggle={this.trackFilterDropDownStatus("Header/WebSource Filter")}
                    itemWrapper={(props) => (
                        <div
                            onClick={() => {
                                this.setState({ isWebSourceHookOpen: true });
                                allTrackers.trackEvent(
                                    "hook/Contact Us/Pop Up",
                                    "click",
                                    `WebSource Filter/${props.text}`,
                                );
                            }}
                        >
                            {props.children}
                        </div>
                    )}
                />
                <UnlockModal
                    isOpen={this.state.isWebSourceHookOpen}
                    onCloseClick={() => {
                        this.setState({ isWebSourceHookOpen: false });
                    }}
                    activeSlide={activeSlide}
                    location="Hook PRO/Website Analysis/Web Source Filter"
                    {...UnlockModalConfig().DeviceFilters}
                />
            </div>
        );
        return wrapWithTooltip ? (
            <div
                key="filter-websource"
                className="scss-tooltip scss-tooltip--s scss-tooltip--autohiding"
                data-scss-tooltip={i18n("wa.overview.websource.tooltip")}
            >
                {component}
            </div>
        ) : (
            component
        );
    }

    @autobind
    private getDurationSelectorComponent(wrapWithTooltip = false) {
        const current = this.services.swNavigator.current();
        const isNewMMXAlgoProps =
            this.services.swNavigator.getParams().webSource !== devicesTypes.DESKTOP &&
            (current.name === "websites-trafficOverview" ||
                current.name === "competitiveanalysis_website_overview_marketingchannels" ||
                current.name === "companyresearch_website_marketingchannels" ||
                current.name === "accountreview_website_marketingchannels");

        const compareDisabledTooltipText = isNewMMXAlgoProps
            ? i18n("websiteanalysis.duration.compare.disabled.tooltip.new.mmx.algo")
            : this.state.keys.indexOf(",") > -1
            ? i18n("websiteanalysis.duration.compare.disabled.tooltip.multiple_websites")
            : i18n("websiteanalysis.duration.compare.disabled.tooltip");

        const isFixedSnapshotRangeLength =
            typeof swSettings.current.resources.FixedSnapshotRangeLength === "number";

        const ComponentClass = isFixedSnapshotRangeLength
            ? FixedDurationsSelector
            : DurationSelectorSimple;
        let { hideCalendar } = current;
        // set hideCalendar to true in case the current component uses FixedSnapshotRangeLength.
        // We do that in order to "apply" the changes immediately after preset selection
        if (isFixedSnapshotRangeLength) {
            hideCalendar = true;
        }
        const component =
            isFixedSnapshotRangeLength ||
            !this.services.swSettings.user.isShortMonthIntervalsUser ? (
                <ComponentClass
                    key="filter-duration"
                    minDate={this.state.minDate}
                    maxDate={this.state.maxDate}
                    minDailyDate={this.state.minDailyDate}
                    maxDailyDate={this.state.maxDailyDate}
                    isDisabled={this.state.durationSelectorDisabled}
                    presets={preparePresets(this.state.durationSelectorPresets)}
                    weeklyPresets={preparePresets(this.state.durationSelectorWeeklyPresets)}
                    initialPreset={this.state.selectedDuration}
                    initialComparedDuration={this.state.selectedComparedDuration || false}
                    onSubmit={this.onDurationChange}
                    componentName={this.state.componentName}
                    keys={this.state.keys}
                    compareAllowed={this.state.comparedDurationAllowed}
                    compareLabel={i18n("websiteanalysis.duration.compare.label")}
                    compareDisabledTooltipText={compareDisabledTooltipText}
                    hasPermissionsLock={this.state.durationPaymentHook}
                    onToggle={this.trackFilterDropDownStatus("Date range")}
                    disableCalendar={hideCalendar}
                    disableFooter={hideCalendar}
                    appendTo="body"
                    showWeeklyToggle={
                        this.services.swSettings.current.resources.WeeklyGranularity === true
                    }
                    isWeeklyDataAvailable={isWeeklyKeywordsAvailable(this.services.swSettings)}
                    weeklyCalendarLocked={this.getWeeklyCalendarLocked()}
                    weeklyToggleProps={this.getWeeklyToggleProps()}
                    isShowPoPDropdownLockModal={!isNewMMXAlgoProps}
                />
            ) : (
                <DurationSelectorPresetOriented
                    minDate={this.state.minDate}
                    maxDate={this.state.maxDate}
                    isDisabled={this.state.durationSelectorDisabled}
                    onSubmit={this.onDurationChange}
                    presets={preparePresets(this.state.durationSelectorPresets)}
                    initialPreset={this.state.selectedDuration}
                    appendTo="body"
                />
            );

        return wrapWithTooltip ? (
            <div
                className="scss-tooltip scss-tooltip--s scss-tooltip--autohiding"
                data-scss-tooltip={this.state.invalidDurationTooltipMessage}
            >
                {component}
            </div>
        ) : (
            component
        );
    }

    @autobind
    private getCompactFilters(): ISidebarListItem[] {
        const fixedFilters: ISidebarListItem[] = [];
        // add subdomains filter only if main website isn't a subDomain by itself
        if (!this.state.mainWebsiteIsSubDomain) {
            fixedFilters.push({
                listItem: (
                    <SubDomainsFilter
                        label="Include Subdomains"
                        key="filter-subdomains"
                        isSelected={this.state.includeSubDomains}
                        onClick={() => null}
                        disabledTooltip={this.state.includeSubDomainsDisabledTooltip}
                        isDisabled={this.state.isSubDomainsFilterDisabled}
                    />
                ),
                onSidebarListItemClick: this.state.isSubDomainsFilterDisabled
                    ? () => null
                    : this.onSidebarListCompactElementItemChangeProp(null, this.onSubdomainsChange),
            });
        }
        if (this.state.isShowEstimationsVsGaToggle) {
            fixedFilters.push({
                listItem: <GaFilter label={i18n("analysis.ga.toggle.label")} key="filter-ga" />,
            });
        }

        return fixedFilters;
    }

    @autobind
    private onCountryChange(country) {
        const currentCountry = this.services.swNavigator.getParams().country;
        if (currentCountry === country.id) {
            return;
        }
        this.trackFilterValue(`Header/Country Filter/${country.text}`);
        this.services.swNavigator.updateParams({
            country: country.id,
        });
    }

    @autobind
    private onWebSourceChange(webSource) {
        const currentWebSource = this.services.swNavigator.getParams().webSource;
        if (currentWebSource === webSource.id) {
            return;
        }
        this.trackFilterValue(`Header/WebSource Filter/${webSource.text}`);
        this.services.swNavigator.updateQueryParams({
            webSource: webSource.id,
        });
    }

    @autobind
    private onDurationChange(duration, comparedDuration) {
        this.trackFilterValue(`Date range/${duration}`, duration);
        const updateParams: { isWWW?: string; duration: string; comparedDuration?: string } = {
            duration,
            comparedDuration: comparedDuration ? comparedDuration : "",
        };

        const durationData = DurationService.getDurationData(duration);
        // SIM-29373: allow include subdomains for daily data only after 29.5.2020
        if (
            durationData.raw.isDaily &&
            durationData.raw.from.isBefore(DAILY_DATA_INCLUDE_SUBDOMAINS_FROM)
        ) {
            updateParams.isWWW = "-";
        }
        // BETA BRANCH ADDITION : for company analysis and website analysis T&E
        if (
            this.state.componentName ===
                this.services.swNavigator.getState("websites-audienceOverview").configId &&
            this.props.showBetaBranchData.value &&
            (duration === "28d" || comparedDuration)
        ) {
            this.props.openResetBetaBranchModal(updateParams);
            return;
        }

        this.services.swNavigator.updateParams(updateParams);
    }

    @autobind
    private onSubdomainsChange() {
        const subdomainsState = this.state.includeSubDomains;
        const trackValue = subdomainsState ? "main domain only" : "include subdomains";
        this.services.track.all.trackEvent(
            "toggle",
            "switch",
            `filter side bar/include subdomains/${trackValue}`,
        );
        this.services.swNavigator.updateParams({
            isWWW: subdomainsState ? "-" : "*",
        });
    }

    @autobind
    private getWebSources(state, params) {
        return utils.getAvailableWebSource(state, params);
    }

    @autobind
    private isCorrectState(toState) {
        return this.services.swNavigator.isWebsiteAnalysis(toState);
    }

    @autobind
    private onStateChangeSuccess(evt, toState, toParams) {
        if (!this.isCorrectState(toState)) {
            return;
        }
        const stateParams = this.getStateParams(toParams, toState);
        const periodOverPeriodDisabled = this.isPeriodOverPeriodDisabled(
            stateParams.comparedDurationItems,
        );
        const countryFilterDisabled = this.isCountryDropDownDisabled(toState);
        const countryFilterAvailable = this.isCountryFilterAvailable(toState);
        const durationSelectorAvailable = this.isDurationSelectorAvailable(toState);
        const durationSelectorDisabled = this.isDurationSelectorDisabled(toParams, toState);
        const webSourceFilterAvailable = this.isWebSourceFilterAvailable(toState);
        const webSourceFilterDisabled = this.isWebSourceFilterDisabled(toState);
        const componentName = this.services.swNavigator.getConfigIdFromStateConfig(
            toState,
            toParams,
        );

        this.setState({
            ...this.state,
            ...stateParams,
            keys: toParams.key,
            componentName,
            periodOverPeriodDisabled,
            countryFilterDisabled,
            countryFilterAvailable,
            durationSelectorDisabled,
            durationSelectorAvailable,
            webSourceFilterAvailable,
            webSourceFilterDisabled,
            comparedDurationAllowed: toState.periodOverPeriodEnabled,
            mainWebsiteIsSubDomain: this.services.rootScope.global.site.isSubDomain,
            durationPaymentHook: this.services.swSettings.current.durationPaymentHook,
        });

        this.updateGAToggleState(toParams.key);
    }

    @autobind
    private onStateChangeStart(event, to, toParams, from, fromParams, toConfigId) {
        if (!this.isCorrectState(to)) {
            return;
        }
        if (this.checkRedirectOnInvalidDurationWebsiteOverview(to, toParams)) {
            this.setState({
                ...this.state,
                showInvalidDurationTooltip: true,
                invalidDurationTooltipMessage: i18n("wa.wwo.websource.tooltip"),
            });
        }
        if (this.checkRedirectOnInvalidDurationAudienceInterests(to, toParams)) {
            const latestValid = DurationService.getDurationData(
                to.overrideDatepickerPreset[0],
                undefined,
                toConfigId,
            );
            const durationData = DurationService.getDurationData(
                toParams.duration,
                undefined,
                toConfigId,
            );
            const closestPreset = DurationService.getClosestPreset(
                durationData.raw.from,
                latestValid.raw.to,
                to.overrideDatepickerPreset,
            );
            this.services.swNavigator.go(
                to,
                Object.assign(toParams, { duration: closestPreset ? closestPreset : "3m" }),
            );
            this.setState({
                ...this.state,
                showInvalidDurationTooltip: true,
                invalidDurationTooltipMessage: i18nFilter()("wa.wwo.websource.tooltip"),
            });
        }
        if (this.checkRedirectOnInvalidDuration(toParams, fromParams, toConfigId)) {
            this.setState({
                ...this.state,
                showInvalidDurationTooltip: true,
                invalidDurationTooltipMessage: i18n("duration.unavailable.tooltip", {
                    duration: DurationService.getDurationData(
                        fromParams.duration,
                        null,
                        "WebAnalysis",
                    ).forTitle,
                }),
            });
        }
    }

    @autobind
    private onNavUpdate(event, to, toParams) {
        if (!this.isCorrectState(to)) {
            return;
        }
        const selectedCountry = _.find<{ id: number }>(this.state.availableCountries, {
            id: parseInt(toParams.country),
        });
        const selectedWebSource = _.find(this.state.availableWebsource, { id: toParams.webSource });
        this.setState({
            ...this.state,
            selectedCountry,
            selectedWebSource,
        });
    }

    @autobind
    private checkRedirectOnInvalidDurationWebsiteOverview(toState, toParams) {
        if (toState.name === "websites-worldwideOverview") {
            if (
                toParams.country === "999" &&
                toParams.duration !== "1m" &&
                !this.services.swSettings.allowedCountry(toParams.country, "WebAnalysis")
            ) {
                return true;
            }
        }

        return false;
    }

    @autobind
    private checkRedirectOnInvalidDurationAudienceInterests(toState, toParams) {
        return (
            toState.name === "websites-audienceInterests" &&
            !toState.overrideDatepickerPreset.includes(toParams.duration)
        );
    }

    @autobind
    private checkRedirectOnInvalidDuration(toParams, fromParams, toConfigId) {
        // Fetch config object according to state's configId
        const previousDuration = fromParams.duration;
        const currentDuration = toParams.duration;
        const unsupportedDuration =
            previousDuration &&
            !this.services.swSettings.allowedDuration(previousDuration, toConfigId);

        if (previousDuration !== currentDuration && unsupportedDuration) {
            return true;
        }
        return false;
    }

    private getComparedDurationDropDownItems(params) {
        return this.services.periodOverPeriod.getPeriodOverPeriodDropdownItems(
            params.duration,
            params.key,
            this.services.swSettings.current.componentId,
        );
    }

    private isPeriodOverPeriodDisabled(comparedDurationDropDownItems) {
        if (
            comparedDurationDropDownItems[0].disabled &&
            comparedDurationDropDownItems[1].disabled
        ) {
            return true;
        } else {
            return false;
        }
    }

    private isCountryDropDownDisabled(state) {
        return state.data.filtersConfig.country === FiltersEnum.DISABLED;
    }

    private isCountryFilterAvailable(state) {
        return state.data.filtersConfig.country !== FiltersEnum.HIDDEN;
    }

    private isDurationSelectorDisabled(params, state) {
        // For users that do not have 999 permissions in the Website overview page
        if (state.data.filtersConfig.duration === FiltersEnum.DISABLED) {
            return true;
        }
        return (
            state.name === "websites-worldwideOverview" &&
            params.country === "999" &&
            !this.services.swSettings.allowedCountry(params.country, "WebAnalysis")
        );
    }

    private isDurationSelectorAvailable(state) {
        return state.data.filtersConfig.duration !== FiltersEnum.HIDDEN;
    }

    private isWebSourceFilterDisabled(state) {
        return state.data.filtersConfig.webSource === FiltersEnum.DISABLED;
    }

    private isWebSourceFilterAvailable(state) {
        return state.data.filtersConfig.webSource !== FiltersEnum.HIDDEN;
    }

    private getStateParams(params, state): IAppStateParams {
        const availableCountries = utils.getCountries();
        const availableWebsource = this.getWebSources(state, params);

        let selectedCountry = _.find<{ id: number }>(availableCountries, {
            id: parseInt(params.country),
        });
        if (!selectedCountry) {
            if (swSettings.current.resources.InitialCountry) {
                selectedCountry = availableCountries.find(
                    ({ id }) => id === swSettings.current.resources.InitialCountry,
                );
            }
            if (!selectedCountry) {
                selectedCountry = _.get(availableCountries, 0, {});
            }
            this.services.swNavigator.updateParams({
                country: selectedCountry.id.toString(),
            });
        }
        const selectedWebSource = _.find(availableWebsource, { id: params.webSource });
        const selectedDuration = params.duration;
        const selectedComparedDuration = params.comparedDuration;
        const comparedDurationItems = this.getComparedDurationDropDownItems(params);

        return {
            availableCountries,
            availableWebsource,
            selectedCountry,
            selectedWebSource,
            selectedDuration,
            selectedComparedDuration,
            includeSubDomains: params.isWWW === "*",
            minDate: this.services.swSettings.current.startDate,
            maxDate: this.services.swSettings.current.endDate,
            // minDailyDate: this.services.swSettings.current.windowStartDate,
            minDailyDate: this.services.swSettings.current.startDate,
            maxDailyDate: this.services.swSettings.current.windowEndDate,
            durationSelectorPresets: this.services.swSettings.current.datePickerPresets,
            durationSelectorWeeklyPresets: this.services.swSettings.current.weeklyDatePickerPresets,
            ...this.isSubdomainsFilterDisabled(params, state),
            comparedDurationItems,
        };
    }

    private isSubdomainsFilterDisabled = (params, state) => {
        const durationData = DurationService.getDurationData(params.duration);
        if (
            durationData.raw.isDaily &&
            durationData.raw.from.isBefore(DAILY_DATA_INCLUDE_SUBDOMAINS_FROM)
        ) {
            return {
                isSubDomainsFilterDisabled: true,
                includeSubDomainsDisabledTooltip: i18n(
                    "analysis.trafficsource.search.subdomains.disabled.tooltip",
                ),
            };
        }
        return {
            isSubDomainsFilterDisabled: utils.isSubdomainsFilterDisabled(params, state),
            includeSubDomainsDisabledTooltip: null,
        };
    };

    private updateGAToggleState(domains) {
        this.services.swConnectedAssetsService
            .isShowEstimationsVsGaToggle(this.services.swNavigator.getApiParams().key)
            .promise.then((isShowEstimationsVsGaToggle) => {
                this.setState({
                    ...this.state,
                    isShowEstimationsVsGaToggle,
                });
                if (!isShowEstimationsVsGaToggle) {
                    this.props.hideGAApprovedDataDispatch();
                }
            });
    }

    @autobind
    private onDurationCompactClick() {
        allTrackers.trackEvent("Drop Down", "open", `Date Range`);
    }

    @autobind
    private onSidebarListCompactElementItemChangeProp(item, cb) {
        return async () => {
            await this.setStateAsync({
                isSideBarOpen: false,
            });
            setTimeout(() => {
                cb(item);
            }, 400);
        };
    }

    @autobind
    private async onDurationChangeFromSideBar(x, y) {
        await this.setStateAsync({
            isSideBarOpen: false,
        });
        setTimeout(() => {
            this.onDurationChange(x, y);
        }, 400);
    }

    private getWeeklyCalendarLocked = () => {
        return (
            <WeeklyCalendarLocked
                title={i18n("datepicker.granularity.weekly.hook.keywords.title")}
                subTitle={i18n("datepicker.granularity.weekly.hook.keywords.subtitle")}
                text={i18n("datepicker.granularity.weekly.hook.keywords.text")}
                buttonText={i18n("datepicker.granularity.weekly.hook.keywords.button")}
                onButtonClick={this.openWeeklyKeywordsHook}
            />
        );
    };

    private openWeeklyKeywordsHook = () => {
        openUnlockModalV2("WeeklyKeywords");
    };

    private getWeeklyToggleProps = () => {
        return {
            weekly: (
                <StyledSwitcherItem alignItems="center">
                    {i18n("datepicker.granularity.weekly")}{" "}
                    <StyledPill
                        backgroundColor={colorsPalettes.orange[400]}
                        text={i18n("datepicker.granularity.weekly.new")}
                    />
                </StyledSwitcherItem>
            ),
            monthly: (
                <StyledSwitcherItem alignItems="center">
                    {i18n("datepicker.granularity.monthly")}
                </StyledSwitcherItem>
            ),
        };
    };
}

function mapDispatchToProps(dispatch) {
    return {
        hideWebSourceTooltipDispatch: () => {
            dispatch(hideWebsourceTooltip());
        },
        // update the GA toggle to false when the GA is unavailable
        hideGAApprovedDataDispatch: () => {
            dispatch(estimatedVsGaSwitchToggle(false));
        },
        openResetBetaBranchModal: (updateParams) => {
            dispatch(toggleResetBetaBranchModal(true, updateParams));
        },
    };
}

function mapStateToProps({ common: { showWebSourceTooltip, showBetaBranchData } }) {
    return {
        showWebSourceTooltip,
        showBetaBranchData,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(WebsiteAnalysisFilters);
