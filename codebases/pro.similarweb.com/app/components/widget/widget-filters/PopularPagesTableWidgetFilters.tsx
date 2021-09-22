import * as React from "react";
import { InjectableComponent } from "components/React/InjectableComponent/InjectableComponent";
import I18n from "components/React/Filters/I18n";
import { Widget } from "components/widget/widget-types/Widget";
import { radioItems } from "components/React/PopularPagesFilters/popularPagesFilters.config";
import { StatefulDropdown } from "components/dashboard/widget-wizard/components/StatefulDropdown";
import { SearchInput } from "@similarweb/ui-components/dist/search-input";

export class PopularPagesTableWidgetFilters extends InjectableComponent {
    protected i18n;
    protected selectedFilters: any = {};
    constructor(props) {
        super(props);
        this.i18n = this.injector.get("i18nFilter");
        this.state = {
            isUtm: this.props.widgetFilters.isUtm
                ? this.props.widgetFilters.isUtm.toString()
                : "false", //as string because dropdown selectedId should be string.
        };
        this.selectedFilters = {
            isUtm: this.state.isUtm === "true",
            filter: this.props.widgetFilters.filter,
            isAll: this.props.widgetFilters.isAll,
            isNew: this.props.widgetFilters.isNew,
            isTrending: this.props.widgetFilters.isTrending,
            isEvergreen: this.props.widgetFilters.isEvergreen,
            orderBy: this.props.widgetFilters.orderBy,
            includeSubDomains: this.props.widgetFilters.includeSubDomains,
        };
        this.selectedFilters[this.getSelectedFilter()] = true;
        this.props.changeFilter(this.getSelectedFilters());
    }
    private getSearchValue() {
        const filterObject: any = Widget.filterParse(this.props.widgetFilters.filter);
        const filterObjectItem = filterObject[Object.keys(filterObject)[0]];
        return filterObjectItem && filterObjectItem.hasOwnProperty("value")
            ? filterObjectItem.value.replace(/"/g, "")
            : "";
    }
    private getSelectedFilters() {
        let filters = [];
        for (let filter in this.selectedFilters) {
            filters.push({ name: filter, value: this.selectedFilters[filter] });
        }
        return filters;
    }
    private onSearch = (value: string) => {
        let filterValue = Widget.filterStringify({
            Page: { operator: "contains", value: `"${value}"` },
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

    private onSelectUtm = (item) => {
        this.setState({ isUtm: item.id });
        this.selectedFilters.isUtm = item.id === "true";
        this.props.changeFilter(this.getSelectedFilters());
    };
    private onSelectSwitcher = (item) => {
        radioItems.forEach((radioItem) => {
            if (item.id === radioItem.value) {
                this.selectedFilters[radioItem.value] = true;
            } else {
                this.selectedFilters[radioItem.value] = false;
            }
        });
        if (item.id === "isTrending") {
            this.onSelectOrderBy({ id: "ChangeInShare desc", text: "Change" });
        }
        this.props.changeFilter(this.getSelectedFilters());
    };

    private onSelectOrderBy = (item) => {
        this.selectedFilters.orderBy = item.id;
        this.props.changeFilter(this.getSelectedFilters());
    };

    private onSelectincludeSubDomains = (item) => {
        this.selectedFilters.includeSubDomains = item.id;
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
                        defaultValue={this.getSearchValue()}
                        onChange={this.onSearch}
                        debounce={400}
                    />
                </div>
                <div key="utm" className="dynamicFilter">
                    <h5>
                        <I18n>{`home.dashboards.wizard.filters.utm`}</I18n>
                    </h5>
                    <StatefulDropdown
                        key="utmFilter"
                        items={[
                            { id: "true", text: "Yes" },
                            { id: "false", text: "No" },
                        ]}
                        selectedId={this.state.isUtm}
                        onSelect={this.onSelectUtm}
                    />
                </div>
                <div key="switcher" className="dynamicFilter">
                    <h5>
                        <I18n>{`home.dashboards.wizard.filters.switcher`}</I18n>
                    </h5>
                    <StatefulDropdown
                        key="switcherFilter"
                        items={radioItems.map((radioItem) => ({
                            id: radioItem.value,
                            text: this.i18n(radioItem.label),
                        }))}
                        selectedId={this.getSelectedFilter()}
                        onSelect={this.onSelectSwitcher}
                    />
                </div>
                <div key="orderby" className="dynamicFilter">
                    <h5>
                        <I18n>{`home.dashboards.wizard.filters.orderBy`}</I18n>
                    </h5>
                    <StatefulDropdown
                        key="orderbyFilter"
                        items={[
                            { id: "Share desc", text: "Traffic Share" },
                            { id: "ChangeInShare desc", text: "Change" },
                        ]}
                        selectedId={this.selectedFilters.orderBy}
                        onSelect={this.onSelectOrderBy}
                    />
                </div>
                <div key="includeSubDomains" className="dynamicFilter">
                    <h5>
                        <I18n>{`home.dashboards.wizard.filters.includeSubDomains`}</I18n>
                    </h5>
                    <StatefulDropdown
                        key="includeSubDomainsFilter"
                        items={[
                            { id: "true", text: "Yes" },
                            { id: "false", text: "No" },
                        ]}
                        selectedId={this.selectedFilters.includeSubDomains}
                        onSelect={this.onSelectincludeSubDomains}
                    />
                </div>
            </div>
        );
    }
}
