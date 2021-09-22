import {BasketShippingStatus} from "@bbyca/ecomm-checkout-components";
import {CLEAR_CART} from "@bbyca/ecomm-checkout-components/dist/redux/cart/actionTypes";

import {Summary, CartAvailability, Promotion, CartLineItem} from "models/Basket";
import hasQPUableItem from "Decide/pages/BasketPage/utils/hasQPUableItem";

import {cartActionTypes} from "../../actions/basketActions";

export enum CheckoutFlow {
    pickUpAtAStore = "pickUpAtAStore",
    getItShipped = "getItShipped",
}

export interface CartPageState {
    lineItems: CartLineItem[];
    summary: Summary;
    availability: CartAvailability;
    basketId: string;
    promotions: Promotion[];
    errorType?: string;
    isLoading: boolean;
    cartStatus?: CartStatus;
    selectedCheckoutFlow: CheckoutFlow;
}

export const enum CartStatus {
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
    LOADING = "LOADING",
}

export const cartReducerInitialState = {
    lineItems: [],
    summary: {
        ehf: 0,
        quantity: 0,
        savings: 0,
        shipping: 0,
        taxes: 0,
        subtotal: 0,
        total: 0,
    },
    availability: {
        shipping: {
            purchasable: false,
            status: BasketShippingStatus.EmptyCart,
        },
    },
    basketId: "",
    promotions: [],
    isLoading: false,
    selectedCheckoutFlow: CheckoutFlow.getItShipped,
};

export const cartPage = (state: CartPageState = cartReducerInitialState, action: any): CartPageState => {
    switch (action.type) {
        case cartActionTypes.FETCH_CART_SUCCESS: {
            const {lineItems, summary, availability, basketId, promotions} = action.payload;
            return {
                ...state,
                basketId: basketId || state.basketId,
                lineItems: lineItems || state.lineItems,
                summary: summary || state.summary,
                promotions: promotions || state.promotions,
                availability: availability || state.availability,
                cartStatus: CartStatus.SUCCESS,
                errorType: "",
                isLoading: false,
            };
        }
        case cartActionTypes.CART_ERROR: {
            const {errorType} = action.payload;
            return {
                ...state,
                errorType,
                cartStatus: CartStatus.FAILED,
                isLoading: false,
            };
        }
        case cartActionTypes.UPDATE_LINE_ITEM: {
            const {lineItem} = action.payload;
            const updatedState: CartPageState = updateLineItem(state, lineItem);

            return {
                ...updatedState,
                selectedCheckoutFlow: hasQPUableItem(updatedState.lineItems)
                    ? updatedState.selectedCheckoutFlow
                    : CheckoutFlow.getItShipped,
            };
        }
        case cartActionTypes.CLEAN_UP:
        case CLEAR_CART:
            return cartReducerInitialState;
        case cartActionTypes.CART_PROCESSING: {
            return {
                ...state,
                isLoading: true,
            };
        }
        case cartActionTypes.CART_PROCESSING_DONE: {
            return {
                ...state,
                isLoading: false,
            };
        }
        case cartActionTypes.SAVE_FOR_LATER_ERROR: {
            const {lineItem} = action.payload;
            return updateLineItem(state, {
                ...lineItem,
                saveForLaterError: true,
            });
        }
        case cartActionTypes.UPDATE_CHECKOUT_FLOW: {
            const {selectedCheckoutFlow} = action.payload;
            return {
                ...state,
                selectedCheckoutFlow,
            };
        }
        default:
            return state;
    }
};

function updateLineItem(state: CartPageState, lineItem: CartLineItem): CartPageState {
    if (!lineItem) {
        return state;
    }
    const lineItemId = lineItem.id;

    const lineItemIndex = state.lineItems.findIndex((item) => item.id === lineItemId);
    const newLineItems = [...state.lineItems];

    if (lineItemIndex !== -1) {
        newLineItems[lineItemIndex] = lineItem;
    }
    return {
        ...state,
        lineItems: newLineItems,
    };
}
