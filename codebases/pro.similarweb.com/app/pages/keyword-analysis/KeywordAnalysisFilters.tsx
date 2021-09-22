import autobind from "autobind-decorator";
import { preparePresets } from "components/dashboard/widget-wizard/components/DashboardWizardDuration";
import { DurationSelectorPresetOriented } from "components/duration-selectors/DurationSelectedPresetOriented";
import * as utils from "components/filters-bar/utils";
import { WebSourceFilter } from "components/filters-bar/websource-filter/WebSourceFilter";
import { FiltersBar, IFilter } from "components/React/FiltersBar/FiltersBar";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import * as _ from "lodash";
import * as React from "react";
import { openUnlockModalV2 } from "services/ModalService";
import { allTrackers } from "services/track/track";
import UnlockModalConfig, {
    IUnlockModalConfigTypes,
} from "../../../.pro-features/components/Modals/src/UnlockModal/unlockModalConfig";
import { CountryFilter } from "../../components/filters-bar/country-filter/CountryFilter";
import { FiltersBase } from "../../components/filters-bar/FiltersBase";

import { PlainTooltip } from "../../components/React/Tooltip/PlainTooltip/PlainTooltip";
import UnlockModal from "../../components/React/UnlockModalProvider/UnlockModalProvider";
import { DurationSelectorSimple } from "../website-analysis/DurationSelectorSimple";
import { FiltersEnum } from "components/filters-bar/utils";
import { swSettings } from "common/services/swSettings";
import { FixedDurationsSelector } from "pages/website-analysis/FixedDurationsSelector";

@SWReactRootComponent
export class KeywordAnalysisFilters extends FiltersBase<any, any> {
    private stateChangeSuccessHandler;

    constructor(props, context) {
        super(props, context);
        const params = this.services.swNavigator.getParams();
        const state = this.services.swNavigator.current();
        const stateParams = this.getStateParams(params, state);
        const selectedDuration = params.duration;
        const selectedComparedDuration = params.comparedDuration;
        const countryFilterDisabled = this.isCountryDropDownDisabled(state);
        const durationSelectorDisabled = this.isDurationSelectorDisabled(state);

        this.state = {
            componentName: this.services.swSettings.current.componentId,
            isSideBarOpen: false,
            keys: params.keyword,
            ...stateParams,
            durationSelectorDisabled,
            selectedDuration,
            selectedComparedDuration,
            countryFilterDisabled,
            isCountryHookOpen: false,
            durationPaymentHook: this.services.swSettings.current.durationPaymentHook,
            comparedDurationAllowed: state.periodOverPeriodEnabled === true,
        };
    }
    public render() {
        return (
            <div className="react-filters-container">
                <FiltersBar filters={this.getFilters()} />
            </div>
        );
    }

    public componentDidMount() {
        this.stateChangeSuccessHandler = this.services.rootScope.$on(
            "navChangeComplete",
            this.onStateChangeSuccess,
        );
    }

    public componentWillUnmount() {
        this.stateChangeSuccessHandler();
    }

    @autobind
    private onStateChangeSuccess(evt, toState, toParams) {
        if (!this.isCorrectState(toState)) {
            return;
        }
        const stateParams = this.getStateParams(toParams, toState);
        const countryFilterDisabled = this.isCountryDropDownDisabled(toState);
        const durationSelectorDisabled = this.isDurationSelectorDisabled(toState);

        this.setState({
            ...this.state,
            ...stateParams,
            keys: toParams.keyword,
            countryFilterDisabled,
            durationSelectorDisabled,
            durationPaymentHook: this.services.swSettings.current.durationPaymentHook,
            selectedDuration: toParams.duration,
        });
    }

