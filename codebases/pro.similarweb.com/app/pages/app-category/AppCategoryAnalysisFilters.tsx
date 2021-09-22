import autobind from "autobind-decorator";
import { Injector } from "common/ioc/Injector";
import { DurationSelectorPresetOriented } from "components/duration-selectors/DurationSelectedPresetOriented";
import { CountryFilter } from "components/filters-bar/country-filter/CountryFilter";
import * as utils from "components/filters-bar/utils";
import { FiltersBar, IFilter } from "components/React/FiltersBar/FiltersBar";
import { PlainTooltip } from "components/React/Tooltip/PlainTooltip/PlainTooltip";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import _ from "lodash";
import dayjs, { Dayjs } from "dayjs";
import React from "react";
import { preparePresets } from "../../components/dashboard/widget-wizard/components/DashboardWizardDuration";
import { AppStoreFilter } from "../../components/filters-bar/appstore-filter/AppStoreFilter";
import { DropdownFilter } from "../../components/filters-bar/dropdown-filter/DropdownFilter";
import { FiltersBase } from "../../components/filters-bar/FiltersBase";
import { DurationSelectorSimple } from "../website-analysis/DurationSelectorSimple";
import "./AppCategoryAnalysisFilters.scss";

interface IAppCategoryAnalysisFiltersState {
    isSideBarOpen: boolean;
    selectedCountry: any;
    availableCountries: any[];
    minDate: Dayjs;
    maxDate: Dayjs;
    durationSelectorPresets: any;
    selectedDuration: any;
    selectedComparedDuration: any;
    componentName: string;
    durationPaymentHook: any;
    comparedDurationAllowed: boolean;
    invalidDurationTooltipMessage: string;
    selectedCategory: any;
    selectedAppStore: any;
    selectedDevice: any;
    selectedMode: any;
    showDeviceFilter: any;
    availableCategories: any;
}
interface IAppCategoryAnalysisFiltersProps {
    isSideBarOpen: boolean;
    stores: any[];
    categories: any[];
    devices: any[];
    modes: any[];
    storeOptions: any;
    updateFromReactComponent: (filters) => void;
    filters: any;
    filtersSettings: any;
    showDatePicker: boolean;
    unsupportedFilter: boolean;
}

@SWReactRootComponent
export class AppCategoryAnalysisFilters extends FiltersBase<
    IAppCategoryAnalysisFiltersProps,
    IAppCategoryAnalysisFiltersState
