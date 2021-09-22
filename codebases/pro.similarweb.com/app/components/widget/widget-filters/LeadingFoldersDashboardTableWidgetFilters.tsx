import * as React from "react";
import { InjectableComponent } from "components/React/InjectableComponent/InjectableComponent";
import I18n from "components/React/Filters/I18n";
import { Widget } from "components/widget/widget-types/Widget";
import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import { StatefulDropdown } from "components/dashboard/widget-wizard/components/StatefulDropdown";
import { Injector } from "../../../../scripts/common/ioc/Injector";

export class LeadingFoldersDashboardTableWidgetFilters extends React.PureComponent<any, any> {
    protected i18n;
    protected selectedFilters: any = {};

    constructor(props) {
        super(props);
        this.i18n = Injector.get("i18nFilter");
        this.selectedFilters = {
            filter: this.props.widgetFilters.filter,
            includeSubDomains: this.props.widgetFilters.includeSubDomains,
        };
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
            Folder: { operator: "contains", value: `"${value}"` },
        });
        this.selectedFilters.filter = filterValue;
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
