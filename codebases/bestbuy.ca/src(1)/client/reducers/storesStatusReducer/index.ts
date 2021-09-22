import {AnyAction} from "redux";
import {storesStatusActionTypes} from "actions";

export interface InitialStoreStatus {
    isLoading: boolean;
    statuses: {};
}

export const initialStoreStatusState: InitialStoreStatus = {
    isLoading: true,
    statuses: {},
};

export const storesStatus = (state: InitialStoreStatus = initialStoreStatusState, action: AnyAction) => {
    switch (action.type) {
        case storesStatusActionTypes.getStoresStatus:
            return {
                ...state,
                isLoading: true,
            };
        case storesStatusActionTypes.storesStatusSuccess:
            return {
                ...state,
                isLoading: false,
                statuses: action.storesStatus,
            };
        default:
            return state;
    }
};
