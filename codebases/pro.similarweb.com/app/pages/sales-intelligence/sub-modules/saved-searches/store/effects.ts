import _ from "lodash";
import {
    CreateSearchDto,
    QueryDefinition,
    SavedSearchType,
    SearchRun,
    SearchTableDataParams,
    SaveSearchDto,
    SearchTableExcelDownloadParams,
} from "../types";
import { ThunkDispatchCommon, ThunkGetState } from "store/types";
import { ThunkDependencies } from "store/thunk-dependencies";
import * as actionCreators from "./action-creators";
import { getSearchId, getSearchName, legacyTransformTechnologiesFilters } from "../helpers";
import {
    AddOpportunitiesToListDto,
    OpportunityListType,
} from "pages/sales-intelligence/sub-modules/opportunities/types";
import * as actionCreatorsOpportunities from "pages/sales-intelligence/sub-modules/opportunities/store/action-creators";
import { updateListOpportunitiesFromSearchThunk } from "pages/sales-intelligence/sub-modules/opportunities/store/effects";
import { fetchExcelQuotaThunk } from "pages/sales-intelligence/sub-modules/common/store/effects";

export const createSearchThunk = (dto: CreateSearchDto) => async (
    dispatch: ThunkDispatchCommon,
    getState: ThunkGetState,
    deps: ThunkDependencies,
) => {
    dispatch(actionCreators.createSearchAsync.request(dto));

    try {
        const result = await deps.si.api.searches.createSearch(dto);
        const withTransformedFilters = {
            ...dto,
            ...result,
            // FIXME: Copied from LeadGeneratorWizard
            filters: _.fromPairs(
                Object.entries(dto.filters).map(
                    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                    // @ts-ignore
                    ([filterName, filterData]: [string, { toClientData?: () => any }]) => {
                        if (!filterData.toClientData) {
                            return [filterName, filterData];
                        } else {
                            return [filterName, filterData.toClientData()];
                        }
                    },
                ),
            ),
        };

        dispatch(actionCreators.createSearchAsync.success(withTransformedFilters));
    } catch (e) {
        dispatch(actionCreators.createSearchAsync.failure(e));
    }
};

export const saveSearchThunk = (queryId: QueryDefinition["id"], dto: SaveSearchDto) => async (
    dispatch: ThunkDispatchCommon,
    getState: ThunkGetState,
    deps: ThunkDependencies,
) => {
    dispatch(actionCreators.saveSearchAsync.request());

    try {
        const result = await deps.si.api.searches.updateSearch(queryId, dto);

        dispatch(
            actionCreators.saveSearchAsync.success(legacyTransformTechnologiesFilters(result)),
        );
    } catch (e) {
        dispatch(actionCreators.saveSearchAsync.failure(e));
    }
};

export const fetchSearchTableDataThunk = (
    queryId: QueryDefinition["id"],
    runId: SearchRun["id"],
    params: SearchTableDataParams = {
        // TODO
        newLeadsOnly: false,
        excludeUserLeads: true,
    },
) => async (dispatch: ThunkDispatchCommon, getState: ThunkGetState, deps: ThunkDependencies) => {
    dispatch(actionCreators.fetchSearchTableDataAsync.request());

    try {
        const result = await deps.si.api.searches.fetchSearchTableData(queryId, runId, params);

        dispatch(actionCreators.fetchSearchTableDataAsync.success(result));
    } catch (e) {
        dispatch(actionCreators.fetchSearchTableDataAsync.failure(e));
    }
};

export const updateSavedSearchThunk = (
    savedSearch: SavedSearchType,
    autoRerunActivated: boolean,
) => async (dispatch: ThunkDispatchCommon, getState: ThunkGetState, deps: ThunkDependencies) => {
    dispatch(actionCreators.updateSavedSearchAsync.request());

    try {
        const result = await deps.si.api.searches.updateSearch(getSearchId(savedSearch), {
            autoRerunActivated,
            name: getSearchName(savedSearch),
        });

        dispatch(
            actionCreators.updateSavedSearchAsync.success(
                legacyTransformTechnologiesFilters(result),
            ),
        );
    } catch (e) {
        dispatch(actionCreators.updateSavedSearchAsync.failure(e));
    }
};

export const deleteSavedSearchThunk = (id: QueryDefinition["id"]) => async (
    dispatch: ThunkDispatchCommon,
    getState: ThunkGetState,
    deps: ThunkDependencies,
) => {
    dispatch(actionCreators.deleteSavedSearchAsync.request());

    try {
        await deps.si.api.searches.deleteSearch(id);

        dispatch(actionCreators.deleteSavedSearchAsync.success(id));
    } catch (e) {
        dispatch(actionCreators.deleteSavedSearchAsync.failure(e));
    }
};

export const downloadSearchTableExcelThunk = (
    params: SearchTableExcelDownloadParams,
    domains: string[] | number,
) => async (dispatch: ThunkDispatchCommon, getState: ThunkGetState, deps: ThunkDependencies) => {
    dispatch(actionCreators.downloadSearchTableExcelAsync.request());
    let result;

    if (Array.isArray(domains)) {
        result = await deps.si.api.searches.downloadSelectedSearchTableExcel({
            ...params,
            body: domains,
        });
    } else {
        result = await deps.si.api.searches.downloadTopSearchTableExcel({
            ...params,
            top: domains,
        });
    }

    if (result.success) {
        const countDomains = Array.isArray(domains) ? domains.length : domains;
        dispatch(actionCreators.downloadSearchTableExcelAsync.success(countDomains));
        await dispatch(fetchExcelQuotaThunk());
    } else {
        dispatch(actionCreators.downloadSearchTableExcelAsync.failure(result.error));
    }
};

export const fetchUpdateListOpportunitiesThunk = (
    queryId: string,
    runId: string,
    params: SearchTableDataParams,
    list: OpportunityListType,
    opportunities: string[] | number,
) => {
    return async (
        dispatch: ThunkDispatchCommon,
        getState: ThunkGetState,
        deps: ThunkDependencies,
    ) => {
        dispatch(actionCreatorsOpportunities.updateListOpportunitiesAsync.request());
        let topOpportunities = { opportunities };

        if (!Array.isArray(opportunities)) {
            try {
                const { records } = await deps.si.api.searches.fetchSearchTableData(
                    queryId,
                    runId,
                    {
                        ...params,
                        pageSize: opportunities,
                    },
                );
                topOpportunities = { opportunities: records.map(({ site }) => site) };
            } catch (e) {
                dispatch(actionCreatorsOpportunities.updateListOpportunitiesAsync.failure(e));
                return;
            }
        }

        await dispatch(
            updateListOpportunitiesFromSearchThunk(
                list,
                topOpportunities as AddOpportunitiesToListDto,
            ),
        );
    };
};

export const fetchTechnologiesFiltersThunk = () => async (
    dispatch: ThunkDispatchCommon,
    getState: ThunkGetState,
    deps: ThunkDependencies,
) => {
    dispatch(actionCreators.fetchTechnologiesFiltersAsync.request());

    try {
        const result = await deps.si.api.searches.fetchTechnologiesFilters();

        dispatch(actionCreators.fetchTechnologiesFiltersAsync.success(result));
    } catch (e) {
        dispatch(actionCreators.fetchTechnologiesFiltersAsync.failure(e));
    }
};
