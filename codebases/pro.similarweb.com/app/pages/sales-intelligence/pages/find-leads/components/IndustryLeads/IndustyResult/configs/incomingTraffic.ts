import { RankCell } from "components/React/Table/cells/RankCell";
import { DefaultCellHeaderRightAlign } from "components/React/Table/headerCells/DefaultCellHeaderRightAlign";
import { IndustryTrafficSource } from "components/React/Table/cells/IndustryTrafficSource";
import { DefaultCell } from "components/React/Table/cells/DefaultCell";
import { ChangePercentage } from "components/React/Table/cells/ChangePercentage";
import { CategoryCell } from "components/React/Table/cells/CategoryCell";
import { AdsenseCell } from "components/React/Table/cells/AdsenseCell";
import { i18nFilter } from "filters/ngFilters";
import { TrafficShare } from "components/React/Table/cells";
import selectionColumn from "./selectionColumn";
import { TableMetaDataConfig } from "../types";

const i18n = i18nFilter();
// Attention, necessary fields are:
// cellComponent, visible, sortable, field and sortDirection
export const incomingTraffic = [
    selectionColumn,
    {
        name: "Domain",
        title: "Domain",
        field: "Domain",
        type: "string",
        format: "None",
        groupable: false,
        fixed: true,
        visible: true,
        cellComponent: IndustryTrafficSource,
        displayName: i18n("Websites"),
        tooltip: i18n("widget.table.tooltip.trafficsourcesoverviewdatakpiwidget.domain"),
        sortable: true,
        isSorted: false,
        sortDirection: "asc",
        showTotalCount: true,
        totalCount: true,
        width: 220,
    },
    {
        name: "SourceType",
        field: "SourceType",
        title: "Source Type",
        visible: true,
        cellComponent: DefaultCell,
        displayName: i18n("widget.table.trafficsourcesoverviewdatakpiwidget.columns.sourcetype"),
        tooltip: i18n("widget.table.tooltip.trafficsourcesoverviewdatakpiwidget.sourcetype"),
        sortable: true,
        isSorted: false,
        sortDirection: "asc",
        width: 160,
    },
    {
        name: "Rank",
        field: "Rank",
        title: "Rank",
        visible: true,
        cellComponent: RankCell,
        headerComponent: DefaultCellHeaderRightAlign,
        displayName: i18n("widget.table.trafficsourcesoverviewdatakpiwidget.columns.globalrank"),
        tooltip: i18n("widget.table.tooltip.trafficsourcesoverviewdatakpiwidget.rank"),
        sortable: true,
        isSorted: false,
        sortDirection: "desc",
        width: 140,
    },
    {
        name: "TotalShare",
        field: "TotalShare",
        title: "Total Share",
        visible: true,
        cellComponent: TrafficShare,
        headerComponent: DefaultCellHeaderRightAlign,
        displayName: i18n("widget.table.trafficsourcesoverviewdatakpiwidget.columns.trafficshare"),
        tooltip: i18n("widget.table.tooltip.trafficsourcesoverviewdatakpiwidget.totalshare"),
        sortable: true,
        isSorted: true,
        sortDirection: "desc",
        width: 170,
    },
    {
        name: "Change",
        field: "Change",
        title: "Change",
        sortable: true,
        isSorted: false,
        sortDirection: "asc",
        visible: true,
        cellComponent: ChangePercentage,
        headerComponent: DefaultCellHeaderRightAlign,
        displayName: i18n("widget.table.trafficsourcesoverviewdatakpiwidget.columns.change"),
        tooltip: i18n("widget.table.tooltip.trafficsourcesoverviewdatakpiwidget.change"),
        width: 110,
    },
    {
        name: "Category",
        field: "Category",
        title: "Category",
        sortable: true,
        isSorted: false,
        sortDirection: "asc",
        visible: true,
        cellComponent: CategoryCell,
        headerComponent: DefaultCellHeaderRightAlign,
        displayName: i18n("widget.table.trafficsourcesoverviewdatakpiwidget.columns.category"),
        tooltip: i18n("widget.table.tooltip.trafficsourcesoverviewdatakpiwidget.category"),
        width: 220,
        ppt: {
            overrideFormat: "Category",
        },
    },
    {
        name: "HasAdsense",
        field: "HasAdsense",
        title: "Has Adsense",
        visible: true,
        sortable: true,
        isSorted: false,
        sortDirection: "asc",
        cellComponent: AdsenseCell,
        headerComponent: DefaultCellHeaderRightAlign,
        displayName: i18n("widget.table.trafficsourcesoverviewdatakpiwidget.columns.adsense"),
        tooltip: i18n("widget.table.tooltip.trafficsourcesoverviewdatakpiwidget.hasadsense"),
        width: 95,
    },
];

export const incomingTrafficTableMetaData: TableMetaDataConfig = {
    tableApi: `/widgetApi/IndustryAnalysis/TrafficSourcesOverviewData/Table`,
    excelApi: `/widgetApi/IndustryAnalysis/TrafficSourcesOverviewData/Excel`,
    i18nPrefix: `analysis.competitors.search.organic.table`,
    metric: `KeywordCompetitorsOrganicTable`,
    tableSelectionTracking: `Keyword Competitors Organic`,
    tableSelectionKey: "KeywordCompetitorsOrganicTable",
    a2dMetric: `TopOrganicSearchCompetitors`,
    searchTypeFilterPlaceholder: "analysis.competitors.search.organic.table.filters.searchtype",
    searchTypeParam: "",
    searchTypes: [
        {
            id: null,
            text: "analysis.competitors.search.organic.table.searchtype.all",
            tooltipText: "analysis.competitors.search.organic.table.searchtype.all.tooltip",
        },
        {
            id: "IsRelatedQuestions",
            text: "analysis.competitors.search.organic.table.searchtype.questions",
            tooltipText: "analysis.competitors.search.organic.table.searchtype.questions.tooltip",
        },
        {
            id: "IsNews",
            text: "analysis.competitors.search.organic.table.searchtype.news",
            tooltipText: "analysis.competitors.search.organic.table.searchtype.news.tooltip",
        },
    ],
    title: "",
};

export const incomingFilters = {
    showWebsiteFilter: false,
    showCategoryFilter: true,
    showSearchTypeFilter: false,
    showSearchSelectFilter: true,
};
