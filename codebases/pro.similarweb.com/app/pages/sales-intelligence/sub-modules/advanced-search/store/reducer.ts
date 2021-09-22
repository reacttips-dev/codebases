import { ActionType, createReducer } from "typesafe-actions";
import { getFilterDoesNotMatchKeyPredicate } from "../helpers/filters";
import { AdvancedSearchState } from "../types/common";
import * as ac from "./action-creators";
import {
    SEARCH_RESULTS_TABLE_INITIAL_PAGE,
    SEARCH_RESULTS_TABLE_PAGE_SIZE,
} from "../constants/table";

const INITIAL_ADVANCED_SEARCH_STATE: AdvancedSearchState = {
    filtersConfigFetched: false,
    filtersConfigFetching: true,
    filtersPanelExpanded: true,
    filtersInDirtyState: [],
    filtersInReadyState: [],
    searchTemplate: null,
    savedSearches: [],
    searchResultsFetching: false,
    searchResultsFetchError: undefined,
    searchResults: {
        rows: [],
        totalCount: 0,
    },
    tableFilters: {
        asc: false,
        orderBy: "visits",
        page: SEARCH_RESULTS_TABLE_INITIAL_PAGE,
        pageSize: SEARCH_RESULTS_TABLE_PAGE_SIZE,
    },
    searchCreating: false,
    searchCreateError: undefined,
    recentlyCreatedSearchId: undefined,
    searchById: null,
    searchByIdFetching: false,
    searchByIdFetchError: undefined,
    searchByIdUpdating: false,
    searchByIdUpdateError: undefined,
    searchByIdDeleting: false,
    searchByIdDeleteError: undefined,
    excelDownloading: false,
    excelDownloadError: undefined,
    isSavedSearchesModalOpened: false,
    isRecommendedSearchesModalOpened: false,
    isSaveNewSearchModalOpened: false,
    isSaveNewSearchSuccessModalOpened: false,
    isSavedSearchSettingsModalOpened: false,
};

