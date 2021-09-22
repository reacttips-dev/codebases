import {ActionCreatorsMapObject} from "redux";

import {errorActionCreators, userActionCreators} from "actions";
import {Availabilities, DetailedProduct, Offer, Seller} from "models";
import {SellerOffer} from "reducers";
import {ApiAvailabilityProvider, getOfferProvider} from "providers";
import State from "store";

import {ApiProductProvider, ApiSellerProvider} from "../../providers";
import {
    getFutureDatePricingValue,
    getUserShippingLocationRegionCode,
    isFutureDatePricingEnabled,
} from "store/selectors";

export const productSellersActionTypes = {
    resetProductSellerState: "RESET_PRODUCT_SELLER_STATE",
    getAvailabilities: "GET_OFFER_AVAILABILITIES",
    getAvailabilitiesFailure: "GET_OFFER_AVAILABILITIES_FAILURE",
    getAvailabilitiesSuccess: "GET_OFFER_AVAILABILITIES_SUCCESS",
    getOffers: "GET_OFFERS",
    getOffersSuccess: "GET_OFFERS_SUCCESS",
    getSeller: "GET_OFFER_DETAILS",
    getSellerFailure: "GET_OFFER_DETAILS_FAILURE",
    getSellerSuccess: "GET_OFFER_DETAILS_SUCCESS",
};

export interface ProductSellersActionCreators extends ActionCreatorsMapObject {
    resetProductSellerState: () => any;
    getOffers: (sku: string) => any;
    getSeller: (sellerId: string) => any;
    getAvailabilities: () => (dispatch, getState) => void;
}

export const productSellersActionCreators: ProductSellersActionCreators = (() => {
    const resetProductSellerState = () => async (dispatch) => {
        dispatch({type: productSellersActionTypes.resetProductSellerState});
    };

    const getOffers = (sku: string) => {
        return async (dispatch, getState) => {
            dispatch({type: productSellersActionTypes.getOffers});

            await dispatch(userActionCreators.locate(true));

            const state: State = getState();
            const productProvider = new ApiProductProvider(
                state.config.dataSources.productApiUrl,
                state.intl.locale,
                state.app.location.regionCode,
            );

            let offers: Offer[];
            let product: DetailedProduct;

            try {
                [offers, product] = await Promise.all([
                    getOfferProvider(state.config.dataSources.offerApiUrl, isFutureDatePricingEnabled(state)).getOffers(
                        sku,
                        getUserShippingLocationRegionCode(state),
                        getFutureDatePricingValue(state),
                    ),
                    productProvider.getProduct({sku}),
                ]);
            } catch (error) {
                return await dispatch(errorActionCreators.error(error, () => getOffers(sku)));
            }

            const sellerOffers = offers.map((offer) => ({offer} as SellerOffer));

            dispatch({type: productSellersActionTypes.getOffersSuccess, sellerOffers, product});
        };
    };

    const getSeller = (sellerId: string) => {
        return async (dispatch, getState) => {
            dispatch({type: productSellersActionTypes.getSeller, sellerId});

            await dispatch(userActionCreators.locate(true));

            const state: State = getState();
            const sellerProvider = new ApiSellerProvider(state.config.dataSources.sellerApiUrl, state.intl.locale);
            let seller: Seller;

            try {
                seller = await sellerProvider.getSeller(sellerId);
            } catch (error) {
                return dispatch({type: productSellersActionTypes.getSellerFailure, sellerId});
            }

            dispatch({type: productSellersActionTypes.getSellerSuccess, seller});
        };
    };

    const getAvailabilities = () => {
        return async (dispatch, getState) => {
            dispatch({type: productSellersActionTypes.getAvailabilities});

            const state: State = getState();
            const availabilityProvider = new ApiAvailabilityProvider(
                state.config.dataSources.availabilityApiUrl,
                state.intl.locale,
            );

            const skus =
                (state.productSellers &&
                    state.productSellers.sellerOffers &&
                    state.productSellers.sellerOffers.map((offer) => {
                        return `${state.productSellers.sku};${offer.offer.sellerId}`;
                    })) ||
                [];

            let availabilities: Availabilities;
            try {
                availabilities = await availabilityProvider.getAvailabilities({
                    postalCode: state.user.shippingLocation.postalCode,
                    skus,
                    storeLocations: [],
                });
            } catch (error) {
                return dispatch({type: productSellersActionTypes.getAvailabilitiesFailure});
            }

            dispatch({
                type: productSellersActionTypes.getAvailabilitiesSuccess,
                payload: {availabilities: availabilities.availabilities},
            });
        };
    };

    return {
        resetProductSellerState,
        getOffers,
        getSeller,
        getAvailabilities,
    };
})();
