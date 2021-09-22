import { DashboardTableWidget } from "components/widget/widget-types/DashboardTableWidget";
import {
    parseFilters,
    searchTypeIds,
} from "components/widget/widget-filters/SearchCompetitorsWidgetFilters";
import { Widget } from "./Widget";
import OrganicSearchCompetitorsWidgetFilters from "../widget-filters/OrganicSearchCompetitorsWidgetFilters";

export class SearchCompetitorsOrganicWidget extends DashboardTableWidget {
    constructor() {
        super();
    }

    static getWidgetMetadataType() {
        return "SearchCompetitorsOrganic";
    }

    static getWidgetDashboardType() {
        return "Table";
    }
    static getFiltersComponent() {
        return OrganicSearchCompetitorsWidgetFilters;
    }

    getProUrl() {
        const { filter = "", keys, country, from, to } = this.apiParams;
        const parsedFilters = Widget.filterParse(filter);
        const parsedFilterData = parseFilters(parsedFilters);
        const urlParams = {
            key: keys,
            isWWW: "*",
            country: country,
            duration: this._durationService.getMonthsFromApiDuration(from, to, true),
            websiteType: parsedFilterData?.SiteFunctionality,
            risingCompetitors: parsedFilterData?.isrise,
            newCompetitors: parsedFilterData?.isnew,
            search: parsedFilterData?.domain,
            organicSearchType: searchTypeIds?.find((type) =>
                Object.keys(parsedFilterData).some((key) => key === type),
            ),
        };
        return this._swNavigator.getStateUrl("websites-competitorsOrganicKeywords", urlParams);
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

SearchCompetitorsOrganicWidget.register();
