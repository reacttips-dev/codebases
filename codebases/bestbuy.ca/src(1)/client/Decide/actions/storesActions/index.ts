import ContentConnectionError from "@bbyca/ecomm-webapp-content/dist/errors/ConnectionError";
import {Location} from "history";
import {
    ActionCreators as StoresComponentActionCreators,
    getActionCreators as getStoreComponentActionCreators,
} from "@bbyca/ecomm-webapp-content/dist/stores";
import {ApiStoreProvider} from "@bbyca/ecomm-webapp-content/dist/stores/providers";

import {ActionCreatorsMapObject, Action} from "redux";
import {ConnectionError, HttpRequestType} from "errors";
import {State} from "store";
import {ThunkResult} from "models";
import routeManager from "utils/routeManager";

import {
    errorActionCreators,
    userActionCreators,
    productActionCreators,
    routingActionCreators,
    availabilityActionCreators,
} from "actions";
import {Key} from "@bbyca/apex-components";
import {getIntlLanguage, getProductSku} from "store/selectors";

export const storesActionTypes = {
    trackStoreLocatorPageView: "stores/STORE_LOCATOR_PAGE_LOAD",
    fetchStores: "stores/STORE_AVAILABILITY_FETCH",
};

export interface StoresActionCreators extends ActionCreatorsMapObject {
    getStores: () => ThunkResult<void>;
    updateStores: (sku: string) => ThunkResult<void>;
    trackStoreLocatorPageView: () => Action;
    syncProductStoreLocatorStateWithLocation: (location: Location, pageKey?: Key) => ThunkResult<void>;
}

export const storesActionCreators: StoresActionCreators = (() => {
    const getStores = (): ThunkResult<void> => {
        return async (dispatch, getState) => {
            await dispatch(userActionCreators.locate(true, true));

            const state: State = getState();
            const storeProvider = new ApiStoreProvider(state.config.dataSources.storeLocationApiUrl);
            const storeActions: StoresComponentActionCreators = getStoreComponentActionCreators(storeProvider);

            try {
                await dispatch(storeActions.getNearbyStores(state.user.shippingLocation.postalCode));
            } catch (error) {
                if (error instanceof ContentConnectionError) {
                    const newError = new ConnectionError(
                        HttpRequestType.StoreLocationApiUrl,
                        error.url,
                        "Failed to fetch stores",
                        error,
                    );
                    dispatch(errorActionCreators.error(newError, () => storesActionCreators.getStores()));
                } else {
                    dispatch(errorActionCreators.error(error));
                }
            }
        };
    };

    const updateStores = (sku: string): ThunkResult<void> => {
        return async (dispatch) => {
            dispatch({type: storesActionTypes.fetchStores});
            await dispatch(availabilityActionCreators.getAvailability(sku));
        };
    };

    const trackStoreLocatorPageView = () => {
        return {
            type: storesActionTypes.trackStoreLocatorPageView,
        };
    };

    const syncProductStoreLocatorStateWithLocation = (location: Location, pageKey?: Key): ThunkResult<void> => {
        return async (dispatch) => {
            await dispatch(productActionCreators.syncProductStateWithLocation(location));
            await dispatch(getStoreLocatorPageAltLangHrefs(location, pageKey));
        };
    };

    const getStoreLocatorPageAltLangHrefs = (location: Location, pageKey?: Key): ThunkResult<void> => {
        return (dispatch, getState) => {
            const state: State = getState();
            const sku = getProductSku(state);
            const key = pageKey ? pageKey : "productRpu";
            let altLangUrl = routeManager.getAltLangPathByKey(getIntlLanguage(state), key, sku);

            if (location && location.search) {
                altLangUrl += location.search;
            }

            dispatch(
                routingActionCreators.setAltLangHrefs({
                    altLangUrl,
                    curLangUrl: routeManager.getCurrLang(location.pathname),
                }),
            );
        };
    };

    return {
        getStores,
        updateStores,
        trackStoreLocatorPageView,
        syncProductStoreLocatorStateWithLocation,
    };
})();
