import { IconButton } from "@similarweb/ui-components/dist/button";
import { default as React } from "react";
import { TrafficShareWithTooltip } from "components/TrafficShare/src/TrafficShareWithTooltip";
import {
    IndexCell,
    ReferringCategoryCell,
    TrafficShareWithVisits,
    WebsiteTooltipTopCell,
} from "../../../../components/React/Table/cells";
import { RowSelectionConsumer } from "components/React/Table/cells/RowSelection";
import { DefaultCellHeader, HeaderCellBlank } from "../../../../components/React/Table/headerCells";
import { SelectAllRowsHeaderCellConsumer } from "components/React/Table/headerCells/SelectAllRowsHeaderCell";
import { i18nFilter } from "filters/ngFilters";
import { RelevancyCompareCellWithTooltip } from "./components/RelevancyCompareCellWithTooltip";
import { NoEngagementScore } from "pages/website-analysis/incoming-traffic/StyledComponents";

const DEFAULT_SORT_FIELD = "TotalShare";
const DEFAULT_SORT_DIRECTION = "desc";
const i18n = i18nFilter();
export const IncomingTrafficCompareTableSettings = {
    defaultSortField: DEFAULT_SORT_FIELD,
    defaultSortDirection: DEFAULT_SORT_DIRECTION,
    searchFieldName: "domain",
    getColumns: (
        sortedColumn = { field: DEFAULT_SORT_FIELD, sortDirection: DEFAULT_SORT_DIRECTION },
        useSelection,
        webSource,
        isDaily = false,
        showEngagementScore,
    ) => {
        const columns: any = [
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
                width: 40,
                headerComponent: SelectAllRowsHeaderCellConsumer,
                isResizable: false,
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
                minWidth: 224,
                isResizable: true,
                sortable: true,
                field: "Domain",
                showTotalCount: true,
                displayName: i18n("analysis.source.referrals.table.columns.domain.title"),
                tooltip: i18n("analysis.source.referrals.table.columns.domain.title.tooltip"),
                cellComponent: WebsiteTooltipTopCell,
            },
            {
                minWidth: 240,
                isResizable: true,
                sortable: true,
                field: "Category",
                displayName: i18n("analysis.source.referrals.table.columns.category.title"),
                tooltip: i18n("analysis.source.referrals.table.columns.category.title.tooltip"),
                cellComponent: ReferringCategoryCell,
            },
            {
                minWidth: 138,
                isResizable: true,
                sortable: true,
                field: "TotalShare",
                displayName: i18n(
                    "analysis.source.search.all.table.columns.totalShareCompare.title",
                ),
                tooltip: i18n(
                    "analysis.source.search.all.table.columns.totalShareCompare.general.title.tooltip",
                ),
                cellComponent: (props) => (
                    <TrafficShareWithVisits {...props} applyAbbrNumberFilter={true} />
                ),
            },
            {
                field: "trafficDistribution",
                width: 182,
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
        if (webSource !== "MobileWeb" && !isDaily) {
            columns.push({
                minWidth: 197,
                sortable: false,
                isResizable: false,
                field: "EngagementScores",
                visible: showEngagementScore,
                displayName: i18n(
                    "analysis.source.search.all.table.columns.engagement-score.compare.title",
                ),
                tooltip: i18n(
                    "analysis.source.search.all.table.columns.engagement-score.compare.tooltip",
                ),
                headerComponent: (props) => <DefaultCellHeader {...props} isBeta={true} />,
                cellComponent: (props) =>
                    props.value ? (
                        <RelevancyCompareCellWithTooltip {...props} />
                    ) : (
                        <NoEngagementScore>-</NoEngagementScore>
                    ),
            });
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
