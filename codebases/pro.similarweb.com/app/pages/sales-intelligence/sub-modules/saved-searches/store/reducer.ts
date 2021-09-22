import { ActionType, createReducer } from "typesafe-actions";
import * as actionCreators from "./action-creators";
import { SavedSearchesState } from "../types";
import { searchDoesNotHaveQueryId, findAndReplaceSavedSearch, searchHasQueryId } from "../helpers";

export const INITIAL_SAVED_SEARCHES_STATE: SavedSearchesState = {
    searches: [],
    reportResult: {},
    searchCreating: false,
    searchCreateError: undefined,
    searchTableData: null,
    searchTableDataFetching: false,
    searchTableDataFetchError: undefined,
    searchSaving: false,
    searchSaveError: undefined,
    searchUpdating: false,
    searchUpdateError: undefined,
    searchDeleting: false,
    searchDeleteError: undefined,
    saveSearchModalOpen: false,
    savedSearchSettingsModalOpen: false,
    downloadingTableExcel: false,
    downloadingTableExcelError: undefined,
    technologiesFilters: {
        categories: {},
    },
    tableResultsCount: 0,
    countExcelExportedDomains: 0,
};

const savedSearchesReducer = createReducer<SavedSearchesState, ActionType<typeof actionCreators>>(
    INITIAL_SAVED_SEARCHES_STATE,
)
    .handleAction(
        actionCreators.fetchSavedSearchesAsync.success,
        (state, { payload }): SavedSearchesState => ({
            ...state,
            searches: payload,
        }),
    )
    .handleAction(
        actionCreators.createSearchAsync.request,
        (state, { payload }): SavedSearchesState => ({
            ...state,
            searchCreating: true,
            searchCreateError: INITIAL_SAVED_SEARCHES_STATE.searchCreateError,
            reportResult: {
                ...payload,
            },
        }),
    )
    .handleAction(
        actionCreators.createSearchAsync.success,
        (state, { payload }): SavedSearchesState => ({
            ...state,
            searchCreating: false,
            reportResult: {
                ...state.reportResult,
                ...payload,
            },
        }),
    )
    .handleAction(
        actionCreators.createSearchAsync.failure,
        (state, { payload }): SavedSearchesState => ({
            ...state,
            searchCreating: false,
            searchCreateError: payload,
        }),
    )
    .handleAction(
        actionCreators.fetchSearchTableDataAsync.request,
        (state): SavedSearchesState => ({
            ...state,
            searchTableDataFetching: true,
            searchTableDataFetchError: INITIAL_SAVED_SEARCHES_STATE.searchTableDataFetchError,
        }),
    )
    .handleAction(
        actionCreators.fetchSearchTableDataAsync.success,
        (state, { payload }): SavedSearchesState => ({
            ...state,
            searchTableDataFetching: false,
            searchTableData: payload,
        }),
    )
    .handleAction(
        actionCreators.fetchSearchTableDataAsync.failure,
        (state, { payload }): SavedSearchesState => ({
            ...state,
            searchTableDataFetching: false,
            searchTableDataFetchError: payload,
        }),
    )
    .handleAction(
        actionCreators.saveSearchAsync.request,
        (state): SavedSearchesState => ({
            ...state,
            searchSaving: true,
            searchSaveError: INITIAL_SAVED_SEARCHES_STATE.searchSaveError,
        }),
    )
    .handleAction(
        actionCreators.saveSearchAsync.success,
        (state, { payload }): SavedSearchesState => ({
            ...state,
            searchSaving: false,
            searches: [...state.searches, payload],
        }),
    )
    .handleAction(
        actionCreators.saveSearchAsync.failure,
        (state, { payload }): SavedSearchesState => ({
            ...state,
            searchSaving: false,
            searchSaveError: payload,
        }),
    )
    .handleAction(
        actionCreators.updateSavedSearchAsync.request,
        (state): SavedSearchesState => ({
            ...state,
            searchUpdating: true,
            searchUpdateError: INITIAL_SAVED_SEARCHES_STATE.searchUpdateError,
        }),
    )
    .handleAction(
        actionCreators.updateSavedSearchAsync.success,
        (state, { payload }): SavedSearchesState => ({
            ...state,
            searchUpdating: false,
            searches: findAndReplaceSavedSearch(payload, state.searches),
        }),
    )
    .handleAction(
        actionCreators.updateSavedSearchAsync.failure,
        (state, { payload }): SavedSearchesState => ({
            ...state,
            searchUpdating: false,
            searchUpdateError: payload,
        }),
    )
    .handleAction(
        actionCreators.toggleSaveSearchModal,
        (state, { payload }): SavedSearchesState => ({
            ...state,
            saveSearchModalOpen: payload,
        }),
    )
    .handleAction(
        actionCreators.toggleSavedSearchSettingsModal,
        (state, { payload }): SavedSearchesState => ({
            ...state,
            savedSearchSettingsModalOpen: payload,
        }),
    )
    .handleAction(
        actionCreators.resetReportResult,
        (state): SavedSearchesState => ({
            ...state,
            reportResult: INITIAL_SAVED_SEARCHES_STATE.reportResult,
        }),
    )
    .handleAction(
        actionCreators.removeSavedSearchAction,
        (state, { payload }): SavedSearchesState => ({
            ...state,
            searches: state.searches.filter(searchDoesNotHaveQueryId(payload)),
        }),
    )
    .handleAction(
        actionCreators.deleteSavedSearchAsync.request,
        (state): SavedSearchesState => ({
            ...state,
            searchDeleting: true,
            searchDeleteError: INITIAL_SAVED_SEARCHES_STATE.searchDeleteError,
        }),
    )
    .handleAction(
        actionCreators.deleteSavedSearchAsync.success,
        (state): SavedSearchesState => ({
            ...state,
            searchDeleting: false,
        }),
    )
    .handleAction(
        actionCreators.deleteSavedSearchAsync.failure,
        (state, { payload }): SavedSearchesState => ({
            ...state,
            searchDeleting: false,
            searchDeleteError: payload,
        }),
    )
    .handleAction(
        actionCreators.updateSearchUsedResultCount,
        (state, { payload }): SavedSearchesState => ({
            ...state,
            searches: state.searches.map((search) => {
                if (searchHasQueryId(payload.searchQueryId)) {
                    return {
                        ...search,
                        lastRun: {
                            ...search.lastRun,
                            usedResultCount: payload.count,
                        },
                        queryDefinition: {
                            ...search.queryDefinition,
                            // eslint-disable-next-line @typescript-eslint/camelcase
                            used_result_count: payload.count,
                        },
                    };
                }

                return search;
            }),
        }),
    )
    .handleAction(
        actionCreators.downloadSearchTableExcelAsync.request,
        (state): SavedSearchesState => ({
            ...state,
            downloadingTableExcel: true,
            downloadingTableExcelError: INITIAL_SAVED_SEARCHES_STATE.downloadingTableExcelError,
        }),
    )
    .handleAction(
        actionCreators.downloadSearchTableExcelAsync.success,
        (state, { payload }): SavedSearchesState => ({
            ...state,
            downloadingTableExcel: false,
            countExcelExportedDomains: payload,
        }),
    )
    .handleAction(
        actionCreators.downloadSearchTableExcelAsync.failure,
        (state, { payload }): SavedSearchesState => ({
            ...state,
            downloadingTableExcel: false,
            downloadingTableExcelError: payload,
        }),
    )
    .handleAction(
        actionCreators.fetchTechnologiesFiltersAsync.success,
        (state, { payload }): SavedSearchesState => ({
            ...state,
            technologiesFilters: payload,
        }),
    )
    .handleAction(
        actionCreators.setSearchTableResultsCount,
        (state, { payload }): SavedSearchesState => ({
            ...state,
            tableResultsCount: payload,
        }),
    );

export default savedSearchesReducer;
