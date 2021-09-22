
import { npsSurveyActionTypes } from "../../actions/npsSurveyActions";

export interface NpsSurveyState {
    showNpsSurvey: boolean;
}

export const initialNpsSurveyTopicsState: NpsSurveyState = {
    showNpsSurvey: true,
};

export const npsSurvey = (state = initialNpsSurveyTopicsState, action): NpsSurveyState => {
    switch (action.type) {
        case npsSurveyActionTypes.toggleNpsSurvey:
            return {
                ...state,
                showNpsSurvey: action.showNpsSurvey,
            };
        default:
            return state;
    }
};
