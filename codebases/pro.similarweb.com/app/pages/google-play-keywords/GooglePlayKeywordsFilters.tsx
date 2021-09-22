import autobind from "autobind-decorator";
import * as utils from "components/filters-bar/utils";
import { FiltersBar, IFilter } from "components/React/FiltersBar/FiltersBar";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import * as _ from "lodash";
import * as React from "react";
import { connect } from "react-redux";
import { CountryFilter } from "../../components/filters-bar/country-filter/CountryFilter";
import { DropdownFilter } from "../../components/filters-bar/dropdown-filter/DropdownFilter";
import { FiltersBase } from "../../components/filters-bar/FiltersBase";

import "./GooglePlayKeywordsFilters.scss";

export interface IAppStateParams {
    /* Countries */
    availableCountries: any[];
    selectedCountry: any;
    /* AppCategorys */
    availableCategories: any[];
    selectedCategory: any;
}

interface IGooglePlayKeywordsFiltersState extends IAppStateParams {
    isSideBarOpen: boolean;
    componentName: string;
    keys: string;
    countryPickerDisabled: boolean;
    showCountryTooltip: boolean;
    countryTooltipMessage: string;
}

export class GooglePlayKeywordsFilters extends FiltersBase<any, IGooglePlayKeywordsFiltersState> {
    private stateChangeSuccessHandler;
    private stateChangeStartHandler;
    private navUpdateHandler;
    constructor(props, context) {
        super(props, context);

        const params = this.services.swNavigator.getParams();
        const state = this.services.swNavigator.current();

        const stateParams = this.getStateParams(params, state);
        const countryPickerDisabled = this.isCountryDropDownDisabled(state);

        this.state = {
            isSideBarOpen: false,

            componentName: this.services.swSettings.current.componentId,
            keys: params.category,
            ...stateParams,
            countryPickerDisabled,

            showCountryTooltip: this.checkCountryTooltip(),
            countryTooltipMessage: i18nFilter()("notpermittedcountry.tooltip"),
        };
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

    public componentDidUpdate(prevProps, prevState) {}

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
        const selectedCategoryId = utils.getSelectedId(this.state.selectedCategory);
        const filters = [
            {
                id: "country",
                key: "country",
                filter: (
                    <CountryFilter
                        key="filter-country"
                        availableCountries={this.state.availableCountries}
                        changeCountry={this.onCountryChange}
                        selectedCountryIds={selectedCountryId}
                        height={60}
                        appendTo="body"
                        disabled={this.state.countryPickerDisabled}
                    />
                ),
            },
            {
                id: "category",
                filter: (
                    <DropdownFilter
                        hasSearch={true}
                        key="filter-category"
                        items={this.state.availableCategories}
                        onChange={this.onCategoryChange}
                        selectedIds={selectedCategoryId}
                        height={60}
                        onToggle={this.trackFilterDropDownStatus("Header/Category Filter")}
                    />
                ),
            },
        ];
        return filters;
    }

    @autobind
    private async onCountryChange(country) {
        this.services.swNavigator.updateParams({
            country: country.id,
        });
    }

    @autobind
    private onCategoryChange(category) {
        this.services.swNavigator.updateParams({
            category: category.id,
        });
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

    @autobind
    private isCorrectState(toState) {
        return this.services.swNavigator.isGooglePlayKeywordAnalysis(toState);
    }

    @autobind
    private onStateChangeSuccess(evt, toState, toParams) {
        if (!this.isCorrectState(toState)) {
            return;
        }
        const stateParams = this.getStateParams(toParams, toState);
        const countryPickerDisabled = this.isCountryDropDownDisabled(toState);

        this.setState({
            ...this.state,
            ...stateParams,
            keys: toParams.category,
            countryPickerDisabled,
            showCountryTooltip: this.checkCountryTooltip(),
        });
    }

    private isCountryDropDownDisabled(state) {
        return state.countryPickerDisabled;
    }

    private getStateParams(params, state): IAppStateParams {
        const availableCountries = utils.getCountries();
        const availableCategories = this.getCategories(state, params);

        const selectedCountry = _.find<{ id: number }>(availableCountries, {
            id: parseInt(params.country, 10),
        });
        const selectedCategory = _.find<{ id: number }>(availableCategories, {
            id: params.category,
        });

        return {
            availableCountries,
            availableCategories,
            selectedCountry,
            selectedCategory,
        };
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

    private checkCountryTooltip() {
        if (this.services.rootScope.showCountryTooltip) {
            this.services.rootScope.showCountryTooltip = false;
            return true;
        } else {
            return false;
        }
    }
}

function mapDispatchToProps(dispatch) {
    return {};
}

function mapStateToProps() {
    return {};
}

const component = connect(mapStateToProps, mapDispatchToProps)(GooglePlayKeywordsFilters);

SWReactRootComponent(component, "GooglePlayKeywordsFilters");

export default component;
