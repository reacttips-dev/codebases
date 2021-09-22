import {userActionTypes} from "actions";
import {User as UserState, UserDefaultLocation} from "models";

export {UserState};

export const initialUserState: UserState = {
    cart: {count: 0},
    shippingLocation: {
        city: UserDefaultLocation.city,
        country: UserDefaultLocation.country,
        nearbyStores: [],
        postalCode: UserDefaultLocation.postalCode,
        regionCode: UserDefaultLocation.regionCode,
        regionName: UserDefaultLocation.regionName,
    },
    isGetLocationLoading: false,
    isGetLocationError: false,
};

export const user = (state = initialUserState, action) => {
    switch (action.type) {
        case userActionTypes.fetchLocation:
            return {
                ...state,
                isGetLocationLoading: true,
                isGetLocationError: false,
            };

        case userActionTypes.getLocationFailure:
            return {
                ...state,
                isGetLocationLoading: false,
                isGetLocationError: true,
            };

        case userActionTypes.getLocationSuccess:
        case userActionTypes.locateFromSession:
            return {
                ...state,
                shippingLocation: {
                    city: action.shippingLocation.city,
                    country: action.shippingLocation.country,
                    nearbyStores: action.shippingLocation.nearbyStores,
                    postalCode: action.shippingLocation.postalCode,
                    regionCode: action.shippingLocation.regionCode,
                    regionName: action.shippingLocation.regionName,
                },
                isGetLocationLoading: false,
                isGetLocationError: false,
            };
        case userActionTypes.clearLocationError:
            return {
                ...state,
                isGetLocationError: false,
            };
        case userActionTypes.getGeoLocateSuccess:
            return {
                ...state,
                geoLocation: {...action.geoLocation},
                preference: {geoLocation: "allow"},
            };

        case userActionTypes.updateCartCount:
            return {
                ...state,
                cart: {
                    count: action.count,
                },
            };

        case userActionTypes.getGeoLocateFailure:
            return {
                ...state,
                preference: {...action.preference},
            };

        case userActionTypes.setPreference:
            return {
                ...state,
                preference: {...action.preference},
            };

        default:
            return state;
    }
};

export default user;
