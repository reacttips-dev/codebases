var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getLineItemBySku } from "../cart";
import { CART_CHILD_ITEM_REMOVED } from "../cart/actionTypes";
/* --------Constants--------*/
export const ADD_REQUIRED_PRODUCTS = "requiredProducts/ADD_REQUIRED_PRODUCTS";
export const FETCHING_REQUIRED_PRODUCTS = "requiredProducts/FETCHING_REQUIRED_PRODUCTS";
export const FETCHING_REQUIRED_PRODUCTS_FAILURE = "requiredProducts/FETCHING_REQUIRED_PRODUCTS_FAILURE";
export const TRACK_REQUIRED_PARTS_PAGE_LOAD = "requiredProducts/TRACK_REQUIRED_PARTS_PAGE_LOAD";
export const UPDATE_REQUIRED_PRODUCT_STATUS = "requiredProducts/UPDATE_REQUIRED_PRODUCT_STATUS";
export const UPDATE_WARRANTY_SELECTION = "requiredProducts/UPDATE_WARRANTY_SELECTION";
/*----------- ACTION CREATORS -----------------*/
export const addRequiredProducts = (sku, requiredProducts, parentProduct, warranties) => ({
    payload: { sku, requiredProducts, parentProduct, warranties },
    type: ADD_REQUIRED_PRODUCTS,
});
export const fetchingRequiredProducts = (sku) => ({
    payload: { sku },
    type: FETCHING_REQUIRED_PRODUCTS,
});
export const fetchingRequiredProductsFailure = (sku) => ({
    payload: { sku },
    type: FETCHING_REQUIRED_PRODUCTS_FAILURE,
});
export const trackRequiredPartsPageLoad = () => ({
    type: TRACK_REQUIRED_PARTS_PAGE_LOAD,
});
export const updateRequiredProductStatus = (sku, requiredProductSku, status) => ({
    payload: { requiredProductSku, sku, status },
    type: UPDATE_REQUIRED_PRODUCT_STATUS,
});
export const updateWarrantySelection = (sku, warrantySku) => ({
    payload: { sku, warrantySku },
    type: UPDATE_WARRANTY_SELECTION,
});
export const addRequiredProductsAndStatuses = (sku, requiredProducts, parentProduct, warranties) => (dispatch) => {
    dispatch(addRequiredProducts(sku, requiredProducts, parentProduct, warranties));
    dispatch(updateRequiredProductsStatuses(sku));
};
export const fetchSimpleRequiredProducts = (sku) => (dispatch, getState, { requiredProductsProvider }) => __awaiter(void 0, void 0, void 0, function* () {
    const state = getState();
    const locale = state.intl && state.intl.locale;
    const regionCode = state.user && state.user.shippingLocation && state.user.shippingLocation.regionCode;
    try {
        dispatch(fetchingRequiredProducts(sku));
        const response = yield requiredProductsProvider.getSimpleRequiredProducts(sku, locale, regionCode);
        const { requiredProducts, parentProduct } = response;
        dispatch(addRequiredProductsAndStatuses(sku, requiredProducts, parentProduct));
    }
    catch (e) {
        dispatch(fetchingRequiredProductsFailure(sku));
    }
});
export const cachedFetchSimpleRequiredProducts = (sku) => (dispatch, getState) => __awaiter(void 0, void 0, void 0, function* () {
    const requiredProductsState = getState().requiredProducts;
    const requiredProducts = getRequiredProducts(requiredProductsState, sku);
    if (requiredProducts && !hasRequiredProductsFetchingFailed(requiredProductsState, sku)) {
        return;
    }
    dispatch(fetchSimpleRequiredProducts(sku));
});
export const fetchDetailedRequiredProducts = (sku, offerFetchOps) => (dispatch, getState, { requiredProductsProvider }) => __awaiter(void 0, void 0, void 0, function* () {
    const state = getState();
    const locale = state.intl && state.intl.locale;
    const regionCode = state.user && state.user.shippingLocation && state.user.shippingLocation.regionCode;
    const postalCode = state.user && state.user.shippingLocation && state.user.shippingLocation.postalCode;
    try {
        dispatch(fetchingRequiredProducts(sku));
        const response = yield requiredProductsProvider.getDetailedRequiredProducts(sku, locale, regionCode, postalCode, offerFetchOps);
        const { requiredProducts, parentProduct, warranties } = response;
        dispatch(addRequiredProductsAndStatuses(sku, requiredProducts, parentProduct, warranties));
    }
    catch (e) {
        dispatch(fetchingRequiredProductsFailure(sku));
    }
});
export const updateRequiredProductsStatuses = (sku) => (dispatch, getState) => {
    const state = getState();
    const requiredProducts = getRequiredProducts(state.requiredProducts, sku);
    const warranties = getWarranties(state.requiredProducts, sku);
    if (requiredProducts) {
        requiredProducts.forEach((product) => {
            const childLineItem = getChildLineItem(state.cart, sku, product.sku);
            const status = childLineItem ? "isInCart" : "notInCart";
            dispatch(updateRequiredProductStatus(sku, product.sku, status));
        });
    }
    if (warranties) {
        warranties.forEach((warranty) => {
            const childLineItem = getChildLineItem(state.cart, sku, warranty.sku);
            if (childLineItem) {
                dispatch(updateWarrantySelection(sku, warranty.sku));
            }
        });
    }
};
const getChildLineItem = (cart, parentSku, childSku) => {
    const parentLineItem = getLineItemBySku(cart, parentSku);
    return parentLineItem
        && parentLineItem.children
        && parentLineItem.children.find((child) => child.sku.id === childSku);
};
const defaultState = {};
export default function reducer(state = defaultState, action = {}) {
    let sku;
    switch (action.type) {
        case ADD_REQUIRED_PRODUCTS:
            sku = action.payload.sku;
            return Object.assign(Object.assign({}, state), { [sku]: Object.assign(Object.assign({}, state[sku]), { isError: false, isLoading: false, parentProduct: action.payload.parentProduct, products: action.payload.requiredProducts, warranties: action.payload.warranties }) });
        case FETCHING_REQUIRED_PRODUCTS:
            sku = action.payload.sku;
            return Object.assign(Object.assign({}, state), { [sku]: Object.assign(Object.assign({}, state[sku]), { isError: false, isLoading: true }) });
        case FETCHING_REQUIRED_PRODUCTS_FAILURE:
            sku = action.payload.sku;
            return Object.assign(Object.assign({}, state), { [sku]: Object.assign(Object.assign({}, state[sku]), { isError: true, isLoading: false }) });
        case UPDATE_REQUIRED_PRODUCT_STATUS:
            sku = action.payload.sku;
            return Object.assign(Object.assign({}, state), { [sku]: Object.assign(Object.assign({}, state[sku]), { products: state[sku].products.map((product) => {
                        const updateProductSku = action.payload.requiredProductSku;
                        if (product.sku !== updateProductSku) {
                            return product;
                        }
                        return Object.assign(Object.assign({}, product), { status: action.payload.status });
                    }) }) });
        case UPDATE_WARRANTY_SELECTION:
            sku = action.payload.sku;
            const warrantySku = action.payload.warrantySku;
            return Object.assign(Object.assign({}, state), { [sku]: Object.assign(Object.assign({}, state[sku]), { selectedWarranty: findSelectedWarranty(state[sku].warranties, warrantySku) }) });
        case CART_CHILD_ITEM_REMOVED:
            sku = action.payload.sku;
            const currentSelectedWarranty = state[sku].selectedWarranty;
            // if warranty of parent item is removed from cart
            const hasWarrantyBeenDeleted = currentSelectedWarranty &&
                (action.payload.lineItem.sku.id === currentSelectedWarranty.sku ||
                    action.payload.lineItem.sku.id === currentSelectedWarranty.parentSku);
            return Object.assign(Object.assign({}, state), { [sku]: Object.assign(Object.assign({}, state[sku]), { selectedWarranty: hasWarrantyBeenDeleted ? null : currentSelectedWarranty }) });
        default:
            return state;
    }
}
/* --------Selector--------*/
export const getSelectedWarranty = (state, sku) => {
    return state && state[sku] && state[sku].selectedWarranty;
};
export const getWarranties = (state, sku) => {
    return state && state[sku] && state[sku].warranties;
};
export const getRequiredProducts = (state, sku) => {
    return state && state[sku] && state[sku].products;
};
export const hasRequiredProductsFetchingFailed = (state, sku) => {
    return state && state[sku] ? state[sku].isError : false;
};
export const isRequiredProductsLoading = (state, sku) => {
    return state && state[sku] && state[sku].isLoading;
};
export const getRequiredPartsParentProduct = (state, sku) => {
    return state && state[sku] && state[sku].parentProduct;
};
const findSelectedWarranty = (warranties, warrantySku) => {
    let selectedWarranty;
    warranties.forEach((warranty) => {
        if (warranty.sku === warrantySku) {
            selectedWarranty = warranty;
        }
    });
    return selectedWarranty;
};
//# sourceMappingURL=index.js.map