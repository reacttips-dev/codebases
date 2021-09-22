var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CartStatus, LineItemType, } from "../../business-rules/entities";
import { NotFoundError } from "../../errors";
import removeQueryParameter from "../../utilities/removeQueryParam";
import { updateRequiredProductsStatuses } from "../requiredProducts";
import { extractAvailableServicePlans, } from "../servicePlan";
import * as cartActions from "./actionTypes";
import { getCurrentlyAttachedServicePlan, getLineItemBySku } from "./selectors";
export const defaultState = {
    apiStatusCode: "",
    availabilities: undefined,
    errorType: "",
    id: undefined,
    refilled: false,
    shipments: [],
    showConfirmation: false,
    status: CartStatus.PROCESSING,
    totalProductPrice: 0,
    totalPurchasePrice: 0,
    totalQuantity: 0,
};
export default function reducer(state = defaultState, action = {}) {
    switch (action.type) {
        case "@@router/LOCATION_CHANGE":
            return Object.assign(Object.assign({}, state), { showConfirmation: false });
        case cartActions.BASKET_FAILURE:
        case cartActions.BASKET_SUCCESS:
            return Object.assign(Object.assign({}, state), { status: CartStatus.BASKET_LOADED });
        case cartActions.BASKET_PROCESSING:
            return Object.assign(Object.assign({}, state), { status: CartStatus.BASKET_PROCESSING });
        case cartActions.CART_ADDED:
            return Object.assign(Object.assign({}, state), { status: CartStatus.ADDED });
        case cartActions.CART_RESET:
            return Object.assign(Object.assign({}, state), { showConfirmation: false, status: CartStatus.PENDING });
        case cartActions.CART_PROCESSING:
            return Object.assign(Object.assign({}, state), { status: CartStatus.PROCESSING });
        case cartActions.CART_ITEM_REMOVED:
            return Object.assign(Object.assign({}, state), { status: CartStatus.ITEM_REMOVED });
        case cartActions.CART_FAILURE:
            return Object.assign(Object.assign(Object.assign({}, state), action.payload), { status: CartStatus.FAILED });
        case cartActions.CLEAR_CART_FAILURE_CODE:
            return Object.assign(Object.assign({}, state), { apiStatusCode: "", errorType: "" });
        case cartActions.UPDATE_CART:
            return Object.assign(Object.assign(Object.assign({}, state), action.payload), { status: CartStatus.UPDATED });
        case cartActions.CLEAR_CART:
            return Object.assign(Object.assign({}, state), { cartId: undefined, shipments: [], showConfirmation: false, status: CartStatus.PENDING, totalQuantity: 0 });
        case cartActions.CLEAR_REMOVED_ITEMS:
            return Object.assign(Object.assign({}, state), { shipments: filterNonRemoved(state.shipments || []) });
        case cartActions.OVERWRITE_CART:
            return Object.assign(Object.assign(Object.assign(Object.assign({}, defaultState), { availabilities: state.availabilities }), action.payload), { status: CartStatus.UPDATED });
        case cartActions.REFILL_FAILURE:
            return Object.assign(Object.assign({}, state), { refilled: false, status: CartStatus.PENDING });
        case cartActions.REFILL_PROCESSING:
            return Object.assign(Object.assign({}, state), { refilled: true, status: CartStatus.PROCESSING });
        case cartActions.REFILL_SUCCESS:
            return Object.assign(Object.assign({}, state), { refilled: true, status: CartStatus.PENDING });
        case cartActions.SHOW_CONFIRMATION:
            return Object.assign(Object.assign({}, state), { showConfirmation: true });
        default:
            return state;
    }
}
const filterNonRemoved = (shipments) => shipments.filter((shipment) => {
    shipment.lineItems = shipment.lineItems.filter((li) => !li.removed);
    return shipment.lineItems && shipment.lineItems.length > 0;
});
/* --------Action Creators--------*/
const cartAdded = () => ({
    type: cartActions.CART_ADDED,
});
const cartFailure = ({ apiStatusCode = "", errorType = "" } = {}) => ({
    payload: { apiStatusCode, errorType },
    type: cartActions.CART_FAILURE,
});
const clearCartFailureCode = () => ({
    type: cartActions.CLEAR_CART_FAILURE_CODE,
});
const cartItemRemoved = () => ({
    type: cartActions.CART_ITEM_REMOVED,
});
const cartChildItemRemoved = (payload) => ({
    payload,
    type: cartActions.CART_CHILD_ITEM_REMOVED,
});
const cartProcessing = () => ({
    type: cartActions.CART_PROCESSING,
});
const clearCart = () => ({
    type: cartActions.CLEAR_CART,
});
const clearRemovedItems = () => ({
    type: cartActions.CLEAR_REMOVED_ITEMS,
});
const overwriteCart = (payload) => ({
    payload,
    type: cartActions.OVERWRITE_CART,
});
const basketFailure = () => ({
    type: cartActions.BASKET_FAILURE,
});
const basketProcessing = () => ({
    type: cartActions.BASKET_PROCESSING,
});
const basketSuccess = () => ({
    type: cartActions.BASKET_SUCCESS,
});
const refillFailure = () => ({
    type: cartActions.REFILL_FAILURE,
});
const refillProcessing = () => ({
    type: cartActions.REFILL_PROCESSING,
});
const refillSuccess = () => ({
    type: cartActions.REFILL_SUCCESS,
});
const resetAddOperationDialog = () => ({
    type: cartActions.CART_RESET,
});
const showConfirmation = () => ({
    type: cartActions.SHOW_CONFIRMATION,
});
const updateCart = (payload) => ({
    payload,
    type: cartActions.UPDATE_CART,
});
/* --------Async Action Creators--------*/
const controlledDelay = () => new Promise((resolve) => {
    setTimeout(() => resolve(), 1000);
});
const trackAddToCart = (offer) => ({
    payload: Object.assign({}, offer),
    type: "ADD_TO_CART_REQUEST",
});
const trackAddFromCart = (payload) => ({
    payload,
    type: cartActions.ANALYTICS_CART_ITEM_ADDED,
});
const trackRemoveFromCart = (payload) => ({
    payload,
    type: cartActions.ANALYTICS_CART_ITEM_REMOVED,
});
const trackAddRequiredPart = (payload) => ({
    payload,
    type: cartActions.ANALYTICS_REQUIRED_PART_ADDED,
});
const trackAddedWarranty = (payload) => ({
    payload,
    type: cartActions.ANALYTICS_WARRANTY_ADDED,
});
const trackRemoveRequiredPart = (payload) => ({
    payload,
    type: cartActions.ANALYTICS_REQUIRED_PART_REMOVED,
});
const addToCart = (offer, onSuccessConfirmation) => (dispatch, getState, { cartAdder, checkoutEvents }) => {
    const state = getState();
    const postalCode = state.user && state.user.shippingLocation && state.user.shippingLocation.postalCode;
    const regionCode = state.user && state.user.shippingLocation && state.user.shippingLocation.regionCode;
    const locale = state.intl && state.intl.locale;
    dispatch(cartProcessing());
    const delay = controlledDelay();
    return new Promise((resolve, reject) => {
        cartAdder.addItem(offer, regionCode, postalCode, locale).then((res) => {
            delay.then(() => {
                dispatch(updateCart(res));
                dispatch(trackAddToCart(offer));
                onSuccessConfirmation();
                dispatch(cartAdded());
                checkoutEvents.notifyListeners("afteraddtocart");
                resolve();
            });
        })
            .catch((res) => {
            delay.then(() => {
                dispatch(cartFailure({ apiStatusCode: res.status || "" }));
                dispatch(showConfirmation());
                checkoutEvents.notifyListeners("afteraddtocart");
                reject();
            });
        });
    });
};
const addAssociatedLineItemToCart = (parentSku, associatedLineItemSku, type, cartTrackerAction) => (dispatch, getState, { cartUpdater }) => __awaiter(void 0, void 0, void 0, function* () {
    const state = getState();
    const postalCode = state.user && state.user.shippingLocation && state.user.shippingLocation.postalCode;
    const regionCode = state.user && state.user.shippingLocation && state.user.shippingLocation.regionCode;
    const locale = state.intl && state.intl.locale;
    const lineItem = getLineItemBySku(state.cart, parentSku);
    const lineItemId = lineItem && lineItem.id;
    const childItem = { sku: associatedLineItemSku, lineItemType: type, quantity: 1 };
    dispatch(cartProcessing());
    const delay = controlledDelay();
    try {
        const response = yield cartUpdater.addChildItem(lineItemId, childItem, regionCode, postalCode, locale);
        yield delay;
        dispatch(updateCart(response));
        dispatch(cartAdded());
        dispatch(updateRequiredProductsStatuses(parentSku));
        if (cartTrackerAction) {
            dispatch(cartTrackerAction({ lineItem: { sku: associatedLineItemSku } }));
        }
    }
    catch (e) {
        yield delay;
        dispatch(cartFailure({ apiStatusCode: e.status || "" }));
    }
});
const addWarrantyToCart = (parentSku, requiredPartSku) => (dispatch, getState, { cartUpdater }) => __awaiter(void 0, void 0, void 0, function* () {
    addAssociatedLineItemToCart(parentSku, requiredPartSku, LineItemType.Psp, trackAddedWarranty);
});
const addRequiredProductToCart = (parentSku, requiredPartSku) => (dispatch, getState, { cartUpdater }) => __awaiter(void 0, void 0, void 0, function* () {
    const state = getState();
    const postalCode = state.user && state.user.shippingLocation && state.user.shippingLocation.postalCode;
    const regionCode = state.user && state.user.shippingLocation && state.user.shippingLocation.regionCode;
    const locale = state.intl && state.intl.locale;
    const lineItem = getLineItemBySku(state.cart, parentSku);
    const lineItemId = lineItem && lineItem.id;
    const childItem = { sku: requiredPartSku, lineItemType: LineItemType.RequiredPart, quantity: 1 };
    dispatch(cartProcessing());
    const delay = controlledDelay();
    try {
        const response = yield cartUpdater.addChildItem(lineItemId, childItem, regionCode, postalCode, locale);
        yield delay;
        dispatch(updateCart(response));
        dispatch(cartAdded());
        dispatch(updateRequiredProductsStatuses(parentSku));
        dispatch(trackAddRequiredPart({ lineItem: { sku: requiredPartSku } }));
    }
    catch (e) {
        yield delay;
        dispatch(cartFailure({ apiStatusCode: e.status || "" }));
    }
});
const getCart = () => (dispatch, getState, { cartRefiller }) => __awaiter(void 0, void 0, void 0, function* () {
    // Refilling only happens at app startup
    // const cartState = getState().cart;
    const state = getState();
    const postalCode = state.user && state.user.shippingLocation && state.user.shippingLocation.postalCode;
    const regionCode = state.user && state.user.shippingLocation && state.user.shippingLocation.regionCode;
    const locale = state.intl && state.intl.locale;
    dispatch(cartProcessing());
    try {
        const res = yield cartRefiller.refillCart(regionCode, postalCode, locale);
        dispatch(overwriteCart(res));
    }
    catch (e) {
        dispatch(cartFailure());
    }
});
const getBasketPage = (getAvailabilities = null, itemsToRemove = null) => (dispatch, getState, { cartRefiller }) => __awaiter(void 0, void 0, void 0, function* () {
    const state = getState();
    const postalCode = state.user && state.user.shippingLocation && state.user.shippingLocation.postalCode;
    const regionCode = state.user && state.user.shippingLocation && state.user.shippingLocation.regionCode;
    const locale = state.intl && state.intl.locale;
    dispatch(basketProcessing());
    try {
        const res = yield cartRefiller.refillCart(regionCode, postalCode, locale);
        let shipmentLineItems = null;
        let availabilities = null;
        if (res.shipments) {
            shipmentLineItems = res.shipments.reduce((acc, { lineItems }) => ([
                ...acc,
                ...lineItems,
            ]), []);
            if (getAvailabilities) {
                availabilities = yield getAvailabilities(shipmentLineItems);
            }
        }
        dispatch(updateCart(res));
        if (itemsToRemove) {
            yield dispatch(removeItems(itemsToRemove, shipmentLineItems));
        }
        dispatch(extractAvailableServicePlans(res));
        dispatch(updateCart({ availabilities }));
        dispatch(basketSuccess());
    }
    catch (e) {
        if (e instanceof Error && e.name === NotFoundError.NAME) {
            dispatch(basketFailure());
        }
        else {
            dispatch(cartFailure({ errorType: cartActions.ERROR_LOAD_CART }));
        }
    }
});
const refillCart = (getAvailabilities = null, itemsToRemove = null) => (dispatch, getState, { cartRefiller }) => __awaiter(void 0, void 0, void 0, function* () {
    if (isOnBasketPage()) {
        return;
    }
    const cartState = getState().cart;
    const state = getState();
    const postalCode = state.user && state.user.shippingLocation && state.user.shippingLocation.postalCode;
    const regionCode = state.user && state.user.shippingLocation && state.user.shippingLocation.regionCode;
    const locale = state.intl && state.intl.locale;
    // Refilling only happens at app startup
    if (cartState && cartState.refilled) {
        return;
    }
    dispatch(refillProcessing());
    try {
        const res = yield cartRefiller.refillCart(regionCode, postalCode, locale);
        dispatch(updateCart(res));
        dispatch(refillSuccess());
    }
    catch (e) {
        dispatch(refillFailure());
    }
});
const removeItem = (lineItemId) => (dispatch, getState, { cartRemover }) => __awaiter(void 0, void 0, void 0, function* () {
    const state = getState();
    const prevCart = state.cart;
    const postalCode = state.user && state.user.shippingLocation && state.user.shippingLocation.postalCode;
    const regionCode = state.user && state.user.shippingLocation && state.user.shippingLocation.regionCode;
    const locale = state.intl && state.intl.locale;
    const lineItem = getLineItemById(prevCart, lineItemId);
    try {
        dispatch(cartProcessing());
        dispatch(cartChildItemRemoved({
            lineItem,
            sku: lineItem && lineItem.sku && lineItem.sku.id,
        }));
        const res = yield cartRemover.removeItem(lineItemId, prevCart, regionCode, postalCode, locale);
        dispatch(cartItemRemoved());
        dispatch(overwriteCart(res));
        dispatch(analyticsItemRemoved(prevCart, lineItemId));
    }
    catch (e) {
        if (e instanceof Error && e.name === NotFoundError.NAME) {
            dispatch(getCart());
        }
        dispatch(cartFailure({ errorType: cartActions.ERROR_REMOVE_ITEM }));
    }
});
const removeRequiredProductFromCart = (parentSku, requiredPartSku) => (dispatch, getState, { cartRemover }) => __awaiter(void 0, void 0, void 0, function* () {
    const state = getState();
    const parentLineItem = getLineItemBySku(state.cart, parentSku);
    const childLineItem = parentLineItem
        && parentLineItem.children
        && parentLineItem.children.find((child) => child.sku.id === requiredPartSku);
    const parentLineItemId = parentLineItem && parentLineItem.id;
    const childLineItemId = childLineItem && childLineItem.id;
    const postalCode = state.user && state.user.shippingLocation && state.user.shippingLocation.postalCode;
    const regionCode = state.user && state.user.shippingLocation && state.user.shippingLocation.regionCode;
    const locale = state.intl && state.intl.locale;
    if (!parentLineItemId || !childLineItemId) {
        return;
    }
    try {
        dispatch(cartProcessing());
        const res = yield cartRemover.removeChildItem(parentLineItemId, childLineItemId, regionCode, postalCode, locale);
        dispatch(cartItemRemoved());
        dispatch(overwriteCart(res));
        dispatch(updateRequiredProductsStatuses(parentSku));
        dispatch(trackRemoveRequiredPart({ lineItem: { sku: requiredPartSku } }));
    }
    catch (e) {
        if (e instanceof Error && e.name === NotFoundError.NAME) {
            dispatch(getCart());
        }
        dispatch(cartFailure({ errorType: cartActions.ERROR_REMOVE_ITEM }));
    }
});
const removeItems = (itemsToRemove, lineItems) => (dispatch, getState) => __awaiter(void 0, void 0, void 0, function* () {
    dispatch(cartProcessing());
    const quantityMap = lineItems.reduce((acc, { id, quantity, sku, }) => (Object.assign(Object.assign({}, acc), { [sku.id]: {
            id,
            quantity,
        } })), {});
    const quantityPromises = itemsToRemove.reduce((acc, { quantity: quantityToRemove, sku }) => {
        const { id, quantity: oldQuantity } = quantityMap[sku];
        const updatedQuantity = oldQuantity - quantityToRemove;
        if (updatedQuantity <= 0) {
            return [
                ...acc,
                dispatch(removeItem(quantityMap[sku].id)),
            ];
        }
        return [
            ...acc,
            dispatch(updateItemQuantity(id, updatedQuantity)),
        ];
    }, []);
    return Promise
        .all(quantityPromises)
        .then(() => {
        // Remove query param to ensure the call isn't repeated on page refresh
        if (isFromRpuFlow()) {
            history.replaceState({}, "", removeQueryParameter(window.location.href, "removeFromBasket"));
        }
        dispatch(refillSuccess());
    })
        .catch((e) => dispatch(cartFailure()));
});
const addChildItem = (lineItemId, childItem) => (dispatch, getState, { cartUpdater }) => __awaiter(void 0, void 0, void 0, function* () {
    const state = getState();
    const postalCode = state.user && state.user.shippingLocation && state.user.shippingLocation.postalCode;
    const regionCode = state.user && state.user.shippingLocation && state.user.shippingLocation.regionCode;
    const locale = state.intl && state.intl.locale;
    try {
        dispatch(cartProcessing());
        const response = yield cartUpdater.addChildItem(lineItemId, childItem, regionCode, postalCode, locale);
        dispatch(trackAddFromCart({ lineItem: childItem }));
        dispatch(updateCart(response));
    }
    catch (e) {
        if (childItem.lineItemType === LineItemType.Psp) {
            dispatch(cartFailure({ errorType: cartActions.ERROR_ADD_WARRANTY }));
        }
        else {
            dispatch(cartFailure());
        }
    }
});
const removeChildItem = (lineItemId, childItemId) => (dispatch, getState, { cartRemover }) => __awaiter(void 0, void 0, void 0, function* () {
    const state = getState();
    const postalCode = state.user && state.user.shippingLocation && state.user.shippingLocation.postalCode;
    const regionCode = state.user && state.user.shippingLocation && state.user.shippingLocation.regionCode;
    const locale = state.intl && state.intl.locale;
    const lineItem = state.cart.shipments.map(({ lineItems }) => lineItems.find((item) => item.id === lineItemId));
    const { children, } = lineItem[0];
    const childItem = children.find((item) => item.id === childItemId);
    try {
        dispatch(cartProcessing());
        const response = yield cartRemover.removeChildItem(lineItemId, childItemId, regionCode, postalCode, locale);
        dispatch(cartChildItemRemoved({
            lineItem: childItem,
            sku: lineItem[0] && lineItem[0].sku && lineItem[0].sku.id,
        }));
        dispatch(trackRemoveFromCart({ lineItem: childItem }));
        dispatch(updateCart(response));
    }
    catch (e) {
        if (childItem.lineItemType === LineItemType.Psp) {
            dispatch(cartFailure({ errorType: cartActions.ERROR_REMOVE_WARRANTY }));
        }
        else {
            dispatch(cartFailure({ errorType: cartActions.ERROR_REMOVE_ITEM }));
        }
    }
});
export const removeCurrentlyAttachedServicePlan = (lineItemId) => (dispatch, getState, { cartRemover, }) => __awaiter(void 0, void 0, void 0, function* () {
    const selectedPlan = getCurrentlyAttachedServicePlan(getState().cart, lineItemId);
    if (selectedPlan) {
        yield cartRemover.removeChildItem(lineItemId, selectedPlan.id);
        return dispatch(getCart());
    }
    return Promise.resolve();
});
const updateItemQuantity = (lineItemId, quantity) => (dispatch, getState, { cartUpdater }) => __awaiter(void 0, void 0, void 0, function* () {
    const state = getState();
    const prevCart = state.cart;
    const postalCode = state.user && state.user.shippingLocation && state.user.shippingLocation.postalCode;
    const regionCode = state.user && state.user.shippingLocation && state.user.shippingLocation.regionCode;
    const locale = state.intl && state.intl.locale;
    try {
        dispatch(cartProcessing());
        const res = yield cartUpdater.updateItemQuantity(lineItemId, quantity, prevCart, regionCode, postalCode, locale);
        dispatch(overwriteCart(res));
        dispatch(analyticsItemQuantityUpdated(prevCart, lineItemId, quantity));
    }
    catch (e) {
        if (e instanceof Error && e.name === NotFoundError.NAME) {
            dispatch(getCart());
        }
        dispatch(cartFailure({ errorType: cartActions.ERROR_UPDATE_QUANTITY }));
    }
});
const isFromRpuFlow = () => {
    const { search } = window.location;
    return search && search.indexOf("removeFromBasket") > -1;
};
const isOnBasketPage = () => {
    const { pathname } = window.location;
    return pathname && pathname.indexOf("basket") > -1 || pathname.indexOf("panier") > -1;
};
/* --------Analytics Action Creators--------*/
const analyticsCartLoaded = () => (dispatch, getState) => {
    dispatch({
        payload: { state: getState().cart },
        type: cartActions.ANALYTICS_CART_LOADED,
    });
};
const analyticsItemRemoved = (cart, lineItemId) => (dispatch) => {
    if (cart.shipments) {
        const lineItem = getLineItemById(cart, lineItemId);
        if (lineItem) {
            dispatch({
                payload: { lineItem },
                type: cartActions.ANALYTICS_CART_ITEM_REMOVED,
            });
        }
    }
};
const analyticsItemQuantityUpdated = (cart, lineItemId, newQuantity) => (dispatch) => {
    if (cart.shipments) {
        const lineItem = getLineItemById(cart, lineItemId);
        if (lineItem) {
            const oldQuantity = lineItem.quantity;
            const update = newQuantity > oldQuantity ? "increase" : "decrease";
            if (newQuantity !== oldQuantity) {
                dispatch({
                    payload: { lineItem, update, oldQuantity, newQuantity },
                    type: cartActions.ANALYTICS_CART_QUANTITY_UPDATED,
                });
            }
        }
    }
};
const analyticsPaypalClicked = () => (dispatch) => {
    dispatch({
        type: cartActions.ANALYTICS_CART_PAYPAL_CLICKED,
    });
};
const analyticsVisaClicked = () => (dispatch) => {
    dispatch({
        type: cartActions.ANALYTICS_CART_VISA_CLICKED,
    });
};
const analyticsPostalCodeUpdated = (postalCode) => ({
    payload: { postalCode },
    type: cartActions.ANALYTICS_CART_POSTAL_CODE_UPDATED,
});
const getLineItemById = (cart, lineItemId) => {
    for (const shipments of cart.shipments) {
        for (const lineItem of shipments.lineItems) {
            if (lineItem.id === lineItemId) {
                return lineItem;
            }
        }
    }
};
const analyticsMasterpassClicked = () => (dispatch) => {
    dispatch({
        type: cartActions.ANALYTICS_CART_MATERPASS_CLICKED,
    });
};
export { addChildItem, addRequiredProductToCart, addWarrantyToCart, addToCart, analyticsCartLoaded, analyticsMasterpassClicked, analyticsPaypalClicked, analyticsVisaClicked, analyticsPostalCodeUpdated, basketFailure, basketProcessing, basketSuccess, cartAdded, cartFailure, cartItemRemoved, cartProcessing, clearCart, clearCartFailureCode, clearRemovedItems, getBasketPage, getCart, overwriteCart, refillCart, refillFailure, refillProcessing, refillSuccess, removeChildItem, removeItem, removeItems, removeRequiredProductFromCart, resetAddOperationDialog, showConfirmation, trackAddFromCart, trackAddRequiredPart, trackAddToCart, trackRemoveFromCart, trackAddedWarranty, updateCart, updateItemQuantity, cartChildItemRemoved, };
export * from "./selectors";
//# sourceMappingURL=index.js.map