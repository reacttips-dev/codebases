import { ThunkDispatchCommon, ThunkGetState } from "store/types";
import { ThunkDependencies } from "store/thunk-dependencies";
import {
    CommonTableFilters,
    IncomingTrafficTableParams,
    OutgoingTrafficTableParams,
} from "../types";
import * as actionCreators from "./action-creators";
import requestParamsHelper from "../services/requestParamsHelper";
import {
    AddOpportunitiesToListDto,
    OpportunityListType,
} from "pages/sales-intelligence/sub-modules/opportunities/types";
import * as actionCreatorsOpportunities from "../../opportunities/store/action-creators";
import { updateListOpportunitiesFromSearchThunk } from "pages/sales-intelligence/sub-modules/opportunities/store/effects";
import { fetchExcelQuotaThunk } from "../../common/store/effects";

export const fetchOutgoingTrafficTableThunk = (
    params: OutgoingTrafficTableParams,
    filters: CommonTableFilters,
) => async (dispatch: ThunkDispatchCommon, getState: ThunkGetState, deps: ThunkDependencies) => {
    dispatch(actionCreators.fetchOutgoingTrafficTableAsync.request());

    const requestParams: OutgoingTrafficTableParams = requestParamsHelper.buildOutgoingRequestParams(
        params,
        filters,
    );

    try {
        const {
            AllCategories,
            ...rest
        } = await deps.si.api.competitorCustomers.fetchOutgoingTrafficTable(requestParams);

        dispatch(actionCreators.fetchOutgoingTrafficTableAsync.success(rest));
        dispatch(actionCreators.setOutgoingTrafficCategoriesAction(AllCategories));
    } catch (e) {
        dispatch(actionCreators.fetchOutgoingTrafficTableAsync.failure(e));
    }
};

export const fetchOutgoingTrafficWithUpdateListOpportunitiesThunk = (
    params,
    filters,
    list: OpportunityListType,
    opportunities: string[] | number,
) => async (dispatch: ThunkDispatchCommon, getState: ThunkGetState, deps: ThunkDependencies) => {
    let topOpportunities = { opportunities };

    dispatch(actionCreatorsOpportunities.updateListOpportunitiesAsync.request());

    if (!Array.isArray(opportunities)) {
        const requestParams: OutgoingTrafficTableParams = requestParamsHelper.buildOutgoingRequestParams(
            { ...params, pageSize: opportunities },
            filters,
        );

        try {
            const { Records } = await deps.si.api.competitorCustomers.fetchOutgoingTrafficTable(
                requestParams,
            );
            topOpportunities = { opportunities: Records.map(({ Domain }) => Domain) };
        } catch (e) {
            dispatch(actionCreatorsOpportunities.updateListOpportunitiesAsync.failure(e));
            return;
        }
    }

    await dispatch(
        updateListOpportunitiesFromSearchThunk(list, topOpportunities as AddOpportunitiesToListDto),
    );
};

