import swLog from "@similarweb/sw-log/index";
import autobind from "autobind-decorator";
import { DurationSelectorPresetOriented } from "components/duration-selectors/DurationSelectedPresetOriented";
import { CountryFilter } from "components/filters-bar/country-filter/CountryFilter";
import * as utils from "components/filters-bar/utils";
import UnlockModalConfig, {
    IUnlockModalConfigTypes,
} from "components/Modals/src/UnlockModal/unlockModalConfig";
import { FiltersBar, IFilter } from "components/React/FiltersBar/FiltersBar";
import { PlainTooltip } from "components/React/Tooltip/PlainTooltip/PlainTooltip";
import UnlockModal from "components/React/UnlockModalProvider/UnlockModalProvider";
import _ from "lodash";
import { Dayjs } from "dayjs";
import React from "react";
import { connect } from "react-redux";
import { openUnlockModalV2 } from "services/ModalService";
import { SegmentsUtils } from "services/segments/SegmentsUtils";
import { preparePresets } from "../../components/dashboard/widget-wizard/components/DashboardWizardDuration";
import { FiltersBase } from "../../components/filters-bar/FiltersBase";
import { i18nFilter } from "../../filters/ngFilters";
import CountryService from "../../services/CountryService";
import { DurationSelectorSimple } from "../website-analysis/DurationSelectorSimple";
import { FiltersEnum } from "components/filters-bar/utils";
import { PreferencesService } from "services/preferences/preferencesService";

interface ISegmentsFiltersState {
    selectedCountry: any;
    availableCountries: any[];
    minDate: Dayjs;
    maxDate: Dayjs;
    durationSelectorPresets: any;
    selectedDuration: any;
    selectedComparedDuration: any;
    comparedDurationAllowed: boolean;
    componentName: string;
    durationPaymentHook: any;
    invalidDurationTooltipMessage: string;
    isSideBarOpen: boolean;
    isCountryHookOpen: boolean;
    isDurationDisabled: boolean;
}
interface ISegmentsFiltersProps {
    updateFromReactComponent?: (filters) => void;
    filters?: any;
    unsupportedFilter?: boolean;
    params: any;
    currentPage: string;
    setIsDatepickerReady: Function;
}

class SegmentsResponsiveFilters extends FiltersBase<ISegmentsFiltersProps, ISegmentsFiltersState> {
    public static defaultProps = {
        unsupportedFilter: false,
    };

    constructor(props, context) {
        super(props, context);
        const params = this.services.swNavigator.getParams();
        const state = this.services.swNavigator.current();
        const stateParams = this.getStateParams(params, state);
        this.state = {
            invalidDurationTooltipMessage: "",
            componentName: this.services.swSettings.current.componentId,
            isSideBarOpen: false,
            durationPaymentHook: this.services.swSettings.current.durationPaymentHook,
            isCountryHookOpen: false,
            ...stateParams,
        };
    }

    public updateUserPreferences = async ({ country, duration, comparedDuration }) => {
        const { params } = this.props;
        try {
            await PreferencesService.add({
                [SegmentsUtils.getSegmentsAnalysisPrefKey(params?.id)]: {
                    duration,
                    comparedDuration,
                    country,
                },
            });
        } catch (e) {
            swLog.error("failed to update segment user preferences", e);
        }
    };

    public shouldComponentUpdate(nextProps, nextState) {
        if (this.state !== nextState || this.props.currentPage !== nextProps.currentPage) {
            return true;
        }
        const params = nextProps.params;
        const paramsAreEqual = _.isEqual(this.props.params, nextProps.params);
        if (!paramsAreEqual) {
            const state = this.services.swNavigator.current();
            const stateParams = this.getStateParams(params, state);
            this.setState(stateParams);
            return true;
        }
        return false;
    }

    public render() {
        return (
            <div className="react-filters-container">
                <FiltersBar filters={this.getFilters()} />
            </div>
        );
    }

