import autobind from "autobind-decorator";
import { preparePresets } from "components/dashboard/widget-wizard/components/DashboardWizardDuration";
import { DurationSelectorPresetOriented } from "components/duration-selectors/DurationSelectedPresetOriented";
import * as utils from "components/filters-bar/utils";
import { FiltersEnum } from "components/filters-bar/utils";
import { WebSourceFilter } from "components/filters-bar/websource-filter/WebSourceFilter";
import { FiltersBar, IFilter } from "components/React/FiltersBar/FiltersBar";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import _ from "lodash";
import { Dayjs } from "dayjs";
import { DurationSelectorSimple } from "pages/website-analysis/DurationSelectorSimple";
import React from "react";
import { connect } from "react-redux";
import { openUnlockModalV2 } from "services/ModalService";
import UnlockModalConfig, {
    IUnlockModalConfigTypes,
} from "../../../.pro-features/components/Modals/src/UnlockModal/unlockModalConfig";
import { hideCountryTooltip, hideWebsourceTooltip } from "../../actions/commonActions";
import { CountryFilter } from "../../components/filters-bar/country-filter/CountryFilter";
import { FiltersBase } from "../../components/filters-bar/FiltersBase";

import UnlockModal from "../../components/React/UnlockModalProvider/UnlockModalProvider";
import { allTrackers } from "../../services/track/track";

export interface IAppStateParams {
    /* Countries */
    availableCountries: any[];
    selectedCountry: any;
    /* Websources */
    availableWebsource: any[];
    selectedWebSource: any;
    /* Duration */
    minDate: Dayjs;
    maxDate: Dayjs;
    selectedDuration: string;
    selectedComparedDuration: string;
    durationSelectorPresets: any;
    durationPaymentHook: boolean;
}
interface IIndustryAnalysisFiltersState extends IAppStateParams {
    componentName: string;
    keys: string;
    countryFilterDisabled: boolean;
    countryFilterAvailable: boolean;
    durationSelectorDisabled: boolean;
    durationSelectorAvailable: boolean;
    webSourceFilterAvailable: boolean;
    webSourceFilterDisabled: boolean;
    comparedDurationAllowed: boolean;
    showCountryTooltip: boolean;
    countryTooltipMessage: string;
    showWebSourceTooltip?: boolean;
    hideWebSourceTooltipDispatch?: () => void;
    hideCountryTooltipDispatch?: () => void;
    isCountryHookOpen: boolean;
    isWebSourceHookOpen: boolean;
    isSideBarOpen: boolean;
}

const hideTooltipDelay = 10000;

export class IndustryAnalysisFilters extends FiltersBase<any, IIndustryAnalysisFiltersState> {
    private stateChangeSuccessHandler;
    private stateChangeStartHandler;
    private navUpdateHandler;
    constructor(props, context) {
        super(props, context);

        const params = this.services.swNavigator.getParams();
        const state = this.services.swNavigator.current();
        const stateParams = this.getStateParams(params, state);
        const countryFilterDisabled = this.isCountryDropDownDisabled(state);
        const countryFilterAvailable = this.isCountryFilterAvailable(state);
        const durationSelectorAvailable = this.isDurationSelectorAvailable(state);
        const durationSelectorDisabled = this.isDurationSelectorDisabled(params, state);
        const webSourceFilterAvailable = this.isWebSourceFilterAvailable(state);
        const webSourceFilterDisabled = this.isWebSourceFilterDisabled(state);

        this.state = {
            isSideBarOpen: false,
            componentName: this.services.swSettings.current.componentId,
            keys: params.category,
            ...stateParams,
            countryFilterDisabled,
            countryFilterAvailable,
            durationSelectorDisabled,
            durationSelectorAvailable,
            webSourceFilterAvailable,
            webSourceFilterDisabled,
            comparedDurationAllowed: state.periodOverPeriodEnabled === true,
            showCountryTooltip: false,
            countryTooltipMessage: i18nFilter()("notpermittedcountry.tooltip"),
            durationPaymentHook: this.services.swSettings.current.durationPaymentHook,
            isCountryHookOpen: false,
            isWebSourceHookOpen: false,
        };
    }

