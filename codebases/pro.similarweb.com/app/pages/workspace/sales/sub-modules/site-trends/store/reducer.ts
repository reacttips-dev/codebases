import { ActionType, createReducer } from "typesafe-actions";
import * as action from "./action-creators";
import { Trend } from "../types";

export type siteTrendsState = {
    siteTrends: Trend[];
    loading: boolean;
};

export const INITIAL_SITE_TRENDS_STATE: siteTrendsState = {
    siteTrends: [],
    loading: false,
};

const siteTrendsReducer = createReducer<siteTrendsState, ActionType<typeof action>>(
    INITIAL_SITE_TRENDS_STATE,
)
    .handleAction(action.fetchSiteTrendsAsyncAction.request, (state, { payload }) => ({
        ...state,
        loading: true,
    }))
    .handleAction(action.fetchSiteTrendsAsyncAction.success, (state, { payload }) => ({
        ...state,
        siteTrends: payload,
        loading: false,
    }))
    .handleAction(action.fetchSiteTrendsAsyncAction.failure, (state) => ({
        ...state,
        loading: false,
    }));

export default siteTrendsReducer;
