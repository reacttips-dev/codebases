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

export const fetchPaidThunk = (params, filters) => async (
    dispatch: ThunkDispatchCommon,
    getState: ThunkGetState,
    deps: ThunkDependencies,
) => {
    dispatch(actions.fetchPaidTableAsync.request());

    const requestParams = buildParams(params, filters);

    try {
        const { AllCategories, ...rest } = await deps.si.api.keywordLeads.fetchPaidTable(
            requestParams,
        );

        dispatch(actions.fetchPaidTableAsync.success(rest));
        dispatch(actions.setPaidCategoriesAction(AllCategories));
    } catch (e) {
        dispatch(actions.fetchPaidTableAsync.failure(e));
    }
};

export const fetchPaidWithUpdateListOpportunitiesThunk = (
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
            const { Data } = await deps.si.api.keywordLeads.fetchPaidTable({
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

export const downloadPaidExcelThunk = (params, filters, domains: number | string[]) => async (
    dispatch: ThunkDispatchCommon,
    getState: ThunkGetState,
    deps: ThunkDependencies,
) => {
    let result;

    dispatch(actions.downloadPaidExcelAsync.request());

    const requestParams = buildParams(params, filters);

    if (Array.isArray(domains)) {
        result = await deps.si.api.keywordLeads.downloadSelectedPaidTableExcel({
            ...requestParams,
            body: domains,
        });
    } else {
        result = await deps.si.api.keywordLeads.downloadTopPaidTableExcel({
            ...requestParams,
            top: domains as number,
        });
    }

    if (result.success) {
        dispatch(actions.downloadPaidExcelAsync.success());
        await dispatch(fetchExcelQuotaThunk());
    } else {
        dispatch(actions.downloadPaidExcelAsync.failure(result.error));
    }
};
