import { createStatePropertySelector } from "pages/workspace/sales/helpers";
import { selectSalesIntelligenceState } from "../../../store/selectors";

const select = createStatePropertySelector(selectSalesIntelligenceState("industries"));

export const selectTableData = select("tableData");
export const selectFetchingData = select("fetchingData");
export const selectTableFilters = select("tableFilters");
export const selectExcelDownloading = select("excelDownloading");
