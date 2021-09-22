/* eslint-disable react/display-name */
import React from "react";
import { i18nFilter } from "filters/ngFilters";
import { getTableColumns } from "pages/lead-generator/lead-generator-exist/leadGeneratorExistConfig";
import { StyledAlertsIndicatorCell } from "pages/workspace/StyledComponent";
import { DefaultCellHeader } from "components/React/Table/headerCells";
import { RowSelectionConsumer } from "components/React/Table/cells/RowSelection";
import { EmailCellHeader } from "components/React/Table/headerCells/EmailCellHeader";
import {
    DomainNameAndIcon,
    selectCol,
    topGeoCountryCol,
    trendCol,
    visibleColumnsFromConfig,
} from "../../common/tableAdditionalColumns";
import { BlueCheckCell } from "components/React/Table/cells/BlueCheckCell";

export const getOptions = (
    workspaceId,
    opportunityListId,
    updateParams,
    onDataUpdate,
    goToDashboardTemplate,
    metric,
    showErrorToast,
    onRowSelected,
) => {
    return {
        shouldEnrichRow: () => false,
        onCellClick: (isOpen, rowIdx, rowData, columnConfig) =>
            !columnConfig.isCheckBox && onRowSelected(null, rowData),
        customTableClass: "sales-workspace-table",
        metric,
        noDataTitle: i18nFilter()("workspaces.sales.table.nodata"),
        addPaddingRightCell: true,
        highlightClickedRow: true,
    };
};

export const getColumns = () => {
    const t = i18nFilter();
    // slice & splice in order to exclude first 4 columns from original config & add trend column
    const columnsFromConfig = getTableColumns();
    columnsFromConfig.splice(6, 0, topGeoCountryCol); // should be in total engagement context
    columnsFromConfig.splice(11, 0, trendCol); // should be in monthly visits context (after YoY Visits Change)
    const newColumns = columnsFromConfig
        .slice(4)
        .map((col) => ({ ...col, field: col.field.toLowerCase() }));
    const fixedCols = [
        selectCol,
        {
            ...newColumns[1], // original Site column from lead-generator config file
            fixed: true,
            visible: true,
            field: "site",
            displayName: t("workspaces.sales.table.column.domains"),
            tooltip: t("workspaces.sales.table.column.domains.tooltip"),
            width: 200,
            cellComponent: ({ value, row }) => (
                <DomainNameAndIcon domain={value} icon={row.favicon} />
            ),
            showTotalCount: true,
            groupKey: null,
        },
        {
            width: 95,
            fixed: true,
            visible: true,
            displayName: t("workspaces.sales.table.column.signals"),
            field: "number_of_unseen_alerts",
            tooltip: t("workspaces.sales.table.column.signals.tooltip"),
            sortable: true,
            isSorted: false,
            type: "string",
            format: "None",
            sortDirection: "desc",
            cellComponent: StyledAlertsIndicatorCell,
            headerComponent: DefaultCellHeader,
        },
    ];

    return fixedCols.concat(
        newColumns.map((col) => ({
            ...col,
            visible: visibleColumnsFromConfig[col.field],
            sortDirection: col.sortDirection || "desc",
        })),
    );
};

export const getColumnsSalesIntelligence = () => {
    const t = i18nFilter();
    // slice & splice in order to exclude first 4 columns from original config & add trend column
    const columnsFromConfig = getTableColumns();
    columnsFromConfig.splice(6, 0, topGeoCountryCol); // should be in total engagement context
    columnsFromConfig.splice(11, 0, trendCol); // should be in monthly visits context (after YoY Visits Change)
    const newColumns = columnsFromConfig
        .slice(4)
        .map((col) => ({ ...col, field: col.field.toLowerCase() }));
    const fixedCols = [
        {
            fixed: true,
            isCheckBox: true,
            cellComponent: (props) => (
                <div className="u-alignCenter">
                    <RowSelectionConsumer {...props} />
                </div>
            ),
            sortable: false,
            width: 48,
            headerComponent: () => null,
            visible: true,
        },
        {
            ...newColumns[1], // original Site column from lead-generator config file
            fixed: true,
            visible: true,
            field: "site",
            displayName: t("Websites"),
            tooltip: t("workspaces.sales.table.column.domains.tooltip"),
            width: 200,
            cellComponent: ({ value, row }) => (
                <DomainNameAndIcon domain={value} icon={row.favicon} />
            ),
            showTotalCount: true,
            groupKey: null,
        },

        {
            width: 95,
            fixed: true,
            visible: true,
            displayName: t("workspaces.sales.table.column.signals"),
            field: "number_of_unseen_alerts",
            tooltip: t("workspaces.sales.table.column.signals.tooltip"),
            sortable: true,
            isSorted: false,
            type: "string",
            format: "None",
            sortDirection: "desc",
            cellComponent: StyledAlertsIndicatorCell,
            headerComponent: DefaultCellHeader,
        },
        {
            fixed: true,
            field: "isLatestSnapshotSent",
            cellComponent: BlueCheckCell,
            sortable: false,
            width: 48,
            headerComponent: EmailCellHeader,
            visible: true,
        },
    ];

    return fixedCols.concat(
        newColumns.map((col) => ({
            ...col,
            visible: visibleColumnsFromConfig[col.field],
            sortDirection: col.sortDirection || "desc",
        })),
    );
};
