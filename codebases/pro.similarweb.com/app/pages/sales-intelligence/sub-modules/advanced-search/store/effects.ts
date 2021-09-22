import { ThunkDispatchCommon, ThunkGetState } from "store/types";
import * as ac from "./action-creators";
import { createSearchDto, createSearchResultsRequestDto } from "../helpers/filters";
import { ThunkDependencies } from "store/thunk-dependencies";
import { OpportunityListType } from "pages/sales-intelligence/sub-modules/opportunities/types";
import { updateListOpportunitiesFromSearchThunk } from "pages/sales-intelligence/sub-modules/opportunities/store/effects";
import { SupportedFilterType } from "../types/filters";
import { setWorkspaceId } from "../../common/store/action-creators";
import { SavedSearchDto, SearchTableFiltersType } from "../types/common";
import { SEARCH_RESULTS_TABLE_INITIAL_PAGE } from "../constants/table";
import {
    selectCurrentSearchObject,
    selectFiltersInReadyState,
    selectTableFilters,
} from "../store/selectors";

export const fetchFiltersConfigThunk = () => async (
    dispatch: ThunkDispatchCommon,
    _: ThunkGetState,
    deps: ThunkDependencies,
) => {
    dispatch(ac.fetchFiltersConfigAsync.request());

    try {
        const config = await deps.si.api.advancedSearch.fetchFiltersConfiguration();
        const {
            filtersInReadyState,
            filtersInDirtyState,
        } = deps.si.advancedSearchFiltersManager.initFiltersFromConfig(config);

        dispatch(
            ac.initFiltersInBothStatesAction({
                filtersInReadyState,
                filtersInDirtyState,
            }),
        );
        dispatch(ac.fetchFiltersConfigAsync.success());
    } catch (e) {
        dispatch(ac.fetchFiltersConfigAsync.failure(e));
    }
};

export const fetchSavedSearchesThunk = () => async (
    dispatch: ThunkDispatchCommon,
    _: ThunkGetState,
    deps: ThunkDependencies,
) => {
    dispatch(ac.fetchSavedSearchesAsync.request());

    try {
        const savedSearches = await deps.si.api.advancedSearch.fetchAllSavedSearches();

        dispatch(ac.fetchSavedSearchesAsync.success(savedSearches));
    } catch (e) {
        dispatch(ac.fetchSavedSearchesAsync.failure(e));
    }
};

export const fetchSearchResultsThunk = (
    filters: SupportedFilterType[],
    tableFilters: SearchTableFiltersType,
) => async (dispatch: ThunkDispatchCommon, getState: ThunkGetState, deps: ThunkDependencies) => {
    dispatch(ac.fetchSearchResultsAsync.request());

    try {
        const dto = createSearchResultsRequestDto(filters, tableFilters);
        const response = await deps.si.api.advancedSearch.fetchSearchResults(dto);

        return dispatch(ac.fetchSearchResultsAsync.success(response));
    } catch (e) {
        if (e?.name !== "AbortError") {
            dispatch(ac.fetchSearchResultsAsync.failure(e));
        }
    }
};

export const saveNewSearchThunk = (name: string) => async (
    dispatch: ThunkDispatchCommon,
    getState: ThunkGetState,
    deps: ThunkDependencies,
) => {
    dispatch(ac.saveNewSearchAsync.request());

    const tableFilters = selectTableFilters(getState());
    const filters = selectFiltersInReadyState(getState());

    try {
        const dto = createSearchDto(name, filters, tableFilters);
        const savedSearch = await deps.si.api.advancedSearch.saveNewSearch(dto);

        dispatch(ac.saveNewSearchAsync.success(savedSearch));
    } catch (e) {
        dispatch(ac.saveNewSearchAsync.failure(e));
    }
};

export const fetchSearchByIdThunk = (id: string) => async (
    dispatch: ThunkDispatchCommon,
    getState: ThunkGetState,
    deps: ThunkDependencies,
) => {
    dispatch(ac.fetchSearchByIdAsync.request());

    try {
        const savedSearch = await deps.si.api.advancedSearch.fetchSearchById(id);

        dispatch(ac.fetchSearchByIdAsync.success(savedSearch));
    } catch (e) {
        dispatch(ac.fetchSearchByIdAsync.failure(e));
    }
};

export const updateSearchThunk = (newName?: SavedSearchDto["name"]) => async (
    dispatch: ThunkDispatchCommon,
    getState: ThunkGetState,
    deps: ThunkDependencies,
) => {
    dispatch(ac.updateSearchByIdAsync.request());

    const state = getState();
    const { searchId, name } = selectCurrentSearchObject(state);
    const tableFilters = selectTableFilters(state);
    const filters = selectFiltersInReadyState(state);

    try {
        const dto = createSearchDto(newName ?? name, filters, tableFilters);
        const result = await deps.si.api.advancedSearch.updateSearchById(searchId, dto);

        dispatch(ac.updateSearchByIdAsync.success(result));
    } catch (e) {
        dispatch(ac.updateSearchByIdAsync.failure(e));
    }
};

export const deleteSearchThunk = (id: SavedSearchDto["searchId"]) => async (
    dispatch: ThunkDispatchCommon,
    getState: ThunkGetState,
    deps: ThunkDependencies,
) => {
    dispatch(ac.deleteSearchByIdAsync.request());

    try {
        await deps.si.api.advancedSearch.deleteSearchById(id);

        dispatch(ac.deleteSearchByIdAsync.success(id));
    } catch (e) {
        dispatch(ac.deleteSearchByIdAsync.failure(e));
    }
};

export const fetchUserWorkspaceIdThunk = () => async (
    dispatch: ThunkDispatchCommon,
    getState: ThunkGetState,
    deps: ThunkDependencies,
) => {
    try {
        const { workspaceId } = await deps.si.api.advancedSearch.fetchUserWorkspaceId();

        dispatch(setWorkspaceId(workspaceId));
    } catch (e) {
        // TODO: Handle error somehow
    }
};

export const addDomainsToListThunk = (list: OpportunityListType, domains: string[]) => async (
    dispatch: ThunkDispatchCommon,
) => {
    await dispatch(updateListOpportunitiesFromSearchThunk(list, { opportunities: domains }));
};

export const addTopNDomainsToListThunk = (
    list: OpportunityListType,
    numberOfDomains: number,
) => async (dispatch: ThunkDispatchCommon, getState: ThunkGetState, deps: ThunkDependencies) => {
    const state = getState();
    const tableFilters = selectTableFilters(state);
    const filters = selectFiltersInReadyState(state);
    const dto = createSearchResultsRequestDto(filters, {
        ...tableFilters,
        page: SEARCH_RESULTS_TABLE_INITIAL_PAGE,
        pageSize: numberOfDomains,
    });

    try {
        const response = await deps.si.api.advancedSearch.fetchSearchResults(dto);
        const domains = response.rows.map((row) => row.site);

        await dispatch(updateListOpportunitiesFromSearchThunk(list, { opportunities: domains }));
    } catch (e) {
        // TODO: Handle error somehow
    }
};
