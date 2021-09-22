import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import DashboardCategoryItem from "components/dashboard/widget-wizard/components/DashboardCategoryItem";
import { StatefulDropdown } from "components/dashboard/widget-wizard/components/StatefulDropdown";
import I18n from "components/React/Filters/I18n";
import { InjectableComponent } from "components/React/InjectableComponent/InjectableComponent";
import { Widget } from "components/widget/widget-types/Widget";
import { i18nFilter } from "filters/ngFilters";
import * as _ from "lodash";
import * as React from "react";

export class KeywordsDashboardTableWidgetFilters extends InjectableComponent {
    protected i18n;
    protected selectedFilters: any = {};

    constructor(props) {
        super(props);
        this.i18n = this.injector.get("i18nFilter");
        this.state = {
            Category: this.removeQuotes(this.getInitialSelection("0", "category")),
            filter: this.props.widgetFilters.filter,
            clearValue: false,
            dynamicCategories: this.getCategories(
                this.props.widgetPreview &&
                    this.props.widgetPreview.Filters &&
                    this.props.widgetPreview.Filters.Category,
            ),
            dynamicSourceTypes:
                props.widgetPreview && props.widgetPreview.Filters
                    ? props.widgetPreview.Filters.Type
                    : [],
            dynamicSearchEngines:
                props.widgetPreview && props.widgetPreview.Filters
                    ? this.fixSearchEngines(props.widgetPreview.Filters.Source)
                    : [],
            dynamicWebsiteType: [
                {
                    id: "7",
                    text: i18nFilter()("topsites.table.site.functionality.filter.all"),
                },
                {
                    id: "2",
                    text: i18nFilter()("topsites.table.site.functionality.filter.transactional"),
                },
                {
                    id: "4",
                    text: i18nFilter()("topsites.table.site.functionality.filter.news"),
                },
                {
                    id: "1",
                    text: i18nFilter()("topsites.table.site.functionality.filter.other"),
                },
            ],
        };
        this.selectedFilters = {
            filter: this.props.widgetFilters.filter,
            orderBy: this.props.widgetFilters.orderBy || "TotalShare desc",
            Category:
                this.props.widgetFilters.Category ||
                this.removeQuotes(this.getInitialSelection("0", "category")),
            Type:
                this.props.widgetFilters.Type ||
                this.removeQuotes(this.getInitialSelection("0", "Source")),
            Source:
                this.props.widgetFilters.Source ||
                this.removeQuotes(this.getInitialSelection("0", "family")),
            FuncFlag: this.props.widgetFilters.FuncFlag || "7",
        };
        if (this.getSelectedFilters()) {
            this.props.changeFilter(this.getSelectedFilters());
        }
    }

    public UNSAFE_componentWillReceiveProps(newProps): void {
        if (this.props.widgetMetric.indexOf("KeywordAnalysisGroup") === -1) {
            if (
                newProps.widgetPreview &&
                newProps.widgetPreview !== this.state.dynamicCategories &&
                newProps.widgetPreview.Filters
            ) {
                const newCategories = [
                    { id: "0", text: "All Categories" },
                    ...newProps.widgetPreview.Filters.Category,
                ];
                const newSourceTypes = [
                    { id: "0", text: "All Sources" },
                    ...newProps.widgetPreview.Filters.Type,
                ];
                const newSearchEngines = [
                    {
                        id: "0",
                        text: "All Search Engines",
                    },
                    ...this.fixSearchEngines(newProps.widgetPreview.Filters.Source),
                ];
                if (
                    this.state.dynamicSourceTypes.length === 0 ||
                    this.props.widgetFilters.Category === undefined ||
                    this.props.widgetFilters.Category !== newProps.widgetFilters.Category ||
                    // eslint:disable-next-line: triple-equals
                    (this.selectedFilters.Type && this.selectedFilters.Type == "0") ||
                    // eslint:disable-next-line: triple-equals
                    (this.selectedFilters.Type && this.selectedFilters.Source == "0")
                ) {
                    this.setState({
                        dynamicCategories: this.getCategories(newCategories),
                        dynamicSourceTypes: newSourceTypes,
                        dynamicSearchEngines: newSearchEngines,
                        Category: this.state.Category || "0",
                    });
                } else {
                    this.setState({ dynamicCategories: this.getCategories(newCategories) });
                }
                this.selectedFilters = {
                    filter: newProps.widgetFilters.filter,
                    orderBy: newProps.widgetFilters.orderBy || "TotalShare desc",
                    Category: this.selectedFilters.Category || "0",
                    Type: this.selectedFilters.Type || "0",
                    Source: this.selectedFilters.Source || "0",
                    FuncFlag: this.selectedFilters.FuncFlag || "7",
                };
            }
            if (newProps.widgetMetric !== this.props.widgetMetric) {
                this.setState({ clearValue: true });
                setTimeout(() => {
                    this.setState({ clearValue: false });
                });
            }
        } else {
            this.selectedFilters = {
                orderBy: newProps.widgetFilters.orderBy || "TotalShare desc",
            };
        }
    }

