import {
    AdsenseCell,
    CellKeyword,
    ChangePercentage,
    DefaultCellRightAlign,
    IndexCell,
    KeywordAnalysisPosition,
    KeywordAnalysisUrl,
    TrafficShare,
    WebsiteTooltipTopCell,
} from "components/React/Table/cells";
import { RowSelectionConsumer } from "components/React/Table/cells/RowSelection";
import {
    DefaultCellHeader,
    DefaultCellHeaderRightAlign,
    HeaderCellBlank,
} from "components/React/Table/headerCells";
import { i18nCategoryFilter, i18nFilter } from "filters/ngFilters";
import React from "react";
import { CPCCell } from "components/Workspace/TableCells/CPCCell";
import { NumberCell } from "components/Workspace/TableCells/NumberCell";

const i18n = i18nFilter();

const DEFAULT_SORT_FIELD = "Share";
const DEFAULT_SORT_DIRECTION = "desc";

export default (
    sortedColumn = { field: DEFAULT_SORT_FIELD, sortDirection: DEFAULT_SORT_DIRECTION },
    excludeFields = [],
) => {
    return [
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
            field: "Keyword",
            showTotalCount: true,
            displayName: "Keyword",
            tooltip: i18n("widget.table.tooltip.keywordanalysisgrouporganic.keyword.keywordgroup"),
            isResizable: true,
            cellComponent: CellKeyword,
        },
        {
            field: "Share",
            displayName: "Traffic Share",
            sortable: true,
            cellComponent: TrafficShare,
            headerComponent: DefaultCellHeader,
            tooltip: i18n("widget.table.tooltip.keywordanalysisorganic.share"),
            width: 200,
        },
        {
            field: "Change",
            displayName: i18n("analysis.source.search.all.table.columns.change.title"),
            sortable: true,
            cellComponent: ChangePercentage,
            headerComponent: DefaultCellHeaderRightAlign,
            tooltip: i18n("widget.table.tooltip.keywordanalysisorganic.change"),
            width: 110,
        },
        {
            field: "Cpc",
            displayName: "CPC",
            sortable: true,
            cellComponent: CPCCell,
            headerComponent: DefaultCellHeaderRightAlign,
            tooltip: i18n("widget.table.tooltip.keywordanalysisgrouporganic.cpc.keywordgroup"),
            width: 220,
        },
        {
            field: "Volume",
            displayName: "Volume",
            sortable: true,
            cellComponent: NumberCell,
            headerComponent: DefaultCellHeader,
            tooltip: i18n("widget.table.tooltip.keywordanalysisgrouporganic.volume.keywordgroup"),
            width: 220,
        },
    ]
        .filter(({ field }) => !excludeFields.includes(field))
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
