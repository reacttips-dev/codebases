import {createSelector, Selector} from "reselect";
import {CartPageState, CartStatus} from "../../../reducers/cartPageReducer";
import {State} from "store";

export const getCartPage: Selector<State, CartPageState> = (state: State) => state.cartPage;

export const getCartPageBasketId = createSelector<State, CartPageState, string>(
    [getCartPage],
    (cartPage) => cartPage && cartPage.basketId,
);

export const getCartPageCartStatus = createSelector<State, CartPageState, CartStatus | undefined>(
    [getCartPage],
    (cartPage) => cartPage && cartPage.cartStatus,
);

export const getCartPageErrorType = createSelector<State, CartPageState, string | undefined>(
    [getCartPage],
    (cartPage) => cartPage && cartPage.errorType,
);
