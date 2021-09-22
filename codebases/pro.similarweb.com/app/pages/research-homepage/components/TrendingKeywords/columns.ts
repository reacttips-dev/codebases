import { ChangePercentage } from "components/React/Table/cells/ChangePercentage";
import { DefaultCell } from "components/React/Table/cells/DefaultCell";
import { KeywordCell } from "components/React/Table/cells/KeywordCell";
import { DefaultCellHeader } from "components/React/Table/headerCells/DefaultCellHeader";

const trendingKeywordsColumns = [
    {
        field: "SearchTerm",
        displayName: "research.homepage.trendingkeywords.table.keyword", // "Keyword"
        headerComponent: DefaultCellHeader,
        cellComponent: KeywordCell,
    },
    {
        field: "TotalShare",
        displayName: "research.homepage.trendingkeywords.table.categoryshare", // "Category Share"
        headerCellClass: "u-direction-rtl",
        cellClass: "folder-icon-cell-total u-alignRight",
        headerComponent: DefaultCellHeader,
        cellComponent: DefaultCell,
        format: "percentagesign",
        minWidth: 98,
    },
    {
        field: "Change",
        displayName: "research.homepage.trendingkeywords.table.change", // "Change"
        headerCellClass: "u-direction-rtl",
        cellClass: "u-alignRight",
        headerComponent: DefaultCellHeader,
        cellComponent: ChangePercentage,
        minWidth: 96,
    },
];
export default trendingKeywordsColumns;
