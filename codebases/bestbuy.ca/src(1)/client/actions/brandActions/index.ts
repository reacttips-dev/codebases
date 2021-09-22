import {routingActionCreators} from "actions/routingActions";
import {Location} from "history";
import {DynamicContentModel, getStateFunc} from "models";
import {getBrandProvider} from "providers";
import {State} from "store";
import routeManager from "utils/routeManager";
import {HttpRequestError, StatusCode} from "../../errors";
import {ActionCreatorsMapObject} from "redux";
import {Dispatch} from "react";

export const BrandActionTypes = {
    fetchContent: "FETCH_BRAND_CONTENT",
    fetchContentError: "FETCH_BRAND_CONTENT_ERROR",
    fetchContentSuccess: "FETCH_BRAND_CONTENT_SUCCESS",
    brandPageLoad: "BRAND_LOAD",
};

export interface BrandActionCreators extends ActionCreatorsMapObject {
    trackBrandPageLoad: () => any;
    syncBrandStateWithLocation: (location: Location) => any;
    fetch: (l1Path: string, l2Path: string, l3Path?: string) => any;
}

export const brandActionCreators: BrandActionCreators = (() => {
    const trackBrandPageLoad = () => {
        return {
            type: BrandActionTypes.brandPageLoad,
        };
    };

    const getAltLangUrl = (state: State, params: {[key: string]: string}) => {
        const language = state.intl.language;
        const altLangPath = state.brand?.dynamicContent?.altLangPath;

        return (
            altLangPath ||
            routeManager.getAltLangPathByKey(language, "brandPage", params.brandL1, params.brandL2, params.brandL3)
        );
    };

    const syncBrandStateWithLocation = (location: Location) => {
        return async (dispatch: Dispatch<{}>, getState: getStateFunc) => {
            let state: State = getState();
            const previousLocation =
                state.routing.previousLocationBeforeTransitions || state.routing.locationBeforeTransitions;
            if (typeof window !== "undefined" && previousLocation?.pathname === location.pathname) {
                return;
            }
            const language = state.intl.language;
            const params: {brandL1: string; brandL2: string; brandL3: string} = routeManager.getParams(
                language,
                location.pathname,
            );
            await dispatch(fetch(params.brandL1, params.brandL2, params.brandL3));

            state = getState();
            await dispatch(
                routingActionCreators.setAltLangHrefs({
                    altLangUrl: getAltLangUrl(state, params),
                    curLangUrl: routeManager.getCurrLang(location.pathname),
                }),
            );
        };
    };

    const fetch = (brandL1: string, brandL2: string, brandL3?: string) => {
        return async (dispatch: Dispatch<{}>, getState: getStateFunc) => {
            dispatch({type: BrandActionTypes.fetchContent});
            const state = getState();
            const provider = getBrandProvider(
                state.config.dataSources.contentApiUrl,
                state.intl.locale,
                state.app.location.regionCode,
            );

            try {
                const dynamicContent: DynamicContentModel = await provider.getBrandsContent([
                    brandL1,
                    brandL2,
                    brandL3,
                ]);
                dispatch({type: BrandActionTypes.fetchContentSuccess, dynamicContent});
            } catch (error) {
                dispatch({type: BrandActionTypes.fetchContentError});
                if (error instanceof HttpRequestError && error.statusCode === StatusCode.BadRequest) {
                    error.statusCode = StatusCode.NotFound;
                }
            }
        };
    };

    return {
        trackBrandPageLoad,
        syncBrandStateWithLocation,
        fetch,
    };
})();
