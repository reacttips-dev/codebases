import { createStatePropertySelector } from "pages/workspace/sales/helpers";
import { selectSalesIntelligenceState } from "../../../store/selectors";

const select = createStatePropertySelector(selectSalesIntelligenceState("competitorCustomers"));

export const selectOutgoingTableFetching = select("outgoingTrafficTableFetching");
export const selectOutgoingTableFetchError = select("outgoingTrafficTableFetchError");
export const selectOutgoingCategories = select("outgoingTrafficCategories");
export const selectOutgoingTable = select("outgoingTrafficTable");
export const selectOutgoingTableExcelDownloading = select("outgoingTableExcelDownloading");
export const selectOutgoingTableFilters = select("outgoingTrafficTableFilters");

export const selectIncomingTableFetching = select("incomingTrafficTableFetching");
export const selectIncomingTableFetchError = select("incomingTrafficTableFetchError");
export const selectIncomingCategories = select("incomingTrafficCategories");
export const selectIncomingTable = select("incomingTrafficTable");
export const selectIncomingTableExcelDownloading = select("incomingTableExcelDownloading");
export const selectIncomingTableFilters = select("incomingTrafficTableFilters");
