import { ThunkDispatchCommon, ThunkGetState } from "single-spa/store/types";
import { UseStatisticsMapByListId, UseStatisticsSelector } from "../types";
import { PreferencesService } from "services/preferences/preferencesService";

export const createSyncStatisticsEffect = (
    key: string,
    useStatisticsSelector: UseStatisticsSelector,
) => () => async (dispatch: ThunkDispatchCommon, getState: ThunkGetState) => {
    const useStatisticsByListId = useStatisticsSelector(getState());
    try {
        await PreferencesService.add({
            [key]: useStatisticsByListId,
        });
    } catch (e) {
        console.error(`Syncing use statistics for key: ${key} failed:`, e);
    }
};

export const createGetStatisticsEffect = <
    A extends { request: Function; success: Function; failure: Function }
>(
    key: string,
    actions: A,
) => () => async (dispatch: ThunkDispatchCommon) => {
    dispatch(actions.request());

    try {
        const useStatistics: UseStatisticsMapByListId = await PreferencesService.get()[key];

        dispatch(actions.success(useStatistics || {}));
    } catch (e) {
        dispatch(actions.failure(e));
    }
};
