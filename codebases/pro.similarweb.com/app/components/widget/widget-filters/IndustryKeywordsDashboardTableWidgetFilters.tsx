import { BooleanSearch } from "@similarweb/ui-components/dist/boolean-search";
import { IBooleanSearchChipItem } from "@similarweb/ui-components/dist/boolean-search/src/BooleanSearch";
import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import { StatefulDropdown } from "components/dashboard/widget-wizard/components/StatefulDropdown";
import I18n from "components/React/Filters/I18n";
import { InjectableComponent } from "components/React/InjectableComponent/InjectableComponent";
import { radioItems } from "components/React/PopularPagesFilters/popularPagesFilters.config";
import { BooleanSearchWrapper } from "components/widget/widget-types/TableSearchKeywordsDashboardWidgetFilters";
import { Widget } from "components/widget/widget-types/Widget";
import * as _ from "lodash";
import {
    booleanSearchApiParamsToChips,
    booleanSearchChipsObjectToApiParams,
} from "pages/website-analysis/traffic-sources/search/booleanSearchUtility";
import * as React from "react";

export class IndustryKeywordsDashboardTableWidgetFilters extends InjectableComponent {
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
        let { includeBranded = "true" } = this.props.widgetFilters;
        includeBranded = /true|false/i.test(includeBranded) ? includeBranded.toString() : "true";
        this.state = {
            includeBranded, // as string because dropdown selectedId should be string.
            Source: this.getInitialSelection(),
            filter: this.props.widgetFilters.filter,
            clearValue: false,
            dynamicSearchChannels:
                props.widgetPreview && props.widgetPreview.Filters
                    ? props.widgetPreview.Filters.Source
                    : "",
        };
        this.selectedFilters = {
            filter: this.props.widgetFilters.filter,
            orderBy: this.props.widgetFilters.orderBy || "TotalShare desc",
            includeBranded,
        };
        if (props.widgetFilters.ExcludeTerms) {
            this.selectedFilters.ExcludeTerms = props.widgetFilters.ExcludeTerms;
        }
        if (props.widgetFilters.IncludeTerms) {
            this.selectedFilters.IncludeTerms = props.widgetFilters.IncludeTerms;
        }
        this.selectedFilters[this.getSelectedFilter()] = true;
        this.props.changeFilter(this.getSelectedFilters());
    }

    public UNSAFE_componentWillReceiveProps(newProps) {
        if (
            newProps.widgetPreview &&
            newProps.widgetPreview !== this.state.dynamicSearchChannels &&
            newProps.widgetPreview.Filters
        ) {
            const newSearchChannels = [
                { id: "0", text: "All Search Channels" },
                ...newProps.widgetPreview.Filters.Source,
            ];
            this.setState({
                dynamicSearchChannels: newSearchChannels,
                Source: this.state.Source || "0",
            });
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
            this.state.dynamicSearchChannels.length > 0 ? (
                <div key="searchChannel" className="dynamicFilter">
                    <h5>
                        <I18n>{`home.dashboards.wizard.filters.searchChannel`}</I18n>
                    </h5>
                    <StatefulDropdown
                        key="sourceFilter"
                        items={this.state.dynamicSearchChannels}
                        selectedId={this.state.Source}
                        onSelect={this.onSelectSource}
                    />
                </div>
            ) : null;
        return (
            <div key="dynamicFiltersContainer" className="filters">
                <div key="includeBranded" className="dynamicFilter">
                    <h5>
                        <I18n>{`home.dashboards.wizard.filters.includeBranded`}</I18n>
                    </h5>
                    <StatefulDropdown
                        key="includeBrandedFilter"
                        items={[
                            { id: "true", text: "Yes" },
                            { id: "false", text: "No" },
                        ]}
                        selectedId={this.state.includeBranded}
                        onSelect={this.onSelectincludeBranded}
                    />
                </div>
                {searchChannels}
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
                <div key="searchterm" className="filters" style={{ flexDirection: "column" }}>
                    <h5>
                        <I18n>{`home.dashboards.wizard.filters.searchterm`}</I18n>
                    </h5>
                    <BooleanSearchWrapper>
                        <BooleanSearch
                            onChange={this.onSearch}
                            chips={booleanSearchApiParamsToChips({
                                IncludeTerms: this.selectedFilters.IncludeTerms,
                                ExcludeTerms: this.selectedFilters.ExcludeTerms,
                            })}
                        />
                    </BooleanSearchWrapper>
                </div>
            </div>
        );
    }

    private getInitialSelection() {
        const filterObject = Widget.filterParse(this.props.widgetFilters.filter);
        const filterObjectItem: any = filterObject["Source"];
        return filterObjectItem ? filterObjectItem.value : "0";
    }

    private getSearchValue() {
        const filterObject: any = Widget.filterParse(this.selectedFilters.filter);
        const filterObjectItem: any = _.find(filterObject, { operator: "contains" });
        return filterObjectItem && filterObjectItem.hasOwnProperty("value")
            ? filterObjectItem.value.replace(/"/g, "")
            : "";
    }

    private getSelectedFilters(newSource?) {
        // TODO: refactor this to use Widget.filterStringify
        const filters = [];
        for (const filter of Object.keys(this.selectedFilters)) {
            let value = this.selectedFilters[filter];
            if (filter === "filter") {
                const metricFilter = this.defaultMetricFilters[this.props.widgetMetric]
                    ? `${this.defaultMetricFilters[this.props.widgetMetric]},`
                    : "";
                const textFilter = this.getSearchValue()
                    ? `SearchTerm;contains;"${this.getSearchValue()}",`
                    : "";
                let sourceFilter;
                if (typeof newSource !== "undefined") {
                    sourceFilter = parseInt(newSource, 10) > 0 ? `Source;==;${newSource},` : "";
                } else {
                    sourceFilter =
                        parseInt(this.state.Source, 10) > 0
                            ? `Source;==;${this.state.Source},`
                            : "";
                }
                value = `${textFilter}${metricFilter}${sourceFilter}`;
                value = _.trim(value, ",");
                this.setState({ filter: value });
            }
            filters.push({ name: filter, value });
        }
        return filters;
    }

    private onSearch = (chipsObject: IBooleanSearchChipItem[]) => {
        const { IncludeTerms, ExcludeTerms } = booleanSearchChipsObjectToApiParams(chipsObject);
        if (IncludeTerms === "") {
            delete this.selectedFilters.IncludeTerms;
        } else {
            this.selectedFilters.IncludeTerms = IncludeTerms;
        }
        if (ExcludeTerms === "") {
            delete this.selectedFilters.ExcludeTerms;
        } else {
            this.selectedFilters.ExcludeTerms = ExcludeTerms;
        }

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

    private onSelectincludeBranded = (item) => {
        this.setState({ includeBranded: item.id });
        this.selectedFilters.includeBranded = item.id === "true";
        this.props.changeFilter(this.getSelectedFilters());
    };

    private onSelectSource = (item) => {
        this.setState({ Source: item.id });
        this.props.changeFilter(this.getSelectedFilters(item.id));
    };

    private onSelectOrderBy = (item) => {
        this.selectedFilters.orderBy = item.id;
        this.props.changeFilter(this.getSelectedFilters());
    };
}
