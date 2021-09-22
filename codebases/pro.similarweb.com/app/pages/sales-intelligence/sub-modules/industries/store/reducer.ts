import { createReducer } from "typesafe-actions";
import * as actionCreators from "./action-creators";
import { IndustryTableState } from "pages/sales-intelligence/sub-modules/industries/types";
import { MAX_DOMAINS_IN_CATEGORY } from "components/customCategoriesWizard/custom-categories-wizard-react";

const INITIAL_INDUSTRIES_STATE: IndustryTableState = {
    tableData: {
        Records: [],
        TotalCount: 0,
        pageSize: MAX_DOMAINS_IN_CATEGORY,
    },
    tableFilters: {
        category: [],
        sourceType: [],
    },
    fetchingData: false,
    excelDownloading: false,
};

const IndustriesReducer = createReducer(INITIAL_INDUSTRIES_STATE)
    .handleAction(actionCreators.fetchTableAsync.success, (state, { payload }) => {
        return {
            ...state,
            tableData: {
                Records: payload.Data,
                TotalCount: payload.TotalCount,
                page: payload.page,
            },
            tableFilters: {
                ...state.tableFilters,
                ...payload.Filters,
            },
            fetchingData: false,
        };
    })
    .handleAction(actionCreators.fetchingTableDataAction, (state, { payload }) => ({
        ...state,
        fetchingData: payload,
    }))
    .handleAction(actionCreators.downloadExcelAsync.request, (state) => ({
        ...state,
        excelDownloading: true,
    }))
    .handleAction(actionCreators.downloadExcelAsync.success, (state) => ({
        ...state,
        excelDownloading: false,
    }))
    .handleAction(actionCreators.downloadExcelAsync.failure, (state) => ({
        ...state,
        excelDownloading: false,
    }));

export default IndustriesReducer;
