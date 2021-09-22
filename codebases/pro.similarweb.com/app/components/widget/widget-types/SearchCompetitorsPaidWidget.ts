import { DashboardTableWidget } from "components/widget/widget-types/DashboardTableWidget";
import {
    parseFilters,
    searchTypeIds,
} from "components/widget/widget-filters/SearchCompetitorsWidgetFilters";
import { Widget } from "./Widget";
import PaidSearchCompetitorsWidgetFilters from "../widget-filters/PaidSearchCompetitorsWidgetFilters";

export class SearchCompetitorsPaidWidget extends DashboardTableWidget {
    constructor() {
        super();
    }

    static getWidgetMetadataType() {
        return "SearchCompetitorsPaid";
    }

    static getWidgetDashboardType() {
        return "Table";
    }
    static getFiltersComponent() {
        return PaidSearchCompetitorsWidgetFilters;
    }

    getProUrl() {
        const { filter = "", keys, country, from, to } = this.apiParams;
        if (filter.length) {
            const parsedFilters = Widget.filterParse(filter);
            const parsedFilterData = parseFilters(parsedFilters);
            const urlParams = {
                key: keys,
                isWWW: "*",
                country: country,
                duration: this._durationService.getMonthsFromApiDuration(from, to, true),
                websiteType: parsedFilterData.SiteFunctionality,
                risingCompetitors: parsedFilterData.isrise,
                newCompetitors: parsedFilterData.isnew,
                search: parsedFilterData.domain,
                paidSearchType: parsedFilterData.searchType,
            };
            return this._swNavigator.getStateUrl("websites-competitorsPaidKeywords", urlParams);
        }
    }

    getColumnsConfig() {
        return [
            {
                name: "Domain",
                title: "analysis.competitors.search.organic.table.columns.domain.title",
                type: "string",
                format: "None",
                sortable: false,
                isSorted: false,
                sortDirection: "desc",
                groupable: false,
                headTemp: "",
                totalCount: false,
                tooltip: false,
                cellTemp: "item-image-cell",
            },
            {
                name: "Search Overlap Score",
                title: "analysis.competitors.search.organic.table.columns.affinity.title",
                type: "string",
                format: "None",
                sortable: false,
                isSorted: false,
                isLink: true,
                sortDirection: "desc",
                groupable: false,
                cellTemp: "keyword-competitors-affinity-cell",
                headTemp: "",
                totalCount: false,
                tooltip: false,
                minWidth: "",
            },
        ];
    }
}

SearchCompetitorsPaidWidget.register();
