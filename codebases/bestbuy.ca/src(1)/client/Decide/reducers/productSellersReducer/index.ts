import {Offer, Seller} from "models";
import {AvailabilityResponse, DetailedProduct as Product} from "models";

import {productSellersActionTypes} from "../../actions";

export interface SellerOffer {
    availability: AvailabilityResponse & {loading?: boolean};
    loading?: boolean;
    offer: Offer;
    seller?: Seller;
}

export interface ProductSellersState {
    sku?: string;
    product: Product;
    loading?: boolean;
    sellerOffers: SellerOffer[];
}

export const initialProductSellersState: ProductSellersState = {
    loading: true,
    product: null,
    sellerOffers: [],
    sku: undefined,
};

export const productSellers = (state = initialProductSellersState, action) => {
    let index;
    switch (action.type) {
        case productSellersActionTypes.resetProductSellerState: {
            return {
                ...state,
                ...initialProductSellersState,
            };
        }
        case productSellersActionTypes.getSeller: {
            index = state.sellerOffers.findIndex((p) => p.offer.sellerId === action.sellerId);
            return {
                ...state,
                sellerOffers: Object.assign([...state.sellerOffers], {
                    [index]: {...state.sellerOffers[index], loading: true},
                }),
            };
        }
        case productSellersActionTypes.getSellerSuccess: {
            const seller: Seller = action.seller;
            index = state.sellerOffers.findIndex((p) => p.offer.sellerId === seller.id);
            return {
                ...state,
                sellerOffers: Object.assign([...state.sellerOffers], {
                    [index]: {...state.sellerOffers[index], seller, loading: false},
                }),
            };
        }
        case productSellersActionTypes.getSellerFailure:
            const sellerId: string = action.sellerId;
            index = state.sellerOffers.findIndex((p) => p.offer.sellerId === sellerId);
            return {
                ...state,
                sellerOffers: Object.assign([...state.sellerOffers], {
                    [index]: {...state.sellerOffers[index], loading: false},
                }),
            };
        case productSellersActionTypes.getOffers:
            return {
                ...state,
                loading: true,
            };
        case productSellersActionTypes.getOffersSuccess:
            return {
                ...state,
                loading: false,
                product: action.product,
                sellerOffers: action.sellerOffers,
                sku: action.product.sku,
            };
        case productSellersActionTypes.getAvailabilities:
            return {
                ...state,
                sellerOffers: state.sellerOffers.map((seller) => ({
                    ...seller,
                    availability: {...seller.availability, loading: true},
                })),
            };
        case productSellersActionTypes.getAvailabilitiesFailure:
            return {
                ...state,
                sellerOffers: state.sellerOffers.map((seller) => ({
                    ...seller,
                    availability: {...seller.availability, loading: false},
                })),
            };
        case productSellersActionTypes.getAvailabilitiesSuccess:
            return {
                ...state,
                sellerOffers: state.sellerOffers.map((seller: SellerOffer) => {
                    const newAvailabilityForSeller =
                        action.payload.availabilities.find((avail) => {
                            return avail.sellerId === (seller.offer && seller.offer.sellerId);
                        }) || {};

                    return {
                        ...seller,
                        availability: {...newAvailabilityForSeller, loading: false},
                    };
                }),
            };
        default:
            return state;
    }
};

export default productSellers;
