import {ActionCreatorsMapObject, AnyAction} from "redux";
import {ThunkAction} from "redux-thunk";
import State from "store";
import {ApiStoreMessageProvider} from "providers/StoreMessageProvider";
import {ThunkResult} from "models";
import getLogger from "common/logging/getLogger";

type GetStoreMessagesThunkAction = ThunkAction<void, State, {storeMessageProvider: ApiStoreMessageProvider}, AnyAction>;
export interface StoreMessageActionCreators extends ActionCreatorsMapObject {
    getStoreMessages: () => ThunkResult<void>;
}

export enum storeMessageActionTypes {
    getStoreMessageRequest = "storeMessage/GET_STORE_MESSAGES_REQUEST",
    getStoreMessagesSuccess = "storeMessage/GET_STORE_MESSAGES_SUCCESS",
    getStoreMessagesError = "storeMessage/GET_STORE_MESSAGES_ERROR",
}

export const storeMessageActionCreators: StoreMessageActionCreators = (() => {
    const getStoreMessages = (): GetStoreMessagesThunkAction => {
        return async (dispatch, _, {storeMessageProvider}) => {
            dispatch({
                type: storeMessageActionTypes.getStoreMessageRequest,
            });
            try {
                const storeMessages = await storeMessageProvider.getStoreMessages();
                dispatch({
                    storeMessages,
                    type: storeMessageActionTypes.getStoreMessagesSuccess,
                });
            } catch (error) {
                getLogger().error(error);
                dispatch({
                    type: storeMessageActionTypes.getStoreMessagesError,
                });
            }
        };
    };

    return {
        getStoreMessages,
    };
})();
