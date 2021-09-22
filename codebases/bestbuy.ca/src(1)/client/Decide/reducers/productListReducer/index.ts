import {SavedProduct} from "../../providers/ProductListProvider";
import {productListActionTypes} from "../../actions/productListActions";

export enum Status {
    idle = "idle",
    loading = "loading",
    resolved = "resolved",
    rejected = "rejected",
    reset = "reset",
}

export interface ProductListState {
    data: null | {products: SavedProduct[]; id: string};
    error: null | Error; // This is reflecting the fetch product list error which shows a global error message on the list.
    status: Status;
}

export const productListInitialState: ProductListState = {
    data: null,
    error: null,
    status: Status.idle,
};

export const productListReducer = (state: ProductListState = productListInitialState, action): ProductListState => {
    switch (action.type) {
        case productListActionTypes.FETCH_PRODUCT_LIST_LOADING: {
            return {
                ...state,
                status: Status.loading,
            };
        }
        case productListActionTypes.FETCH_PRODUCT_LIST_ERROR: {
            return {
                ...state,
                error: action.payload.error,
                status: Status.rejected,
            };
        }
        case productListActionTypes.FETCH_PRODUCT_LIST_SUCCESS: {
            return {
                error: null,
                data: action.payload.data,
                status: Status.resolved,
            };
        }
        case productListActionTypes.FETCH_PRODUCT_LIST_RESET: {
            return {
                data: null,
                error: null,
                status: Status.reset,
            };
        }
        case productListActionTypes.MOVE_SAVED_ITEM_SUCCESS: {
            const savedProduct = {
                ...action.payload.product,
                movedToCart: true,
                moveToCartError: false,
            };

            const newData = updateSavedProduct(state, savedProduct);

            return {
                error: null,
                data: newData,
                status: Status.resolved,
            };
        }
        case productListActionTypes.MOVE_SAVED_ITEM_ERROR: {
            const savedProduct = {
                ...action.payload.product,
                moveToCartError: true,
                movedToCart: false,
                removeError: false,
            };

            const newData = updateSavedProduct(state, savedProduct);

            return {
                data: newData,
                error: null,
                status: Status.rejected,
            };
        }
        case productListActionTypes.REMOVE_SAVED_ITEM_SUCCESS: {
            const savedProduct = {
                ...action.payload.product,
                removed: true,
                removeError: false,
            };

            const newData = updateSavedProduct(state, savedProduct);

            return {
                error: null,
                data: newData,
                status: Status.resolved,
            };
        }
        case productListActionTypes.REMOVE_SAVED_ITEM_ERROR: {
            const savedProduct = {
                ...action.payload.product,
                removeError: true,
                removed: false,
                moveToCartError: false,
            };

            const newData = updateSavedProduct(state, savedProduct);

            return {
                data: newData,
                error: null,
                status: Status.rejected,
            };
        }
        default:
            return state;
    }
};

function updateSavedProduct(
    state: ProductListState,
    savedProduct: SavedProduct,
): null | {products: SavedProduct[]; id: string} {
    if (!savedProduct || !state.data) {
        return state.data;
    }

    const newSavedProducts = state.data?.products.map((item) => {
        return item.sku === savedProduct.sku ? savedProduct : item;
    });

    return {
        ...state.data,
        products: newSavedProducts,
    };
}
