import {Action} from "redux";
import {bazaarVoiceJSActionTypes} from "Decide/actions/bazaarVoiceJSActions";

export interface BazaarVoiceJSState {
    isloadedProductReviewsJS?: boolean;
    isloadedSellerReviewsJS?: boolean;
}

export const bazaarVoiceJS = (state: BazaarVoiceJSState = {}, action: Action) => {
    switch (action.type) {
        case bazaarVoiceJSActionTypes.loadedProductReviewsJS:
            return {
                ...state,
                isloadedProductReviewsJS: true,
            };

        case bazaarVoiceJSActionTypes.loadedSellerReviewsJS:
            return {
                ...state,
                isloadedSellerReviewsJS: true,
            };

        default:
            return state;
    }
};

export default bazaarVoiceJS;
