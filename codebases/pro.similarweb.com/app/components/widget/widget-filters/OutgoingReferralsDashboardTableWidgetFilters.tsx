import * as React from "react";
import * as _ from "lodash";
import { InjectableComponent } from "components/React/InjectableComponent/InjectableComponent";
import I18n from "components/React/Filters/I18n";
import { Widget } from "components/widget/widget-types/Widget";
import { StatefulDropdown } from "components/dashboard/widget-wizard/components/StatefulDropdown";
import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import DashboardCategoryItem from "components/dashboard/widget-wizard/components/DashboardCategoryItem";
import categoryService from "common/services/categoryService";

export class OutgoingReferralsDashboardTableWidgetFilters extends InjectableComponent {
    protected i18n;
    protected selectedFilters: any = {};

    constructor(props) {
        super(props);
        this.i18n = this.injector.get("i18nFilter");
        const staticCategories = categoryService.getCategories();
        this.state = {
            clearValue: false,
            dynamicCategories: this.getCategories(staticCategories),
        };
        this.selectedFilters = {
            filter:
                this.removeQuotes(
                    this.getInitialSelection()["domain"] &&
                        this.getInitialSelection()["domain"].value,
                ) || props.widgetFilters.filter,
            orderBy: props.widgetFilters.orderBy || "TotalShare desc",
            Category:
                this.props.widgetFilters.Category ||
                this.removeQuotes(
                    this.getInitialSelection()["category"] &&
                        this.getInitialSelection()["category"].value,
                ) ||
                "All",
            includeSubDomains: this.props.widgetFilters.includeSubDomains,
        };
        this.getSelectedFilters() && props.changeFilter(this.getSelectedFilters());
    }

    public UNSAFE_componentWillReceiveProps(newProps) {
        //TODO: Add available categories to backend response
        /*        if (newProps.widgetPreview && newProps.widgetPreview !== this.state.dynamicCategories && newProps.widgetPreview.Filters) {
                    let _newCategories = [{id: "0", text: "All Categories"}, ...newProps.widgetPreview.Filters.category];
                    if (this.props.widgetFilters.Category === undefined || (this.props.widgetFilters.Category !== newProps.widgetFilters.Category)) {
                        this.setState({
                            dynamicCategories: this.getCategories(_newCategories),
                            Category: this.selectedFilters.Category || "0",
                        });
                    }else{
                        this.setState({dynamicCategories: this.getCategories(_newCategories)});
                    }
                    this.selectedFilters = {
                        filter: newProps.widgetFilters.filter,
                        orderBy: newProps.widgetFilters.orderBy || "TotalShare desc",
                        Category: this.selectedFilters.Category || "0",
                    };
                }*/
        if (newProps.widgetMetric !== this.props.widgetMetric) {
            this.setState({ clearValue: true });
            setTimeout(() => {
                this.setState({ clearValue: false });
            });
        }
    }

    private getCategories(apiCategories) {
        const categories = [];
        if (apiCategories) {
            apiCategories.forEach((category) => {
                categories.push(category);
                if (category.children) {
                    category.children.forEach((child) => {
                        categories.push(child);
                    });
                }
            });
        }
        return categories;
    }

    private getInitialSelection() {
        const widgetFilters = this.props.widgetFilters.filter;
        if (typeof widgetFilters === "string" && widgetFilters) {
            return Widget.filterParse(widgetFilters);
        } else {
            return "0";
        }
    }

    private removeQuotes(string) {
        return string && string.replace(/"/g, "");
    }

    private getSearchValue() {
        if (
            typeof this.selectedFilters.filter === "string" &&
            this.selectedFilters.filter &&
            this.selectedFilters.filter.indexOf(";") > 0
        ) {
            const filterObject: any = Widget.filterParse(this.selectedFilters.filter);
            const filterObjectItem: any = filterObject["domain"];
            return filterObjectItem && filterObjectItem.hasOwnProperty("value")
                ? filterObjectItem.value.replace(/"/g, "")
                : "";
        } else {
            return typeof this.selectedFilters.filter === "string"
                ? this.selectedFilters.filter
                : "";
        }
    }

    private getSelectedFilters(newCategory?) {
        if (!newCategory) return this.selectedFilters["filter"];
        let filters = [];
        for (let filter in this.selectedFilters) {
            let _value = this.selectedFilters[filter];
            if (filter === "filter") {
                let _textFilter = this.getSearchValue()
                    ? `domain;contains;"${this.getSearchValue()}",`
                    : "";
                let _categoryFilter;

                switch (newCategory) {
                    case "All":
                        _categoryFilter = "";
                        break;
                    case "fromState":
                        if (this.selectedFilters.Category === "0") {
                            _categoryFilter = "";
                            break;
                        }
                        _categoryFilter =
                            this.selectedFilters.Category && this.selectedFilters.Category != "All"
                                ? `category;category;"${this.selectedFilters.Category}",`
                                : "";
                        break;
                    default:
                        _categoryFilter = newCategory ? `category;category;"${newCategory}",` : "";
                }

                _value = `${_textFilter}${_categoryFilter}`;
                _value = _.trim(_value, ",");
                this.setState({ filter: _value });
            }
            filters.push({ name: filter, value: _value });
        }
        return filters;
    }

    private onSearch = (value: string) => {
        let filterValue = Widget.filterStringify({
            domain: { operator: "contains", value: `"${value}"` },
        });
        this.selectedFilters.filter = filterValue;
        this.props.changeFilter(this.getSelectedFilters("fromState"));
    };

    private onSelectCategory = (item) => {
        this.selectedFilters.Category = item.id;
        this.props.changeFilter(this.getSelectedFilters(item.id));
    };

    private onSelectOrderBy = (item) => {
        this.selectedFilters.orderBy = item.id;
        this.props.changeFilter(this.getSelectedFilters("fromState"));
    };

    private onSelectincludeSubDomains = (item) => {
        this.selectedFilters.includeSubDomains = item.id;
        this.props.changeFilter(this.getSelectedFilters("fromState"));
    };

    render() {
        let _searchChannels =
            this.state.dynamicCategories.length > 0 ? (
                <div key="searchChannel" className="dynamicFilter">
                    <h5>
                        <I18n>{`home.dashboards.wizard.filters.category`}</I18n>
                    </h5>
                    <StatefulDropdown
                        key="categoryFilter"
                        items={this.state.dynamicCategories}
                        selectedId={this.selectedFilters.Category}
                        onSelect={this.onSelectCategory}
                        DropDownItemComponent={DashboardCategoryItem}
                        hasSearch={true}
                        searchPlaceHolder={this.i18n(
                            "home.dashboards.wizard.filters.searchCategory",
                        )}
                    />
                </div>
            ) : null;
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
                {_searchChannels}
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
