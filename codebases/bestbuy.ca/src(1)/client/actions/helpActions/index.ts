import {errorActionCreators} from "actions/errorActions";
import {routingActionCreators} from "actions/routingActions";
import {Location} from "history";
import {HelpContent} from "models";
import {getHelpProvider} from "providers";
import {State} from "store";
import routeManager from "utils/routeManager";
import {HttpRequestError, StatusCode} from "../../errors";
import {ActionCreatorsMapObject} from "redux";

export const helpTopicActionTypes = {
    fetchContent: "FETCH_HELP_CONTENT",
    fetchContentError: "FETCH_HELP_CONTENT_ERROR",
    fetchContentSuccess: "FETCH_HELP_CONTENT_SUCCESS",
    helpPageLoad: "HELP_PAGE_LOAD",
};

export interface HelpActionCreators extends ActionCreatorsMapObject {
    trackHelpPageLoad: () => any;
    syncHelpStateWithLocation: (location: Location) => any;
    fetch: (categoryId?: string, topicId?: string, subTopicId?: string) => any;
}

export const helpActionCreators: HelpActionCreators = (() => {
    const trackHelpPageLoad = () => {
        return {
            type: helpTopicActionTypes.helpPageLoad,
        };
    };

    const getAltLangUrl = (state: State, params: {[key: string]: string}) => {
        const language = state.intl.language;
        const altLangPath = !!state.help.content && state.help.content.altLangPath;
        const altLangUrl = !!altLangPath && routeManager.getHelpTopAltLangUrl(altLangPath, language);
        return (
            altLangUrl ||
            routeManager.getAltLangPathByKey(language, "help", params.categoryId, params.topicId, params.subTopicId)
        );
    };

    const syncHelpStateWithLocation = (location: Location) => {
        return async (dispatch, getState) => {
            let state: State = getState();
            const previousLocation =
                state.routing.previousLocationBeforeTransitions || state.routing.locationBeforeTransitions;
            if (typeof window !== "undefined" && previousLocation.pathname === location.pathname) {
                return;
            }
            const language = state.intl.language;
            const params = routeManager.getParams(language, location.pathname);
            await dispatch(fetch(params.categoryId, params.topicId, params.subTopicId));

            state = getState();
            await dispatch(
                routingActionCreators.setAltLangHrefs({
                    altLangUrl: getAltLangUrl(state, params),
                    curLangUrl: routeManager.getCurrLang(location.pathname),
                }),
            );
        };
    };

    const fetch = (categoryId?: string, topicId?: string, subTopicId?: string) => {
        return async (dispatch, getState) => {
            dispatch({type: helpTopicActionTypes.fetchContent});
            const state = getState();
            const provider = getHelpProvider(
                state.config.dataSources.helpTopicsApiUrl,
                state.intl.locale,
                state.app.location.regionCode,
            );

            try {
                let content: HelpContent;
                if (!!subTopicId) {
                    content = await provider.getSubTopic(categoryId, topicId, subTopicId);
                } else if (!!topicId) {
                    content = await provider.getTopic(categoryId, topicId);
                } else if (!!categoryId) {
                    content = await provider.getCategory(categoryId);
                } else {
                    content = await provider.getHub();
                }
                dispatch({type: helpTopicActionTypes.fetchContentSuccess, content});
            } catch (error) {
                dispatch({type: helpTopicActionTypes.fetchContentError});
                if (error instanceof HttpRequestError && error.statusCode === StatusCode.BadRequest) {
                    error.statusCode = StatusCode.NotFound;
                }
                dispatch(errorActionCreators.error(error, () => fetch(categoryId, topicId)));
            }
        };
    };

    return {
        trackHelpPageLoad,
        syncHelpStateWithLocation,
        fetch,
    };
})();
