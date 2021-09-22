import { ThunkDispatchCommon, ThunkGetState } from "store/types";
import { ThunkDependencies } from "store/thunk-dependencies";
import * as actions from "../action-creators";
import { buildParams } from "../../utils";
import {
    AddOpportunitiesToListDto,
    OpportunityListType,
} from "pages/sales-intelligence/sub-modules/opportunities/types";
import * as actionCreatorsOpportunities from "pages/sales-intelligence/sub-modules/opportunities/store/action-creators";
import { updateListOpportunitiesFromSearchThunk } from "pages/sales-intelligence/sub-modules/opportunities/store/effects";
import { fetchExcelQuotaThunk } from "pages/sales-intelligence/sub-modules/common/store/effects";

export const fetchOrganicThunk = (params, filters) => async (
    dispatch: ThunkDispatchCommon,
    getState: ThunkGetState,
    deps: ThunkDependencies,
) => {
    dispatch(actions.fetchOrganicTableAsync.request());

    const requestParams = buildParams(params, filters);

    try {
        const { AllCategories, ...rest } = await deps.si.api.keywordLeads.fetchOrganicTable(
            requestParams,
        );

        dispatch(actions.fetchOrganicTableAsync.success(rest));
        dispatch(actions.setOrganicCategoriesAction(AllCategories));
    } catch (e) {
        dispatch(actions.fetchOrganicTableAsync.failure(e));
    }
};

export const fetchOrganicWithUpdateListOpportunitiesThunk = (
    params,
    filters,
    list: OpportunityListType,
    opportunities: string[] | number,
) => async (dispatch: ThunkDispatchCommon, getState: ThunkGetState, deps: ThunkDependencies) => {
    let topOpportunities = { opportunities };

    dispatch(actionCreatorsOpportunities.updateListOpportunitiesAsync.request());

    if (!Array.isArray(opportunities)) {
        const requestParams = buildParams(params, filters);

        try {
            const { Data } = await deps.si.api.keywordLeads.fetchOrganicTable({
                ...requestParams,
                pageSize: opportunities,
            });
            topOpportunities = { opportunities: Data.map(({ Domain }) => Domain) };
        } catch (e) {
            dispatch(actionCreatorsOpportunities.updateListOpportunitiesAsync.failure(e));
            return;
        }
    }

    await dispatch(
        updateListOpportunitiesFromSearchThunk(list, topOpportunities as AddOpportunitiesToListDto),
    );
};

export const downloadOrganicExcelThunk = (params, filters, domains: number | string[]) => async (
    dispatch: ThunkDispatchCommon,
    getState: ThunkGetState,
    deps: ThunkDependencies,
) => {
    let result;
    dispatch(actions.downloadOrganicExcelAsync.request());

    const requestParams = buildParams(params, filters);

    if (Array.isArray(domains)) {
        result = await deps.si.api.keywordLeads.downloadSelectedOrganicTableExcel({
            ...requestParams,
            body: domains,
        });
    } else {
        result = await deps.si.api.keywordLeads.downloadTopOrganicTableExcel({
            ...requestParams,
            top: domains as number,
        });
    }

    if (result.success) {
        dispatch(actions.downloadOrganicExcelAsync.success());
        await dispatch(fetchExcelQuotaThunk());
    } else {
        dispatch(actions.downloadOrganicExcelAsync.failure(result.error));
    }
};