> {
    private stateChangeSuccessHandler;
    private i18n;

    static defaultProps = {
        unsupportedFilter: false,
    };

    constructor(props, context) {
        super(props, context);
        this.i18n = Injector.get("i18nFilter");
        const params = this.services.swNavigator.getParams();
        const state = this.services.swNavigator.current();
        const stateParams = this.getStateParams(params, state);
        this.state = {
            invalidDurationTooltipMessage: "",
            componentName: this.services.swSettings.current.componentId,
            isSideBarOpen: false,
            durationPaymentHook: this.services.swSettings.current.durationPaymentHook,
            ...stateParams,
        };
    }

    public componentDidMount() {
        this.stateChangeSuccessHandler = this.services.rootScope.$on(
            "navChangeComplete",
            this.onNavChangeSuccess,
        );
    }

    public componentWillUnmount() {
        this.stateChangeSuccessHandler();
    }

    // this is a perfect example of the upside down
    // dependancy we have with AngularJS
    // this should have gotten these things as props
    // not go get them from the service
    public UNSAFE_componentWillReceiveProps(props) {
        const params = this.services.swNavigator.getParams();
        const state = this.services.swNavigator.current();
        const stateParams = this.getStateParams(params, state);
        this.setState(stateParams);
    }

    render() {
        return (
            <div className="react-filters-container">
                <FiltersBar filters={this.getFilters()} />
            </div>
        );
    }

    @autobind
    private getCategories(state, params) {
        const avaliableCategories = [];
        this.props.categories.forEach((item, index) => {
            avaliableCategories.push({
                ...item,
            });
            if (item.children && item.children.length !== 0) {
                (item.children as any[]).forEach((child) => {
                    avaliableCategories.push({
                        ...child,
                        className: "child",
                    });
                });
            }
        });
        return avaliableCategories;
    }

    private getStateParams(params, state) {
        const availableCountries = utils.getCountries();
        const availableCategories = this.getCategories(state, params);
        const selectedCountry = _.find<{ id: number }>(availableCountries, {
            id: parseInt(params.country, 10),
        });
        const selectedAppStore = _.find(this.props.stores, { id: this.props.filters.store });
        const selectedCategory = _.find(availableCategories, { id: this.props.filters.category });
        const selectedDevice = _.find(this.props.devices, { id: this.props.filters.device });
        const selectedMode = _.find(this.props.modes, { id: this.props.filters.mode });
        const showDeviceFilter = params.store === "Apple";
        const selectedComparedDuration = params.comparedDuration;
        const selectedDuration = params.duration;

        return {
            availableCategories,
            selectedComparedDuration,
            selectedDuration,
            selectedDevice,
            selectedCategory,
            selectedAppStore,
            showDeviceFilter,
            selectedMode,
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
        const selectedAppStoreId = utils.getSelectedId(this.state.selectedAppStore);
        const selectedCategoryId = utils.getSelectedId(this.state.selectedCategory);
        const selectedDeviceId = utils.getSelectedId(this.state.selectedDevice);
        const selectedModeId = utils.getSelectedId(this.state.selectedMode);
        const unsupportedFilter = this.props.unsupportedFilter !== false;
        const filters = [];
        if (!this.props.filtersSettings.disableStore) {
            filters.push({
                id: "appstore",
                filter: (
                    <AppStoreFilter
                        disabled={this.props.filtersSettings.fixedStore || unsupportedFilter}
                        key="filter-appstore"
                        items={this.props.stores}
                        onChange={this.onAppStoreChange}
                        selectedIds={selectedAppStoreId}
                        height={60}
                        onToggle={this.trackFilterDropDownStatus("Header/AppStore Filter")}
                    />
                ),
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
        });
        if (!this.props.filtersSettings.disableCategory) {
            filters.push({
                id: "category",
                filter: (
                    <DropdownFilter
                        disabled={unsupportedFilter}
                        hasSearch={true}
                        key="filter-category"
                        items={this.state.availableCategories}
                        onChange={this.onCategoryChange}
                        selectedIds={selectedCategoryId}
                        height={60}
                        searchPlaceHolder={this.i18n("appcategory.filters.category.placeholder")}
                        onToggle={this.trackFilterDropDownStatus("Header/Category Filter")}
                    />
                ),
            });
        }
        if (!this.props.filtersSettings.hideMode) {
            filters.push({
                id: "modes",
                filter: (
                    <DropdownFilter
                        disabled={unsupportedFilter}
                        key="filter-modes"
                        items={this.props.modes}
                        onChange={this.onModeChange}
                        selectedIds={selectedModeId}
                        height={60}
                        onToggle={this.trackFilterDropDownStatus("Header/Modes Filter")}
                    />
                ),
            });
        }
        if (this.state.showDeviceFilter) {
            filters.push({
                id: "device",
                filter: (
                    <DropdownFilter
                        disabled={unsupportedFilter}
                        key="filter-device"
                        items={this.props.devices}
                        onChange={this.onDeviceChange}
                        selectedIds={selectedDeviceId}
                        height={60}
                        onToggle={this.trackFilterDropDownStatus("Header/Device Filter")}
                    />
                ),
            });
        }
        if (this.props.showDatePicker && this.state.selectedDuration) {
            filters.push({
                id: "duration",
                filter: this.getDurationSelectorComponent(false),
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
                isDisabled={this.props.unsupportedFilter != false}
                presets={preparePresets(this.state.durationSelectorPresets)}
                initialPreset={this.state.selectedDuration}
                initialComparedDuration={this.state.selectedComparedDuration}
                onSubmit={this.onChangeDuration}
                componentName={this.state.componentName}
                keys={[]}
                compareAllowed={this.state.comparedDurationAllowed}
                hasPermissionsLock={this.state.durationPaymentHook}
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
        return this.services.swNavigator.isAppCategory(toState);
    }

    @autobind
    private onNavChangeSuccess(evt, toState, toParams) {
        if (!this.isCorrectState(toState)) {
            return;
        }
        const stateParams = this.getStateParams(toParams, toState);
        this.setState({ ...stateParams });
    }

    @autobind
    private onAppStoreChange(store) {
        this.setState({ selectedAppStore: store });
        this.props.updateFromReactComponent({ store: store.id });
    }

    @autobind
    private onCategoryChange(category) {
        this.setState({ selectedCategory: category });
        this.props.updateFromReactComponent({ category: category.id });
    }

    @autobind
    private onModeChange(mode) {
        this.setState({ selectedMode: mode });
        this.props.updateFromReactComponent({ mode: mode.id });
    }

    @autobind
    private onDeviceChange(device) {
        this.setState({ selectedDevice: device });
        this.props.updateFromReactComponent({ device: device.id });
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
    private onChangeDuration(duration, comparedDuration) {
        this.services.swNavigator.updateQueryParams({
            duration,
            comparedDuration,
        });
    }

    @autobind
    private onCountryChange(country) {
        this.setState({ selectedCountry: country });
        this.services.swNavigator.updateParams({
            country: country.id,
        });
        this.trackFilterValue(`Header/Country Filter/${country.text}`);
    }
}
