import {ActionCreatorsMapObject} from "redux";

export const npsSurveyActionTypes = {
    toggleNpsSurvey: "NPS_TOGGLE_SURVEY",
};

export interface NpsSurveyActionCreators extends ActionCreatorsMapObject {
    toggleNpsSurvey: () => any;
    initNpsSurvey: () => any;
}

export const npsSurveyActionCreators: NpsSurveyActionCreators = (() => {
    const initNpsSurvey = () => {
        return async (dispatch, getState) => {
            const store = getState();
            const showNpsSurvey = store.npsSurvey.showNpsSurvey && store.config.npsSurvey.enabled;
            if (showNpsSurvey !== store.npsSurvey.showNpsSurvey) {
                await dispatch({
                    type: npsSurveyActionTypes.toggleNpsSurvey,
                    showNpsSurvey,
                });
            }
        };
    };

    const toggleNpsSurvey = () => {
        return async (dispatch) => {
            await dispatch({
                type: npsSurveyActionTypes.toggleNpsSurvey,
                showNpsSurvey: false,
            });
        };
    };

    return {
        initNpsSurvey,
        toggleNpsSurvey,
    };
})();
