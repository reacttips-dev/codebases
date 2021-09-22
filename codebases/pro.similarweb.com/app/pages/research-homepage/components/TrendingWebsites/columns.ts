import { WebsiteCell } from "components/React/Table/cells/AppAndWebsiteCell";
import { ChangePercentage } from "components/React/Table/cells/ChangePercentage";
import { DefaultCell } from "components/React/Table/cells/DefaultCell";
import { DefaultCellHeader } from "components/React/Table/headerCells/DefaultCellHeader";

const trendingWebsitesColumns = [
    {
        field: "Domain",
        displayName: "research.homepage.trendingwebsites.table.website", // "Website"
        headerComponent: DefaultCellHeader,
        cellComponent: WebsiteCell,
    },
    {
        field: "AvgMonthVisits",
        displayName: "research.homepage.trendingwebsites.table.visits", // "Visits"
        headerCellClass: "u-direction-rtl",
        cellClass: "folder-icon-cell-total u-alignRight",
        headerComponent: DefaultCellHeader,
        cellComponent: DefaultCell,
        format: "minVisitsAbbr",
        width: 70,
    },
    {
        field: "Change",
        displayName: "research.homepage.trendingwebsites.table.change", // "Change"
        headerCellClass: "u-direction-rtl",
        cellClass: "u-alignRight",
        headerComponent: DefaultCellHeader,
        cellComponent: ChangePercentage,
        minWidth: 96,
    },
];
export default trendingWebsitesColumns;
