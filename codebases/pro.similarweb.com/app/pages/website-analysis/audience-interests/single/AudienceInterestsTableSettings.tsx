import { default as React } from "react";
import { i18nFilter } from "../../../../filters/ngFilters";
import { DefaultCellHeader, HeaderCellBlank } from "../../../../components/React/Table/headerCells";
import {
    AdsenseCell,
    IndexCell,
    PercentageCell,
    RankCell,
    ReferringCategoryCell,
    ScoreBarCell,
    WebsiteTooltipTopCell,
} from "../../../../components/React/Table/cells";
import { RowSelectionConsumer } from "../../../../components/React/Table/cells/RowSelection";
import { SelectAllRowsHeaderCellConsumer } from "../../../../components/React/Table/headerCells/SelectAllRowsHeaderCell";

const DEFAULT_SORT_FIELD = "RelevancyScore";
const DEFAULT_SORT_DIRECTION = "desc";
const i18n = i18nFilter();
export const AudienceInterestsTableSettings = {
    defaultSortField: DEFAULT_SORT_FIELD,
    defaultSortDirection: DEFAULT_SORT_DIRECTION,
    searchFieldName: "domain",
    getColumns: (
        sortedColumn = { field: DEFAULT_SORT_FIELD, sortDirection: DEFAULT_SORT_DIRECTION },
        isDaily = false,
        useSelection?,
    ) => {
        const columns: any = [
            {
                fixed: true,
                cellComponent: RowSelectionConsumer,
                sortable: false,
                headerComponent: SelectAllRowsHeaderCellConsumer,
                isResizable: false,
                width: 40,
                visible: useSelection,
                disableHeaderCellHover: true,
            },
            {
                fixed: true,
                cellComponent: IndexCell,
                headerComponent: HeaderCellBlank,
                disableHeaderCellHover: true,
                sortable: false,
                isResizable: false,
                width: 40,
            },
            {
                minWidth: 275,
                sortable: true,
                field: "Domain",
                showTotalCount: true,
                displayName: i18n("analysis.source.referrals.table.columns.domain.title"),
                tooltip: i18n("analysis.source.referrals.table.columns.domain.title.tooltip"),
                isResizable: true,
                cellComponent: WebsiteTooltipTopCell,
            },
            {
                minWidth: 281,
                isResizable: true,
                sortable: true,
                field: "Category",
                displayName: i18n("analysis.source.referrals.table.columns.category.title"),
                tooltip: i18n("analysis.source.referrals.table.columns.category.title.tooltip"),
                cellComponent: ReferringCategoryCell,
            },
            {
                minWidth: 112,
                isResizable: true,
                sortable: true,
                field: "Rank",
                displayName: i18n("analysis.source.referrals.table.columns.rank.title"),
                tooltip: i18n("analysis.source.referrals.table.columns.rank.title.tooltip"),
                cellComponent: RankCell,
            },
            {
                field: "RelevancyScore",
                displayName: i18n(
                    "analysis.audience.interests.organic.table.columns.relevancyScore.title",
                ),
                tooltip: i18n(
                    "analysis.audience.interests.organic.table.columns.relevancyScore.title.tooltip",
                ),
                cellComponent: ScoreBarCell,
                sortable: true,
                isResizable: true,
                minWidth: 132,
                width: 132,
            },
            {
                field: "Overlap",
                displayName: i18n("analysis.audience.interests.organic.table.columns.score.title"),
                tooltip: i18n(
                    "analysis.audience.interests.organic.table.columns.score.title.tooltip",
                ),
                cellComponent: PercentageCell,
                sortable: true,
                isResizable: true,
                minWidth: 96,
            },
            {
                field: "HasAdsense",
                displayName: i18n("analysis.all.table.columns.googleAds.title"),
                tooltip: i18n("analysis.all.table.columns.googleAds.title.tooltip"),
                cellComponent: AdsenseCell,
                sortable: true,
                width: 77,
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
