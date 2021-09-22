import {tracker} from "@bbyca/ecomm-utilities";
import {ConnectionError} from "errors";
import {ActionCreatorsMapObject} from "redux";
import {errorActionCreators, routingActionCreators, userActionCreators} from "../../actions";
import {createHomePageContentProvider, createHomePageFallbackContentProvider} from "../../providers";
import State from "../../store";
import routeManager from "../../utils/routeManager";
import {generateQueryParamMap} from "utils/queryString";

export const homePageActionTypes = {
    updateHomepageDynamicContent: "UPDATE_HOMEPAGE_DYNAMIC_CONTENT",
    fetchContent: "HOMEPAGE_FETCH",
    fetchFallbackContent: "HOMEPAGE_FALLBACK_FETCH",
    getContentSuccess: "HOMEPAGE_SUCCESS",
    getFallbackContentSuccess: "HOMEPAGE_FALLBACK_SUCCESS",
    homepageError: "HOMEPAGE_ERROR",
    trackHomePage: "HOME_PAGE_LOAD",
};

interface Location {
    search: string;
    pathname?: string;
}

export interface HomeActionCreators extends ActionCreatorsMapObject {
    syncHomeStateWithLocation: (location) => any;
    getContent: (location: Location) => any;
    loadContent: (location: Location) => any;
    getFallbackContent: () => any;
    trackHomePageLoad: () => any;
}

export const homeActionCreators: HomeActionCreators = (() => {
    const trackHomePageLoad = () => {
        return (dispatch, getState) => {
            const state = getState();
            dispatch({
                type: homePageActionTypes.trackHomePage,
            });
            switch (state.homePage.contentType) {
                case "homepageFallback":
                    tracker.dispatchEvent({category: "Homepage", action: "Load", label: "Fallback"});
                    break;
                case "homepageError":
                    tracker.dispatchEvent({category: "Homepage", action: "Load", label: "Error"});
                    break;
                default:
                    break;
            }
        };
    };

    const syncHomeStateWithLocation = (location: Location) => {
        return async (dispatch, getState) => {
            await dispatch(homeActionCreators.loadContent(location));
            await dispatch(
                routingActionCreators.setAltLangHrefs({
                    altLangUrl: routeManager.getAltLangPathByKey(getState().intl.language, "homepage"),
                    curLangUrl: routeManager.getCurrLang(location.pathname),
                }),
            );
        };
    };

    const loadContent = (location: Location) => {
        return async (dispatch, getState) => {
            await dispatch(userActionCreators.locate(false));
            await dispatch(homeActionCreators.getContent(location));
        };
    };

    const getContent = (location: Location) => {
        return async (dispatch, getState) => {
            await new Promise(async (resolve, reject) => {
                const state: State = getState();

                let fallbackLoaded = false;
                await dispatch({type: homePageActionTypes.fetchContent});

                const fallbackTimer = setTimeout(async () => {
                    /* ---------------
                    this flag should kick in after the fallback api has responded
                    there's a chance here that we could still get the content
                    before the fallback. With MTH fast approaching and worry around
                    caching fallback content I will leave it as is.
                    ------------------*/
                    fallbackLoaded = true;
                    await dispatch(getFallbackContent());
                    resolve();
                }, 5000);
                try {
                    const urlParsed = generateQueryParamMap(location.search);
                    const previewKey = urlParsed.previewkey;
                    const urlHomePage = state.config.dataSources.contentApiUrl;
                    const environment = state.app.environment.appEnv;
                    const usePreview = previewKey && environment !== "production";
                    const provider = createHomePageContentProvider(
                        urlHomePage,
                        state.intl.locale,
                        state.app.location.regionCode,
                        usePreview ? {previewkey: previewKey} : undefined,
                    );

                    const content = await provider.getContent();
                    if (!fallbackLoaded) {
                        clearTimeout(fallbackTimer);
                        await dispatch({content, type: homePageActionTypes.getContentSuccess});
                        resolve();
                    }
                } catch (error) {
                    if (error instanceof ConnectionError) {
                        clearTimeout(fallbackTimer);
                        await dispatch(errorActionCreators.error(error, () => homeActionCreators.getContent(location)));
                        resolve();
                    } else {
                        if (!fallbackLoaded) {
                            clearTimeout(fallbackTimer);
                            await dispatch(getFallbackContent());
                            resolve();
                        }
                    }
                }
            });
        };
    };

    const getFallbackContent = () => {
        return async (dispatch, getState) => {
            const state: State = getState();
            await dispatch({type: homePageActionTypes.fetchFallbackContent});

            try {
                const provider = createHomePageFallbackContentProvider(
                    state.config.dataSources.contentFallbackApiUrl[state.intl.language],
                );
                const content = await provider.getContent();
                await dispatch({content, type: homePageActionTypes.getFallbackContentSuccess});
            } catch (error) {
                await dispatch({error, type: homePageActionTypes.homepageError});
            }
        };
    };

    return {
        trackHomePageLoad,
        syncHomeStateWithLocation,
        loadContent,
        getContent,
        getFallbackContent,
    };
})();