    public componentDidMount() {
        this.navUpdateHandler = this.services.rootScope.$on("navUpdate", this.onStateChangeSuccess);
        this.stateChangeSuccessHandler = this.services.rootScope.$on(
            "navChangeComplete",
            this.onStateChangeSuccess,
        );
        const { hideWebSourceTooltipDispatch, hideCountryTooltipDispatch } = this.props;
        setTimeout(() => {
            hideWebSourceTooltipDispatch && hideWebSourceTooltipDispatch();
            hideCountryTooltipDispatch && hideCountryTooltipDispatch();
        }, hideTooltipDelay);
    }

    public componentWillUnmount() {
        this.stateChangeSuccessHandler();
        this.navUpdateHandler();
    }

    public componentDidUpdate(prevProps, prevState) {
        const { hideWebSourceTooltipDispatch, hideCountryTooltipDispatch } = this.props;
        if (prevState.showCountryTooltip === true) {
            setTimeout(() => {
                hideCountryTooltipDispatch && hideCountryTooltipDispatch();
            }, hideTooltipDelay);
        }

        if (prevState.showWebSourceTooltip === true) {
            setTimeout(() => {
                hideWebSourceTooltipDispatch && hideWebSourceTooltipDispatch();
            }, hideTooltipDelay);
        }
    }

