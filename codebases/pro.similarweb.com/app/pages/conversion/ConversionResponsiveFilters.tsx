import {
    IFilter,
    SidebarListCompactElementItem,
} from "@similarweb/ui-components/dist/responsive-filters-bar";
import autobind from "autobind-decorator";
import { DurationSelectorPresetOriented } from "components/duration-selectors/DurationSelectedPresetOriented";
import { CountryFilter } from "components/filters-bar/country-filter/CountryFilter";
import { CountryFilterCompact } from "components/filters-bar/country-filter/CountryFilterCompact";
import * as utils from "components/filters-bar/utils";
import { FiltersBar } from "components/React/FiltersBar/FiltersBar";
import { PlainTooltip } from "components/React/Tooltip/PlainTooltip/PlainTooltip";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import _ from "lodash";
import { Dayjs } from "dayjs";
import React from "react";
import { preparePresets } from "../../components/dashboard/widget-wizard/components/DashboardWizardDuration";
import { FiltersBase } from "../../components/filters-bar/FiltersBase";
import { i18nFilter } from "../../filters/ngFilters";
import { ISegmentsData } from "../../services/conversion/ConversionSegmentsService";
import { DurationSelectorCompact } from "../website-analysis/DurationSelectorCompact";
import { DurationSelectorSidebarButton } from "../website-analysis/DurationSelectorSidebarButton";
import { DurationSelectorSimple } from "../website-analysis/DurationSelectorSimple";
import { conversionConfig } from "./config/conversionConfig";
import { ConversionSegmentsUtils } from "./ConversionSegmentsUtils";

interface IConversionFiltersState {
    isSideBarOpen: boolean;
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
}
interface IConversionFiltersProps {
    isSideBarOpen?: boolean;
    updateFromReactComponent?: (filters) => void;
    filters?: any;
    unsupportedFilter?: boolean;
    segmentsData: ISegmentsData;
    params: any;
    currentPage: string;
}

@SWReactRootComponent
export class ConversionResponsiveFilters extends FiltersBase<
    IConversionFiltersProps,
    IConversionFiltersState
