import {utils as adobeLaunch} from "@bbyca/adobe-launch/lib/utils";
import {ThunkInjectables, ThunkResult} from "models";
import {getUserShippingLocationPostalCode, getUserShippingLocationRegionCode} from "store/selectors/userSelectors";
import {getIntlLocale} from "../../../store/selectors/intlSelectors";
import {basketActionCreators} from "../../actions/basketActions";
import getProductListId from "../../utils/getProductListId";
import {getProductListLineItems, getCartPageBasketId} from "../../store/selectors";
import {SavedProduct} from "../../providers/ProductListProvider";

export const productListActionTypes = {
    FETCH_PRODUCT_LIST_LOADING: "productList/FETCH_PRODUCT_LIST_LOADING",
    FETCH_PRODUCT_LIST_SUCCESS: "productList/FETCH_PRODUCT_LIST_SUCCESS",
    FETCH_PRODUCT_LIST_ERROR: "productList/FETCH_PRODUCT_LIST_ERROR",
    FETCH_PRODUCT_LIST_RESET: "productList/FETCH_PRODUCT_LIST_RESET",
    MOVE_SAVED_ITEM_SUCCESS: "productList/MOVE_SAVED_ITEM_SUCCESS",
    MOVE_SAVED_ITEM_ERROR: "productList/MOVE_SAVED_ITEM_ERROR",
    REMOVE_SAVED_ITEM_SUCCESS: "productList/REMOVE_SAVED_ITEM_SUCCESS",
    REMOVE_SAVED_ITEM_ERROR: "productList/REMOVE_SAVED_ITEM_ERROR",
};

export interface ProductListActionCreators {
    fetchProductList: () => ThunkResult<Promise<void>>;
    moveSavedItemToCart: (sku: string) => ThunkResult<void>;
    resetProductListState: () => ThunkResult<void>;
    removeSavedItem: () => ThunkResult<void>;
    removeSavedItemSuccess: (product: SavedProduct) => any;
    removeSavedItemError: (product: SavedProduct) => any;
    moveSavedItemToCartSuccess: (product: SavedProduct) => any;
    moveSavedItemToCartError: (product: SavedProduct) => any;
}

