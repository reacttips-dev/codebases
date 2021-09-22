import {ApiGlobalContentProvider} from "../../providers";
import State from "../../store";
import {ActionCreatorsMapObject} from "redux";

// Currently not using errorActionCreators, API considers 404 a valid state (See Note below)
// import { errorActionCreators } from "../errorActions";

export const globalContentActionTypes = {
    update: "GLOBAL_NOTIFICATION_UPDATE",
    getGlobalContentSuccess: "GLOBAL_CONTENT_SUCCESS",
    getGlobalContentFailed: "GLOBAL_CONTENT_FAILED",
};

export interface GlobalContentActionCreators extends ActionCreatorsMapObject {
    getGlobalContent();
}

export const globalContentActionCreators: GlobalContentActionCreators = (() => {
    const getGlobalContent = () => {
        return async (dispatch, getState) => {
            // api provider instance here
            const state: State = getState();
            const globalContentProvider = new ApiGlobalContentProvider(
                state.config.dataSources.contentApiUrl,
                state.intl.locale,
            );

            try {
                const globalContent = await globalContentProvider.getGlobalContent();
                dispatch({
                    type: globalContentActionTypes.getGlobalContentSuccess,
                    globalContent,
                });
            } catch (error) {
                dispatch({
                    type: globalContentActionTypes.getGlobalContentFailed,
                });
            }
        };
    };

    return {
        getGlobalContent,
    };
})();
