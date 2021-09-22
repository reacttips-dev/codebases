import { Button } from "@similarweb/ui-components/dist/button";
import { Checkbox } from "@similarweb/ui-components/dist/checkbox";
import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import I18n from "components/React/Filters/I18n";

import { InjectableComponentClass } from "components/React/InjectableComponent/InjectableComponent";
import { IDeliveryDateItem, IFilter, IPeriod } from "pages/insights/deep-insights/types";
import * as React from "react";
import { i18nFilter } from "../../../filters/ngFilters";
import { DeliveryDateDropDown } from "./components/DeliveryDateDropDown";
import { PeriodSelector } from "./components/PeriodSelector";
import { TypesMultiSelect } from "./components/TypesMultiSelect";
import { SwTrack } from "services/SwTrack";

class FilterLocalizationTexts {
    searchPlaceholder: string;
    reportTypeDropDownLabel: string;
}

export class SWFilters extends InjectableComponentClass<any, any> {
    private durationOptions: any;
    private deliveryDropDown: DeliveryDateDropDown;
    private deliveryDate: IDeliveryDateItem;
    private periodSelector: PeriodSelector;
    private typesMultiSelect: TypesMultiSelect;
    private localizationTexts: FilterLocalizationTexts;

    constructor(props: any) {
        super();

        this.state = {
            skipExamples: false,
            searchText: "",
            clearSearchText: false,
            develiveryDate: {
                clear: false,
                filterFunction: null,
            },
        };

        this.localizationTexts = new FilterLocalizationTexts();
        this.localizationTexts.searchPlaceholder = this.i18n("forms.search.placeholder");
    }

    componentDidMount(): void {
        const { skipExamples = false, searchText = "" } = this.props.filterOptions;
        if (searchText !== "") {
            this.search(searchText);
        }
        this.setState({ skipExamples });
    }

    onSelectDeliveryDate = (fn) => {
        this.setState((prevState) => {
            return {
                ...prevState,
                develiveryDate: { clear: false, filterFunction: fn },
            };
        });
    };

    setDurationRange = (minDate, maxDate, isCustom?) => {
        this.periodSelector.setDurationRange(minDate, maxDate, isCustom);
    };

    applyDeliveryDropDown = (item: IDeliveryDateItem) => {
        this.deliveryDate = item || null;
        this.apply();
    };

    apply = () => {
        const duration: IPeriod = this.periodSelector.getCurrentDuration();
        const reportTypes: string[] = this.typesMultiSelect
            ? this.typesMultiSelect.getCurrentReportTypes()
            : [];

        const criteria: Partial<IFilter> = {
            selectedTypeId: reportTypes,
            period: duration,
            deliveryDate: this.deliveryDate,
            searchText: this.state.searchText,
            skipExamples: this.state.skipExamples,
        };

        this.props.onApplyFilters(criteria);
    };

    clearAll = () => {
        SwTrack.all.trackEvent("Button", "click", "reports table/Clear all");

        const _defaultPeriod: any = this.periodSelector.getDefaultDuration();
        const criteria: Partial<IFilter> = {
            selectedTypeId: null,
            period: _defaultPeriod,
            deliveryDate: { shiftValue: null, shiftType: "" },
            skipExamples: false,
        };

        this.props.onClearAll(criteria);
        this.typesMultiSelect.unselectAllTypes();
        this.deliveryDropDown.unselect();
        this.periodSelector.clearAll();

        this.setState((prevState) => {
            return {
                ...prevState,
                searchText: "",
                skipExamples: false,
                clearSearchText: true,
            };
        });
    };

    search = (searchText) => {
        SwTrack.all.trackEvent("Search Bar", "click", `reports table /${searchText}`);

        this.setState((prevState) => {
            return {
                ...prevState,
                searchText: searchText,
                clearSearchText: false,
            };
        }, this.apply);
    };

    skipExamples = (e) => {
        this.setState((prevState) => {
            return {
                ...prevState,
                skipExamples: !prevState.skipExamples,
            };
        }, this.apply);
    };

    render(): JSX.Element {
        return (
            <div className="filters-toolbar-container">
                <div className="filters-toolbar">
                    <div className="filter-by-text">
                        <SearchInput
                            placeholder={this.localizationTexts.searchPlaceholder}
                            debounce={500}
                            onChange={this.search}
                            defaultValue={this.props.filterOptions.searchText}
                            clearValue={this.state.clearSearchText}
                        />
                    </div>

                    <div className="filter-by-type">
                        <TypesMultiSelect
                            ref={(instance) => (this.typesMultiSelect = instance)}
                            applyFilters={this.apply}
                            reportsTypes={this.props.reportsTypes}
                            selectedTypeId={this.props.filterOptions.selectedTypeId}
                        />
                    </div>

                    <div className="filter-by-period">
                        <PeriodSelector
                            ref={(instance) => {
                                this.periodSelector = instance;
                            }}
                            filterOptions={this.props.filterOptions}
                            applyFilters={this.apply}
                        />
                    </div>

                    <div className="filter-by-delivery-date">
                        <DeliveryDateDropDown
                            initialType={this.props.filterOptions.deliveryType}
                            ref={(instance) => {
                                this.deliveryDropDown = instance;
                            }}
                            applyFilters={this.applyDeliveryDropDown}
                        />
                    </div>

                    <div className="filter-buttons">
                        <Button type="flat" onClick={this.clearAll}>
                            {i18nFilter()("forms.buttons.clearall")}
                        </Button>
                    </div>
                </div>
                <div className="fitler-skip-examples">
                    <Checkbox
                        label={<I18n>forms.buttons.skipExamples</I18n>}
                        onClick={this.skipExamples}
                        selected={this.state.skipExamples}
                        isDisabled={false}
                    />
                </div>
            </div>
        );
    }
}