export const productListActionCreators = (() => {
    const fetchProductListLoading = () => ({type: productListActionTypes.FETCH_PRODUCT_LIST_LOADING});
    const fetchProductListError = (error: Error) => ({
        type: productListActionTypes.FETCH_PRODUCT_LIST_ERROR,
        payload: {error},
    });
    const fetchProductListSuccess = (data: object) => ({
        type: productListActionTypes.FETCH_PRODUCT_LIST_SUCCESS,
        payload: {data},
    });

    const fetchProductListReset = () => ({
        type: productListActionTypes.FETCH_PRODUCT_LIST_RESET,
    });

    const moveSavedItemToCartSuccess = (product: SavedProduct) => ({
        type: productListActionTypes.MOVE_SAVED_ITEM_SUCCESS,
        payload: {product},
    });

    const moveSavedItemToCartError = (product: SavedProduct) => ({
        type: productListActionTypes.MOVE_SAVED_ITEM_ERROR,
        payload: {product},
    });

    const removeSavedItemSuccess = (product: SavedProduct) => ({
        type: productListActionTypes.REMOVE_SAVED_ITEM_SUCCESS,
        payload: {product},
    });

    const removeSavedItemError = (product: SavedProduct) => ({
        type: productListActionTypes.REMOVE_SAVED_ITEM_ERROR,
        payload: {product},
    });

    const fetchProductList = () => async (dispatch, getState, {productListProvider}: ThunkInjectables) => {
        dispatch(fetchProductListLoading());
        const state = getState();
        const productListId = getProductListId();
        const locale = getIntlLocale(state);
        const regionCode = getUserShippingLocationRegionCode(state);
        const postalCode = getUserShippingLocationPostalCode(state);

        if (productListId) {
            try {
                const resp = await productListProvider.getSaveForLaterLists(
                    locale,
                    regionCode,
                    postalCode,
                    productListId,
                );

                return dispatch(fetchProductListSuccess(resp));
            } catch (error) {
                adobeLaunch.pushEventToDataLayer({event: "save-for-later-section-load-error"});
                return dispatch(fetchProductListError(error));
            }
        }
    };

    const moveSavedItemToCart = (sku: string) => async (
        dispatch,
        getState,
        {productListProvider, cookieCartProvider}: ThunkInjectables,
    ) => {
        dispatch(fetchProductListLoading());
        const state = getState();
        // at this point productListId is guaranteed to exist because
        // a user cannot have a saved item without having a list
        const productListId = getProductListId();
        const savedProducts = getProductListLineItems(state);
        const movedProduct = savedProducts.find((item) => item.sku === sku);

        if (!productListId) {
            return;
        }

        try {
            const regionCode = getUserShippingLocationRegionCode(state);
            const postalCode = getUserShippingLocationPostalCode(state);
            const destinationBasketId = getCartPageBasketId(state);
            const resp = await productListProvider.moveProductToCart({
                regionCode,
                postalCode,
                destinationBasketId,
                sku,
                productListId,
            });

            const cartId = resp.basketId;
            const cartIdCookie = cookieCartProvider.getCartId();

            if (!destinationBasketId || !cartIdCookie?.length) {
                cookieCartProvider.setCartId(cartId);
            }

            if (movedProduct) {
                dispatch(moveSavedItemToCartSuccess(movedProduct));

                adobeLaunch.pushEventToDataLayer({
                    event: "move-saved-item-to-cart-success",
                    payload: {
                        moveToCartItems: [
                            {
                                id: movedProduct.sku,
                                name: movedProduct.name,
                                nameAndSku: `${movedProduct.name} : ${movedProduct.sku}`,
                                purchasePrice: movedProduct.purchasePrice,
                                location: "saved",
                            },
                        ],
                    },
                });
            }
            dispatch(basketActionCreators.getCart(true));
        } catch (error) {
            dispatch(moveSavedItemToCartError(movedProduct));

            adobeLaunch.pushEventToDataLayer({
                event: "move-saved-item-to-cart-error",
                payload: {
                    moveToCartItems: [
                        {
                            id: movedProduct.sku,
                            name: movedProduct.name,
                            nameAndSku: `${movedProduct.name} : ${movedProduct.sku}`,
                            purchasePrice: movedProduct.purchasePrice,
                        },
                    ],
                },
            });
        }
    };

    const resetProductListState = () => async (dispatch) => {
        dispatch(fetchProductListReset());
    };

    const removeSavedItem = (sku: string) => async (dispatch, getState, {productListProvider}: ThunkInjectables) => {
        dispatch(fetchProductListLoading());
        const state = getState();
        const savedProducts = getProductListLineItems(state);

        const productListId = getProductListId();

        if (!productListId) {
            return;
        }

        const savedProduct = savedProducts.find((item) => item.sku === sku);

        if (savedProduct) {
            try {
                await productListProvider.removeSavedItem({sku, productListId});
                dispatch(removeSavedItemSuccess(savedProduct));

                adobeLaunch.pushEventToDataLayer({
                    event: "remove-saved-item-success",
                    payload: {
                        moveToCartItems: [
                            {
                                id: savedProduct.sku,
                                name: savedProduct.name,
                                nameAndSku: `${savedProduct.name} : ${savedProduct.sku}`,
                            },
                        ],
                    },
                });
            } catch (error) {
                dispatch(removeSavedItemError(savedProduct));
            }
        }
    };

    return {
        fetchProductList,
        moveSavedItemToCart,
        resetProductListState,
        removeSavedItem,
        removeSavedItemSuccess,
        removeSavedItemError,
        moveSavedItemToCartSuccess,
        moveSavedItemToCartError,
    };
})();
