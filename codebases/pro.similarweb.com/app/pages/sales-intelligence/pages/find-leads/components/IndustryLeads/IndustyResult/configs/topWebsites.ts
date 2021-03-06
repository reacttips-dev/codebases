import {
    DefaultCellRightAlign,
    IndustryTrafficSource,
    TrafficShare,
} from "components/React/Table/cells";
import { PercentageBarCellRounded } from "components/React/Table/cells/PercentageBarCellRounded";
import { DefaultCellHeaderRightAlign } from "components/React/Table/headerCells/DefaultCellHeaderRightAlign";
import { i18nFilter } from "filters/ngFilters";
import { ChangePercentage } from "components/React/Table/cells/ChangePercentage";
import { AdsenseCell } from "components/React/Table/cells/AdsenseCell";
import { RankCell } from "components/React/Table/cells/RankCell";
import selectionColumn from "./selectionColumn";
import { TableMetaDataConfig } from "../types";

const i18n = i18nFilter();
// Attention, necessary fields are:
// cellComponent, visible, sortable, field and sortDirection
export const topSites = [
    selectionColumn,
    {
        visible: true,
        name: "Domain",
        title: "Domain",
        field: "Domain",
        type: "string",
        fixed: true,
        cellComponent: IndustryTrafficSource,
        displayName: i18n("Websites"),
        format: "None",
        sortable: true,
        isSorted: false,
        sortDirection: "desc",
        groupable: false,
        cellTemp: "website-tooltip-top",
        headTemp: "",
        totalCount: true,
        tooltip: "widget.table.tooltip.topsites.domain",
        width: 185,
        showTotalCount: true,
    },
    {
        visible: true,
        title: "Traffic Share",
        name: "Share",
        field: "Share",
        displayName: i18n("Traffic Share"),
        type: "string",
        format: "percentagesign",
        sortable: true,
        isSorted: true,
        sortDirection: "desc",
        groupable: false,
        cellTemp: "traffic-share",
        cellComponent: TrafficShare,
        headTemp: "",
        totalCount: false,
        tooltip: "widget.table.tooltip.topsites.share",
        minWidth: 150,
    },
    {
        visible: true,
        name: "Change",
        title: "Change",
        field: "Change",
        displayName: i18n("Change"),
        type: "double",
        format: "number",
        sortable: true,
        isSorted: false,
        sortDirection: "desc",
        groupable: false,
        cellTemp: "change-percentage",
        headerComponent: DefaultCellHeaderRightAlign,
        cellComponent: ChangePercentage,
        totalCount: false,
        tooltip: "widget.table.tooltip.topsites.change",
        width: 110,
    },
    {
        visible: true,
        name: "Rank",
        title: "Rank",
        field: "Rank",
        displayName: i18n("Rank"),
        format: "rank",
        sortable: true,
        isSorted: false,
        sortDirection: "desc",
        groupable: false,
        cellComponent: RankCell,
        headerComponent: DefaultCellHeaderRightAlign,
        totalCount: false,
        tooltip: "widget.table.tooltip.topsites.rank",
        minWidth: 85,
    },
    {
        visible: true,
        name: "AvgMonthVisits",
        field: "AvgMonthVisits",
        title: "Monthly Visits",
        displayName: i18n("Monthly Visits"),
        type: "double",
        format: "minVisitsAbbr",
        sortable: true,
        isSorted: false,
        sortDirection: "desc",
        groupable: false,
        cellComponent: DefaultCellRightAlign,
        headerComponent: DefaultCellHeaderRightAlign,
        totalCount: false,
        tooltip: "widget.table.tooltip.monthlyvisits",
        width: 130,
    },
    {
        visible: true,
        name: "UniqueUsers",
        field: "UniqueUsers",
        displayName: i18n("Unique Visitors"),
        title: "Unique Visitors",
        type: "double",
        format: "minVisitsAbbr",
        sortable: true,
        isSorted: false,
        sortDirection: "desc",
        groupable: false,
        cellComponent: DefaultCellRightAlign,
        headerComponent: DefaultCellHeaderRightAlign,
        totalCount: false,
        tooltip: "metric.uniquevisitors.tab.tooltip",
        width: 130,
    },
    {
        visible: true,
        name: "DesktopMobileShare",
        field: "DesktopMobileShare",
        title: "Desktop vs Mobile",
        displayName: "Desktop vs Mobile",
        type: "double",
        format: "abbrNumber",
        sortable: "False",
        isSorted: "False",
        cellComponent: PercentageBarCellRounded,
        cellTemplate: "percentage-bar-cell-rounded",
        sortDirection: "desc",
        groupable: "False",
        cellTemp: "percentage-bar-cell-rounded",
        headTemp: "",
        totalCount: "False",
        tooltip: "wa.ao.desktopvsmobile.tooltip",
        minWidth: 190,
        webSources: ["Total"],
    },
    {
        visible: true,
        name: "AvgVisitDuration",
        field: "AvgVisitDuration",
        title: "Visit Duration",
        displayName: i18n("Visit Duration"),
        type: "double",
        format: "time",
        sortable: true,
        isSorted: false,
        sortDirection: "desc",
        groupable: false,
        cellTemp: "time-cell",
        headerComponent: DefaultCellHeaderRightAlign,
        totalCount: false,
        tooltip: "widget.table.tooltip.topsites.avgvisitduration",
        width: 130,
    },
    {
        visible: true,
        name: "PagesPerVisit",
        field: "PagesPerVisit",
        displayName: i18n("Pages/Visit"),
        title: "Pages/Visit",
        type: "double",
        format: "number",
        sortable: true,
        isSorted: false,
        sortDirection: "desc",
        groupable: false,
        cellTemp: "pages-per-visit",
        headerComponent: DefaultCellHeaderRightAlign,
        totalCount: false,
        tooltip: "widget.table.tooltip.topsites.ppv",
        width: 110,
    },
    {
        visible: true,
        name: "BounceRate",
        field: "BounceRate",
        title: "Bounce Rate",
        displayName: i18n("Bounce Rate"),
        type: "double",
        format: "percentagesign",
        sortable: true,
        isSorted: false,
        sortDirection: "asc",
        groupable: false,
        cellTemp: "bounce-rate",
        headerComponent: DefaultCellHeaderRightAlign,
        totalCount: false,
        tooltip: "widget.table.tooltip.topsites.bouncerate",
        width: 125,
        inverted: true,
    },
    {
        visible: true,
        name: "HasAdsense",
        field: "HasAdsense",
        title: "Adsense",
        displayName: i18n("Adsense"),
        cellComponent: AdsenseCell,
        type: "bool",
        format: "None",
        sortable: true,
        isSorted: false,
        sortDirection: "desc",
        groupable: false,
        cellTemp: "adsense-cell",
        headTemp: "",
        totalCount: false,
        width: 95,
    },
];

export const topSitesTableMetaData: TableMetaDataConfig = {
    tableApi: `/widgetApi/TopSitesExtended/TopSitesExtended/Table`,
    excelApi: `/widgetApi/TopSitesExtended/TopSitesExtended/Excel`,
    i18nPrefix: `analysis.competitors.search.organic.table`,
    metric: `KeywordCompetitorsOrganicTable`,
    tableSelectionTracking: `Outbound Traffic`,
    tableSelectionKey: "KeywordCompetitorsOrganicTable",
    a2dMetric: `TopOrganicSearchCompetitors`,
    searchTypeFilterPlaceholder: "analysis.competitors.search.organic.table.filters.searchtype",
    searchTypeParam: "",
    searchTypes: [],
    title: "",
};

export const topWebsitesFilters = {
    showWebsiteFilter: true,
};
