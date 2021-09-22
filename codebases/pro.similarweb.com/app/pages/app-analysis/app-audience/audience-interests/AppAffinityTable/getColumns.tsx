import { i18nFilter } from "filters/ngFilters";
import React from "react";
import {
    AppAndWebsiteCell,
    CategoryNoLinkCell,
    DefaultCell,
    IndexCell,
    RankCell,
    TrafficShare,
} from "../../../../../components/React/Table/cells";
import { DefaultCellHeader } from "../../../../../components/React/Table/headerCells";

const DEFAULT_SORT_DIRECTION = "desc";

export const getColumns = (sortedColumn, i18nReplacements) => {
    return [
        {
            field: "",
            cellComponent: IndexCell,
            fixed: true,
            width: 60,
            sortable: false,
            disableHeaderCellHover: true,
        },
        {
            field: "Title",
            displayName: i18nFilter()("mobileApps.affinity.table.columns.apptitle"),
            cellComponent: AppAndWebsiteCell,
            showTotalCount: true,
            width: 300,
            sortable: true,
        },
        {
            field: "Publisher",
            displayName: i18nFilter()("mobileApps.affinity.table.columns.publisher"),
            cellComponent: DefaultCell,
            sortable: true,
        },
        {
            field: "MainCategoryID",
            displayName: i18nFilter()("mobileApps.affinity.table.columns.category"),
            cellComponent: CategoryNoLinkCell,
            sortable: true,
        },
        {
            field: "CategoryRank",
            displayName: i18nFilter()("mobileApps.affinity.table.columns.categoryrank"),
            cellComponent: RankCell,
            width: 150,
            tooltip: i18nFilter()("mobileApps.affinity.table.columns.categoryrank.tooltip"),
            sortable: true,
        },
        {
            field: "CountryRank",
            displayName: i18nFilter()("mobileApps.affinity.table.columns.countryrank"),
            cellComponent: RankCell,
            width: 150,
            tooltip: i18nFilter()("mobileApps.affinity.table.columns.countryrank.tooltip"),
            sortable: true,
        },
        {
            field: "Affinity",
            displayName: i18nFilter()("mobileApps.affinity.table.columns.affinity"),
            cellComponent: TrafficShare,
            width: 350,
            tooltip: i18nFilter()(
                "mobileApps.affinity.table.columns.affinity.tooltip",
                i18nReplacements,
            ),
            sortable: true,
        },
    ].map((cell: any) => {
        return {
            ...cell,
            visible: true,
            isSorted: sortedColumn.field === cell.field,
            sortable: cell.sortable,
            headerComponent: DefaultCellHeader,
            sortDirection:
                sortedColumn.field === cell.field
                    ? sortedColumn.sortDirection
                    : DEFAULT_SORT_DIRECTION,
        };
    });
};
