import {
    AdsenseCell,
    BounceRate,
    ChangePercentage,
    DefaultCellRightAlign,
    IndexCell,
    PagesPerVisit,
    PercentageBarCellRoundedRight,
    RankCell,
    TimeCell,
    TrafficShare,
    WebsiteTooltipTopCell,
} from "components/React/Table/cells";
import { RowSelectionConsumer } from "components/React/Table/cells/RowSelection";
import { DefaultCellHeaderRightAlign } from "components/React/Table/headerCells";
import { default as React } from "react";
import { i18nFilter } from "filters/ngFilters";

const DEFAULT_SORT_FIELD = "TotalShare";
const DEFAULT_SORT_DIRECTION = "desc";

export const DesktopMobileShare = "DesktopMobileShare";

export const getBonusCountryColumns = (
    excludeFields = [],
    sortedColumn = { field: DEFAULT_SORT_FIELD, sortDirection: DEFAULT_SORT_DIRECTION },
) => {
    const i18n = i18nFilter();
    const columns = [
        {
            fixed: true,
            cellComponent: IndexCell,
            sortable: false,
            width: 45,
            dashboardHide: "true",
            disableHeaderCellHover: true,
        },
        {
            field: "Domain",
            width: 185,
            sortable: true,
            showTotalCount: true,
            displayName: i18n("analysis.source.referrals.table.columns.domain.title"),
            tooltip: "widget.table.tooltip.topsites.domain",
            isResizable: true,
            cellComponent: WebsiteTooltipTopCell,
            fixed: true,
        },
        {
            field: "Share",
            displayName: i18n("Traffic Share"),
            sortable: true,
            groupable: false,
            cellComponent: TrafficShare,
            tooltip: "widget.table.tooltip.topsites.share",
            minWidth: 150,
        },
        {
            field: "Rank",
            displayName: i18n("common.tables.columns.rank.title"),
            sortable: true,
            groupable: false,
            cellComponent: RankCell,
            headerComponent: DefaultCellHeaderRightAlign,
            tooltip: "widget.table.tooltip.topsites.rank",
            minWidth: 80,
            inverted: true,
        },
    ]
        .filter((column) => !excludeFields.includes(column.field))
        .map((col) => {
            const isSorted = sortedColumn && col.field === sortedColumn.field;
            return {
                ...col,
                visible: true,
                isSorted: true,
                sortDirection: isSorted ? sortedColumn.sortDirection : DEFAULT_SORT_DIRECTION,
            };
        });
    return columns;
};

export const getColumns = (
    excludeFields = [],
    sortedColumn = { field: DEFAULT_SORT_FIELD, sortDirection: DEFAULT_SORT_DIRECTION },
) => {
    const i18n = i18nFilter();
    const columns = [
        {
            fixed: true,
            cellComponent: RowSelectionConsumer,
            sortable: false,
            width: 33,
            dashboardHide: true,
            disableHeaderCellHover: true,
        },
        {
            fixed: true,
            cellComponent: IndexCell,
            sortable: false,
            width: 45,
            dashboardHide: "true",
            disableHeaderCellHover: true,
        },
        {
            field: "Domain",
            width: 185,
            sortable: true,
            showTotalCount: true,
            displayName: i18n("analysis.source.referrals.table.columns.domain.title"),
            tooltip: "widget.table.tooltip.topsites.domain",
            isResizable: true,
            cellComponent: WebsiteTooltipTopCell,
            fixed: true,
        },
        {
            field: "Share",
            displayName: i18n("Traffic Share"),
            sortable: true,
            groupable: false,
            cellComponent: TrafficShare,
            tooltip: "widget.table.tooltip.topsites.share",
            minWidth: 150,
        },
        {
            field: "Change",
            displayName: i18n("analysis.source.search.all.table.columns.change.title"),
            sortable: true,
            groupable: false,
            cellComponent: ChangePercentage,
            tooltip: "widget.table.tooltip.topsites.change",
            width: 95,
        },
        {
            field: "Rank",
            displayName: i18n("common.tables.columns.rank.title"),
            sortable: true,
            groupable: false,
            cellComponent: RankCell,
            headerComponent: DefaultCellHeaderRightAlign,
            tooltip: "widget.table.tooltip.topsites.rank",
            minWidth: 80,
            inverted: true,
        },
        {
            field: "AvgMonthVisits",
            displayName: i18n("common.tables.columns.monthly.visits.title"),
            format: "minVisitsAbbr",
            sortable: true,
            groupable: false,
            cellComponent: DefaultCellRightAlign,
            headerComponent: DefaultCellHeaderRightAlign,
            tooltip: "widget.table.tooltip.monthlyvisits",
            width: 125,
        },
        {
            field: "UniqueUsers",
            displayName: i18n("common.tables.columns.unique.visits.title"),
            format: "minVisitsAbbr",
            sortable: true,
            groupable: false,
            cellComponent: DefaultCellRightAlign,
            headerComponent: DefaultCellHeaderRightAlign,
            tooltip: "metric.uniquevisitors.tab.tooltip",
            width: 130,
        },
        {
            field: DesktopMobileShare,
            displayName: i18n("common.tables.columns.desktop.mobile.share.title"),
            sortable: "False",
            groupable: false,
            cellComponent: PercentageBarCellRoundedRight,
            headerComponent: DefaultCellHeaderRightAlign,
            tooltip: "wa.ao.desktopvsmobile.tooltip",
            minWidth: 190,
        },
        {
            field: "AvgVisitDuration",
            displayName: i18n("common.tables.columns.visit.duration.title"),
            sortable: true,
            groupable: false,
            cellComponent: TimeCell,
            headerComponent: DefaultCellHeaderRightAlign,
            tooltip: "widget.table.tooltip.topsites.avgvisitduration",
            width: 115,
        },
        {
            field: "PagesPerVisit",
            displayName: i18n("common.tables.columns.page.per.visit.title"),
            sortable: true,
            groupable: false,
            cellComponent: PagesPerVisit,
            headerComponent: DefaultCellHeaderRightAlign,
            tooltip: "widget.table.tooltip.topsites.ppv",
            width: 110,
        },
        {
            field: "BounceRate",
            displayName: i18n("common.tables.columns.bounce.rate.title"),
            sortable: true,
            groupable: false,
            cellComponent: BounceRate,
            headerComponent: DefaultCellHeaderRightAlign,
            tooltip: "widget.table.tooltip.topsites.bouncerate",
            width: 110,
            inverted: true,
        },
        {
            field: "HasAdsense",
            displayName: i18n("common.tables.columns.adsense.title"),
            sortable: true,
            groupable: false,
            cellComponent: AdsenseCell,
            width: 95,
        },
    ]
        .filter((column) => !excludeFields.includes(column.field))
        .map((col) => {
            const isSorted = sortedColumn && col.field === sortedColumn.field;
            return {
                ...col,
                visible: true,
                isSorted: true,
                sortDirection: isSorted ? sortedColumn.sortDirection : DEFAULT_SORT_DIRECTION,
            };
        });
    return columns;
};
