import {Offer} from "models";
import {OffersState} from "reducers";
import {createSelector} from "reselect";
import State from "store";

const getOffers = (rootState: Pick<State, "offers">) => rootState.offers;

export const getOffersForSku = (sku: string) =>
    createSelector<Pick<State, "offers">, OffersState, Offer | null>([getOffers], (offers) => {
        const offersForSku: {[offerId: string]: Offer} = offers?.data?.[sku];
        const winnerOffer = Object.values(offersForSku || {}).find((offer: Offer) => offer.isWinner) || null;
        return winnerOffer;
    });
