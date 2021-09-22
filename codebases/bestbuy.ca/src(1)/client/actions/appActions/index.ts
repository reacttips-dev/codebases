import {clearCart} from "@bbyca/ecomm-checkout-components/dist/redux/cart";
import {Cookie, CookieUtils} from "@bbyca/bbyca-components";
import {ActionCreatorsMapObject, Dispatch, Action} from "redux";

import {detectAdBlocker} from "utils/detectAdBlocker";
import {StoreUpdate} from "components/App";
import {setTermsOnStorage} from "Decide/pages/BasketPage/utils/termsChecked";
import {isKiosk} from "store/selectors/appSelectors";
import {generateQueryParamMap} from "utils/queryString";
import {getDomain} from "utils/urlUtils";
import {version as versionNumber} from "../../../../package.json";
import {createPersonalizedContentProvider} from "../../providers";
import State from "../../store";

export const appActionTypes = {
    setAppVariables: "SET_APP_VARIABLES_SUCCESS",
    updateStore: "UPDATE_STORE",
    batchUpdateStore: "BATCH_UPDATE_STORE",
    setAdBlockerIsActive: "SET_AD_BLOCKER_IS_ACTIVE",
    setRegionCode: "SET_APP_LOCATION_REGION_CODE",
    setCountry: "SET_APP_LOCATION_COUNTRY",
};

export const KIOSK_COOKIE_NAME = "kioskId";
export const STORE_ID_COOKIE_NAME = "storeId";

export interface AppActionCreators extends ActionCreatorsMapObject {
    setAppVariables: (
        userAgent: string,
        appEnv: string,
        nodeEnv: string,
        muiUserAgent: string,
        standalone: boolean,
        appMode: string,
    ) => any;
    personalizeContent: (path: string, contentType: string, entryId: string, updateType: string) => any;
    setRegionCode: (regionCode: string) => Action;
    setCountry: (country: string) => Action;
    updateStore: (path: string, data: any, updateType: string) => any;
    batchUpdateStore: (queue: StoreUpdate[]) => any;
    setAdBlockerIsActive: () => any;
    logout: () => void;
    setMcfCookies: () => any;
}

export const appActionCreators: AppActionCreators = (() => {
    const updateStore = (path: string, data: object, updateType: string) => {
        return (dispatch: Dispatch<object>) => {
            dispatch({
                type: appActionTypes.updateStore,
                path,
                data,
                updateType,
            });
        };
    };

    const batchUpdateStore = (queue: StoreUpdate[]) => {
        return (dispatch: Dispatch<object>) => {
            dispatch({
                type: appActionTypes.batchUpdateStore,
                queue,
            });
        };
    };

    const setAppVariables = (
        userAgent: string,
        appEnv: string,
        nodeEnv: string,
        muiUserAgent: string,
        standalone: boolean,
        appMode: string,
    ) => {
        return async (dispatch: Dispatch<object>) => {
            dispatch({
                type: appActionTypes.setAppVariables,
                userAgent,
                appEnv,
                nodeEnv,
                versionNumber,
                muiUserAgent,
                standalone,
                appMode,
            });
        };
    };

    const setRegionCode = (regionCode: string) => {
        return {
            regionCode,
            type: appActionTypes.setRegionCode,
        };
    };

    const setCountry = (country: string) => {
        return {
            country,
            type: appActionTypes.setCountry,
        };
    };

    const personalizeContent = (path: string, contentType: string, entryId: string, updateType: string) => {
        return async (dispatch: Dispatch<object>, getState: () => State) => {
            const state: State = getState();

            try {
                const provider = createPersonalizedContentProvider(
                    state.config.dataSources.contentApiUrl,
                    state.intl.locale,
                    state.user.shippingLocation.regionCode,
                    contentType,
                    entryId,
                );

                const content = await provider.getEntry();
                dispatch({
                    type: appActionTypes.updateStore,
                    path,
                    data: content,
                    updateType,
                });
            } catch (error) {
                return;
            }
        };
    };

    const setAdBlockerIsActive = () => {
        return async (dispatch: Dispatch<object>, getState: () => State) => {
            try {
                const adBlockerIsActive = detectAdBlocker();
                if (adBlockerIsActive) {
                    dispatch({
                        type: appActionTypes.setAdBlockerIsActive,
                        adBlockerIsActive,
                    });
                }
            } catch (error) {
                return;
            }
        };
    };

    const logout = () => (dispatch: Dispatch<any>) => {
        dispatch(clearCart());
        setTermsOnStorage(false);
    };

    const setMcfCookies = () => (_: Dispatch<object>, getState: () => State) => {
        if (isKiosk(getState())) {
            const queryParams = generateQueryParamMap(window.location.search);
            if (queryParams.kioskId && queryParams.storeId) {
                const kioskCookie = new Cookie(KIOSK_COOKIE_NAME, queryParams.kioskId);
                kioskCookie.domain = getDomain();
                const storeCookie = new Cookie(STORE_ID_COOKIE_NAME, queryParams.storeId);
                storeCookie.domain = getDomain();
                CookieUtils.setCookie(kioskCookie);
                CookieUtils.setCookie(storeCookie);
            }
        }
    };

    return {
        updateStore,
        batchUpdateStore,
        setAppVariables,
        setRegionCode,
        setCountry,
        personalizeContent,
        setAdBlockerIsActive,
        logout,
        setMcfCookies,
    };
})();
