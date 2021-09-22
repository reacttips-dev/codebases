import {Seller, SellerReviews} from "models";

import {sellerActionTypes} from "../../actions";

export interface SellerWithReviews extends Seller {
    reviews: SellerReviews;
}

export interface SellerState {
    seller: SellerWithReviews;
}

export const initialSellerState: SellerState = {
    seller: null,
};

export const seller = (state = initialSellerState, action) => {
    switch (action.type) {
        case sellerActionTypes.getSeller:
            return {
                ...state,
                seller: action.seller,
            };

        case sellerActionTypes.loadingMoreSellerReviews:
            return {
                ...state,
                seller: {
                    ...state.seller,
                    reviews: {
                        ...state.seller.reviews,
                        loadingMore: action.loadingMore,
                    },
                },
            };

        case sellerActionTypes.loadMoreSellerReviews:
            return {
                ...state,
                seller: {
                    ...state.seller,
                    reviews: action.reviews,
                },
            };

        case sellerActionTypes.sellerReviewPageLoad:
            return state;

        case sellerActionTypes.setInitialPageLoad:
            return {
                ...state,
                seller: action.seller,
            };

        default:
            return state;
    }
};

export default seller;
