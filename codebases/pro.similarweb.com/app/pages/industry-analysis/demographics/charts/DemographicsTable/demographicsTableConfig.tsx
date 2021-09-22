import categoryService from "common/services/categoryService";
import { HeatmapCell } from "components/React/Table/cells/HeatmapCell";
import { RowSelectionConsumer } from "components/React/Table/cells/RowSelection";
import { DefaultCellHeaderRightAlignNoElipsis } from "components/React/Table/headerCells/DefaultCellHeaderRightAlignNoElipsis";
import { SelectAllRowsHeaderCellConsumer } from "components/React/Table/headerCells/SelectAllRowsHeaderCell";
import { DomainSelection } from "components/React/TableSelectionComponents/DomainSelection";
import { i18nFilter } from "filters/ngFilters";
import React from "react";
import {
    IndexCell,
    PercentageBarCellRounded,
    TrafficShare,
    WebsiteTooltipTopCell,
} from "../../../../../components/React/Table/cells";
import { DefaultCellHeader } from "../../../../../components/React/Table/headerCells";

const getHeatmapColumn = ({ field, displayName }: { field: string; displayName: string }) => {
    return {
        field,
        displayName,
        cellComponent: HeatmapCell,
        headerComponent: DefaultCellHeaderRightAlignNoElipsis,
        sortable: true,
        minWidth: 66,
        hideZeroValue: true,
    };
};

export const getTableColumns = (sortedColumn = { field: "Share", sortDirection: "desc" }) => {
    const translateFilter = i18nFilter();

    const tableColumns = [
        {
            fixed: true,
            cellComponent: RowSelectionConsumer,
            headerComponent: SelectAllRowsHeaderCellConsumer,
            sortable: false,
            visible: categoryService.hasCustomCategoriesPermission(),
            width: 48,
        },
        {
            fixed: true,
            field: "#",
            cellComponent: IndexCell,
            disableHeaderCellHover: true,
            sortable: false,
            width: 40,
            headerComponent: DefaultCellHeader,
        },
        {
            field: "Domain",
            displayName: translateFilter("analysis.dest.out.table.columns.domain.title"),
            tooltip: translateFilter("analysis.dest.out.table.columns.domain.title.tooltip"),
            cellComponent: WebsiteTooltipTopCell,
            headerComponent: DefaultCellHeader,
            sortable: true,
            showTotalCount: true,
            groupable: true,
            maxWidth: 245,
            minWidth: 140,
        },
        {
            field: "Share",
            displayName: translateFilter("analysis.dest.out.table.columns.share.title"),
            tooltip: translateFilter("analysis.dest.out.table.columns.share.title.tooltip"),
            cellComponent: TrafficShare,
            headerComponent: DefaultCellHeader,
            sortable: true,
            minWidth: 100,
            hideZeroValue: true,
        },
        {
            field: "MaleShare",
            displayName: translateFilter("analysis.dest.out.table.columns.male_female_share.title"),
            cellComponent: PercentageBarCellRounded,
            headerComponent: DefaultCellHeader,
            sortable: true,
            minWidth: 150,
            hideZeroValue: true,
        },
        getHeatmapColumn({
            field: "age18To24",
            displayName: translateFilter("analysis.dest.out.table.columns.ages_18_to_24.title"),
        }),
        getHeatmapColumn({
            field: "age25To34",
            displayName: translateFilter("analysis.dest.out.table.columns.ages_25_to_34.title"),
        }),
        getHeatmapColumn({
            field: "age35To44",
            displayName: translateFilter("analysis.dest.out.table.columns.ages_35_to_44.title"),
        }),
        getHeatmapColumn({
            field: "age45To54",
            displayName: translateFilter("analysis.dest.out.table.columns.ages_45_to_54.title"),
        }),
        getHeatmapColumn({
            field: "age55To64",
            displayName: translateFilter("analysis.dest.out.table.columns.ages_55_to_64.title"),
        }),
        getHeatmapColumn({
            field: "age65Plus",
            displayName: translateFilter("analysis.dest.out.table.columns.ages_65_plus.title"),
        }),
    ];

    const adjustedColumns = tableColumns.map((col: any) => {
        const isSorted = sortedColumn && col.field === sortedColumn.field;

        return {
            ...col,
            visible: true,
            isSorted,
            sortDirection: isSorted ? sortedColumn.sortDirection : "desc",
        };
    });

    return adjustedColumns;
};

export const getTableOptions = (showToast: any, clearAllSelectedRows: any, selectedRows: any) => {
    return {
        showCompanySidebar: true,
        aboveHeaderComponents: [
            <DomainSelection
                key="DomainSelection"
                showToast={showToast}
                clearAllSelectedRows={clearAllSelectedRows}
                selectedRows={selectedRows}
            />,
        ],
        tableSelectionTrackingParam: "Domain",
        metric: "DemographicsTableMetric",
    };
};
