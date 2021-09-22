import {errorActionCreators} from "actions/errorActions";
import {routingActionCreators} from "actions/routingActions";
import {Location} from "history";
import {DynamicContentModel} from "models";
import {State} from "store";
import routeManager from "utils/routeManager";
import {HttpRequestError, StatusCode, handleRedirectError} from "../../errors";
import {
    createEventMarketingContentProvider,
    createBrandStoreContentProvider,
    createServiceContentProvider,
    createCorporateContentProvider,
    createCareersContentProvider,
} from "providers";
import {ActionCreatorsMapObject} from "redux";

export const dynamicActionTypes = {
    fetchContent: "FETCH_DYNAMIC_CONTENT",
    fetchContentError: "FETCH_DYNAMIC_CONTENT_ERROR",
    fetchContentSuccess: "FETCH_DYNAMIC_CONTENT_SUCCESS",
    trackDynamicContentPageLoad: "DYNAMIC_CONTENT_PAGE_LOAD",
};

export interface DynamicContentActionCreators extends ActionCreatorsMapObject {
    trackDynamicContentPageLoad: () => void;
    syncDynamicContentStateWithLocation: (location: Location) => void;
    fetch: (...ids: string[]) => void;
}

export const dynamicContentActionCreators: DynamicContentActionCreators = (() => {
    const trackDynamicContentPageLoad = () => {
        return {
            type: dynamicActionTypes.trackDynamicContentPageLoad,
        };
    };

    const syncDynamicContentStateWithLocation = (location: Location) => {
        return async (dispatch, getState) => {
            let state: State = getState();
            const language = state.intl.language;
            const {name, id} = routeManager.getParams<{name?: string; id?: string}>(language, location.pathname);

            await dispatch(fetch(name, id));

            state = getState();
            const dynamicContent = state.dynamicContent;
            if (dynamicContent.content) {
                const content = dynamicContent.content;
                const altLangName = content.altLangId || (content.seo && content.seo.altLangSeoText) || name;
                if (content.seo && content.seo.seoText && name && name !== content.seo.seoText) {
                    handleRedirectError(
                        routeManager.getPathByKey(
                            state.intl.language,
                            state.routing.pageKey,
                            content.seo.seoText,
                            content.id,
                        ),
                    );
                }
                await dispatch(
                    routingActionCreators.setAltLangHrefs({
                        altLangUrl: routeManager.getAltLangPathByKey(
                            language,
                            state.routing.pageKey,
                            altLangName,
                            content.altLangId ? undefined : id,
                        ),
                        curLangUrl: routeManager.getCurrLang(location.pathname),
                    }),
                );
            }
        };
    };

    const fetch = (...ids: string[]) => {
        return async (dispatch, getState) => {
            dispatch({type: dynamicActionTypes.fetchContent});
            const state = getState();
            const mappedProvider = _createProvider(state.routing.pageKey);
            const provider = mappedProvider(
                state.config.dataSources.contentApiUrl,
                state.intl.locale,
                state.app.location.regionCode,
                ...ids,
            );

            try {
                const content = (await provider.getContent()) as DynamicContentModel;
                dispatch({type: dynamicActionTypes.fetchContentSuccess, content});
            } catch (error) {
                dispatch({type: dynamicActionTypes.fetchContentError});
                if (error instanceof HttpRequestError && error.statusCode === StatusCode.BadRequest) {
                    error.statusCode = StatusCode.NotFound;
                }
                dispatch(errorActionCreators.error(error, () => fetch(...ids)));
            }
        };
    };

    const _createProvider = (pageKey: string) => {
        const providerMap = {
            eventMarketing: createEventMarketingContentProvider,
            brandStore: createBrandStoreContentProvider,
            services: createServiceContentProvider,
            corporate: createCorporateContentProvider,
            careers: createCareersContentProvider,
        };
        return providerMap[pageKey];
    };

    return {
        trackDynamicContentPageLoad,
        syncDynamicContentStateWithLocation,
        fetch,
    };
})();
