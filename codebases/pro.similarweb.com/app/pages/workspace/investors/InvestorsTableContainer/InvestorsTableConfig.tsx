import { IconButton } from "@similarweb/ui-components/dist/button";
import * as React from "react";
import { i18nFilter } from "../../../../filters/ngFilters";
import { getTableColumns } from "../../../lead-generator/lead-generator-exist/leadGeneratorExistConfig";
import {
    DomainNameAndIconHeader,
    DomainNameAndIconWithAlerts,
    selectCol,
    topGeoCountryCol,
    trendCol,
    visibleColumnsFromConfig,
} from "../../common/tableAdditionalColumns";

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
        rowActionsComponents: [
            <IconButton
                onClick={onRowSelected}
                type="flat"
                iconName="arrow-right"
                key="row-button"
            />,
        ],
        onCellClick: (isOpen, rowIdx, rowData, columnConfig) =>
            !columnConfig.isCheckBox && onRowSelected(null, rowData),
        customTableClass: "investors-workspace-table",
        metric,
        noDataTitle: i18nFilter()("workspaces.investors.table.nodata"),
        addPaddingRightCell: true,
        highlightClickedRow: true,
    };
};

export const getColumns = () => {
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
            displayName: i18nFilter()("workspaces.investors.table.column.domains"),
            tooltip: i18nFilter()("workspaces.investors.table.column.domains.tooltip"),
            width: 232,
            cellComponent: ({ value, row }) => (
                <DomainNameAndIconWithAlerts
                    domain={value}
                    icon={row.favicon}
                    allAlerts={row.number_of_all_alerts}
                    unseenAlerts={row.number_of_unseen_alerts}
                />
            ),
            headerComponent: (props) => <DomainNameAndIconHeader {...props} />,
            showTotalCount: true,
            groupKey: null,
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
