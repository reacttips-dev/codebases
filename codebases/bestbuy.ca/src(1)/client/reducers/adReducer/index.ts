import {adActionTypes} from "actions/adActions";
import {AnyAction} from "redux";

export interface AdsState {
    googleAds: GoogleAds;
}

export interface GoogleAds {
    [key: string]: GoogleAd;
}

export interface GoogleAd {
    isSponsored: boolean;
    adRendered: boolean;
    isNativeAd: boolean;
}
interface State {
    googleAds: GoogleAds;
}

export const initialStateAdReducer: State = {
    googleAds: {},
};

export const ads = (state = initialStateAdReducer, action: AnyAction): State => {
    switch (action.type) {
        case adActionTypes.adLoaded:
            return {
                ...state,
                googleAds: {
                    ...state.googleAds,
                    [action.adId]: {
                        isSponsored: action.isSponsored,
                        isNativeAd: action.isNativeAd,
                        adRendered: action.adRendered,
                    },
                },
            };
        default:
            return state;
    }
};