const advancedSearchReducer = createReducer<AdvancedSearchState, ActionType<typeof ac>>(
    INITIAL_ADVANCED_SEARCH_STATE,
)
    .handleAction(ac.setSearchTemplateAction, (state, { payload }) => ({
        ...state,
        searchTemplate: payload,
    }))
    .handleAction(ac.downloadAsExcelAsync.request, (state) => ({
        ...state,
        excelDownloading: true,
    }))
    .handleAction(ac.downloadAsExcelAsync.success, (state) => ({
        ...state,
        excelDownloading: false,
    }))
    .handleAction(ac.downloadAsExcelAsync.failure, (state, { payload }) => ({
        ...state,
        excelDownloading: false,
        excelDownloadError: payload,
    }))
    .handleAction(ac.fetchSavedSearchesAsync.success, (state, { payload }) => ({
        ...state,
        savedSearches: payload,
    }))
    .handleAction(ac.updateSearchByIdAsync.request, (state) => ({
        ...state,
        searchByIdUpdating: true,
        searchByIdUpdateError: INITIAL_ADVANCED_SEARCH_STATE.searchByIdUpdateError,
    }))
    .handleAction(ac.updateSearchByIdAsync.success, (state, { payload }) => ({
        ...state,
        searchByIdUpdating: false,
        searchById: payload,
    }))
    .handleAction(ac.updateSearchByIdAsync.failure, (state, { payload }) => ({
        ...state,
        searchByIdUpdating: false,
        searchByIdUpdateError: payload,
    }))
    .handleAction(ac.deleteSearchByIdAsync.request, (state) => ({
        ...state,
        searchByIdDeleting: true,
        searchByIdDeleteError: INITIAL_ADVANCED_SEARCH_STATE.searchByIdUpdateError,
    }))
    .handleAction(ac.deleteSearchByIdAsync.success, (state, { payload }) => ({
        ...state,
        searchByIdDeleting: false,
        savedSearches: state.savedSearches.filter((s) => s.searchId !== payload),
    }))
    .handleAction(ac.deleteSearchByIdAsync.failure, (state, { payload }) => ({
        ...state,
        searchByIdDeleting: false,
        searchByIdDeleteError: payload,
    }))
    .handleAction(ac.toggleSavedSearchesModalAction, (state, { payload }) => ({
        ...state,
        isSavedSearchesModalOpened: payload,
    }))
    .handleAction(ac.toggleSavedSearchSettingsModalAction, (state, { payload }) => ({
        ...state,
        isSavedSearchSettingsModalOpened: payload,
    }))
    .handleAction(ac.toggleNewSearchModalAction, (state, { payload }) => ({
        ...state,
        isRecommendedSearchesModalOpened: payload,
    }))
    .handleAction(ac.clearCurrentSearchAction, (state) => ({
        ...state,
        searchById: null,
    }))
    .handleAction(ac.initFiltersInBothStatesAction, (state, { payload }) => ({
        ...state,
        filtersInDirtyState: payload.filtersInDirtyState,
        filtersInReadyState: payload.filtersInReadyState,
    }))
    .handleAction(ac.addOrUpdateInDirtyListAction, (state, { payload }) => ({
        ...state,
        filtersInDirtyState: state.filtersInDirtyState
            .filter(getFilterDoesNotMatchKeyPredicate(payload.key))
            .concat(payload),
    }))
    .handleAction(ac.addOrUpdateInReadyListAction, (state, { payload }) => ({
        ...state,
        filtersInReadyState: state.filtersInReadyState
            .filter(getFilterDoesNotMatchKeyPredicate(payload.key))
            .concat(payload),
    }))
    .handleAction(ac.removeFromDirtyListAction, (state, { payload }) => ({
        ...state,
        filtersInDirtyState: state.filtersInDirtyState.filter(
            getFilterDoesNotMatchKeyPredicate(payload),
        ),
    }))
    .handleAction(ac.removeFromReadyListAction, (state, { payload }) => ({
        ...state,
        filtersInReadyState: state.filtersInReadyState.filter(
            getFilterDoesNotMatchKeyPredicate(payload),
        ),
    }))
    .handleAction(ac.resetFiltersAction, (state, { payload }) => ({
        ...state,
        filtersInDirtyState: [],
        filtersInReadyState: payload,
    }))
    .handleAction(ac.fetchSearchByIdAsync.request, (state) => ({
        ...state,
        searchById: null,
        searchByIdFetching: true,
        searchByIdFetchError: INITIAL_ADVANCED_SEARCH_STATE.searchByIdFetchError,
    }))
    .handleAction(ac.fetchSearchByIdAsync.success, (state, { payload }) => ({
        ...state,
        searchById: payload,
        searchByIdFetching: false,
    }))
    .handleAction(ac.fetchSearchByIdAsync.failure, (state, { payload }) => ({
        ...state,
        searchByIdFetching: false,
        searchByIdFetchError: payload,
    }))
    .handleAction(ac.saveNewSearchAsync.request, (state) => ({
        ...state,
        searchCreating: true,
        searchCreateError: INITIAL_ADVANCED_SEARCH_STATE.searchCreateError,
        recentlyCreatedSearchId: INITIAL_ADVANCED_SEARCH_STATE.recentlyCreatedSearchId,
    }))
    .handleAction(ac.saveNewSearchAsync.success, (state, { payload }) => ({
        ...state,
        searchCreating: false,
        recentlyCreatedSearchId: payload.searchId,
    }))
    .handleAction(ac.saveNewSearchAsync.failure, (state, { payload }) => ({
        ...state,
        searchCreating: false,
        searchCreateError: payload,
    }))
    .handleAction(ac.fetchFiltersConfigAsync.request, (state) => ({
        ...state,
        filtersConfigFetching: true,
        filtersConfigFetched: false,
    }))
    .handleAction(ac.fetchFiltersConfigAsync.success, (state) => ({
        ...state,
        filtersConfigFetching: false,
        filtersConfigFetched: true,
    }))
    .handleAction(ac.fetchFiltersConfigAsync.failure, (state) => ({
        ...state,
        filtersConfigFetching: false,
    }))
    .handleAction(ac.toggleFiltersPanelAction, (state) => ({
        ...state,
        filtersPanelExpanded: !state.filtersPanelExpanded,
    }))
    .handleAction(ac.fetchSearchResultsAsync.request, (state) => ({
        ...state,
        searchResultsFetching: true,
        searchResultsFetchError: INITIAL_ADVANCED_SEARCH_STATE.searchResultsFetchError,
    }))
    .handleAction(ac.fetchSearchResultsAsync.success, (state, { payload }) => ({
        ...state,
        searchResults: payload,
        searchResultsFetching: false,
    }))
    .handleAction(ac.fetchSearchResultsAsync.failure, (state, { payload }) => ({
        ...state,
        searchResultsFetching: false,
        searchResultsFetchError: payload,
    }))
    .handleAction(ac.updateTableFiltersAction, (state, { payload }) => ({
        ...state,
        tableFilters: {
            ...state.tableFilters,
            ...payload,
        },
    }));

export default advancedSearchReducer;