export const fetchIncomingTrafficWithUpdateListOpportunitiesThunk = (
    params,
    filters,
    list: OpportunityListType,
    opportunities: string[] | number,
) => {
    return async (dispatch: ThunkDispatchCommon, _: ThunkGetState, deps: ThunkDependencies) => {
        dispatch(actionCreatorsOpportunities.updateListOpportunitiesAsync.request());
        let topOpportunities = { opportunities };

        if (!Array.isArray(opportunities)) {
            const requestParams: IncomingTrafficTableParams = requestParamsHelper.buildIncomingRequestParams(
                { ...params, pageSize: opportunities },
                filters,
            );

            try {
                const { Records } = await deps.si.api.competitorCustomers.fetchIncomingTrafficTable(
                    requestParams,
                );
                topOpportunities = { opportunities: Records.map(({ Domain }) => Domain) };
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

export const fetchIncomingTrafficTableThunk = (
    params: IncomingTrafficTableParams,
    filters: CommonTableFilters,
) => async (dispatch: ThunkDispatchCommon, getState: ThunkGetState, deps: ThunkDependencies) => {
    dispatch(actionCreators.fetchIncomingTrafficTableAsync.request());

    const requestParams: IncomingTrafficTableParams = requestParamsHelper.buildIncomingRequestParams(
        params,
        filters,
    );

    try {
        const {
            AllCategories,
            ...rest
        } = await deps.si.api.competitorCustomers.fetchIncomingTrafficTable(requestParams);

        dispatch(actionCreators.fetchIncomingTrafficTableAsync.success(rest));
        dispatch(actionCreators.setIncomingTrafficCategoriesAction(AllCategories));
    } catch (e) {
        dispatch(actionCreators.fetchIncomingTrafficTableAsync.failure(e));
    }
};

export const downloadOutgoingTableExcelThunk = (
    params: OutgoingTrafficTableParams,
    filters: CommonTableFilters,
    domains: number | string[],
) => async (dispatch: ThunkDispatchCommon, getState: ThunkGetState, deps: ThunkDependencies) => {
    let result;
    dispatch(actionCreators.downloadOutgoingTableExcelAsync.request());

    const requestParams: OutgoingTrafficTableParams = requestParamsHelper.buildOutgoingRequestParams(
        params,
        filters,
    );
    if (Array.isArray(domains)) {
        result = await deps.si.api.competitorCustomers.downloadSelectedOutgoingTableExcel({
            ...requestParams,
            body: domains,
        });
    } else {
        result = await deps.si.api.competitorCustomers.downloadTopOutgoingTableExcel({
            ...requestParams,
            top: domains,
        });
    }

    if (result.success) {
        dispatch(actionCreators.downloadOutgoingTableExcelAsync.success());
        await dispatch(fetchExcelQuotaThunk());
    } else {
        dispatch(actionCreators.downloadOutgoingTableExcelAsync.failure(result.error));
    }
};

export const downloadIncomingTableExcelThunk = (
    params: IncomingTrafficTableParams,
    filters: CommonTableFilters,
    domains: number | string[],
) => async (dispatch: ThunkDispatchCommon) => {
    const requestParams: IncomingTrafficTableParams = requestParamsHelper.buildIncomingRequestParams(
        params,
        filters,
    );

    if (Array.isArray(domains)) {
        await dispatch(
            downloadIncomingSelectedDomainsTableExcelThunk({ ...requestParams, body: domains }),
        );
    } else {
        await dispatch(
            downloadIncomingTopDomainsTableExcelThunk({ ...requestParams, top: domains as number }),
        );
    }
};

const downloadIncomingTopDomainsTableExcelThunk = (params: IncomingTrafficTableParams) => async (
    dispatch: ThunkDispatchCommon,
    getState: ThunkGetState,
    deps: ThunkDependencies,
) => {
    dispatch(actionCreators.downloadIncomingTableExcelAsync.request());
    try {
        const result = await deps.si.api.competitorCustomers.downloadTopIncomingTableExcel(params);

        if (result.success) {
            dispatch(actionCreators.downloadIncomingTableExcelAsync.success());
            await dispatch(fetchExcelQuotaThunk());
        } else {
            dispatch(actionCreators.downloadIncomingTableExcelAsync.failure(result.error));
        }
    } catch (error) {
        dispatch(actionCreators.downloadIncomingTableExcelAsync.failure(error));
    }
};

const downloadIncomingSelectedDomainsTableExcelThunk = (
    params: IncomingTrafficTableParams,
) => async (dispatch: ThunkDispatchCommon, getState: ThunkGetState, deps: ThunkDependencies) => {
    dispatch(actionCreators.downloadIncomingTableExcelAsync.request());
    try {
        const result = await deps.si.api.competitorCustomers.downloadSelectedIncomingTableExcel(
            params,
        );

        if (result.success) {
            dispatch(actionCreators.downloadIncomingTableExcelAsync.success());
            await dispatch(fetchExcelQuotaThunk());
        } else {
            dispatch(actionCreators.downloadIncomingTableExcelAsync.failure(result.error));
        }
    } catch (error) {
        dispatch(actionCreators.downloadIncomingTableExcelAsync.failure(error));
    }
};