    private getStateParams(params, state) {
        const availableCountries = utils.getCountries();
        const selectedCountry = CountryService.getCountryById(params.country);
        const { mode, id, duration, comparedDuration } = params;

        // initialize state params
        let selectedDuration = duration;
        let selectedComparedDuration = comparedDuration;
        let isDurationDisabled = false;
        let minDate = this.services.swSettings.current.startDate;
        let maxDate = this.services.swSettings.current.endDate;

        // if page requires duration filter change
        if (state?.overrideDurationFilterParams) {
            selectedDuration = state.overrideDurationFilterParams.validDuration;
            selectedComparedDuration = state.overrideDurationFilterParams.validComparedDuration;
            isDurationDisabled = state.overrideDurationFilterParams.isDurationDisabled;
            minDate = state.overrideDurationFilterParams.minDate;
            maxDate = state.overrideDurationFilterParams.maxDate;
        }

        return {
            isDurationDisabled,
            selectedDuration,
            selectedComparedDuration,
            availableCountries,
            selectedCountry,
            minDate,
            maxDate,
            durationSelectorPresets: this.services.swSettings.current.datePickerPresets,
            comparedDurationAllowed:
                state?.periodOverPeriodEnabled === true && params.mode === "single",
        };
    }

    private getFilters(): IFilter[] {
        const selectedCountryId = utils.getSelectedId(this.state.selectedCountry);
        const unsupportedFilter = this.props.unsupportedFilter !== false;
        const filters = [];
        if (this.state.selectedDuration) {
            filters.push({
                id: "duration",
                filter: this.getDurationSelectorComponent(false),
            });
        }
        if (
            this.state.selectedCountry &&
            this.isCountryFilterAvailable(this.services.swNavigator.current())
        ) {
            filters.push({
                id: "country",
                filter: (
                    <div key="filter-country">
                        <CountryFilter
                            disabled={unsupportedFilter}
                            key="filter-country"
                            availableCountries={this.state.availableCountries}
                            changeCountry={this.onCountryChange}
                            selectedCountryIds={selectedCountryId || []}
                            dropdownPopupPlacement="bottom-right"
                            appendTo="body"
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
            });
        }
        return filters;
    }
    private isCountryFilterAvailable(state) {
        return state.data?.filtersConfig?.country !== FiltersEnum.HIDDEN;
    }

    private getDurationSelectorComponent(wrapWithTooltip = false) {
        const component = !this.services.swSettings.user.isShortMonthIntervalsUser ? (
            <DurationSelectorSimple
                key="filter-duration"
                minDate={this.state.minDate}
                maxDate={this.state.maxDate}
                isDisabled={this.props.unsupportedFilter !== false || this.state.isDurationDisabled}
                presets={preparePresets(this.state.durationSelectorPresets)}
                initialPreset={this.state.selectedDuration}
                initialComparedDuration={this.state.selectedComparedDuration}
                compareLabel={i18nFilter()("websiteanalysis.duration.compare.label")}
                compareDisabledTooltipText={i18nFilter()(
                    "websiteanalysis.duration.compare.disabled.tooltip",
                )}
                placement="bottom-right"
                appendTo="body"
                onSubmit={this.onChangeDuration}
                componentName={this.state.componentName}
                compareAllowed={this.state.comparedDurationAllowed}
                keys={[]}
                hasPermissionsLock={this.state.durationPaymentHook}
            />
        ) : (
            <DurationSelectorPresetOriented
                minDate={this.state.minDate}
                maxDate={this.state.maxDate}
                isDisabled={this.props.unsupportedFilter !== false || this.state.isDurationDisabled}
                onSubmit={this.onChangeDuration}
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
    private onChangeDuration(duration, comparedDuration) {
        if (!this.services.swSettings.allowedDuration(duration, this.props.currentPage)) {
            return;
        }
        this.services.swNavigator.updateParams({
            duration,
            comparedDuration: comparedDuration ? comparedDuration : "",
        });
        this.updateUserPreferences({
            duration,
            comparedDuration: comparedDuration ? comparedDuration : undefined,
            country: String(this.state.selectedCountry.id),
        });
    }

    @autobind
    private onCountryChange(country) {
        if (!country) {
            return;
        }
        this.setState({ selectedCountry: country });
        this.services.swNavigator.updateParams({
            country: country.id,
        });
        this.updateUserPreferences({
            duration: this.state.selectedDuration,
            comparedDuration: this.state.selectedComparedDuration,
            country: String(country.id),
        });
    }
}

function mapStateToProps(store) {
    const {
        routing: { currentPage, params },
    } = store;
    return {
        currentPage,
        params,
    };
}
export default connect(mapStateToProps, null)(SegmentsResponsiveFilters);
