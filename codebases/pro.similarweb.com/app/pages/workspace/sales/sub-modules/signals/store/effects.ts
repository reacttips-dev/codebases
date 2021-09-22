import * as a from "./action-creators";
import { ThunkDependencies } from "single-spa/store/thunk-dependencies";
import { ThunkDispatchCommon, ThunkGetState } from "single-spa/store/types";
import { selectSignalsUse } from "./selectors";
import { SIGNALS_USER_DATA_STORE_KEY } from "../constants";
import { buildSignalsRequestParamsForAllOrInverse } from "../helpers";
import {
    createGetStatisticsEffect,
    createSyncStatisticsEffect,
} from "../../usage-statistics/store/effects";

export const fetchSignalsForCountryThunkAction = (
    workspaceId: string,
    opportunitiesListId: string,
    countryCode: number,
) => async (dispatch: ThunkDispatchCommon, getState: ThunkGetState, d: ThunkDependencies) => {
    dispatch(a.fetchSignalsAsyncAction.request());

    try {
        const response = await d.si.api.signals.fetchSignals({
            countryCode,
            workspaceId,
            opportunitiesListId,
        });

        dispatch(a.fetchSignalsAsyncAction.success(response));
    } catch (e) {
        dispatch(a.fetchSignalsAsyncAction.failure(e));
    }
};

export const fetchSignalsForAllOrInverseThunkAction = (
    workspaceId: string,
    opportunitiesListId: string,
    countryCode: number,
) => async (dispatch: ThunkDispatchCommon, getState: ThunkGetState, d: ThunkDependencies) => {
    const userHasOnlyOneCountry = d.si.settingsHelper.hasSingleCountryAllowed();
    const params = buildSignalsRequestParamsForAllOrInverse(
        {
            workspaceId,
            opportunitiesListId,
        },
        countryCode,
        userHasOnlyOneCountry,
    );

    try {
        const response = await d.si.api.signals.fetchSignals(params);

        dispatch(a.fetchRestCountriesSignalsSuccessAction(response));
    } catch (e) {
        dispatch(a.fetchSignalsAsyncAction.failure(e));
    }
};

export const getSignalsUseThunkAction = createGetStatisticsEffect(
    SIGNALS_USER_DATA_STORE_KEY,
    a.getSignalsUseAsyncAction,
);

export const syncSignalsUseThunkAction = createSyncStatisticsEffect(
    SIGNALS_USER_DATA_STORE_KEY,
    selectSignalsUse,
);

export const removeListIdFromSignalsUseThunkAction = (id: string) => (
    dispatch: ThunkDispatchCommon,
    getState: ThunkGetState,
) => {
    const signalsUse = selectSignalsUse(getState());

    if (Object.keys(signalsUse).includes(id)) {
        const newSignalUse = { ...signalsUse };

        delete newSignalUse[id];

        dispatch(a.getSignalsUseAsyncAction.success(newSignalUse));
    }
};