    public render() {
        return (
            <div className="react-filters-container">
                <FiltersBar filters={this.getFilters()} />
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
                filter: this.getCountryFilterComponent(
                    this.props.showCountryTooltip,
                    selectedCountryId,
                ),
            });
        }

        if (showDurationFilter) {
            filters.unshift({
                id: "duration",
                filter: this.getDurationSelectorComponent(),
            });
        }

        if (showWebSourceFilter && selectedWebSource) {
            filters.push({
                id: "webSource",
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
                    location="Hook PRO/Web Category Analysis/Web Source Filter"
                    {...UnlockModalConfig().DeviceFilters}
                />
            </div>
        );
        return wrapWithTooltip ? (
            <div
                className="scss-tooltip scss-tooltip--s scss-tooltip--autohiding"
                data-scss-tooltip={i18nFilter()("wa.overview.websource.tooltip")}
            >
                {component}
            </div>
        ) : (
            component
        );
    }

    @autobind
    private getCountryFilterComponent(wrapWithTooltip = false, selectedCountryId) {
        const activeSlide: IUnlockModalConfigTypes["CountryFilters"] = "Countries";
        const component = (
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
                    activeSlide={activeSlide}
                    location="Hook PRO/Web Category Analysis/Country Filter"
                    {...UnlockModalConfig().CountryFilters}
                />
            </div>
        );
        return wrapWithTooltip ? (
            <div
                className="scss-tooltip scss-tooltip--s scss-tooltip--autohiding"
                data-scss-tooltip={i18nFilter()("topsites.unsupportedCountry.tooltip")}
            >
                {component}
            </div>
        ) : (
            component
        );
    }

    @autobind
    private getDurationSelectorComponent() {
        const current = this.services.swNavigator.current();
        const component = !this.services.swSettings.user.isShortMonthIntervalsUser ? (
            <DurationSelectorSimple
                key="filter-duration"
                minDate={this.state.minDate}
                maxDate={this.state.maxDate}
                isDisabled={this.state.durationSelectorDisabled}
                presets={preparePresets(this.state.durationSelectorPresets)}
                initialPreset={this.state.selectedDuration}
                initialComparedDuration={this.state.selectedComparedDuration || false}
                onSubmit={this.onDurationChange}
                componentName={this.state.componentName}
                keys={this.state.keys}
                compareAllowed={this.state.comparedDurationAllowed}
                compareLabel={i18nFilter()("categoryanalysis.duration.compare.label")}
                compareDisabledTooltipText={i18nFilter()(
                    "categoryanalysis.duration.compare.disabled.tooltip",
                )}
                hasPermissionsLock={this.state.durationPaymentHook}
                disableCalendar={current.hideCalendar}
                disableFooter={current.hideCalendar}
                onToggle={this.trackFilterDropDownStatus("Date range")}
                appendTo="body"
            />
        ) : (
            <DurationSelectorPresetOriented
                minDate={this.state.minDate}
                maxDate={this.state.maxDate}
                isDisabled={this.state.durationSelectorDisabled}
                onSubmit={this.onDurationChange}
                presets={preparePresets(this.state.durationSelectorPresets)}
                initialPreset={this.state.selectedDuration}
            />
        );
        return component;
    }

    @autobind
    private async onCountryChange(country) {
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
        this.services.swNavigator.updateParams({
            duration,
            comparedDuration: comparedDuration ? comparedDuration : "",
        });
    }

    @autobind
    private getWebSources(state, params) {
        return utils.getAvailableWebSource(state, params);
    }

    @autobind
    private isCorrectState(toState) {
        return this.services.swNavigator.isIndustryAnalysis(toState);
    }

    @autobind
    private onStateChangeSuccess(evt, toState, toParams) {
        if (!this.isCorrectState(toState)) {
            return;
        }
        const stateParams = this.getStateParams(toParams, toState);
        const countryFilterDisabled = this.isCountryDropDownDisabled(toState);
        const countryFilterAvailable = this.isCountryFilterAvailable(toState);
        const durationSelectorAvailable = this.isDurationSelectorAvailable(toState);
        const durationSelectorDisabled = this.isDurationSelectorDisabled(toParams, toState);
        const webSourceFilterAvailable = this.isWebSourceFilterAvailable(toState);
        const webSourceFilterDisabled = this.isWebSourceFilterDisabled(toState);
        this.setState({
            ...this.state,
            ...stateParams,
            keys: toParams.category,
            countryFilterDisabled,
            countryFilterAvailable,
            durationSelectorDisabled,
            durationSelectorAvailable,
            webSourceFilterAvailable,
            webSourceFilterDisabled,
            comparedDurationAllowed: toState.periodOverPeriodEnabled,
            durationPaymentHook: this.services.swSettings.current.durationPaymentHook,
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

    private getComparedDurationDropDownItems(params) {
        return this.services.periodOverPeriod.getPeriodOverPeriodDropdownItems(
            params.duration,
            params.key,
            "WebAnalysis",
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
        return state.data?.filtersConfig?.country === FiltersEnum.DISABLED;
    }

    private isCountryFilterAvailable(state) {
        return state.data?.filtersConfig?.country !== FiltersEnum.HIDDEN;
    }

    private isDurationSelectorDisabled(params, state) {
        if (typeof state.data.filtersConfig === "function") {
            const result = state.data.filtersConfig(params);
            return result.duration === FiltersEnum.DISABLED;
        }
        return state.data?.filtersConfig?.duration === FiltersEnum.DISABLED;
    }

    private isDurationSelectorAvailable(state) {
        return state.data?.filtersConfig?.duration !== FiltersEnum.HIDDEN;
    }

    private isWebSourceFilterDisabled(state) {
        return state.data?.filtersConfig?.webSource === FiltersEnum.DISABLED;
    }

    private isWebSourceFilterAvailable(state) {
        return state.data?.filtersConfig?.webSource !== FiltersEnum.HIDDEN;
    }
    private selectedDuration(state, params) {
        if (typeof state.overrideParams === "function") {
            return state.overrideParams(params).duration;
        } else {
            return params.duration;
        }
    }

    private getStateParams(params, state): IAppStateParams {
        const availableCountries = utils.getCountries();
        const availableWebsource = this.getWebSources(state, params);
        const selectedCountry = _.find<{ id: number }>(availableCountries, {
            id: parseInt(params.country),
        });
        const selectedWebSource = _.find(availableWebsource, { id: params.webSource });
        const selectedDuration = this.selectedDuration(state, params);
        const selectedComparedDuration = params.comparedDuration;

        return {
            availableCountries,
            availableWebsource,
            selectedCountry,
            selectedWebSource,
            selectedDuration,
            selectedComparedDuration,
            minDate: this.services.swSettings.current.startDate,
            maxDate: this.services.swSettings.current.endDate,
            durationSelectorPresets: this.services.swSettings.current.datePickerPresets,
            durationPaymentHook: this.services.swSettings.current.durationPaymentHook,
        };
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
}

function mapDispatchToProps(dispatch) {
    return {
        hideWebSourceTooltipDispatch: () => {
            dispatch(hideWebsourceTooltip());
        },
        hideCountryTooltipDispatch: () => {
            dispatch(hideCountryTooltip());
        },
    };
}

function mapStateToProps({ common: { showWebSourceTooltip, showCountryTooltip } }) {
    return {
        showWebSourceTooltip,
        showCountryTooltip,
    };
}

const component = connect(mapStateToProps, mapDispatchToProps)(IndustryAnalysisFilters);

SWReactRootComponent(component, "IndustryAnalysisFilters");

export default component;
