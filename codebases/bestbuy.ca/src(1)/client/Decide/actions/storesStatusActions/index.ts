import {ActionCreatorsMapObject, AnyAction} from "redux";
import {ThunkAction} from "redux-thunk";

import State from "store";

import {ApiStoresStatusProvider} from "../../providers";

type GetStoresStatusThunkAction = ThunkAction<void, State, {storesStatusProvider: ApiStoresStatusProvider}, AnyAction>;
export interface StoresStatusActionCreators extends ActionCreatorsMapObject {
    getStoresStatus: () => GetStoresStatusThunkAction;
}

export const storesStatusActionTypes = {
    getStoresStatus: "GET_STORES_STATUS",
    storesStatusSuccess: "STORES_STATUS_SUCCESS",
};

export const storesStatusActionCreators: StoresStatusActionCreators = (() => {
    const getStoresStatus = (): GetStoresStatusThunkAction => {
        return async (dispatch, _, {storesStatusProvider}: {storesStatusProvider: ApiStoresStatusProvider}) => {
            dispatch({
                type: storesStatusActionTypes.getStoresStatus,
            });
            const storesStatus = await storesStatusProvider.getStoresStatus();
            dispatch({
                type: storesStatusActionTypes.storesStatusSuccess,
                storesStatus,
            });
        };
    };

    return {
        getStoresStatus,
    };
})();
