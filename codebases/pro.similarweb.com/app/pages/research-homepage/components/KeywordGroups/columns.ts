import { ChangePercentage } from "components/React/Table/cells/ChangePercentage";
import { DefaultCell } from "components/React/Table/cells/DefaultCell";
import { KeywordGroupCell } from "components/React/Table/cells/KeywordGroupCell";
import { DefaultCellHeader } from "components/React/Table/headerCells/DefaultCellHeader";

const keywordGroupsColumns = [
    {
        field: "Name",
        displayName: "research.homepage.keywordgroups.table.keywordgroup", // "Keyword Group",
        headerComponent: DefaultCellHeader,
        cellComponent: KeywordGroupCell,
    },
    {
        field: "Volume",
        displayName: "research.homepage.keywordgroups.table.totalvolume", // "Total Volume",
        headerCellClass: "u-direction-rtl",
        cellClass: "folder-icon-cell-total u-alignRight",
        headerComponent: DefaultCellHeader,
        cellComponent: DefaultCell,
        format: "minVisitsAbbr",
        width: 96,
    },
    {
        field: "Change",
        displayName: "research.homepage.keywordgroups.table.change", // "Change",
        headerCellClass: "u-direction-rtl",
        cellClass: "u-alignRight",
        headerComponent: DefaultCellHeader,
        cellComponent: ChangePercentage,
        width: 72,
    },
];
export default keywordGroupsColumns;
