import { ChangePercentage } from "components/React/Table/cells/ChangePercentage";
import { CustomCategoryCell } from "components/React/Table/cells/CustomCategoryCell";
import { DefaultCell } from "components/React/Table/cells/DefaultCell";
import { DefaultCellHeader } from "components/React/Table/headerCells/DefaultCellHeader";

const customCategoriesColumns = [
    {
        field: "Name",
        displayName: "research.homepage.customcategories.table.category",
        headerComponent: DefaultCellHeader,
        cellComponent: CustomCategoryCell,
    },
    {
        field: "TotalVisits",
        displayName: "research.homepage.customcategories.table.totalvisits",
        headerCellClass: "u-direction-rtl",
        cellClass: "folder-icon-cell-total u-alignRight",
        headerComponent: DefaultCellHeader,
        cellComponent: DefaultCell,
        format: "minVisitsAbbr",
        width: 96,
    },
    {
        field: "Change",
        displayName: "research.homepage.customcategories.table.change",
        headerCellClass: "u-direction-rtl",
        cellClass: " u-alignRight",
        headerComponent: DefaultCellHeader,
        cellComponent: ChangePercentage,
        width: 72,
    },
];
export default customCategoriesColumns;
