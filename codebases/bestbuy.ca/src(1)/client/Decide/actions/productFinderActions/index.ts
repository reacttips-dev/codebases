import {ActionCreatorsMapObject} from "redux";

import {Product} from "components/ProductFinder/ProductFinderOptions";

export interface ProductFinderActionCreators extends ActionCreatorsMapObject {
    sendPageloadAnalytics: (rawOptions: object) => void;
    sendAnalytics: (product: any) => void;
    sendErrorAnalytics: (product: any) => void;
}

export const productFinderActionTypes = {
    sendPageloadAnalytics: "MOBILE_PREORDER_PAGELOAD",
    sendErrorAnalytics: "MOBILE_PREORDER_PAGELOAD_ERROR",
    sendAnalytics: "PRE_ORDER_ADD_TO_CART",
};

export const productFinderActionCreators: ProductFinderActionCreators = (() => {
    const sendPageloadAnalytics = (rawOptions) => {
        return (dispatch) => {
            dispatch({
                type: productFinderActionTypes.sendPageloadAnalytics,
                payload: {
                    products: rawOptions,
                },
            });
        };
    };

    const sendAnalytics = (originalProduct: Product) => {
        return (dispatch) => {
            dispatch({
                type: productFinderActionTypes.sendAnalytics,
                payload: {
                    product: {
                        name: originalProduct.name,
                        sku: originalProduct.sku,
                        price: originalProduct.price,
                        options: {
                            carrier: originalProduct.options.carrier,
                            model: originalProduct.options.model,
                            color: originalProduct.options.color.en,
                            capacity: originalProduct.options.capacity,
                        },
                    },
                },
            });
        };
    };

    const sendErrorAnalytics = () => {
        return (dispatch) => {
            dispatch({
                type: productFinderActionTypes.sendErrorAnalytics,
            });
        };
    };

    return {
        sendPageloadAnalytics,
        sendAnalytics,
        sendErrorAnalytics,
    };
})();
