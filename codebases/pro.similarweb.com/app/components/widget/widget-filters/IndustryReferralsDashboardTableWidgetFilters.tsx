import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import DashboardCategoryItem from "components/dashboard/widget-wizard/components/DashboardCategoryItem";
import { StatefulDropdown } from "components/dashboard/widget-wizard/components/StatefulDropdown";
import I18n from "components/React/Filters/I18n";
import { InjectableComponent } from "components/React/InjectableComponent/InjectableComponent";
import { Widget } from "components/widget/widget-types/Widget";
import * as _ from "lodash";
import * as React from "react";

export class IndustryReferralsDashboardTableWidgetFilters extends InjectableComponent {
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
            Category: this.removeQuotes(
                this.getInitialSelection()["category"] &&
                    this.getInitialSelection()["category"].value,
            ),
            sourceType: this.removeQuotes(
                this.getInitialSelection()["sourceType"] &&
                    this.getInitialSelection()["sourceType"].value,
            ),
            filter: this.props.widgetFilters.filter,
            clearValue: false,
            dynamicCategories: this.getCategories(
                this.props.widgetPreview &&
                    this.props.widgetPreview.Filters &&
                    this.props.widgetPreview.Filters.category,
            ),
            dynamicSourceTypes:
                props.widgetPreview && props.widgetPreview.Filters
                    ? props.widgetPreview.Filters.sourceType
                    : [],
        };
        this.selectedFilters = {
            filter: this.props.widgetFilters.filter,
            orderBy: this.props.widgetFilters.orderBy || "TotalShare desc",
            Category:
                this.props.widgetFilters.Category ||
                this.removeQuotes(
                    this.getInitialSelection()["category"] &&
                        this.getInitialSelection()["category"].value,
                ),
            sourceType:
                this.props.widgetFilters.sourceType ||
                this.removeQuotes(
                    this.getInitialSelection()["sourceType"] &&
                        this.getInitialSelection()["sourceType"].value,
                ),
        };

        const selectedFilters = this.getSelectedFilters(
            this.selectedFilters.Category,
            this.selectedFilters.sourceType,
        );
        if (selectedFilters) {
            this.props.changeFilter(selectedFilters);
        }
    }

    public UNSAFE_componentWillReceiveProps(newProps) {
        if (
            newProps.widgetPreview &&
            newProps.widgetPreview !== this.state.dynamicCategories &&
            newProps.widgetPreview.Filters
        ) {
            const newCategories = [
                { id: "0", text: "All Categories" },
                ...newProps.widgetPreview.Filters.category,
            ];
            const newSourceTypes = [
                { id: "0", text: "All Sources" },
                ...newProps.widgetPreview.Filters.sourceType,
            ];
            if (
                this.state.dynamicSourceTypes.length === 0 ||
                this.props.widgetFilters.Category === undefined ||
                this.props.widgetFilters.Category !== newProps.widgetFilters.Category ||
                // eslint:disable-next-line: triple-equals
                (this.selectedFilters.sourceType && this.selectedFilters.sourceType == "0")
            ) {
                this.setState({
                    dynamicCategories: this.getCategories(newCategories),
                    dynamicSourceTypes: newSourceTypes,
                    Category: this.state.Category || "0",
                    sourceType:
                        this.state.sourceType &&
                        _.find(newSourceTypes, { id: this.state.sourceType })
                            ? this.state.sourceType
                            : "0",
                });
            } else {
                this.setState({ dynamicCategories: this.getCategories(newCategories) });
            }
            this.selectedFilters = {
                filter: newProps.widgetFilters.filter,
                orderBy: newProps.widgetFilters.orderBy || "TotalShare desc",
                Category: this.selectedFilters.Category || "0",
                sourceType: this.selectedFilters.sourceType || "0",
            };
        }
        if (newProps.widgetMetric !== this.props.widgetMetric) {
            this.setState({ clearValue: true });
            setTimeout(() => {
                this.setState({ clearValue: false });
            });
        }
    }

    public render() {
        const searchChannels =
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
                    />
                </div>
            ) : null;
        const sourceTypes =
            this.state.dynamicSourceTypes.length > 0 ? (
                <div key="searchChannel" className="dynamicFilter">
                    <h5>
                        <I18n>{`home.dashboards.wizard.filters.sourceType`}</I18n>
                    </h5>
                    <StatefulDropdown
                        key="sourceFilter"
                        items={this.state.dynamicSourceTypes}
                        selectedId={this.selectedFilters.sourceType}
                        onSelect={this.onSelectSourceType}
                        DropDownItemComponent={DashboardCategoryItem}
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
                {searchChannels}
                {sourceTypes}
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
        if (widgetFilters) {
            return Widget.filterParse(widgetFilters);
        } else {
            return "0";
        }
    }

    private removeQuotes(str: string) {
        return str && str.replace(/"/g, "");
    }

    private getSearchValue() {
        const filterObject: any = Widget.filterParse(this.selectedFilters.filter);
        const filterObjectItem: any = _.find(filterObject, { operator: "contains" });
        return filterObjectItem && filterObjectItem.hasOwnProperty("value")
            ? filterObjectItem.value.replace(/"/g, "")
            : "";
    }

    private getSelectedFilters(newCategory?, newSourceType?) {
        if (!newCategory && !newSourceType) {
            return this.selectedFilters["filter"];
        }
        // TODO: refactor this to use Widget.filterStringify
        const filters = [];
        for (const filter of Object.keys(this.selectedFilters)) {
            let value = this.selectedFilters[filter];
            if (filter === "filter") {
                const textFilter = this.getSearchValue()
                    ? `Domain;contains;"${this.getSearchValue()}",`
                    : "";
                let categoryFilter;
                let sourceTypeFilter;

                switch (newCategory) {
                    case "0":
                        categoryFilter = "";
                        break;
                    case "fromState":
                        if (this.selectedFilters.Category === "0") {
                            categoryFilter = "";
                            break;
                        }
                        categoryFilter = this.selectedFilters.Category
                            ? `category;category;"${this.selectedFilters.Category}",`
                            : "";
                        break;
                    default:
                        categoryFilter = newCategory ? `category;category;"${newCategory}",` : "";
                }

                switch (newSourceType) {
                    case "0":
                        sourceTypeFilter = "";
                        break;
                    case "fromState":
                        if (this.selectedFilters.sourceType === "0") {
                            sourceTypeFilter = "";
                            break;
                        }
                        sourceTypeFilter = this.selectedFilters.sourceType
                            ? `sourceType;==;"${this.selectedFilters.sourceType}",`
                            : "";
                        break;
                    default:
                        sourceTypeFilter = newSourceType ? `sourceType;==;"${newSourceType}",` : "";
                }

                value = `${textFilter}${categoryFilter}${sourceTypeFilter}`;
                value = _.trim(value, ",");
                this.setState({ filter: value });
            }
            filters.push({ name: filter, value });
        }
        return filters;
    }

    private onSearch = (value: string) => {
        const filterValue = Widget.filterStringify({
            Domain: { operator: "contains", value: `"${value}"` },
        });
        this.selectedFilters.filter = filterValue;
        this.props.changeFilter(this.getSelectedFilters("fromState", "fromState"));
    };

    private onSelectCategory = (item) => {
        this.selectedFilters.Category = item.id;
        this.setState({
            Category: item.id,
        });
        // this.state.Category = item.id;
        this.props.changeFilter(this.getSelectedFilters(item.id, "fromState"));
    };

    private onSelectSourceType = (item) => {
        this.selectedFilters.sourceType = item.id;
        this.setState({
            sourceType: item.id,
        });
        // this.state.sourceType = item.id;
        this.props.changeFilter(this.getSelectedFilters("fromState", item.id));
    };

    private onSelectOrderBy = (item) => {
        this.selectedFilters.orderBy = item.id;
        this.props.changeFilter(this.getSelectedFilters("fromState", "fromState"));
    };
}
