import { createSelector } from "reselect";
import { createStatePropertySelector } from "pages/workspace/sales/helpers";
import { selectSalesIntelligenceState } from "../../../store/selectors";
import { getSearchesWithAutoRerunEnabled, sortByQueryDefinitionName } from "../helpers";

const select = createStatePropertySelector(selectSalesIntelligenceState("savedSearches"));

export const selectSavedSearches = select("searches");
export const selectReportResult = select("reportResult");
export const selectSearchCreating = select("searchCreating");
export const selectSearchCreateError = select("searchCreateError");
export const selectSearchTableData = select("searchTableData");
export const selectSearchTableDataFetching = select("searchTableDataFetching");
export const selectSearchTableDataFetchError = select("searchTableDataFetchError");
export const selectSearchSaving = select("searchSaving");
export const selectSearchSaveError = select("searchSaveError");
export const selectSearchUpdating = select("searchUpdating");
export const selectSearchUpdateError = select("searchUpdateError");
export const selectSearchDeleting = select("searchDeleting");
export const selectSearchDeleteError = select("searchDeleteError");
export const selectSaveSearchModalOpen = select("saveSearchModalOpen");
export const selectSavedSearchSettingsModalOpen = select("savedSearchSettingsModalOpen");
export const selectTableExcelDownloading = select("downloadingTableExcel");
export const selectExcelExportedDomains = select("countExcelExportedDomains");
export const selectTableExcelDownloadError = select("downloadingTableExcelError");
export const selectTechnologiesFilters = select("technologiesFilters");
export const selectSearchTableResultsCount = select("tableResultsCount");

export const selectSortedSavedSearches = createSelector(
    selectSavedSearches,
    sortByQueryDefinitionName,
);

export const selectSavedSearchWithAutoRerunEnabled = createSelector(
    selectSavedSearches,
    getSearchesWithAutoRerunEnabled,
);
