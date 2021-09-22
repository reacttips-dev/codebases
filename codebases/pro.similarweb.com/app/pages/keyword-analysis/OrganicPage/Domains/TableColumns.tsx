import {
    AdsenseCell,
    ChangePercentage,
    IndexCell,
    KeywordAnalysisPosition,
    KeywordAnalysisTrafficSource,
    KeywordAnalysisUrl,
    TrafficShare,
} from "components/React/Table/cells";
import { RowSelectionConsumer } from "components/React/Table/cells/RowSelection";
import {
    DefaultCellHeader,
    DefaultCellHeaderRightAlign,
    HeaderCellBlank,
} from "components/React/Table/headerCells";
import { i18nCategoryFilter, i18nFilter } from "filters/ngFilters";
import React from "react";

const i18n = i18nFilter();

const DEFAULT_SORT_FIELD = "TotalShare";
const DEFAULT_SORT_DIRECTION = "desc";

const tooltips = {
    domain: {
        organic: {
            single: "widget.table.tooltip.keywordanalysisorganic.domain",
            group: "widget.table.tooltip.keywordanalysisorganic.domain.keywordgroup",
        },
        paid: {
            single: "widget.table.tooltip.keywordanalysispaid.domain",
            group: "widget.table.tooltip.keywordanalysispaid.domain.keywordgroup",
        },
        mobile: {
            single: "KeywordAnalysis.mobile.table.domains.Domain",
            group: "KeywordAnalysis.mobile.table.domains.Domain.keywordgroup",
        },
    },
    share: {
        organic: {
            single: "widget.table.tooltip.keywordanalysisorganic.share",
            group: "widget.table.tooltip.keywordanalysisorganic.share.keywordgroup",
        },
        paid: {
            single: "widget.table.tooltip.keywordanalysispaid.share",
            group: "widget.table.tooltip.keywordanalysispaid.share.keywordgroup",
        },
        mobile: {
            single: "KeywordAnalysis.mobile.table.domains.Share",
            group: "KeywordAnalysis.mobile.table.domains.Share.keywordgroup",
        },
    },
    change: {
        organic: {
            single: "widget.table.tooltip.keywordanalysisorganic.change",
            group: "widget.table.tooltip.keywordanalysisorganic.change.keywordgroup",
        },
        paid: {
            single: "widget.table.tooltip.keywordanalysispaid.change",
            group: "widget.table.tooltip.keywordanalysispaid.change.keywordgroup",
        },
        mobile: {
            single: "KeywordAnalysis.mobile.table.domains.Change",
            group: "KeywordAnalysis.mobile.table.domains.Change.keywordgroup",
        },
    },
    position: {
        organic: {
            single: "widget.table.tooltip.keywordanalysisorganic.position",
            group: "widget.table.tooltip.keywordanalysisorganic.position.keywordgroup",
        },
        paid: {
            single: "widget.table.tooltip.keywordanalysispaid.position",
            group: "widget.table.tooltip.keywordanalysispaid.position.keywordgroup",
        },
        mobile: {
            single: "KeywordAnalysis.mobile.table.domains.Position",
            group: "KeywordAnalysis.mobile.table.domains.Position.keywordgroup",
        },
    },
    url: {
        organic: {
            single: "widget.table.tooltip.keywordanalysisorganic.url",
            group: "widget.table.tooltip.keywordanalysisorganic.url.keywordgroup",
        },
        paid: {
            single: "widget.table.tooltip.keywordanalysispaid.url",
            group: "widget.table.tooltip.keywordanalysispaid.url.keywordgroup",
        },
        mobile: {
            single: "KeywordAnalysis.mobile.table.domains.Url",
            group: "KeywordAnalysis.mobile.table.domains.Url.keywordgroup",
        },
    },
    category: {
        organic: {
            single: "widget.table.tooltip.keywordanalysisorganic.category",
            group: "widget.table.tooltip.keywordanalysisorganic.category.keywordgroup",
        },
        paid: {
            single: "widget.table.tooltip.keywordanalysispaid.category",
            group: "widget.table.tooltip.keywordanalysispaid.category.keywordgroup",
        },
        mobile: {
            single: "KeywordAnalysis.mobile.table.domains.Category",
            group: "KeywordAnalysis.mobile.table.domains.Category.keywordgroup",
        },
    },
};
const getTooltip = (column) => (type) => (mode) => {
    return tooltips[column][type][mode];
};

export default (
    sortedColumn = { field: DEFAULT_SORT_FIELD, sortDirection: DEFAULT_SORT_DIRECTION },
    type,
    isGroup,
    excludeFields: string[] = [],
) => {
    const mode = isGroup ? "group" : "single";
    return [
        {
            fixed: true,
            cellComponent: RowSelectionConsumer,
            sortable: false,
            isResizable: false,
            width: 33,
            disableHeaderCellHover: true,
        },
        {
            fixed: true,
            cellComponent: IndexCell,
            headerComponent: HeaderCellBlank,
            disableHeaderCellHover: true,
            sortable: false,
            isResizable: false,
            width: 65,
        },
        {
            width: 220,
            sortable: true,
            field: "Domain",
            showTotalCount: true,
            displayName: i18n("analysis.source.referrals.table.columns.domain.title"),
            tooltip: getTooltip("domain")(type)(mode),
            isResizable: true,
            cellComponent: KeywordAnalysisTrafficSource,
        },
        {
            field: "Share",
            displayName: "Traffic Share",
            sortable: true,
            cellComponent: TrafficShare,
            headerComponent: DefaultCellHeader,
            tooltip: getTooltip("share")(type)(mode),
            width: 200,
        },
        {
            field: "Change",
            displayName: i18n("analysis.source.search.all.table.columns.change.title"),
            sortable: true,
            cellComponent: ChangePercentage,
            headerComponent: DefaultCellHeaderRightAlign,
            tooltip: getTooltip("change")(type)(mode),
            width: 110,
        },
        {
            field: "Position",
            displayName: i18n("keyword.analysis.ads.table.columns.position.title"),
            sortable: true,
            cellComponent: KeywordAnalysisPosition,
            headerComponent: DefaultCellHeaderRightAlign,
            tooltip: getTooltip("position")(type)(mode),
            width: 90,
        },
        {
            field: "Url",
            displayName: i18n("keywordanalysis.competitors.table.column.url"),
            sortable: true,
            cellComponent: KeywordAnalysisUrl,
            headerComponent: DefaultCellHeader,
            tooltip: getTooltip("url")(type)(mode),
            width: 275,
        },
        {
            field: "Category",
            displayName: i18n("dropdown.category"),
            sortable: true,
            cellComponent: ({ row, value }) => {
                return i18nCategoryFilter()(value);
            },
            headerComponent: DefaultCellHeader,
            tooltip: getTooltip("category")(type)(mode),
            width: 220,
        },
        {
            field: "Serp",
            displayName: i18n("analysis.source.search.all.table.columns.featured.title"),
            sortable: true,
            cellComponent: AdsenseCell,
            headerComponent: DefaultCellHeader,
            tooltip: i18n("analysis.source.search.all.table.columns.featured.title.tooltip"),
            width: 220,
            hide: type !== "organic",
        },
    ]
        .filter((column) => !column.hide && !excludeFields.includes(column.field))
        .map((col) => {
            const isSorted = sortedColumn && col.field === sortedColumn.field;
            return {
                ...col,
                visible: true,
                isSorted,
                sortDirection: isSorted ? sortedColumn.sortDirection : DEFAULT_SORT_DIRECTION,
            };
        });
};
