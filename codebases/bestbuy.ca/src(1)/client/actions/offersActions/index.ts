import {Offer} from "models";

export const offersActionTypes = {
    setOffers: "offers/SET_OFFERS",
};

export interface OffersActionCreators {
    setOffers(offers: Offer[], sku: string): {type: string; payload: {offers: Offer[]; sku: string}};
}

export const offersActionCreatores: OffersActionCreators = (() => {
    const setOffers = (offers: Offer[], sku: string) => ({
        type: offersActionTypes.setOffers,
        payload: {offers, sku},
    });

    return {
        setOffers,
    };
})();
