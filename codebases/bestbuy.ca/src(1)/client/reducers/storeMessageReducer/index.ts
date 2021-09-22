import {AnyAction} from "redux";
import {storeMessageActionTypes} from "actions";

export interface InitialStoreMessages {
    isLoading: boolean;
    messages: {
        [key: string]: string;
    };
}

export const initialStoreMessageState: InitialStoreMessages = {
    isLoading: true,
    messages: {},
};

export const storeMessages = (state: InitialStoreMessages = initialStoreMessageState, action: AnyAction) => {
    switch (action.type) {
        case storeMessageActionTypes.getStoreMessageRequest:
            return {
                ...state,
                isLoading: true,
            };
        case storeMessageActionTypes.getStoreMessagesSuccess:
            return {
                ...state,
                isLoading: false,
                messages: action.storeMessages,
            };
        case storeMessageActionTypes.getStoreMessagesError:
            return {
                ...state,
                isLoading: false,
            };
        default:
            return state;
    }
};
