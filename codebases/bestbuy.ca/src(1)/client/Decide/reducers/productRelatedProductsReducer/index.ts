import {
    ProductRelatedProduct,
    ProductRelationshipTypes,
    ProductServiceContent,
    SimpleProduct,
    Offer,
    Availability,
} from "models";
import {Action as ReduxAction} from "redux";

import {productRelatedProductsActionTypes} from "../../actions";

export interface ProductRelatedProductsState {
    products: Record<string, Record<string, ProductRelatedProduct>>;
}

export const initialProductRelatedProducts: ProductRelatedProductsState = {
    products: {},
};

interface ActionPayload {
    sku: string;
    type: ProductRelationshipTypes;
    items: [];
}

interface ActionPayload {
    product: SimpleProduct;
    parentSKU: string;
    offer: Offer;
    content: ProductServiceContent;
    availability: Availability;
}

interface Action extends ReduxAction {
    payload?: ActionPayload;
}

export const productRelatedProducts = (state = {...initialProductRelatedProducts}, action: Action) => {
    if (!action.payload) {
        return state;
    }
    switch (action.type) {
        case productRelatedProductsActionTypes.fetchProductRelatedProductsSuccess:
            return {
                ...state,
                products: {
                    ...state.products,
                    [action.payload.sku]: action.payload.items.reduce(
                        (data: Record<string, ProductRelatedProduct>, item: ProductRelatedProduct) => {
                            data[item.id] = {
                                ...item,
                                relationshipType: action.payload?.type || ProductRelationshipTypes.SERVICE,
                                loading: true,
                            };
                            return data;
                        },
                        {},
                    ),
                },
            };
        case productRelatedProductsActionTypes.fetchRelatedProductSuccess: {
            const products = {...state.products};
            products[action.payload.parentSKU] = {
                ...products[action.payload.parentSKU],
                [action.payload.product.sku]: {
                    ...products[action.payload.parentSKU][action.payload.product.sku],
                    product: {...action.payload.product},
                    offer: {...action.payload.offer},
                    availability: {...action.payload.availability},
                    content: {...action.payload.content},
                    loading: false,
                } as ProductRelatedProduct,
            };
            return {
                ...state,
                products,
            };
        }
        case productRelatedProductsActionTypes.fetchRelatedProductFailure: {
            const products = {...state.products};
            products[action.payload.parentSKU] = {
                ...products[action.payload.parentSKU],
                [action.payload.sku]: {
                    ...products[action.payload.parentSKU][action.payload.sku],
                    loading: false,
                    error: true,
                } as ProductRelatedProduct,
            };
            return {
                ...state,
                products,
            };
        }
        case productRelatedProductsActionTypes.fetchProductRelatedProductsFailure: {
            const products = {
                ...state.products,
            };
            for (const [key, relatedProduct] of Object.entries(products[action.payload.parentSKU])) {
                relatedProduct.error = true;
                relatedProduct.loading = false;
                products[action.payload.parentSKU][key] = relatedProduct;
            }
            return {
                ...state,
                products,
            };
        }
        default:
            return state;
    }
};

export default productRelatedProducts;
