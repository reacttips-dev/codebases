import { createAction, createAsyncAction } from "typesafe-actions";
import {
    CreateSearchResponseDto,
    SavedSearchType,
    SearchTableDataResponseDto,
    CreateSearchDto,
    QueryDefinition,
} from "../types";
import { FetchError } from "../../../types";
import { ICategoriesResponse } from "pages/lead-generator/lead-generator-new/components/filters/TechnographicsBoxFilter";

export const fetchSavedSearchesAsync = createAsyncAction(
    "@@si/saved-searches/FETCH_SEARCHES_START",
    "@@si/saved-searches/FETCH_SEARCHES_SUCCESS",
    "@@si/saved-searches/FETCH_SEARCHES_FAILURE",
)<undefined, SavedSearchType[], FetchError>();

export const createSearchAsync = createAsyncAction(
    "@@si/saved-searches/CREATE_SEARCH_START",
    "@@si/saved-searches/CREATE_SEARCH_SUCCESS",
    "@@si/saved-searches/CREATE_SEARCH_FAILURE",
)<CreateSearchDto, CreateSearchResponseDto, FetchError>();

export const fetchSearchTableDataAsync = createAsyncAction(
    "@@si/saved-searches/FETCH_SEARCH_TABLE_DATA_START",
    "@@si/saved-searches/FETCH_SEARCH_TABLE_DATA_SUCCESS",
    "@@si/saved-searches/FETCH_SEARCH_TABLE_DATA_FAILURE",
)<void, SearchTableDataResponseDto, FetchError>();

export const saveSearchAsync = createAsyncAction(
    "@@si/saved-searches/SAVE_SEARCH_START",
    "@@si/saved-searches/SAVE_SEARCH_SUCCESS",
    "@@si/saved-searches/SAVE_SEARCH_FAILURE",
)<void, SavedSearchType, FetchError>();

export const updateSavedSearchAsync = createAsyncAction(
    "@@si/saved-searches/UPDATE_SAVED_SEARCH_START",
    "@@si/saved-searches/UPDATE_SAVED_SEARCH_SUCCESS",
    "@@si/saved-searches/UPDATE_SAVED_SEARCH_FAILURE",
)<void, SavedSearchType, FetchError>();

export const deleteSavedSearchAsync = createAsyncAction(
    "@@si/saved-searches/DELETE_SAVED_SEARCH_START",
    "@@si/saved-searches/DELETE_SAVED_SEARCH_SUCCESS",
    "@@si/saved-searches/DELETE_SAVED_SEARCH_FAILURE",
)<void, QueryDefinition["id"], FetchError>();

export const downloadSearchTableExcelAsync = createAsyncAction(
    "@@si/saved-searches/DOWNLOAD_TABLE_EXCEL_START",
    "@@si/saved-searches/DOWNLOAD_TABLE_EXCEL_SUCCESS",
    "@@si/saved-searches/DOWNLOAD_TABLE_EXCEL_FAILURE",
)<void, number, FetchError>();

export const fetchTechnologiesFiltersAsync = createAsyncAction(
    "@@si/saved-searches/FETCH_TECHNOLOGIES_FILTERS_START",
    "@@si/saved-searches/FETCH_TECHNOLOGIES_FILTERS_SUCCESS",
    "@@si/saved-searches/FETCH_TECHNOLOGIES_FILTERS_FAILURE",
)<void, ICategoriesResponse, FetchError>();

export const toggleSaveSearchModal = createAction("@@si/saved-searches/TOGGLE_SAVE_SEARCH_MODAL")<
    boolean
>();

export const toggleSavedSearchSettingsModal = createAction(
    "@@si/saved-searches/TOGGLE_SAVED_SEARCH_SETTINGS_MODAL",
)<boolean>();

export const resetReportResult = createAction("@@si/saved-searches/RESET_REPORT_RESULT")();

export const removeSavedSearchAction = createAction("@@si/saved-searches/REMOVE_SAVED_SEARCH")<
    QueryDefinition["id"]
>();

export const updateSearchUsedResultCount = createAction("@@si/saved-searches/UPDATE_RESULT_COUNT")<{
    searchQueryId: SavedSearchType["queryDefinition"]["id"];
    count: SavedSearchType["queryDefinition"]["used_result_count"];
}>();

// TOTO: Remove after table rewrite
export const setSearchTableResultsCount = createAction(
    "@@si/saved-searches/SET_TABLE_RESULTS_COUNT",
)<number>();
