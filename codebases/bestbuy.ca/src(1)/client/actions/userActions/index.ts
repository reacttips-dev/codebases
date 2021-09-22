import {ActionCreatorsMapObject} from "redux";
import {errorActionCreators} from "../../actions";
import {positionErrorCode} from "../../constants";
import {GeoLocationError, HttpRequestError} from "../../errors";
import {parseQueryString} from "../../utils/queryString";
import {Coordinates, Preference, PickupStore} from "../../models";
import {
    ApiLocationProvider,
    localStorage,
    ApiStoreLocationProvider as StoreLocations,
    sessionStorage,
} from "../../providers";
import {UserState} from "../../reducers";
import State from "../../store";
import geolocate from "../../utils/geolocation";
import {getCart} from "@bbyca/ecomm-checkout-components/dist/redux/cart";
import {CookieUtils, Cookie} from "@bbyca/bbyca-components";
import {cieUtilities, ApiCustomerInfoProvider} from "@bbyca/account-components";
import {Dispatch} from "react-redux";

export const userActionTypes = {
    getGeoLocateFailure: "USER_GEOLOCATE_FAILURE",
    getGeoLocateSuccess: "USER_GEOLOCATE_SUCCESS",
    fetchLocation: "FETCH_USER_LOCATE",
    getLocationFailure: "USER_LOCATE_FAILURE",
    getLocationSuccess: "USER_LOCATE_SUCCESS",
    clearLocationError: "USER_LOCATE_ERROR_CLEAR",
    locateFromSession: "USER_LOCATE_FROM_SESSION_SUCCESS",
    setPreference: "PREFERENCE_SET",
    updateCartCount: "USER_CART_COUNT_UPDATE",
};

export interface UserActionCreators extends ActionCreatorsMapObject {
    clearLocationError: () => any;
    getCustomerId: () => Promise<string>;
    getGeoLocation: () => any;
    setGeoLocation: (forceGeoLocate?: boolean) => any;
    getLocation: (includeStores: boolean, postalCode?: string) => any;
    locate: (includeStores: boolean, geoLocate?: boolean, postalCode?: string) => any;
    setPreference: (preference: Preference) => any;
    updateCartCount: () => any;
}

export const getNearbyStores = async (
    providerUrl: string,
    locale: string,
    postalCode: string,
): Promise<PickupStore[]> => {
    const storeLocationProvider = new StoreLocations(providerUrl, locale);
    return await storeLocationProvider.getNonKioskLocations(postalCode);
};

export const useQueryPostalCode = (location: Location): string | undefined => {
    const query = parseQueryString(location.search);

    if (query && query.postalCode) {
        return query.postalCode;
    }
};

