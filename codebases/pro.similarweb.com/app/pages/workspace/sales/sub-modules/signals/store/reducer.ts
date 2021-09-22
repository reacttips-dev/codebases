import { ActionType, createReducer } from "typesafe-actions";
import * as ac from "./action-creators";
import { SignalsContainer, SignalWithId, SignalSubFilter } from "../types";
import { UseStatisticsMapByListId } from "../../usage-statistics/types";
import { updateUseStatisticsByList } from "../../usage-statistics/helpers";
import { selectLeadListAction } from "pages/workspace/sales/sub-modules/opportunities-lists/store/action-creators";

type SignalsActions = ActionType<typeof ac> | ActionType<typeof selectLeadListAction>;

export type SignalsState = {
    signalsContainer: SignalsContainer;
    signalsFetching: boolean;
    signalsFetchError?: string;
    restCountriesSignalsByName: SignalsContainer;
    signalsUse: UseStatisticsMapByListId;
    selectedFilterId: SignalWithId["id"] | null;
    selectedSubFilterId: SignalSubFilter["code"] | null;
    activeTabIndex: number;
};

export const INITIAL_SIGNALS_STATE: SignalsState = {
    signalsContainer: {
        total: 0,
        filters: {},
    },
    signalsFetching: false,
    restCountriesSignalsByName: {
        total: 0,
        filters: {},
    },
    signalsUse: {},
    selectedFilterId: null,
    selectedSubFilterId: null,
    activeTabIndex: 0,
};

const signalsReducer = createReducer<SignalsState, SignalsActions>(INITIAL_SIGNALS_STATE)
    .handleAction(ac.fetchSignalsAsyncAction.request, (state) => ({
        ...state,
        signalsFetching: true,
        signalsFetchError: INITIAL_SIGNALS_STATE.signalsFetchError,
    }))
    .handleAction(ac.fetchSignalsAsyncAction.success, (state, { payload }) => ({
        ...state,
        signalsFetching: false,
        signalsContainer: payload,
    }))
    .handleAction(ac.fetchSignalsAsyncAction.failure, (state, { payload }) => ({
        ...state,
        signalsFetching: false,
        signalsFetchError: payload,
    }))
    .handleAction(ac.fetchRestCountriesSignalsSuccessAction, (state, { payload }) => ({
        ...state,
        restCountriesSignalsByName: payload,
    }))
    .handleAction(ac.getSignalsUseAsyncAction.success, (state, { payload }) => ({
        ...state,
        signalsUse: payload,
    }))
    .handleAction(ac.updateSignalsUseAction, (state, { payload }) => ({
        ...state,
        signalsUse: updateUseStatisticsByList(state.signalsUse, payload),
    }))
    .handleAction(ac.setActiveSignalFilterAction, (state, { payload }) => ({
        ...state,
        selectedFilterId: payload,
    }))
    .handleAction(ac.setActiveSignalSubFilterAction, (state, { payload }) => ({
        ...state,
        selectedSubFilterId: payload,
    }))
    .handleAction(ac.setSignalsActiveTabAction, (state, { payload }) => ({
        ...state,
        activeTabIndex: payload,
    }))
    .handleAction(selectLeadListAction, (state) => ({
        ...state,
        selectedFilterId: null,
        selectedSubFilterId: null,
    }));

export default signalsReducer;
