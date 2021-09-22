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

export const fetchMobileThunk = (params, filters) => async (
    dispatch: ThunkDispatchCommon,
    getState: ThunkGetState,
    deps: ThunkDependencies,
) => {
    dispatch(actions.fetchMobileTableAsync.request());

    const requestParams = buildParams(params, filters);

    try {
        const { AllCategories, ...rest } = await deps.si.api.keywordLeads.fetchMobileTable(
            requestParams,
        );

        dispatch(actions.fetchMobileTableAsync.success(rest));
        dispatch(actions.setMobileCategoriesAction(AllCategories));
    } catch (e) {
        dispatch(actions.fetchMobileTableAsync.failure(e));
    }
};

export const fetchMobileWithUpdateListOpportunitiesThunk = (
    params,
    filters,
    list: OpportunityListType,
    opportunities: string[] | number,
) => async (dispatch, getState, deps: ThunkDependencies) => {
    let topOpportunities = { opportunities };

    dispatch(actionCreatorsOpportunities.updateListOpportunitiesAsync.request());

    if (!Array.isArray(opportunities)) {
        const requestParams = buildParams(params, filters);

        try {
            const { Data } = await deps.si.api.keywordLeads.fetchMobileTable({
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

export const downloadMobileExcelThunk = (params, filters, domains: number | string) => async (
    dispatch: ThunkDispatchCommon,
    getState: ThunkGetState,
    deps: ThunkDependencies,
) => {
    let result;

    dispatch(actions.downloadMobileExcelAsync.request());

    const requestParams = buildParams(params, filters);

    if (Array.isArray(domains)) {
        result = await deps.si.api.keywordLeads.downloadSelectedMobileTableExcel({
            ...requestParams,
            body: domains,
        });
    } else {
        result = await deps.si.api.keywordLeads.downloadTopMobileTableExcel({
            ...requestParams,
            top: domains as number,
        });
    }

    if (result.success) {
        dispatch(actions.downloadMobileExcelAsync.success());
        await dispatch(fetchExcelQuotaThunk());
    } else {
        dispatch(actions.downloadMobileExcelAsync.failure(result.error));
    }
};
