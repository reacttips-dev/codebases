import { ThunkDispatchCommon, ThunkGetState } from "store/types";
import { ThunkDependencies } from "store/thunk-dependencies";
import * as actions from "../action-creators";
import { buildParams } from "../../utils";
import { fetchIncomingTrafficWithUpdateListOpportunitiesThunk } from "pages/sales-intelligence/sub-modules/competitor-customers/store/effects";
import * as actionCreatorsOpportunities from "pages/sales-intelligence/sub-modules/opportunities/store/action-creators";
import { OutgoingTrafficTableParams } from "pages/sales-intelligence/sub-modules/competitor-customers/types";
import requestParamsHelper from "pages/sales-intelligence/sub-modules/competitor-customers/services/requestParamsHelper";
import { updateListOpportunitiesFromSearchThunk } from "pages/sales-intelligence/sub-modules/opportunities/store/effects";
import {
    AddOpportunitiesToListDto,
    OpportunityListType,
} from "pages/sales-intelligence/sub-modules/opportunities/types";
import { fetchExcelQuotaThunk } from "pages/sales-intelligence/sub-modules/common/store/effects";

export const fetchTotalThunk = (params, filters) => async (
    dispatch: ThunkDispatchCommon,
    getState: ThunkGetState,
    deps: ThunkDependencies,
) => {
    dispatch(actions.fetchTotalTableAsync.request());
    const requestParams = buildParams(params, filters);
    try {
        const { AllCategories, ...rest } = await deps.si.api.keywordLeads.fetchTotalTable(
            requestParams,
        );

        dispatch(actions.fetchTotalTableAsync.success(rest));
        dispatch(actions.setTotalCategoriesAction(AllCategories));
    } catch (e) {
        dispatch(actions.fetchTotalTableAsync.failure(e));
    }
};

export const fetchTotalWithUpdateListOpportunitiesThunk = (
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
            const { Data } = await deps.si.api.keywordLeads.fetchTotalTable({
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

export const downloadTotalExcelThunk = (params, filters, domains: number | string[]) => async (
    dispatch: ThunkDispatchCommon,
    getState: ThunkGetState,
    deps: ThunkDependencies,
) => {
    dispatch(actions.downloadTotalExcelAsync.request());
    let result;
    const requestParams = buildParams(params, filters);

    if (Array.isArray(domains)) {
        result = await deps.si.api.keywordLeads.downloadSelectedTotalTableExcel({
            ...requestParams,
            body: domains,
        });
    } else {
        result = await deps.si.api.keywordLeads.downloadTopTotalTableExcel({
            ...requestParams,
            top: domains as number,
        });
    }

    if (result.success) {
        dispatch(actions.downloadTotalExcelAsync.success());
        await dispatch(fetchExcelQuotaThunk());
    } else {
        dispatch(actions.downloadTotalExcelAsync.failure(result.error));
    }
};
