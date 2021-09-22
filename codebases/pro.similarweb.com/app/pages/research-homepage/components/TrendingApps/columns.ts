import { AppCell } from "components/React/Table/cells/AppAndWebsiteCell";
import { ChangePercentage } from "components/React/Table/cells/ChangePercentage";
import { DefaultCell } from "components/React/Table/cells/DefaultCell";
import { DefaultCellHeader } from "components/React/Table/headerCells/DefaultCellHeader";

const trendingAppsColumns = [
    {
        field: "App",
        displayName: "research.homepage.trendingapps.table.apps", // "Apps"
        headerComponent: DefaultCellHeader,
        cellComponent: AppCell,
    },
    {
        field: "Downloads",
        displayName: "research.homepage.trendingapps.table.downloads", // "Downloads"
        headerCellClass: "u-direction-rtl",
        cellClass: "folder-icon-cell-total u-alignRight",
        headerComponent: DefaultCellHeader,
        cellComponent: DefaultCell,
        format: "minVisitsAbbr",
        minWidth: 70,
    },
    {
        field: "DownloadsChange",
        displayName: "research.homepage.trendingapps.table.change", // "Change"
        headerCellClass: "u-direction-rtl",
        cellClass: "u-alignRight",
        headerComponent: DefaultCellHeader,
        cellComponent: ChangePercentage,
        minWidth: 96,
    },
];
export default trendingAppsColumns;
