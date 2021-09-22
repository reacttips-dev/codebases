import { ThunkDispatchCommon, ThunkGetState } from "store/types";
import * as actionCreators from "pages/sales-intelligence/sub-modules/industries/store/action-creators";
import { ThunkDependencies } from "store/thunk-dependencies";
import { fetchExcelQuotaThunk } from "pages/sales-intelligence/sub-modules/common/store/effects";
import {
    AddOpportunitiesToListDto,
    OpportunityListType,
} from "pages/sales-intelligence/sub-modules/opportunities/types";
import * as actionCreatorsOpportunities from "pages/sales-intelligence/sub-modules/opportunities/store/action-creators";
import { updateListOpportunitiesFromSearchThunk } from "pages/sales-intelligence/sub-modules/opportunities/store/effects";
import { FilterIndustryTableConfig } from "pages/sales-intelligence/sub-modules/industries/types";

export const fetchIndustriesTableDataThunk = (
    url: string,
    params: Pick<FilterIndustryTableConfig, "params">,
    page: number,
) => async (dispatch: ThunkDispatchCommon, _: ThunkGetState, deps: ThunkDependencies) => {
    dispatch(actionCreators.fetchingTableDataAction(true));

    try {
        const tableData = await deps.si.api.industries.fetchTableData(url, { ...params, page });

        dispatch(actionCreators.fetchTableAsync.success({ ...tableData, page }));
    } catch (e) {
        dispatch(actionCreators.fetchingTableDataAction(false));
    }
};

export const downloadListTableExcelThunk = (url: string, domains: number | string[]) => async (
    dispatch: ThunkDispatchCommon,
    getState: ThunkGetState,
    deps: ThunkDependencies,
) => {
    dispatch(actionCreators.downloadExcelAsync.request());
    let result;
    if (Array.isArray(domains)) {
        result = await deps.si.api.industries.downloadSelectedListTableExcel(url, domains);
    } else {
        result = await deps.si.api.industries.downloadTopListTableExcel(url);
    }

    if (result.success) {
        dispatch(actionCreators.downloadExcelAsync.success());
        await dispatch(fetchExcelQuotaThunk());
    } else {
        dispatch(actionCreators.downloadExcelAsync.failure(result.error));
    }
};

export const updateListOpportunitiesThunk = (
    url: string,
    params: Partial<FilterIndustryTableConfig>,
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
                const { Data } = await deps.si.api.industries.fetchTableData(url, params);
                topOpportunities = { opportunities: Data.map(({ Domain }) => Domain) };
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
