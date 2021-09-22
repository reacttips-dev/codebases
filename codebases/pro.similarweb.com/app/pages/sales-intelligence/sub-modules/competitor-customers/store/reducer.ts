import { ActionType, createReducer } from "typesafe-actions";
import { CompetitorCustomersState } from "../types";
import * as actionCreators from "./action-creators";

export const INITIAL_COMPETITOR_CUSTOMERS_STATE: CompetitorCustomersState = {
    outgoingTrafficTable: {
        Records: [],
        TotalCount: 0,
    },
    outgoingTrafficCategories: [],
    outgoingTrafficTableFetching: false,
    outgoingTrafficTableFetchError: undefined,
    outgoingTableExcelDownloading: false,
    outgoingTrafficTableFilters: {
        page: 1,
        search: "",
        category: "",
        orderBy: "Share desc",
    },
    incomingTrafficTable: {
        Records: [],
        TotalCount: 0,
    },
    incomingTrafficCategories: [],
    incomingTrafficTableFetching: false,
    incomingTrafficTableFetchError: undefined,
    incomingTableExcelDownloading: false,
    incomingTrafficTableFilters: {
        page: 1,
        search: "",
        category: "",
        orderBy: "Share desc",
    },
};

const competitorCustomersReducer = createReducer<
    CompetitorCustomersState,
    ActionType<typeof actionCreators>
>(INITIAL_COMPETITOR_CUSTOMERS_STATE)
    .handleAction(actionCreators.fetchOutgoingTrafficTableAsync.request, (state) => ({
        ...state,
        outgoingTrafficTableFetching: true,
        outgoingTrafficTableFetchError:
            INITIAL_COMPETITOR_CUSTOMERS_STATE.outgoingTrafficTableFetchError,
    }))
    .handleAction(actionCreators.fetchOutgoingTrafficTableAsync.success, (state, { payload }) => ({
        ...state,
        outgoingTrafficTableFetching: false,
        outgoingTrafficTable: payload,
    }))
    .handleAction(actionCreators.fetchOutgoingTrafficTableAsync.failure, (state, { payload }) => ({
        ...state,
        outgoingTrafficTableFetching: false,
        outgoingTrafficTableFetchError: payload,
    }))
    .handleAction(actionCreators.fetchIncomingTrafficTableAsync.request, (state) => ({
        ...state,
        incomingTrafficTableFetching: true,
        incomingTrafficTableFetchError:
            INITIAL_COMPETITOR_CUSTOMERS_STATE.incomingTrafficTableFetchError,
    }))
    .handleAction(actionCreators.fetchIncomingTrafficTableAsync.success, (state, { payload }) => ({
        ...state,
        incomingTrafficTableFetching: false,
        incomingTrafficTable: payload,
    }))
    .handleAction(actionCreators.fetchIncomingTrafficTableAsync.failure, (state, { payload }) => ({
        ...state,
        incomingTrafficTableFetching: false,
        incomingTrafficTableFetchError: payload,
    }))
    .handleAction(actionCreators.setOutgoingTrafficCategoriesAction, (state, { payload }) => ({
        ...state,
        outgoingTrafficCategories: payload,
    }))
    .handleAction(actionCreators.setIncomingTrafficCategoriesAction, (state, { payload }) => ({
        ...state,
        incomingTrafficCategories: payload,
    }))
    .handleAction(actionCreators.downloadOutgoingTableExcelAsync.request, (state) => ({
        ...state,
        outgoingTableExcelDownloading: true,
    }))
    .handleAction(actionCreators.downloadOutgoingTableExcelAsync.success, (state) => ({
        ...state,
        outgoingTableExcelDownloading: false,
    }))
    .handleAction(actionCreators.downloadOutgoingTableExcelAsync.failure, (state) => ({
        ...state,
        outgoingTableExcelDownloading: false,
    }))
    .handleAction(actionCreators.downloadIncomingTableExcelAsync.request, (state) => ({
        ...state,
        incomingTableExcelDownloading: true,
    }))
    .handleAction(actionCreators.downloadIncomingTableExcelAsync.success, (state) => ({
        ...state,
        incomingTableExcelDownloading: false,
    }))
    .handleAction(actionCreators.downloadIncomingTableExcelAsync.failure, (state) => ({
        ...state,
        incomingTableExcelDownloading: false,
    }))
    .handleAction(actionCreators.setOutgoingTableFiltersAction, (state, { payload }) => ({
        ...state,
        outgoingTrafficTableFilters: payload,
    }))
    .handleAction(actionCreators.setIncomingTableFiltersAction, (state, { payload }) => ({
        ...state,
        incomingTrafficTableFilters: payload,
    }));

export default competitorCustomersReducer;
