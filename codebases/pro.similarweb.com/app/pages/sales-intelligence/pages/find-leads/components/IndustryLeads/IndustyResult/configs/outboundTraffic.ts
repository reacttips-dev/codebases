import { RankCell } from "components/React/Table/cells/RankCell";
import { ChangePercentage } from "components/React/Table/cells/ChangePercentage";
import { CategoryCell } from "components/React/Table/cells/CategoryCell";
import { AdsenseCell } from "components/React/Table/cells/AdsenseCell";
import { i18nFilter } from "filters/ngFilters";
import { TrafficShare, WebsiteTooltipTopCell } from "components/React/Table/cells";
import selectionColumn from "./selectionColumn";
import { TableMetaDataConfig } from "../types";

// Attention, necessary fields are:
// cellComponent, visible, sortable, field and sortDirection
export const outboundTraffic = [
    selectionColumn,
    {
        name: "Domain",
        title: "Domain",
        field: "Domain",
        type: "string",
        format: "None",
        sortDirection: "asc",
        groupable: false,
        isSorted: false,
        visible: true,
        fixed: true,
        displayName: i18nFilter()("Websites"),
        tooltip: i18nFilter()("analysis.dest.out.table.columns.domain.title.tooltip"),
        cellComponent: WebsiteTooltipTopCell,
        sortable: true,
        showTotalCount: true,
        width: 270,
    },
    {
        name: "Category",
        field: "Category",
        title: "Category",
        sortDirection: "asc",
        isSorted: false,
        visible: true,
        displayName: i18nFilter()("analysis.dest.out.table.columns.category.title"),
        tooltip: i18nFilter()("analysis.dest.out.table.columns.category.title.tooltip"),
        cellComponent: CategoryCell,
        sortable: true,
        minWidth: 220,
        ppt: {
            overrideFormat: "Category",
        },
    },
    {
        name: "Rank",
        title: "Rank",
        sortDirection: "desc",
        field: "Rank",
        displayName: i18nFilter()("analysis.dest.out.table.columns.rank.title"),
        tooltip: i18nFilter()("analysis.dest.out.table.columns.rank.title.tooltip"),
        cellComponent: RankCell,
        format: "rank",
        sortable: true,
        width: 120,
        visible: true,
        isSorted: false,
    },
    {
        field: "Share",
        name: "Share",
        title: "Share",
        visible: true,
        displayName: i18nFilter()("analysis.dest.out.table.columns.share.title"),
        tooltip: i18nFilter()("analysis.dest.out.table.columns.share.title.tooltip"),
        cellComponent: TrafficShare,
        sortable: true,
        minWidth: 150,
        isSorted: true,
        sortDirection: "desc",
    },
    {
        name: "Change",
        field: "Change",
        title: "Change",
        sortDirection: "asc",
        sortable: true,
        isSorted: false,
        visible: true,
        displayName: i18nFilter()("analysis.dest.out.table.columns.change.title"),
        tooltip: i18nFilter()("analysis.dest.out.table.columns.change.title.tooltipSimple"),
        cellComponent: ChangePercentage,
        width: 110,
    },
    {
        name: "HasAdsense",
        field: "HasAdsense",
        title: "Has Adsense",
        sortDirection: "asc",
        visible: true,
        sortable: true,
        isSorted: false,
        displayName: i18nFilter()("analysis.all.table.columns.googleAds.title"),
        tooltip: i18nFilter()("analysis.all.table.columns.googleAds.title.tooltip"),
        cellComponent: AdsenseCell,
        width: 95,
    },
];

export const outboundTrafficTableMetaData: TableMetaDataConfig = {
    tableApi: `/widgetApi/IndustryAnalysis/OutgoingReferrals/Table`,
    excelApi: `/widgetApi/IndustryAnalysis/OutgoingReferrals/Excel`,
    i18nPrefix: `analysis.competitors.search.organic.table`,
    metric: `KeywordCompetitorsOrganicTable`,
    tableSelectionTracking: `Outbound Traffic`,
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

export const outboundFilters = {
    showWebsiteFilter: false,
    showCategoryFilter: false,
    showSearchTypeFilter: false,
};
