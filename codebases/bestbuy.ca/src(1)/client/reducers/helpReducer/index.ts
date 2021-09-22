import {HelpCategory, HelpHub, HelpTopic, DynamicContentModel} from "models";
import {helpTopicActionTypes} from "../../actions/helpActions";

export interface HelpState {
    loading: boolean;
    content?: HelpHub & HelpCategory & HelpTopic & DynamicContentModel;
}

export const initialHelpTopicsState: HelpState = {
    content: undefined,
    loading: false,
};

export const help = (state = initialHelpTopicsState, action): HelpState => {
    switch (action.type) {
        case helpTopicActionTypes.fetchContent:
            return {
                ...state,
                loading: true,
            };
        case helpTopicActionTypes.fetchContentSuccess:
            return {
                content: action.content,
                loading: false,
            };
        case helpTopicActionTypes.fetchContentError:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
};
