import { combineReducers } from "redux";
import * as entities from "../../business-rules/entities";
import payment from "../../redux/checkout/payment";
import shippingAddress from "../../redux/checkout/shipping";
import CheckoutApiClient from "../../services/CheckoutApiClient/CheckoutApiClient";
import { clearCart } from "../cart";
import * as checkoutActions from "./actionTypes";
const defaultState = {
    status: entities.OrderStatus.PENDING,
};
/* --------Reducers--------*/
const order = (state = defaultState, action = {}) => {
    switch (action.type) {
        case checkoutActions.UPDATE_REVIEW_ORDER:
            return Object.assign(Object.assign({}, state), { createdBasket: action.createdBasket, createdBasketJson: action.json, etag: action.etag, reviewItems: action.createdBasket.lineItems, status: entities.OrderStatus.REVIEW });
        case checkoutActions.SET_ORDER_NUMBER:
            return Object.assign(Object.assign({}, state), { orderNumber: action.orderNo, status: entities.OrderStatus.CONFIRMED });
        case checkoutActions.RESET_CHECKOUT:
            return {
                status: entities.OrderStatus.PENDING,
            };
        default:
            return state;
    }
};
export function email(state = null, action = {}) { return state; }
/* --------Action Creators--------*/
const resetCheckout = () => ({
    type: checkoutActions.RESET_CHECKOUT,
});
const setOrderNo = (orderNo) => ({
    orderNo,
    type: checkoutActions.SET_ORDER_NUMBER,
});
const updateReviewOrder = ({ createdBasket, etag, json }) => ({
    createdBasket,
    etag,
    json,
    type: checkoutActions.UPDATE_REVIEW_ORDER,
});
/* --------Async Action Creators--------*/
const reviewOrder = (orderData) => (dispatch, getState, { checkoutApiClient }) => {
    // todo: we should set an orderData type to ensure cleaner data - let's hold off until after the POC.
    let etag;
    const orderJsonData = JSON.stringify(orderData);
    const { lineItems: lineItems2 } = orderData;
    console.log("start creating basket ...", lineItems2);
    console.log("checkoutApiClient== ", checkoutApiClient);
    checkoutApiClient.createBasket(orderJsonData)
        .then((response) => {
        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }
        etag = response.headers.get("ETag");
        return response.json();
    }).then((basketDataFromResponse) => {
        console.log(basketDataFromResponse);
        dispatch(updateReviewOrder({
            createdBasket: buildCreatedBasket(basketDataFromResponse),
            etag,
            json: basketDataFromResponse,
        }));
    });
};
const buildCreatedBasket = (basketJson) => {
    const createdBasket = new entities.CreatedBasket();
    createdBasket.subtotal = basketJson.subtotal;
    createdBasket.orderTotal = basketJson.orderTotal;
    createdBasket.tax = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < basketJson.tax.length; i++) {
        console.log(basketJson.tax[i]);
        createdBasket.tax = createdBasket.tax.concat({ type: basketJson.tax[i].type, amount: basketJson.tax[i].amount });
    }
    const { lineItems } = basketJson;
    createdBasket.lineItems = lineItems;
    return createdBasket;
};
const confirmOrder = () => (dispatch, getState) => {
    const { createdBasketJson, etag } = getState().checkout.order;
    let trackingNumber = null;
    const checkoutApiClient = new CheckoutApiClient();
    checkoutApiClient.commitOrder(JSON.stringify(createdBasketJson), etag).then((response) => {
        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }
        // get the tracking number from the 'Location' reponse header
        const location = response.headers.get("location");
        trackingNumber = location.split("/").pop();
        if (trackingNumber) {
            console.log(`Congratz! Your order is committed, the tracking number is ${trackingNumber}`);
            dispatch(setOrderNo(trackingNumber));
            dispatch(clearCart());
        }
        else {
            console.log("Sorry mate, your order did NOT go through.");
        }
    });
};
export { confirmOrder, resetCheckout, reviewOrder, };
export default combineReducers({ order, email, payment, shippingAddress });
//# sourceMappingURL=index.js.map