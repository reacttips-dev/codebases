import {ActionCreatorsMapObject} from "redux";
import {ThunkResult} from "models";

export const cellPhonePlanActionTypes = {
    loadingCellPhonePlan: "cellphonePlan/LOADING_CELLPHONE_PLAN",
    getCellPhonePlanSuccess: "cellphonePlan/CELLPHONE_PLAN_SUCCESS",
    trackMobileActivationPageView: "cellphonePlan/MOBILE_ACTIVATION_PAGE_LOAD",
};

type FetchCellPhonePlanThunk = ThunkResult<Promise<void>>;

export interface CellPhonePlanActionCreators extends ActionCreatorsMapObject {
    fetchCellPhonePlan: (sku: string) => FetchCellPhonePlanThunk;
    trackMobileActivationPageView: () => ThunkResult<void>;
}

export const cellPhonePlanActionCreators: CellPhonePlanActionCreators = (() => {
    const fetchCellPhonePlan = (sku: string): FetchCellPhonePlanThunk => async (
        dispatch,
        _,
        {cellPhonePlanPricingProvider},
    ) => {
        try {
            dispatch({type: cellPhonePlanActionTypes.loadingCellPhonePlan});
            const planData = await cellPhonePlanPricingProvider.fetchCellPhonePlan(sku);

            dispatch({
                type: cellPhonePlanActionTypes.getCellPhonePlanSuccess,
                cellPhonePlan: planData,
            });
        } catch (error) {
            // Do not raise error when API returns an error
        }
    };

    const trackMobileActivationPageView = (): ThunkResult<void> => {
        return (dispatch) => {
            dispatch({
                type: cellPhonePlanActionTypes.trackMobileActivationPageView,
            });
        };
    };

    return {
        fetchCellPhonePlan,
        trackMobileActivationPageView,
    };
})();
