import { IconButton } from "@similarweb/ui-components/dist/button";
import { default as React } from "react";
import {
    AdsenseCell,
    ChangePercentage,
    IndexCell,
    RankCell,
    ReferringCategoryCell,
    TrafficShareWithVisits,
    WebsiteTooltipTopCell,
} from "../../../../components/React/Table/cells";
import { RowSelectionConsumer } from "components/React/Table/cells/RowSelection";
import { DefaultCellHeader, HeaderCellBlank } from "../../../../components/React/Table/headerCells";
import { SelectAllRowsHeaderCellConsumer } from "components/React/Table/headerCells/SelectAllRowsHeaderCell";
import { i18nFilter } from "filters/ngFilters";
import { RelevancySingleCell } from "pages/website-analysis/incoming-traffic/single/components/RelevancySingleCell";

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
        useSelection,
        durationTooltipParams,
        webSource,
        showEngagementScore,
    ) => {
        let columns: any = [
            {
                fixed: true,
                cellComponent: ({ row }) => {
                    return (
                        <>
                            {!row.parent && (
                                <IconButton iconName="chev-down" type="flat" className="enrich" />
                            )}
                        </>
                    );
                },
                sortable: false,
                headerComponent: HeaderCellBlank,
                isResizable: false,
                width: 40,
                columnClass: "collapseControlColumn", // optional
                cellClass: "collapseControlCell", // optional
                disableHeaderCellHover: true,
            },
            {
                fixed: true,
                cellComponent: RowSelectionConsumer,
                sortable: false,
                headerComponent: SelectAllRowsHeaderCellConsumer,
                isResizable: false,
                width: 40,
                visible: useSelection,
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
                minWidth: 244,
                isResizable: true,
                sortable: true,
                field: "Domain",
                showTotalCount: true,
                displayName: i18n("analysis.source.referrals.table.columns.domain.title"),
                tooltip: i18n("analysis.source.referrals.table.columns.domain.title.tooltip"),
                cellComponent: WebsiteTooltipTopCell,
            },
            {
                minWidth: 280,
                isResizable: true,
                sortable: true,
                field: "Category",
                displayName: i18n("analysis.source.referrals.table.columns.category.title"),
                tooltip: i18n("analysis.source.referrals.table.columns.category.title.tooltip"),
                cellComponent: ReferringCategoryCell,
            },
            {
                minWidth: 104,
                isResizable: true,
                sortable: true,
                field: "Rank",
                displayName: i18n("analysis.source.referrals.table.columns.rank.title"),
                tooltip: i18n("analysis.source.referrals.table.columns.rank.title.tooltip"),
                cellComponent: RankCell,
            },
            {
                minWidth: 138,
                isResizable: true,
                sortable: true,
                field: "Share",
                displayName: i18n("analysis.source.referrals.table.columns.share.title"),
                tooltip: i18n("analysis.source.referrals.table.columns.share.title.tooltip"),
                cellComponent: (props) => (
                    <TrafficShareWithVisits {...props} applyAbbrNumberFilter={true} />
                ),
            },
            {
                minWidth: 108,
                isResizable: true,
                sortable: true,
                field: "Change",
                displayName: i18n("analysis.source.search.all.table.columns.change.title"),
                tooltip: i18n(
                    "analysis.source.search.all.table.columns.change.title.tooltip",
                    durationTooltipParams,
                ),
                cellComponent: ChangePercentage,
                visible: !isDaily,
            },
            {
                width: 77,
                sortable: true,
                field: "HasAdsense",
                displayName: i18n("analysis.all.table.columns.googleads.title"),
                tooltip: i18n("analysis.all.table.columns.googleads.title.tooltip"),
                cellComponent: AdsenseCell,
            },
        ];
        if (webSource !== "MobileWeb" && !isDaily) {
            const lastCol = columns.pop();
            columns = [
                ...columns,
                {
                    minWidth: 174,
                    isResizable: true,
                    sortable: true,
                    visible: showEngagementScore,
                    field: "EngagementScore",
                    displayName: i18n(
                        "analysis.source.search.all.table.columns.engagement-score.title",
                    ),
                    tooltip: i18n(
                        "analysis.source.search.all.table.columns.engagement-score.tooltip",
                    ),
                    headerComponent: (props) => <DefaultCellHeader {...props} isBeta={true} />,
                    cellComponent: RelevancySingleCell,
                },
                lastCol,
            ];
        }
        return columns.map((col: any) => {
            const isSorted = sortedColumn && col.field === sortedColumn.field;
            return {
                ...col,
                visible: col.visible !== false,
                headerComponent: col.headerComponent || DefaultCellHeader,
                isSorted,
                sortDirection: isSorted ? sortedColumn.sortDirection : DEFAULT_SORT_DIRECTION,
            };
        });
    },
};
