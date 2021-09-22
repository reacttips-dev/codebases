import * as React from "react";
import { InjectableComponent } from "components/React/InjectableComponent/InjectableComponent";
import I18n from "components/React/Filters/I18n";
import { Widget } from "components/widget/widget-types/Widget";
import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import { StatefulDropdown } from "components/dashboard/widget-wizard/components/StatefulDropdown";
import * as _ from "lodash";

export class TopSitesTableWidgetFilters extends InjectableComponent {
    protected i18n;
    protected selectedFilters: any = {};

    constructor(props) {
        super(props);
        this.i18n = this.injector.get("i18nFilter");
        this.selectedFilters = {
            filter: this.props.widgetFilters.filter,
            orderBy: this.props.widgetFilters.orderBy || "Share desc",
            organicPaid: this.getInitialOrganicSearchValue(props.widgetFilters.filter) || "",
        };
        this.props.changeFilter(this.getSelectedFilters());
    }

    private getSearchValue() {
        const filterObject: any = Widget.filterParse(this.selectedFilters.filter);
        const filterObjectItem: any = _.find(filterObject, { operator: "contains" });
        return filterObjectItem && filterObjectItem.hasOwnProperty("value")
            ? filterObjectItem.value.replace(/"/g, "")
            : "";
    }

    private getInitialOrganicSearchValue(filter) {
        const filterObject: any = Widget.filterParse(filter);
        const filterObjectItem: any = filterObject["OP"];
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
                let _organicSearchFilter = this.selectedFilters.organicPaid
                    ? `OP;==;${this.selectedFilters.organicPaid},`
                    : "";
                let _textFilter = this.getSearchValue()
                    ? `Domain;contains;"${this.getSearchValue()}",`
                    : "";
                _value = `${_textFilter}${_organicSearchFilter}`;
                _value = _.trim(_value, ",");
                this.setState({ filter: _value });
            }
            filters.push({ name: filter, value: _value });
        }
        return filters;
    }

    private onSearch = (value: string) => {
        let filterValue = Widget.filterStringify({
            Domain: { operator: "contains", value: `"${value}"` },
        });
        this.selectedFilters.filter = filterValue;
        this.props.changeFilter(this.getSelectedFilters());
    };

    private onSelectOrderBy = (item) => {
        this.selectedFilters.orderBy = item.id;
        this.props.changeFilter(this.getSelectedFilters());
    };

    private onSelectOrganicPaid = (item) => {
        this.selectedFilters.organicPaid = item.id;
        this.props.changeFilter(this.getSelectedFilters());
    };

    private getOrderByItems = () => {
        const items = [
            { id: "Share desc", text: "Traffic Share" },
            { id: "Change desc", text: "Change" },
            { id: "Rank asc", text: "Rank" },
            { id: "AvgMonthVisits desc", text: "Monthly Visits" },
            { id: "AvgVisitDuration desc", text: "Visit Duration" },
            { id: "PagesPerVisit desc", text: "Pages/Visit" },
            { id: "BounceRate asc", text: "Bounce Rate" },
        ];

        if (["TopSites", "TopSitesExtended"].indexOf(this.props.widgetMetric) > -1) {
            items.push({ id: "UniqueUsers desc", text: "Unique Visits" });
        }

        return items;
    };

    render() {
        return (
            <div key="dynamicFiltersContainer" className="filters">
                <div key="searchterm" className="dynamicFilter">
                    <h5>
                        <I18n>{`home.dashboards.wizard.filters.searchterm`}</I18n>
                    </h5>
                    <SearchInput
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
                        items={this.getOrderByItems()}
                        selectedId={this.selectedFilters.orderBy}
                        onSelect={this.onSelectOrderBy}
                    />
                </div>
                {this.props.widgetMetric === "CategoryLeadersSearch" && (
                    <div key="orderby" className="dynamicFilter">
                        <h5>
                            <I18n>{`home.dashboards.wizard.filters.organicPaid`}</I18n>
                        </h5>
                        <StatefulDropdown
                            key="organicPaidSelector"
                            items={[
                                { id: "", text: "Organic & Paid" },
                                { id: "0", text: "Organic" },
                                { id: "1", text: "Paid" },
                            ]}
                            selectedId={this.selectedFilters.organicPaid}
                            onSelect={this.onSelectOrganicPaid}
                        />
                    </div>
                )}
            </div>
        );
    }
}
