import { createAction, createAsyncAction } from "typesafe-actions";
import { SignalsContainer, SignalWithId, SignalSubFilter } from "../types";
import { UseStatisticsMapByListId, UseStatisticsUpdatePayload } from "../../usage-statistics/types";

export const fetchSignalsAsyncAction = createAsyncAction(
    "@@sales/signals/FETCH_SIGNALS_START",
    "@@sales/signals/FETCH_SIGNALS_SUCCESS",
    "@@sales/signals/FETCH_SIGNALS_FAILURE",
)<void, SignalsContainer, string | undefined>();

export const fetchRestCountriesSignalsSuccessAction = createAction(
    "@@sales/signals/FETCH_REST_COUNTRIES_SIGNALS_SUCCESS",
)<SignalsContainer>();

export const getSignalsUseAsyncAction = createAsyncAction(
    "@@sales/signals/GET_SIGNALS_USE_START",
    "@@sales/signals/GET_SIGNALS_USE_SUCCESS",
    "@@sales/signals/GET_SIGNALS_USE_FAILURE",
)<void, UseStatisticsMapByListId, string | undefined>();

export const updateSignalsUseAction = createAction("@@sales/signals/UPDATE_SIGNALS_USE")<
    UseStatisticsUpdatePayload
>();

export const setActiveSignalFilterAction = createAction("@@sales/signals/SELECT_FILTER")<
    SignalWithId["id"]
>();
export const setActiveSignalSubFilterAction = createAction("@@sales/signals/SELECT_SUB_FILTER")<
    SignalSubFilter["code"]
>();
export const setSignalsActiveTabAction = createAction("@@sales/signals/SET_ACTIVE_SIGNALS_TAB")<
    number
>();
