import { AppTooltipCell, RankCell } from "../../../components/React/Table/cells";
import { DefaultCellHeader } from "../../../components/React/Table/headerCells";
import { DefaultCellHeaderRightAlign } from "../../../components/React/Table/headerCells/DefaultCellHeaderRightAlign";
import { i18nFilter } from "../../../filters/ngFilters";

export const androidColumns = [
    {
        fixed: true,
        field: "Title",
        displayName: i18nFilter()("appstorekeywords.analysis.table.apptitle"),
        type: "string",
        sortable: true,
        isSorted: false,
        sortDirection: "desc",
        cellComponent: AppTooltipCell,
        headerComponent: DefaultCellHeader,
        totalCount: "True",
        tooltip: "appstorekeywords.analysis.table.apptitle.tooltip",
        width: 260,
        visible: true,
    },
    {
        fixed: true,
        field: "UsageRank",
        displayName: i18nFilter()("topapps.table.columns.usagerank"),
        type: "string",
        sortable: true,
        isSorted: false,
        sortDirection: "desc",
        cellComponent: RankCell,
        headerComponent: DefaultCellHeaderRightAlign,
        tooltip: "topapps.table.columns.usagerank.tooltip",
        width: 130,
        visible: true,
    },
    {
        fixed: true,
        field: "StoreRank",
        displayName: i18nFilter()("topapps.table.columns.storerank"),
        type: "double",
        sortable: true,
        isSorted: false,
        sortDirection: "desc",
        cellComponent: RankCell,
        headerComponent: DefaultCellHeaderRightAlign,
        tooltip: "topapps.table.columns.storerank.tooltip",
        width: 130,
        visible: true,
    },
];

export const appleColumns = [
    {
        fixed: true,
        field: "Title",
        displayName: i18nFilter()("appstorekeywords.analysis.table.apptitle"),
        type: "string",
        sortable: true,
        isSorted: false,
        sortDirection: "desc",
        cellComponent: AppTooltipCell,
        headerComponent: DefaultCellHeader,
        totalCount: "True",
        tooltip: "appstorekeywords.analysis.table.apptitle.tooltip",
        width: 260,
        visible: true,
    },
    {
        fixed: true,
        field: "StoreRank",
        displayName: i18nFilter()("topapps.table.columns.storerank"),
        type: "double",
        sortable: true,
        isSorted: false,
        sortDirection: "desc",
        cellComponent: RankCell,
        headerComponent: DefaultCellHeaderRightAlign,
        tooltip: "topapps.table.columns.storerank.tooltip",
        width: 130,
        visible: true,
    },
];

export const AppCategoryTrendsTableColumnsConfigGen = (
    sortbyField: string,
    sortDirection: string,
    isPlayStore: boolean,
) => {
    let selectedConfig: any = appleColumns;
    if (isPlayStore) {
        selectedConfig = androidColumns;
    }
    return selectedConfig.map((col, idx) => {
        if (!col.sortable) {
            return col;
        }
        return {
            ...col,
            isSorted: sortbyField ? col.field === sortbyField : col.isSorted,
            sortDirection:
                sortbyField && col.field === sortbyField ? sortDirection : col.sortDirection,
        };
    });
};
