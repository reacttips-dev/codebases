import {ActionCreatorsMapObject, Action} from "redux";

export const bazaarVoiceJSActionTypes = {
    loadedProductReviewsJS: "bazaarVoice/LOADED_PRODUCT_REVIEWS_BV_JS",
    loadedSellerReviewsJS: "bazaarVoice/LOADED_SELLER_REVIEWS_BV_JS",
};

export interface BazaarVoiceJSActionCreators extends ActionCreatorsMapObject {
    loadedProductReviewsJS: () => Action;
    loadedSellerReviewsJS: () => Action;
}

export const bazaarVoiceJSActionCreators: BazaarVoiceJSActionCreators = (() => {
    const loadedProductReviewsJS = () => {
        return {type: bazaarVoiceJSActionTypes.loadedProductReviewsJS};
    };

    const loadedSellerReviewsJS = () => {
        return {type: bazaarVoiceJSActionTypes.loadedSellerReviewsJS};
    };

    return {
        loadedProductReviewsJS,
        loadedSellerReviewsJS,
    };
})();
