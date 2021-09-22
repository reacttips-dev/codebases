import { colorsPalettes } from "@similarweb/styles";
import { default as React } from "react";
import { i18nFilter } from "../../../../../filters/ngFilters";
import {
    AdsenseCell,
    ChangePercentage,
    IndexCell,
    RankCell,
    ReferringCategoryCell,
    TrafficShare,
    WebsiteTooltipTopCell,
} from "../../../../../components/React/Table/cells";
import {
    DefaultCellHeader,
    HeaderCellBlank,
} from "../../../../../components/React/Table/headerCells";
import { RowSelectionConsumer } from "../../../../../components/React/Table/cells/RowSelection";
import { TrafficShareWithTooltip } from "../../../../../../.pro-features/components/TrafficShare/src/TrafficShareWithTooltip";

const DEFAULT_SORT_FIELD = "Share";
const DEFAULT_SORT_DIRECTION = "desc";
const i18n = i18nFilter();
export const IncomingTrafficSingleTableSettings = {
    defaultSortField: DEFAULT_SORT_FIELD,
    defaultSortDirection: DEFAULT_SORT_DIRECTION,
    searchFieldName: "domain",
    getColumns: (
        sortedColumn = { field: DEFAULT_SORT_FIELD, sortDirection: DEFAULT_SORT_DIRECTION },
        isDaily = false,
    ) => {
        const columns: any = [
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
                minWidth: 214,
                isResizable: true,
                sortable: true,
                field: "Domain",
                showTotalCount: true,
                displayName: i18n("analysis.source.referrals.table.columns.domain.title"),
                tooltip: i18n("analysis.source.referrals.table.columns.domain.title.tooltip"),
                cellComponent: WebsiteTooltipTopCell,
            },
            {
                minWidth: 244,
                isResizable: true,
                sortable: true,
                field: "Category",
                displayName: i18n("analysis.source.referrals.table.columns.category.title"),
                tooltip: i18n("analysis.source.referrals.table.columns.category.title.tooltip"),
                cellComponent: ReferringCategoryCell,
            },
            {
                minWidth: 100,
                isResizable: true,
                sortable: true,
                field: "Rank",
                displayName: i18n("analysis.source.referrals.table.columns.rank.title"),
                tooltip: i18n("analysis.source.referrals.table.columns.rank.title.tooltip"),
                cellComponent: RankCell,
            },
            {
                minWidth: 120,
                sortable: true,
                isResizable: true,
                field: "Share",
                displayName: i18n("analysis.source.referrals.table.columns.share.title"),
                tooltip: i18n("analysis.source.referrals.table.columns.share.title.tooltip"),
                cellComponent: TrafficShare,
            },
            {
                minWidth: 104,
                isResizable: true,
                sortable: true,
                field: "Change",
                displayName: i18n("analysis.source.search.all.table.columns.change.title"),
                tooltip: i18n("arena.visits.table.tooltip.change"),
                cellComponent: ChangePercentage,
                visible: !isDaily,
            },
            {
                width: 95,
                sortable: true,
                field: "HasAdsense",
                displayName: i18n("analysis.all.table.columns.googleads.title"),
                tooltip: i18n("analysis.all.table.columns.googleads.title.tooltip"),
                cellComponent: AdsenseCell,
            },
        ];
        return columns.map((col: any) => {
            const isSorted = sortedColumn && col.field === sortedColumn.field;
            return {
                ...col,
                visible: col.visible === false ? false : true,
                headerComponent: col.headerComponent || DefaultCellHeader,
                isSorted,
                sortDirection: isSorted ? sortedColumn.sortDirection : DEFAULT_SORT_DIRECTION,
            };
        });
    },
};

export const IncomingTrafficCompareTableSettings = {
    defaultSortField: DEFAULT_SORT_FIELD,
    defaultSortDirection: DEFAULT_SORT_DIRECTION,
    searchFieldName: "domain",
    getColumns: (
        sortedColumn = { field: DEFAULT_SORT_FIELD, sortDirection: DEFAULT_SORT_DIRECTION },
    ) => {
        const columns: any = [
            {
                fixed: true,
                cellComponent: IndexCell,
                headerComponent: HeaderCellBlank,
                sortable: false,
                isResizable: false,
                width: 65,
            },
            {
                width: 250,
                sortable: true,
                field: "Domain",
                showTotalCount: true,
                displayName: i18n("analysis.source.referrals.table.columns.domain.title"),
                tooltip: i18n("analysis.source.referrals.table.columns.domain.title.tooltip"),
                cellComponent: WebsiteTooltipTopCell,
            },
            {
                width: 200,
                sortable: true,
                field: "Category",
                displayName: i18n("analysis.source.referrals.table.columns.category.title"),
                tooltip: i18n("analysis.source.referrals.table.columns.category.title.tooltip"),
                cellComponent: ReferringCategoryCell,
            },
            {
                width: 150,
                sortable: true,
                field: "TotalShare",
                displayName: i18n(
                    "analysis.source.search.all.table.columns.totalShareCompare.title",
                ),
                tooltip: i18n(
                    "analysis.source.search.all.table.columns.totalShareCompare.general.title.tooltip",
                ),
                cellComponent: TrafficShare,
            },
            {
                field: "trafficDistribution",
                displayName: i18n("analysis.source.search.all.table.columns.shareCompare.title"),
                tooltip: i18n(
                    "analysis.source.search.all.table.columns.shareCompare.title.tooltip",
                ),
                cellComponent: ({ value, tooltipTitle }) => {
                    return <TrafficShareWithTooltip data={value} title={tooltipTitle} />;
                },
                tooltipTitle: i18n("incomingtraffic.competitivetrafficshare.tooltip"),
            },
        ];
        return columns.map((col: any) => {
            const isSorted = sortedColumn && col.field === sortedColumn.field;
            return {
                ...col,
                visible: true,
                headerComponent: col.headerComponent || DefaultCellHeader,
                isSorted,
                sortDirection: isSorted ? sortedColumn.sortDirection : DEFAULT_SORT_DIRECTION,
            };
        });
    },
};