    private getStateParams(params, state) {
        const excludeStates =
            state.isUSStatesSupported === undefined ? false : !state.isUSStatesSupported;
        const availableCountries = utils.getCountries(excludeStates);
        const availableWebsource = this.getWebSources(state, params);
        let selectedCountry = _.find<{ id: number }>(availableCountries, {
            id: parseInt(params.country),
        });
        if (!selectedCountry) {
            if (swSettings.current.resources.initialCountry) {
                selectedCountry = availableCountries.find(
                    ({ id }) => id === swSettings.current.resources.initialCountry,
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

        return {
            availableCountries,
            availableWebsource,
            selectedCountry,
            selectedWebSource,
            minDate: this.services.swSettings.current.startDate,
            maxDate: this.services.swSettings.current.endDate,
            durationSelectorPresets: this.services.swSettings.current.datePickerPresets,
        };
    }

    @autobind
    private getWebSources(state, params) {
        return utils.getAvailableWebSource(state, params);
    }

    @autobind
    private onCountryChange(country) {
        this.trackFilterValue(`Header/Country Filter/${country.text}`);
        this.services.swNavigator.updateParams({
            country: country.id,
        });
    }

    private getFilters(): IFilter[] {
        const selectedCountryId = utils.getSelectedId(this.state.selectedCountry);
        const selectedWebSource = utils.getSelectedId(this.state.selectedWebSource);

        const filters = [
            {
                id: "duration",
                // filter: this.getDurationSelectorComponent(this.state.showInvalidDurationTooltip),
                filter: this.getDurationSelectorComponent(false),
            },
            {
                id: "country",
                key: "country",
                filter: (
                    <div key="filter-country">
                        <CountryFilter
                            key="filter-country"
                            appendTo="body"
                            availableCountries={this.state.availableCountries}
                            changeCountry={this.onCountryChange}
                            selectedCountryIds={selectedCountryId}
                            disabled={this.state.countryFilterDisabled}
                            height={60}
                            onToggle={this.trackFilterDropDownStatus("Header/Country Filter")}
                            itemWrapper={(props) => (
                                <div
                                    onClick={() => {
                                        if (this.services.swSettings.user.hasSolution2) {
                                            openUnlockModalV2("WebCountry");
                                        } else {
                                            this.setState({ isCountryHookOpen: true });
                                        }
                                        this.services.track.all.trackEvent(
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
                            location="Hook PRO/Web Category Analysis/Country Filter"
                            {...UnlockModalConfig().CountryFilters}
                        />
                    </div>
                ),
            },
        ];
        if (this.state.availableWebsource.length > 0 && selectedWebSource) {
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
    private getWebSourceFilterComponent(wrapWithTooltip = false, selectedWebSource) {
        const activeSlide: IUnlockModalConfigTypes["DeviceFilters"] = "Devices";
        const component = (
            <div key="filter-websource">
                <WebSourceFilter
                    appendTo="body"
                    items={this.state.availableWebsource}
                    onChange={this.onWebSourceChange}
                    selectedIds={selectedWebSource}
                    height={60}
                    onToggle={this.trackFilterDropDownStatus("Header/WebSource Filter")}
                    disabled={this.state.availableWebsource.length === 1}
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
                className="scss-tooltip scss-tooltip--s scss-tooltip--autohiding"
                data-scss-tooltip={i18nFilter()("wa.overview.websource.tooltip")}
            >
                {component}
            </div>
        ) : (
            component
        );
    }

    private isCountryDropDownDisabled(state) {
        return state.data?.filtersConfig?.country === FiltersEnum.DISABLED;
    }

    private isDurationSelectorDisabled(state) {
        return state.data?.filtersConfig?.duration === FiltersEnum.DISABLED;
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

    private getDurationSelectorComponent(wrapWithTooltip = false) {
        const current = this.services.swNavigator.current();
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
                    isDisabled={this.state.durationSelectorDisabled}
                    presets={preparePresets(this.state.durationSelectorPresets)}
                    initialPreset={this.state.selectedDuration}
                    initialComparedDuration={this.state.selectedComparedDuration}
                    onSubmit={this.onDurationChange}
                    componentName={this.state.componentName}
                    keys={this.state.keys}
                    disableCalendar={hideCalendar}
                    disableFooter={hideCalendar}
                    compareAllowed={this.state.comparedDurationAllowed}
                    hasPermissionsLock={this.state.durationPaymentHook}
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
        return wrapWithTooltip ? (
            <PlainTooltip
                cssClassContent="filters-bar-tooltip"
                placement={"bottom"}
                text={this.state.invalidDurationTooltipMessage}
            >
                <div>{component}</div>
            </PlainTooltip>
        ) : (
            component
        );
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
    private onDurationChange(duration, comparedDuration) {
        this.services.swNavigator.updateParams({
            duration,
            comparedDuration: comparedDuration ? comparedDuration : "",
        });
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

    @autobind
    private isCorrectState(toState) {
        return (
            (toState.parent && toState.parent === "findaffiliates_bykeywords_root") ||
            this.services.swNavigator.isKeywordAnalysis(toState)
        );
    }
}
