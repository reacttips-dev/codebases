import {
    ChangePercentage,
    DefaultCellRightAlign,
    IndexCell,
    LeadingSite,
    SearchKeywordCell,
    TrafficShareWithVisits,
} from "components/React/Table/cells";
import { RowSelectionConsumer } from "components/React/Table/cells/RowSelection";
import { DefaultCellHeader, DefaultCellHeaderRightAlign } from "components/React/Table/headerCells";
import { default as React } from "react";
import { i18nFilter } from "filters/ngFilters";
import { CoreTrendsBarCellWrapper } from "components/core cells/src/CoreTrendsBarCell/CoreTrendsBarCellWrapper";
import { SelectAllRowsHeaderCellConsumer } from "components/React/Table/headerCells/SelectAllRowsHeaderCell";

const DEFAULT_SORT_FIELD = "TotalShare";
const DEFAULT_SORT_DIRECTION = "desc";

export const DesktopMobileShare = "DesktopMobileShare";

export const getColumns = (
    excludeFields = [],
    sortedColumn = { field: DEFAULT_SORT_FIELD, sortDirection: DEFAULT_SORT_DIRECTION },
) => {
    const i18n = i18nFilter();
    const columns = [
        {
            fixed: true,
            cellComponent: RowSelectionConsumer,
            headerComponent: SelectAllRowsHeaderCellConsumer,
            sortable: false,
            width: 40,
            dashboardHide: true,
            disableHeaderCellHover: true,
        },
        {
            fixed: true,
            cellComponent: IndexCell,
            sortable: false,
            width: 52,
            dashboardHide: "true",
            disableHeaderCellHover: true,
        },
        {
            field: "SearchTerm",
            minWidth: 200,
            sortable: true,
            showTotalCount: true,
            displayName: i18n("ia.topkeywords.table.column.searchTerm"),
            tooltip: i18n("analysis.source.search.all.table.columns.searchterms.title.tooltip"),
            isResizable: true,
            cellComponent: (props) => <SearchKeywordCell {...props} withAdsLink={false} />,
        },
        {
            field: "TotalShare",
            displayName: i18n("ia.topkeywords.table.column.trafficShareWithVisits"),
            sortable: true,
            groupable: false,
            isResizable: true,
            cellComponent: TrafficShareWithVisits,
            tooltip: i18n("ia.topkeywords.table.column.trafficShareWithVisits.tooltip"),
            width: 158,
        },
        {
            field: "Change",
            displayName: i18n("analysis.source.search.all.table.columns.change.title"),
            sortable: true,
            groupable: false,
            cellComponent: ChangePercentage,
            tooltip: "widget.table.tooltip.topsites.change",
            width: 95,
            isResizable: true,
        },
        {
            field: "Volume",
            displayName: i18n("ia.topkeywords.table.column.volume"),
            tooltip: i18n("widget.table.tooltip.searchkeywordsabb.volume"),
            sortable: false,
            groupable: false,
            cellComponent: DefaultCellRightAlign,
            headerComponent: DefaultCellHeaderRightAlign,
            width: 81,
            isResizable: true,
            format: "minAbbrNumber",
        },
        {
            field: "VolumeTrend",
            displayName: i18n("ia.topkeywords.table.column.trend"),
            tooltip: i18n("widget.table.tooltip.searchkeywordsabb.volume"),
            sortable: false,
            groupable: false,
            cellComponent: CoreTrendsBarCellWrapper,
            headerComponent: DefaultCellHeaderRightAlign,
            width: 130,
            isResizable: true,
        },
        {
            field: "LeadingSite",
            displayName: i18n("keywords.seasonality.table.leader.name"),
            tooltip: i18n("keywords.seasonality.table.leader.name.tooltip"),
            sortable: false,
            groupable: false,
            cellComponent: LeadingSite,
            headerComponent: DefaultCellHeader,
            width: 150,
            isResizable: true,
        },
    ]
        .filter((column) => !excludeFields.includes(column.field))
        .map((col) => {
            const isSorted = sortedColumn && col.field === sortedColumn.field;
            return {
                ...col,
                visible: true,
                sortDirection: isSorted ? sortedColumn.sortDirection : DEFAULT_SORT_DIRECTION,
            };
        });
    return columns;
};
