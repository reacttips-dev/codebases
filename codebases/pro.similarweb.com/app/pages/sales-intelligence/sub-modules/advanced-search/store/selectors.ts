import { RootState } from "store/types";
import { createSelector } from "reselect";
import { createStatePropertySelector } from "pages/workspace/sales/helpers";
import { selectSalesIntelligenceState } from "pages/sales-intelligence/store/selectors";
import { WithFiltersKeysProp } from "../types/common";
import { SupportedFilterType } from "../types/filters";
import { getFilterMatchesKeyPredicate } from "../helpers/filters";

const select = createStatePropertySelector(selectSalesIntelligenceState("advancedSearch"));

export const selectFiltersConfigFetched = select("filtersConfigFetched");
export const selectFiltersConfigFetching = select("filtersConfigFetching");
export const selectFiltersPanelExpanded = select("filtersPanelExpanded");
export const selectFiltersInDirtyState = select("filtersInDirtyState");
export const selectFiltersInReadyState = select("filtersInReadyState");
export const selectSearchTemplate = select("searchTemplate");
export const selectSearchResultsFetching = select("searchResultsFetching");
export const selectSearchResultsFetchError = select("searchResultsFetchError");
export const selectSearchResults = select("searchResults");
export const selectTableFilters = select("tableFilters");
export const selectAllSavedSearches = select("savedSearches");
export const selectSearchIsCreating = select("searchCreating");
export const selectSearchCreateError = select("searchCreateError");
export const selectRecentlyCreatedSearchId = select("recentlyCreatedSearchId");
export const selectCurrentSearchObject = select("searchById");
export const selectSearchByIdFetching = select("searchByIdFetching");
export const selectSearchByIdFetchError = select("searchByIdFetchError");
export const selectSearchIsUpdating = select("searchByIdUpdating");
export const selectSearchUpdateError = select("searchByIdUpdateError");
export const selectSearchIsDeleting = select("searchByIdDeleting");
export const selectSearchDeleteError = select("searchByIdDeleteError");
export const selectExcelDownloading = select("excelDownloading");
export const selectExcelDownloadError = select("excelDownloadError");
export const selectIsSavedSearchesModalOpened = select("isSavedSearchesModalOpened");
export const selectIsNewSearchModalOpened = select("isRecommendedSearchesModalOpened");
export const selectIsSavedSearchSettingsModalOpened = select("isSavedSearchSettingsModalOpened");

export const selectNumberOfFiltersInDirtyState = (s: RootState) => {
    return selectFiltersInDirtyState(s).length;
};

export const selectNumberOfFiltersInReadyState = (s: RootState) => {
    return selectFiltersInReadyState(s).length;
};

export const selectSearchResultsCount = (s: RootState) => {
    return selectSearchResults(s).totalCount;
};

export const selectFiltersInBothStates = createSelector(
    [selectFiltersInDirtyState, selectFiltersInReadyState],
    (filtersInDirtyState, filtersInReadyState) => {
        return filtersInReadyState.filter((f) => {
            return (
                typeof filtersInDirtyState.find(getFilterMatchesKeyPredicate(f.key)) !== "undefined"
            );
        });
    },
);

export const selectNumberOfFiltersInBothStates = (s: RootState) => {
    return selectFiltersInBothStates(s).length;
};

export const selectFiltersInBothStatesThatMatchKeys = createSelector(
    [selectFiltersInBothStates, (_: RootState, props: WithFiltersKeysProp) => props.filtersKeys],
    (filtersInBothStates, keys) => {
        return keys.reduce<SupportedFilterType[]>((matchedFilters, key) => {
            const filter = filtersInBothStates.find(getFilterMatchesKeyPredicate(key));

            if (typeof filter !== "undefined") {
                matchedFilters.push(filter);
            }

            return matchedFilters;
        }, []);
    },
);

export const selectNumberOfSavedSearches = (s: RootState) => {
    return selectAllSavedSearches(s).length;
};
