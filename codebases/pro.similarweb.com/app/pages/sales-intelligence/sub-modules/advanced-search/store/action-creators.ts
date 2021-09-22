import { createAction, createAsyncAction } from "typesafe-actions";
import { SupportedFilterType } from "../types/filters";
import { FetchError } from "pages/sales-intelligence/types";
import {
    FiltersInBothStates,
    PopularSearchTemplate,
    SavedSearchDto,
    SearchResultsResponseDto,
    SearchTableFiltersType,
    SimplifiedSavedSearchDto,
} from "../types/common";

/** Filters panel expand */
export const toggleFiltersPanelAction = createAction("@@si/advanced-search/TOGGLE_FILTERS_PANEL")();

/** Searches modal popups */
export const toggleSavedSearchesModalAction = createAction(
    "@@si/advanced-search/TOGGLE_SAVED_SEARCHES_MODAL",
)<boolean>();
export const toggleNewSearchModalAction = createAction(
    "@@si/advanced-search/TOGGLE_NEW_SEARCH_MODAL",
)<boolean>();
export const toggleSavedSearchSettingsModalAction = createAction(
    "@@si/advanced-search/TOGGLE_SAVED_SEARCH_SETTINGS_MODAL",
)<boolean>();

/** Filters initialization */
export const initFiltersInBothStatesAction = createAction(
    "@@si/advanced-search/INIT_FILTERS_IN_BOTH_STATES",
)<FiltersInBothStates>();

/** Filters in dirty state */
export const addOrUpdateInDirtyListAction = createAction(
    "@@si/advanced-search/ADD_OR_UPDATE_IN_DIRTY_LIST",
)<SupportedFilterType>();
export const removeFromDirtyListAction = createAction(
    "@@si/advanced-search/REMOVE_FROM_DIRTY_LIST",
)<SupportedFilterType["key"]>();

/** Filters in ready state */
export const addOrUpdateInReadyListAction = createAction(
    "@@si/advanced-search/ADD_OR_UPDATE_IN_READY_LIST",
)<SupportedFilterType>();
export const removeFromReadyListAction = createAction(
    "@@si/advanced-search/REMOVE_FROM_READY_LIST",
)<SupportedFilterType["key"]>();

/** Resetting filters */
export const resetFiltersAction = createAction("@@si/advanced-search/RESET_FILTERS")<
    SupportedFilterType[]
>();

/** Table filters */
export const updateTableFiltersAction = createAction("@@si/advanced-search/UPDATE_TABLE_FILTERS")<
    Partial<SearchTableFiltersType>
>();

/** Deleting saved search object */
export const clearCurrentSearchAction = createAction("@@si/advanced-search/CLEAR_CURRENT_SEARCH")();

/** Set search template for later use  */
export const setSearchTemplateAction = createAction(
    "@@si/advanced-search/SET_SEARCH_TEMPLATE",
)<PopularSearchTemplate | null>();

export const fetchFiltersConfigAsync = createAsyncAction(
    "@@si/advanced-search/FETCH_FILTERS_CONFIG_START",
    "@@si/advanced-search/FETCH_FILTERS_CONFIG_SUCCESS",
    "@@si/advanced-search/FETCH_FILTERS_CONFIG_FAILURE",
)<void, void, FetchError>();

export const fetchSavedSearchesAsync = createAsyncAction(
    "@@si/advanced-search/FETCH_SAVED_SEARCHES_START",
    "@@si/advanced-search/FETCH_SAVED_SEARCHES_SUCCESS",
    "@@si/advanced-search/FETCH_SAVED_SEARCHES_FAILURE",
)<void, SimplifiedSavedSearchDto[], FetchError>();

export const fetchSearchResultsAsync = createAsyncAction(
    "@@si/advanced-search/FETCH_SEARCH_RESULTS_START",
    "@@si/advanced-search/FETCH_SEARCH_RESULTS_SUCCESS",
    "@@si/advanced-search/FETCH_SEARCH_RESULTS_FAILURE",
)<void, SearchResultsResponseDto, FetchError>();

export const saveNewSearchAsync = createAsyncAction(
    "@@si/advanced-search/SAVE_NEW_SEARCH_START",
    "@@si/advanced-search/SAVE_NEW_SEARCH_SUCCESS",
    "@@si/advanced-search/SAVE_NEW_SEARCH_FAILURE",
)<void, SavedSearchDto, FetchError>();

export const fetchSearchByIdAsync = createAsyncAction(
    "@@si/advanced-search/FETCH_SEARCH_BY_ID_START",
    "@@si/advanced-search/FETCH_SEARCH_BY_ID_SUCCESS",
    "@@si/advanced-search/FETCH_SEARCH_BY_ID_FAILURE",
)<void, SavedSearchDto, FetchError>();

export const updateSearchByIdAsync = createAsyncAction(
    "@@si/advanced-search/UPDATE_SEARCH_BY_ID_START",
    "@@si/advanced-search/UPDATE_SEARCH_BY_ID_SUCCESS",
    "@@si/advanced-search/UPDATE_SEARCH_BY_ID_FAILURE",
)<void, SavedSearchDto, FetchError>();

export const deleteSearchByIdAsync = createAsyncAction(
    "@@si/advanced-search/DELETE_SEARCH_BY_ID_START",
    "@@si/advanced-search/DELETE_SEARCH_BY_ID_SUCCESS",
    "@@si/advanced-search/DELETE_SEARCH_BY_ID_FAILURE",
)<void, string, FetchError>();

export const downloadAsExcelAsync = createAsyncAction(
    "@@si/advanced-search/DOWNLOAD_AS_EXCEL_START",
    "@@si/advanced-search/DOWNLOAD_AS_EXCEL_SUCCESS",
    "@@si/advanced-search/DOWNLOAD_AS_EXCEL_FAILURE",
)<void, void, FetchError>();
