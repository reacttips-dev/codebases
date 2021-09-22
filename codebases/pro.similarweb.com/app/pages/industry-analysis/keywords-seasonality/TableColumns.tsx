import CoreNumberCell from "components/core cells/src/CoreNumberCell/CoreNumberCell";
import { OvertimeDefaultCell } from "components/React/SocialOvertime/SocialOvertimeCell";
import {
    DefaultCellRightAlign,
    IndexCell,
    OrganicPaid,
    SearchKeywordCell,
    TrafficShare,
} from "components/React/Table/cells";
import { LeadingSite } from "components/React/Table/cells/LeadingSite";
import { RowSelectionConsumer } from "components/React/Table/cells/RowSelection";
import {
    DefaultCellHeader,
    DefaultCellHeaderRightAlign,
    HeaderCellBlank,
} from "components/React/Table/headerCells";
import { SeasonalityHeaderCell } from "components/React/Table/headerCells/SeasonalityHeaderCell";
import { SelectAllRowsHeaderCellConsumer } from "components/React/Table/headerCells/SelectAllRowsHeaderCell";
import { i18nFilter } from "filters/ngFilters";
import { SeasonalityCell } from "components/React/Table/cells/SeasonalityCell";
import React from "react";

const i18n = i18nFilter();

const DEFAULT_SORT_FIELD = "TotalShare";
const DEFAULT_SORT_DIRECTION = "desc";

export default (
    isCpcAndVolumeSortingAllowed,
    sortedColumn = { field: DEFAULT_SORT_FIELD, sortDirection: DEFAULT_SORT_DIRECTION },
) => {
    return [
        {
            fixed: true,
            cellComponent: OvertimeDefaultCell,
            sortable: false,
            headerComponent: HeaderCellBlank,
            isResizable: false,
            width: 48,
            columnClass: "collapseControlColumn",
            cellClass: "collapseControlCell",
        },
        {
            fixed: true,
            cellComponent: RowSelectionConsumer,
            headerComponent: SelectAllRowsHeaderCellConsumer,
            sortable: false,
            isResizable: false,
            width: 40,
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
            fixed: true,
            width: 213,
            sortable: false,
            field: "SearchTerm",
            showTotalCount: true,
            displayName: i18n("keywords.seasonality.table.term.name"),
            tooltip: i18n("keywords.seasonality.table.term.tooltip"),
            isResizable: true,
            cellComponent: SearchKeywordCell,
        },
        {
            fixed: true,
            width: 265,
            sortable: false,
            field: "Seasonality",
            showTotalCount: true,
            displayName: i18n("keywords.seasonality.table.seasonality.name"),
            tooltip: i18n("keywords.seasonality.table.seasonality.name.tooltip"),
            isResizable: false,
            cellComponent: SeasonalityCell,
            headerComponent: SeasonalityHeaderCell,
        },
        {
            field: "TotalShare",
            displayName: "Traffic Share",
            sortable: true,
            cellComponent: TrafficShare,
            headerComponent: DefaultCellHeader,
            tooltip: i18n("keywords.seasonality.table.columns.traffic.share.tooltip"),
            width: 118,
        },
        {
            field: "KwVolume",
            displayName: i18n("keywords.seasonality.table.volume.name"),
            sortable: isCpcAndVolumeSortingAllowed,
            cellComponent: DefaultCellRightAlign,
            headerComponent: DefaultCellHeaderRightAlign,
            tooltip: i18n("keywords.seasonality.table.volume.name.tooltip"),
            format: "minVisitsAbbr",
            width: 102,
        },
        {
            field: "CPC",
            displayName: "CPC",
            sortable: isCpcAndVolumeSortingAllowed,
            cellComponent: ({ value }) => <CoreNumberCell value={value} format="0.00" prefix="$" />,
            headerComponent: DefaultCellHeaderRightAlign,
            tooltip: i18n("widget.table.tooltip.keywordanalysisgrouporganic.cpc.keywordgroup"),
            width: 80,
        },
        {
            field: "OrganicShare",
            displayName: i18n("keywords.seasonality.table.organicvspaid.name"),
            sortable: false,
            cellComponent: OrganicPaid,
            tooltip: i18n("keywords.seasonality.table.organicvspaid.tooltip"),
            width: 146,
        },
        {
            field: "LeadingSite",
            displayName: i18n("keywords.seasonality.table.leader.name"),
            tooltip: i18n("keywords.seasonality.table.leader.name.tooltip"),
            sortable: false,
            cellComponent: LeadingSite,
            width: 181,
        },
    ].map((col) => {
        const isSorted = sortedColumn && col.field === sortedColumn.field;
        return {
            ...col,
            visible: true,
            isSorted,
            sortDirection: isSorted ? sortedColumn.sortDirection : DEFAULT_SORT_DIRECTION,
        };
    });
};
