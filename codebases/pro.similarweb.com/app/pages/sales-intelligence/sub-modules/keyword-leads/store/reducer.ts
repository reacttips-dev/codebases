import { ActionType, createReducer } from "typesafe-actions";
import * as actions from "./action-creators";

export const INITIAL_KEYWORD_LEADS_STATE = {
    totalTable: {
        Data: [],
        TotalCount: 0,
        Filters: { Source: [], Type: [], Category: [] },
    },
    totalCategories: [],
    totalTableFetching: false,
    totalTableFetchError: undefined,
    totalTableExcelDownloading: false,
    totalTableFilters: {
        page: 1,
        search: "",
        category: "",
        orderBy: "Share desc",
        sourceTypes: [],
    },

    paidTable: {
        Data: [],
        TotalCount: 0,
        Filters: { Source: [], Type: [], Category: [] },
    },
    paidCategories: [],
    paidTableFetching: false,
    paidTableFetchError: undefined,
    paidTableExcelDownloading: false,
    paidTableFilters: {
        page: 1,
        search: "",
        category: "",
        orderBy: "Share desc",
        sourceTypes: [],
    },

    mobileTable: {
        Data: [],
        TotalCount: 0,
        Filters: { Source: [], Type: [], Category: [] },
    },
    mobileCategories: [],
    mobileTableFetching: false,
    mobileTableFetchError: undefined,
    mobileTableExcelDownloading: false,
    mobileTableFilters: {
        page: 1,
        search: "",
        category: "",
        orderBy: "Share desc",
        sourceTypes: [],
    },

    organicTable: {
        Data: [],
        TotalCount: 0,
        Filters: { Source: [], Type: [], Category: [] },
    },
    organicCategories: [],
    organicTableFetching: false,
    organicTableFetchError: undefined,
    organicTableExcelDownloading: false,
    organicTableFilters: {
        page: 1,
        search: "",
        category: "",
        orderBy: "Share desc",
        sourceTypes: [],
    },
};

export const keywordsReducer = createReducer<any, ActionType<typeof actions>>(
    INITIAL_KEYWORD_LEADS_STATE,
)
    // request
    .handleAction(actions.fetchTotalTableAsync.request, (state) => ({
        ...state,
        totalTableFetching: true,
    }))
    .handleAction(actions.fetchPaidTableAsync.request, (state) => ({
        ...state,
        paidTableFetching: true,
    }))
    .handleAction(actions.fetchOrganicTableAsync.request, (state) => ({
        ...state,
        organicTableFetching: true,
    }))
    .handleAction(actions.fetchMobileTableAsync.request, (state) => ({
        ...state,
        mobileTableFetching: true,
    }))
    // success
    .handleAction(actions.fetchTotalTableAsync.success, (state, { payload }) => ({
        ...state,
        totalTableFetching: false,
        totalTable: payload,
    }))
    .handleAction(actions.fetchPaidTableAsync.success, (state, { payload }) => ({
        ...state,
        paidTableFetching: false,
        paidTable: payload,
    }))
    .handleAction(actions.fetchOrganicTableAsync.success, (state, { payload }) => ({
        ...state,
        organicTableFetching: false,
        organicTable: payload,
    }))
    .handleAction(actions.fetchMobileTableAsync.success, (state, { payload }) => ({
        ...state,
        mobileTableFetching: false,
        mobileTable: payload,
    }))
    // failure
    .handleAction(actions.fetchTotalTableAsync.failure, (state, { payload }) => ({
        ...state,
        totalTableFetching: false,
        totalTableFetchError: payload,
    }))
    .handleAction(actions.fetchPaidTableAsync.failure, (state, { payload }) => ({
        ...state,
        totalTableFetching: false,
        paidTableFetchError: payload,
    }))
    .handleAction(actions.fetchOrganicTableAsync.failure, (state, { payload }) => ({
        ...state,
        totalTableFetching: false,
        organicTableFetchError: payload,
    }))
    .handleAction(actions.fetchMobileTableAsync.failure, (state, { payload }) => ({
        ...state,
        totalTableFetching: false,
        mobileTableFetchError: payload,
    }))
    .handleAction(actions.setTotalFiltersAction, (state, { payload }) => ({
        ...state,
        totalTableFilters: payload,
    }))
    .handleAction(actions.setMobileFiltersAction, (state, { payload }) => ({
        ...state,
        mobileTableFilters: payload,
    }))
    .handleAction(actions.setOrganicFiltersAction, (state, { payload }) => ({
        ...state,
        organicTableFilters: payload,
    }))
    .handleAction(actions.setPaidFiltersAction, (state, { payload }) => ({
        ...state,
        paidTableFilters: payload,
    }))
    .handleAction(actions.downloadTotalExcelAsync.request, (state) => ({
        ...state,
        totalTableExcelDownloading: true,
    }))
    .handleAction(actions.downloadTotalExcelAsync.failure, (state) => ({
        ...state,
        totalTableExcelDownloading: false,
    }))
    .handleAction(actions.downloadTotalExcelAsync.success, (state) => ({
        ...state,
        totalTableExcelDownloading: false,
    }))
    .handleAction(actions.downloadPaidExcelAsync.request, (state) => ({
        ...state,
        paidTableExcelDownloading: true,
    }))
    .handleAction(actions.downloadPaidExcelAsync.failure, (state) => ({
        ...state,
        paidTableExcelDownloading: false,
    }))
    .handleAction(actions.downloadPaidExcelAsync.success, (state) => ({
        ...state,
        paidTableExcelDownloading: false,
    }))
    .handleAction(actions.downloadOrganicExcelAsync.request, (state) => ({
        ...state,
        organicTableExcelDownloading: true,
    }))
    .handleAction(actions.downloadOrganicExcelAsync.failure, (state) => ({
        ...state,
        organicTableExcelDownloading: false,
    }))
    .handleAction(actions.downloadOrganicExcelAsync.success, (state) => ({
        ...state,
        organicTableExcelDownloading: false,
    }))
    .handleAction(actions.downloadMobileExcelAsync.request, (state) => ({
        ...state,
        mobileTableExcelDownloading: true,
    }))
    .handleAction(actions.downloadMobileExcelAsync.failure, (state) => ({
        ...state,
        mobileTableExcelDownloading: false,
    }))
    .handleAction(actions.downloadMobileExcelAsync.success, (state) => ({
        ...state,
        mobileTableExcelDownloading: false,
    }));
