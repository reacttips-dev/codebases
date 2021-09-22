import { DynamicContentModel } from "models";
import { dynamicActionTypes } from "actions/dynamicContentActions";

export interface DynamicContentState {
    loading: boolean;
    content?: DynamicContentModel;
}

export const initialDynamicContentState: DynamicContentState = {
    content: undefined,
    loading: false,
};

export const dynamicContent = (state = initialDynamicContentState, action): DynamicContentState => {
    switch (action.type) {
        case dynamicActionTypes.fetchContent:
            return {
                ...state,
                loading: true,
            };
        case dynamicActionTypes.fetchContentSuccess:
            return {
                content: action.content,
                loading: false,
            };
        case dynamicActionTypes.fetchContentError:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
};