> {
    public static defaultProps = {
        unsupportedFilter: false,
    };

    constructor(props, context) {
        super(props, context);
        const params = this.services.swNavigator.getParams();
        const state = this.services.swNavigator.current();
        const stateParams = this.getStateParams(params, state, props.segmentsData);
        this.state = {
            invalidDurationTooltipMessage: "",
            componentName: this.services.swSettings.current.componentId,
            isSideBarOpen: false,
            durationPaymentHook: this.services.swSettings.current.durationPaymentHook,
            ...stateParams,
        };
    }

    public shouldComponentUpdate(nextProps, nextState) {
        if (this.state !== nextState) {
            return true;
        }
        const params = nextProps.params;
        const state = this.services.swNavigator.getState(conversionConfig[nextProps.currentPage]);
        const paramsAreEqual = _.isEqual(this.props.params, nextProps.params);
        const statesAreEqual = nextProps.currentPage === this.props.currentPage;
        if (!paramsAreEqual || !statesAreEqual) {
            const stateParams = this.getStateParams(params, state, this.props.segmentsData);
            this.setState(stateParams);
            return true;
        }
        return false;
    }

    public render() {
        return (
            <div className="react-filters-container conversionFilters">
                <FiltersBar filters={this.getFilters()} />
            </div>
        );
    }

    private getStateParams(params, state, segmentsData) {
        const { sid, gid } = params;
        const availableCountries = sid
            ? ConversionSegmentsUtils.getSegmentCountries(segmentsData, sid)
            : ConversionSegmentsUtils.getSegmentGroupCountries(segmentsData, gid);
        let selectedCountry = availableCountries.find(({ id }) => {
            return +id === +params.country;
        });
        if (!selectedCountry) {
            const { swNavigator } = this.services;
            swNavigator.go(swNavigator.current().name, { country: availableCountries[0].id });
            selectedCountry = availableCountries[0];
        }
        const selectedDuration = params.duration;
        const selectedComparedDuration = params.comparedDuration;

        return {
            selectedDuration,
            selectedComparedDuration,
            availableCountries,
            selectedCountry,
            minDate: this.services.swSettings.current.startDate,
            maxDate: this.services.swSettings.current.endDate,
            durationSelectorPresets: this.services.swSettings.current.datePickerPresets,
            comparedDurationAllowed: state.periodOverPeriodEnabled === true,
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
                compactFilter: {
                    listItem: (
                        <DurationSelectorSidebarButton
                            disabled={unsupportedFilter}
                            key="filter-duration"
                            presets={preparePresets(this.state.durationSelectorPresets)}
                            initialPreset={this.state.selectedDuration}
                            compareSelected={false}
                        />
                    ),
                    compactElement: (
                        <DurationSelectorCompact
                            key="filter-duration-compact"
                            minDate={this.state.minDate}
                            presets={preparePresets(this.state.durationSelectorPresets)}
                            initialPreset={this.state.selectedDuration}
                            maxDate={this.state.maxDate}
                            compareAllowed={false}
                            compareLabel={i18nFilter()("websiteanalysis.duration.compare.label")}
                            compareDisabledTooltipText={i18nFilter()(
                                "websiteanalysis.duration.compare.disabled.tooltip",
                            )}
                            componentName={this.state.componentName}
                            keys={""}
                            onSubmit={this.onDurationChangeFromSideBar}
                        />
                    ),
                },
            });
        }
        filters.push({
            id: "country",
            filter: (
                <CountryFilter
                    disabled={unsupportedFilter}
                    key="filter-country"
                    availableCountries={this.state.availableCountries}
                    changeCountry={this.onCountryChange}
                    selectedCountryIds={selectedCountryId}
                    height={60}
                    appendTo="body"
                    onToggle={this.trackFilterDropDownStatus("Header/Country Filter")}
                />
            ),
            compactFilter: {
                listItem: (
                    <SidebarListCompactElementItem
                        disabled={unsupportedFilter}
                        key="filter-country"
                        iconClass={`country-icon country-icon-${this.state.selectedCountry.id}`}
                        title={this.state.selectedCountry.text}
                    />
                ),
                compactElement: (
                    <CountryFilterCompact
                        countries={this.state.availableCountries}
                        onChange={this.onSidebarListCompactElementItemChangeProp}
                        selectedCountry={selectedCountryId}
                        onChangeCallBack={this.onCountryChange}
                    />
                ),
            },
        });
        return filters;
    }

    private getDurationSelectorComponent(wrapWithTooltip = false) {
        const component = !this.services.swSettings.user.isShortMonthIntervalsUser ? (
            <DurationSelectorSimple
                key="filter-duration"
                minDate={this.state.minDate}
                maxDate={this.state.maxDate}
                isDisabled={this.props.unsupportedFilter !== false}
                presets={preparePresets(this.state.durationSelectorPresets)}
                initialPreset={this.state.selectedDuration}
                initialComparedDuration={this.state.selectedComparedDuration}
                compareLabel={i18nFilter()("websiteanalysis.duration.compare.label")}
                compareDisabledTooltipText={i18nFilter()(
                    "websiteanalysis.duration.compare.disabled.tooltip",
                )}
                onSubmit={this.onChangeDuration}
                componentName={this.state.componentName}
                compareAllowed={this.state.comparedDurationAllowed}
                keys={[]}
                hasPermissionsLock={this.state.durationPaymentHook}
                appendTo="body"
            />
        ) : (
            <DurationSelectorPresetOriented
                minDate={this.state.minDate}
                maxDate={this.state.maxDate}
                isDisabled={this.props.unsupportedFilter != false}
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
    private isCorrectState(toState) {
        return this.services.swNavigator.isIndustryConversion(toState);
    }

    @autobind
    private async onDurationChangeFromSideBar(x, y) {
        await this.setStateAsync({
            isSideBarOpen: false,
        });
        this.onChangeDuration(x, y);
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
        const { swNavigator } = this.services;
        swNavigator.updateParams({
            duration,
            comparedDuration: comparedDuration ? comparedDuration : "",
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
    }
}
