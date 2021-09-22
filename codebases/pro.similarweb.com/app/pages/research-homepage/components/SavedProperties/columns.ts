import { AppAndWebsiteCell } from "components/React/Table/cells/AppAndWebsiteCell";
import { DefaultCellHeader } from "components/React/Table/headerCells/DefaultCellHeader";

const savedAnalysisColumns = [
    {
        field: "Name",
        displayName: "research.homepage.favorites.websitesandapps", // "Websites and Apps"
        headerComponent: DefaultCellHeader,
        cellComponent: AppAndWebsiteCell,
        cellClass: "saved-properties-fixed-height",
        maxWidth: "100%",
    },
];
export default savedAnalysisColumns;