    public render(): React.ReactNode {
        const Categoires =
            this.state.dynamicCategories.length > 0 ? (
                <div key="avilableCategories" className="dynamicFilter">
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
        const Types =
            this.state.dynamicSourceTypes.length > 0 ? (
                <div key="searchChannel" className="dynamicFilter">
                    <h5>
                        <I18n>{`home.dashboards.wizard.filters.sourceType`}</I18n>
                    </h5>
                    <StatefulDropdown
                        key="sourceFilter"
                        items={this.state.dynamicSourceTypes}
                        selectedId={this.selectedFilters.Type}
                        onSelect={this.onSelectSourceType}
                        DropDownItemComponent={DashboardCategoryItem}
                        hasSearch={true}
                    />
                </div>
            ) : null;
        const SearchEngines =
            this.state.dynamicSearchEngines.length > 0 ? (
                <div key="searchEngines" className="dynamicFilter">
                    <h5>
                        <I18n>{`home.dashboards.wizard.filters.SearchEngine`}</I18n>
                    </h5>
                    <StatefulDropdown
                        key="searchEngineFilter"
                        items={this.state.dynamicSearchEngines}
                        selectedId={this.selectedFilters.Source}
                        onSelect={this.onSelectSearchEngine}
                        DropDownItemComponent={DashboardCategoryItem}
                        hasSearch={true}
                    />
                </div>
            ) : null;
        const WebsiteType =
            this.state.dynamicWebsiteType.length > 0 ? (
                <div key="websiteType" className="dynamicFilter">
                    <h5>
                        <I18n>{`home.dashboards.wizard.filters.WebsiteType`}</I18n>
                    </h5>
                    <StatefulDropdown
                        key="websiteTypeFilter"
                        items={this.state.dynamicWebsiteType}
                        selectedId={this.selectedFilters.FuncFlag}
                        onSelect={this.onSelectWebsiteType}
                        DropDownItemComponent={DashboardCategoryItem}
                        hasSearch={false}
                    />
                </div>
            ) : null;
        if (this.props.widgetMetric.indexOf("KeywordAnalysisGroup") > -1) {
            return (
                <div key="dynamicFiltersContainer" className="filters">
                    <div key="orderby" className="dynamicFilter">
                        <h5>
                            <I18n>{`home.dashboards.wizard.filters.orderBy`}</I18n>
                        </h5>
                        <StatefulDropdown
                            key="orderbyFilter"
                            items={[
                                { id: "Share desc", text: "Traffic Share" },
                                { id: "Change desc", text: "Change" },
                                { id: "Volume desc", text: "Volume" },
                                { id: "Cpc desc", text: "CPC" },
                            ]}
                            selectedId={this.selectedFilters.orderBy}
                            onSelect={this.onSelectOrderBy}
                        />
                    </div>
                </div>
            );
        } else {
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
                    {Categoires}
                    {Types}
                    {SearchEngines}
                    {WebsiteType}
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

    public componentWillUnmount(): void {
        this.selectedFilters.filter = "";
        this.props.changeFilter(this.getSelectedFilters("0", "0", "0"));
    }

    private fixSearchEngines(items) {
        return items.map((source) => {
            return {
                ...source,
                text: source.text[0].toUpperCase() + source.text.substr(1),
                id: source.text,
            };
        });
    }

    private getCategories(apiCategories) {
        const categories = [];
        if (apiCategories) {
            apiCategories.forEach((category) => {
                if (category) {
                    categories.push(category);
                    if (category.children) {
                        category.children.forEach((child) => {
                            categories.push(child);
                        });
                    }
                }
            });
        }
        return categories;
    }

    private getInitialSelection(defaultId = "0", type?) {
        const widgetFilters = this.props.widgetFilters.filter;
        if (widgetFilters) {
            const parsedFilters = Widget.filterParse(widgetFilters);
            if (parsedFilters[type]) {
                return parsedFilters[type].value;
            } else {
                return defaultId;
            }
        } else {
            return defaultId;
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

    private getSelectedFilters(newCategory?, newSourceType?, newSearchEngine?, newWebsiteType?) {
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
                let TypeFilter;
                let SourceFilter;
                let WebsiteTypeFilter;

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
                        TypeFilter = "";
                        break;
                    case "fromState":
                        if (this.selectedFilters.Type === "0") {
                            TypeFilter = "";
                            break;
                        }
                        TypeFilter = this.selectedFilters.Type
                            ? `Source;==;${this.selectedFilters.Type},`
                            : "";
                        break;
                    default:
                        TypeFilter = newSourceType ? `Source;==;${newSourceType},` : "";
                }

                switch (newSearchEngine) {
                    case "0":
                        SourceFilter = "";
                        break;
                    case "fromState":
                        if (this.selectedFilters.Source === "0") {
                            SourceFilter = "";
                            break;
                        }
                        SourceFilter = this.selectedFilters.Source
                            ? `family;==;"${this.selectedFilters.Source}",`
                            : "";
                        break;
                    default:
                        SourceFilter = newSearchEngine ? `family;==;"${newSearchEngine}",` : "";
                }

                switch (newWebsiteType) {
                    case "0":
                        WebsiteTypeFilter = "";
                        break;
                    case "fromState":
                        if (this.selectedFilters._WebsiteTypeFilter === "0") {
                            WebsiteTypeFilter = "";
                            break;
                        }
                        WebsiteTypeFilter = this.selectedFilters.FuncFlag || "";
                        break;
                    default:
                        WebsiteTypeFilter = newWebsiteType ? newWebsiteType : "";
                }

                value = `${textFilter}${categoryFilter}${TypeFilter}${SourceFilter}`;
                value = _.trim(value, ",");
                this.setState({ filter: value });
            }
            filters.push({ name: filter, value });
        }
        return filters;
    }

    private onSearch = (value: string): void => {
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
        this.props.changeFilter(this.getSelectedFilters(item.id, "fromState", "fromState"));
    };

    private onSelectSourceType = (item) => {
        this.selectedFilters.Type = item.id;
        this.props.changeFilter(this.getSelectedFilters("fromState", item.id, "fromState"));
    };

    private onSelectSearchEngine = (item) => {
        this.selectedFilters.Source = item.id;
        this.props.changeFilter(this.getSelectedFilters("fromState", "fromState", item.id));
    };

    private onSelectWebsiteType = (item) => {
        this.selectedFilters.FuncFlag = item.id;
        this.props.changeFilter(
            this.getSelectedFilters("fromState", "fromState", "fromState", item.id),
        );
    };

    private onSelectOrderBy = (item) => {
        this.selectedFilters.orderBy = item.id;
        this.props.changeFilter(this.getSelectedFilters("fromState", "fromState", "fromState"));
    };
}
