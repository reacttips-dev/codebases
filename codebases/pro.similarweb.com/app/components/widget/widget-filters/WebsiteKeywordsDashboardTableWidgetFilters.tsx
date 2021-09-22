import * as React from "react";
import { InjectableComponent } from "components/React/InjectableComponent/InjectableComponent";
import I18n from "components/React/Filters/I18n";
import { Widget } from "components/widget/widget-types/Widget";
import { radioItems } from "components/React/PopularPagesFilters/popularPagesFilters.config";
import { StatefulDropdown } from "components/dashboard/widget-wizard/components/StatefulDropdown";
import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import * as _ from "lodash";

export class WebsiteKeywordsDashboardTableWidgetFilters extends InjectableComponent {
    protected i18n;
    protected selectedFilters: any = {};
    protected defaultMetricFilters: any = {};

    constructor(props) {
        super(props);
        this.i18n = this.injector.get("i18nFilter");
        this.defaultMetricFilters = {
            TopKeywordsOrganic: "OP;==;0",
            TopKeywordsPaid: "OP;==;1",
        };
        this.state = {
            filter: this.props.widgetFilters.filter,
            clearValue: false,
        };
        this.selectedFilters = {
            filter: this.props.widgetFilters.filter,
            orderBy: this.props.widgetFilters.orderBy || "TotalShare desc",
        };
        this.selectedFilters[this.getSelectedFilter()] = true;
        this.props.changeFilter(this.getSelectedFilters());
    }

    public UNSAFE_componentWillReceiveProps(newProps) {
        if (newProps.widgetMetric !== this.props.widgetMetric) {
            this.setState({ clearValue: true });
            setTimeout(() => {
                this.setState({ clearValue: false });
            });
        }
    }

    private getSearchValue() {
        const filterObject: any = Widget.filterParse(this.selectedFilters.filter);
        const filterObjectItem: any = _.find(filterObject, { operator: "contains" });
        return filterObjectItem && filterObjectItem.hasOwnProperty("value")
            ? filterObjectItem.value.replace(/"/g, "")
            : "";
    }

    private getSelectedFilters() {
        //TODO: refactor this to use Widget.filterStringify
        let filters = [];
        for (let filter in this.selectedFilters) {
            let _value = this.selectedFilters[filter];
            if (filter === "filter") {
                let _metricFilter = this.defaultMetricFilters[this.props.widgetMetric]
                    ? `${this.defaultMetricFilters[this.props.widgetMetric]},`
                    : "";
                let _textFilter = this.getSearchValue()
                    ? `SearchTerm;contains;"${this.getSearchValue()}",`
                    : "";
                _value = `${_textFilter}${_metricFilter}`;
                _value = _.trim(_value, ",");
                this.setState({ filter: _value });
            }
            filters.push({ name: filter, value: _value });
        }
        return filters;
    }

    private onSearch = (value: string) => {
        let filterValue = Widget.filterStringify({
            SearchTerm: { operator: "contains", value: `"${value}"` },
        });
        this.selectedFilters.filter = filterValue;
        this.props.changeFilter(this.getSelectedFilters());
    };

    private getSelectedFilter() {
        let selectedFilter = radioItems[0].value;
        radioItems.forEach((radioItem) => {
            if (this.props.widgetFilters[radioItem.value] === true) {
                selectedFilter = radioItem.value;
                return;
            }
        });
        return selectedFilter;
    }

    private onSelectOrderBy = (item) => {
        this.selectedFilters.orderBy = item.id;
        this.props.changeFilter(this.getSelectedFilters());
    };

    render() {
        return (
            <div key="dynamicFiltersContainer" className="filters">
                <div key="searchterm" className="dynamicFilter">
                    <h5>
                        <I18n>{`home.dashboards.wizard.filters.searchterm`}</I18n>
                    </h5>
                    <SearchInput
                        clearValue={this.state.clearValue}
                        defaultValue={this.getSearchValue()}
                        onChange={this.onSearch}
                        debounce={400}
                    />
                </div>
                <div key="orderby" className="dynamicFilter">
                    <h5>
                        <I18n>{`home.dashboards.wizard.filters.orderBy`}</I18n>
                    </h5>
                    <StatefulDropdown
                        key="orderbyFilter"
                        items={[
                            { id: "TotalShare desc", text: "Traffic Share" },
                            { id: "Change desc", text: "Change" },
                        ]}
                        selectedId={this.selectedFilters.orderBy}
                        onSelect={this.onSelectOrderBy}
                    />
                </div>
            </div>
        );
    }
}
