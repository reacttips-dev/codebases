import {Offer} from "models";
import {offersActionTypes} from "actions/offersActions";

// TODO: fix typings for this file
export interface OffersState {
    data: {
        [sku: string]: {
            [offerId: string]: Offer;
        };
    };
}

export const setOffersReducer = (state: OffersState, action: any) => {
    const {offers, sku} = action.payload;
    const offersData: {[offerId: string]: Offer} = {};
    offers.forEach((offer: Offer) => {
        offersData[offer.offerId] = offer;
    });
    return {
        ...state,
        data: {
            ...state.data,
            [sku]: offersData,
        },
    };
};

export const offersReducer = (state: OffersState = {data: {}}, action: any) => {
    switch (action.type) {
        case offersActionTypes.setOffers:
            return setOffersReducer(state, action);
        default:
            return state;
    }
};
