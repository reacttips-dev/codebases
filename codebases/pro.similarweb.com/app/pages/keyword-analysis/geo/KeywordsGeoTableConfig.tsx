import {
    DefaultCellRightAlign,
    IndexCell,
    OrganicPaid,
    TrafficScore,
    WebsiteTooltipTopCell,
} from "components/React/Table/cells";
import { DefaultCellHeader, DefaultCellHeaderRightAlign } from "components/React/Table/headerCells";
import { i18nFilter } from "filters/ngFilters";
import * as React from "react";
import { KeywordsGeoCountryCell } from "./Components/KeywordsGeoCountryCell";
import { KeywordsGeoCpcCell } from "./Components/KeywordsGeoCpcCell";
import { KeywordsGeoTrendCellWithTooltip } from "./Components/KeywordsGeoTrendCellWithTooltip";

function getLeaderColumnHeader(category: string) {
    if (category === "paid") {
        return i18nFilter()("keywordAnalysis.geo.table.column.leadingDomain.paid");
    } else if (category === "organic") {
        return i18nFilter()("keywordAnalysis.geo.table.column.leadingDomain.organic");
    } else {
        return i18nFilter()("keywordAnalysis.geo.table.column.leadingDomain");
    }
}

export const getTableConfig = (category: string) => {
    const tableColumns: any[] = [
        {
            fixed: true,
            cellComponent: IndexCell,
            disableHeaderCellHover: true,
            sortable: false,
            visible: true,
            width: 32,
        },
        {
            field: "Country",
            displayName: i18nFilter()("keywordAnalysis.geo.table.column.country"),
            type: "string",
            format: "None",
            sortable: true,
            isSorted: false,
            cellComponent: KeywordsGeoCountryCell,
            headerComponent: DefaultCellHeader,
            sortDirection: "asc",
            tooltip: i18nFilter()("keywordAnalysis.geo.table.tooltip.country"),
            visible: true,
            minWidth: 160,
            maxWidth: 240,
            ppt: {
                // override the table column format when rendered in ppt
                overrideFormat: "Country",
            },
        },
        {
            field: "TrafficScore",
            sortable: true,
            isResizable: true,
            displayName: i18nFilter()("keywordAnalysis.geo.table.column.trafficScore"),
            tooltip: i18nFilter()("keywordAnalysis.geo.table.tooltip.trafficScore"),
            cellComponent: TrafficScore,
            sortDirection: "desc",
            isSorted: true,
            visible: true,
            minWidth: 120,
            maxWidth: 160,
        },
        {
            field: "TrafficTrend",
            displayName: i18nFilter()("keywordAnalysis.geo.table.column.trafficTrend"),
            tooltip: i18nFilter()("keywordAnalysis.geo.table.tooltip.trafficTrend"),
            cellComponent: KeywordsGeoTrendCellWithTooltip,
            headerComponent: DefaultCellHeader,
            sortDirection: "desc",
            sortable: false,
            visible: true,
            isSorted: false,
            minWidth: 120,
            maxWidth: 160,
        },
        {
            field: "Volume",
            sortable: true,
            displayName: i18nFilter()("keywordAnalysis.geo.table.column.volume"),
            tooltip: i18nFilter()("keywordAnalysis.geo.table.tooltip.volume"),
            cellComponent: DefaultCellRightAlign,
            headerComponent: DefaultCellHeaderRightAlign,
            format: "abbrNumber",
            width: 95,
            isSorted: false,
            visible: true,
            sortDirection: "asc",
        },
        {
            field: "Organic",
            trackingName: "OrganicPaid",
            displayName: i18nFilter()("keywordAnalysis.geo.table.column.OrganicVsPaid"),
            tooltip: i18nFilter()("keywordAnalysis.geo.table.tooltip.OrganicVsPaid"),
            cellComponent: OrganicPaid,
            visible: true,
            minWidth: 120,
            maxWidth: 160,
        },
        {
            field: "MaxCpc",
            trackingName: "CPC",
            displayName: i18nFilter()("keywordAnalysis.geo.table.column.cpc"),
            tooltip: i18nFilter()("keywordAnalysis.geo.table.tooltip.cpc"),
            headerComponent: DefaultCellHeaderRightAlign,
            cellComponent: KeywordsGeoCpcCell,
            format: "CPC",
            sortable: true,
            isSorted: false,
            sortDirection: "asc",
            width: 80,
            visible: true,
        },
        {
            field: "Leader",
            displayName: getLeaderColumnHeader(category),
            tooltip: i18nFilter()("keywordAnalysis.geo.table.tooltip.leadingDomain"),
            cellComponent: WebsiteTooltipTopCell,
            headerComponent: DefaultCellHeader,
            sortable: true,
            sortDirection: "asc",
            isSorted: false,
            visible: true,
            minWidth: 240,
        },
    ];
    return tableColumns;
};

export interface ISource {
    id: string;
    text: string;
    tooltip?: string;
    key?: string;
    name?: string;
}

export const organicPaidSources: ISource[] = [
    {
        id: "both",
        name: "Organic and Paid",
        key: "both",
        text: "keywordAnalysis.geo.table.filters.organicpaid",
    },
    {
        id: "organic",
        name: "Organic Search",
        key: "organic",
        text: "keywordAnalysis.geo.table.filters.organic",
    },
    {
        id: "paid",
        name: "Paid Search",
        key: "paid",
        text: "keywordAnalysis.geo.table.filters.paid",
    },
];
