import autobind from "autobind-decorator";
import { preparePresets } from "components/dashboard/widget-wizard/components/DashboardWizardDuration";
import { DurationSelectorPresetOriented } from "components/duration-selectors/DurationSelectedPresetOriented";
import { FiltersBase } from "components/filters-bar/FiltersBase";
import * as utils from "components/filters-bar/utils";
import { FiltersBar, IFilter } from "components/React/FiltersBar/FiltersBar";
import * as _ from "lodash";
import * as React from "react";
import { openUnlockModalV2 } from "services/ModalService";
import UnlockModalConfig, {
    IUnlockModalConfigTypes,
} from "../../../.pro-features/components/Modals/src/UnlockModal/unlockModalConfig";
import { CountryFilter } from "../../components/filters-bar/country-filter/CountryFilter";
import { PlainTooltip } from "../../components/React/Tooltip/PlainTooltip/PlainTooltip";
import UnlockModal from "../../components/React/UnlockModalProvider/UnlockModalProvider";
import { allTrackers } from "../../services/track/track";
import { DurationSelectorSimple } from "../website-analysis/DurationSelectorSimple";

const disableDuration = new Set([
    "apps-demographics",
    "companyresearch_app_appdmg",
    "salesIntelligence-apps-demographics",
]);

export class AppAnalysisFilters extends FiltersBase<any, any> {
    private navUpdateHandler;
    private stateChangeSuccessHandler;

    constructor(props, context) {
        super(props, context);
        const params = this.services.swNavigator.getParams();
        const state = this.services.swNavigator.current();
        const stateParams = this.getStateParams(params, state);
        const durationSelectorDisabled = disableDuration.has(state.name);
        const selectedDuration = params.duration;

        this.state = {
            componentName: this.services.swSettings.current.componentId,
            isSideBarOpen: false,
            keys: params.appId,
            ...stateParams,
            durationSelectorDisabled,
            countryPickerDisabled: this.isCountryDropDownDisabled(state, params),
            selectedDuration,
            comparedDurationAllowed: false,
            durationPaymentHook: this.services.swSettings.current.durationPaymentHook,
            isCountryHookOpen: false,
        };
    }

    public render() {
        return (
            <div className="u-flex-row u-flex-center u-lineHeight1">
                <div className="react-filters-container">
                    <FiltersBar filters={this.getFilters()} />
                </div>
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
    private isCorrectState(toState) {
        return this.services.swNavigator.isAppAnalysis(toState);
    }

    @autobind
    private onStateChangeSuccess(evt, toState, toParams) {
        if (!this.isCorrectState(toState)) {
            return;
        }
        const stateParams = this.getStateParams(toParams, toState);
        const countryPickerDisabled = this.isCountryDropDownDisabled(toState, toParams);
        const durationSelectorDisabled = disableDuration.has(toState.name);
        const selectedDuration = toParams.duration;

        this.setState({
            ...this.state,
            ...stateParams,
            selectedDuration,
            countryPickerDisabled,
            durationSelectorDisabled,
            durationPaymentHook: this.services.swSettings.current.durationPaymentHook,
            comparedDurationAllowed: toState.periodOverPeriodEnabled,
        });
    }

    private isCountryDropDownDisabled(state, params) {
        switch (state.name) {
            case "companyresearch_app_appengagementoverview":
            case "apps-engagementoverview":
                return !!params.appId?.startsWith?.("1_");
            default:
                return false;
        }
    }

    private getStateParams(params, state) {
        const availableCountries = utils.getCountries();
        const selectedCountry = _.find<{ id: number }>(availableCountries, {
            id: parseInt(params.country, 10),
        });
        return {
            availableCountries,
            selectedCountry,
            minDate: this.services.swSettings.current.startDate,
            maxDate: this.services.swSettings.current.endDate,
            durationSelectorPresets: this.services.swSettings.current.datePickerPresets,
        };
    }

    @autobind
    private onCountryChange(country) {
        this.services.swNavigator.updateParams({ country: country.id });
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

    private getFilters(): IFilter[] {
        const filters = [];
        if (!this.props.hideDurationSelector) {
            filters.push({
                id: "duration",
                filter: this.getDurationSelectorComponent(false),
            });
        }
        if (!this.props.hideCountrySelector) {
            const selectedCountryIdForDropdown = utils.getSelectedId(this.state.selectedCountry);
            const activeSlide: IUnlockModalConfigTypes["CountryFilters"] = "Countries";
            filters.push({
                id: "country",
                key: "country",
                filter: (
                    <div key="filter-country">
                        <CountryFilter
                            availableCountries={this.state.availableCountries}
                            changeCountry={this.onCountryChange}
                            selectedCountryIds={selectedCountryIdForDropdown}
                            height={60}
                            appendTo="body"
                            disabled={this.state.countryPickerDisabled}
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
                            location="Hook PRO/App Analysis/Country Filter"
                            {...UnlockModalConfig().CountryFilters}
                        />
                    </div>
                ),
            });
        }
        return filters;
    }

    private getDurationSelectorComponent(wrapWithTooltip = false) {
        const component = !this.services.swSettings.user.isShortMonthIntervalsUser ? (
            <DurationSelectorSimple
                key="filter-duration"
                minDate={this.state.minDate}
                maxDate={this.state.maxDate}
                isDisabled={this.state.durationSelectorDisabled}
                presets={preparePresets(this.state.durationSelectorPresets)}
                initialPreset={this.state.selectedDuration}
                initialComparedDuration={false}
                onSubmit={this.onDurationChange}
                componentName={this.state.componentName}
                keys={this.state.keys}
                compareAllowed={false}
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
                appendTo="body"
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
    private onDurationChange(duration, comparedDuration) {
        this.trackFilterValue(`Date range/${duration}`, duration);
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
}