export const userActionCreators: UserActionCreators = (() => {
    const locate = (includeStores: boolean, geoLocate?: boolean, postalCode?: string) => {
        return async (dispatch) => {
            if (typeof window === "undefined") {
                return;
            } // window does not exist on server side, so it should return.

            if (!postalCode && window.location) {
                postalCode = useQueryPostalCode(window.location);
            }
            if (geoLocate) {
                await dispatch(getGeoLocation());
                return dispatch(getLocation(includeStores));
            } else if (postalCode) {
                return dispatch(getLocation(includeStores, postalCode));
            } else {
                const storedUser: UserState = sessionStorage.getItem("user");
                if (storedUser) {
                    return dispatch({type: userActionTypes.locateFromSession, ...storedUser});
                } else {
                    await dispatch(getGeoLocation());
                    return dispatch(getLocation(includeStores));
                }
            }
        };
    };

    const getGeoLocation = () => {
        return async (dispatch) => {
            let preference;

            try {
                const position: Position = await geolocate();

                // Can't spread the Position type: unknown reason
                const geoLocation: Coordinates = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };
                preference = {
                    geoLocation: "allow",
                };
                dispatch({type: userActionTypes.getGeoLocateSuccess, geoLocation});
            } catch (error) {
                if (error.code === positionErrorCode.timeout || error.code === positionErrorCode.deny) {
                    preference = {
                        geoLocation: "deny",
                    };

                    dispatch({type: userActionTypes.getGeoLocateFailure, preference});
                    dispatch(
                        errorActionCreators.error(new GeoLocationError(error.code, error.message), () =>
                            getGeoLocation(),
                        ),
                    );
                } else {
                    dispatch(errorActionCreators.error(error, () => getGeoLocation()));
                }
            } finally {
                localStorage.setItem("preference", preference);
            }
        };
    };

    const setGeoLocation = (forceGeoLocate?: boolean) => {
        return async (dispatch, getState) => {
            const state: State = getState();
            const userAgent = state.app.environment.userAgent;

            // we're skipping geolocation for iOS for now
            const isAppleDevice = userAgent.includes("iPhone") || userAgent.includes("iPad");
            const shouldGeolocate: boolean | undefined = isAppleDevice
                ? false
                : state.user.preference?.geoLocation === "allow";
            await dispatch(locate(true, forceGeoLocate || shouldGeolocate));
        };
    };

    const getLocation = (includeStores: boolean, postalCode?: string) => {
        return async (dispatch, getState) => {
            const state: State = getState();
            const locationProvider = new ApiLocationProvider(
                state.config.dataSources.locationApiUrl,
                state.intl.locale,
            );

            try {
                dispatch({type: userActionTypes.fetchLocation});

                let location = null;

                // No longer using location provider to get nearby stores, but using StoreLocationProvider to get store list with addresses
                if (postalCode) {
                    location = await locationProvider.locate(false, null, postalCode);
                } else {
                    location = await locationProvider.locate(false, state.user.geoLocation);
                }

                const nearbyStores = includeStores
                    ? await getNearbyStores(
                          state.config.dataSources.storeLocationApiUrl,
                          state.intl.locale,
                          location.postalCode,
                      )
                    : [];

                const regionName = state.intl.messages["regionNames." + location.regionCode];

                const user: UserState = {
                    shippingLocation: {
                        city: location.city,
                        country: location.country,
                        nearbyStores,
                        postalCode: location.postalCode,
                        regionCode: location.regionCode,
                        regionName,
                    },
                };

                if (state.user.geoLocation) {
                    user.geoLocation = state.user.geoLocation;
                }

                sessionStorage.setItem("user", user);

                dispatch({type: userActionTypes.getLocationSuccess, ...user});

                const prevPostalCode = state.user.shippingLocation.postalCode;
                // Reload the cart as the postal code has changed, which may cause shipping fee and tax to change too
                if (
                    postalCode &&
                    prevPostalCode &&
                    prevPostalCode.replace(/ /g, "").toUpperCase() !== postalCode.replace(/ /g, "").toUpperCase()
                ) {
                    dispatch(getCart());
                }
            } catch (error) {
                if (error instanceof HttpRequestError) {
                    dispatch({type: userActionTypes.getLocationFailure});
                }

                await dispatch(errorActionCreators.error(error, () => getLocation(includeStores)));
            }
        };
    };

    const clearLocationError = () => {
        return (dispatch) => {
            dispatch({type: userActionTypes.clearLocationError});
        };
    };

    const updateCartCount = () => {
        const cartItemsCookieName = "CartItems";
        let cartCount: number = 0;
        const cartItemCookie: Cookie = CookieUtils.getCookie(cartItemsCookieName);
        if (cartItemCookie) {
            cartCount = Number(cartItemCookie.value);
        }

        return async (dispatch) => {
            dispatch({
                type: userActionTypes.updateCartCount,
                count: cartCount,
            });
        };
    };

    const setPreference = (preference: Preference) => {
        return {
            type: userActionTypes.setPreference,
            preference,
        };
    };

    const getCustomerId = () => {
        return async (dispatch: Dispatch<object>, getState: () => State): Promise<string> => {
            const accessToken = cieUtilities.getAccessToken();
            if (accessToken) {
                const state: State = getState();
                const customerInfoProvider = new ApiCustomerInfoProvider(state.config.dataSources.accountApiUrl);
                const customerInfo = await customerInfoProvider.getCustomerInfo({accessToken});
                if (customerInfo && customerInfo.id) {
                    return customerInfo.id;
                }
                return Promise.reject("Invalid customerInfo");
            }
            return Promise.reject("Invalid access token");
        };
    };

    return {
        clearLocationError,
        getCustomerId,
        getGeoLocation,
        setGeoLocation,
        getLocation,
        locate,
        setPreference,
        updateCartCount,
    };
})();
