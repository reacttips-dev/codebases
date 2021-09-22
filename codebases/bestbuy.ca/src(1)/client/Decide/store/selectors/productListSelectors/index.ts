import {createSelector, Selector} from "reselect";

import {State} from "store";

import {SavedProduct} from "../../../providers/ProductListProvider";
import {ProductListState} from "../../../reducers/productListReducer";

export const getProductList: Selector<State, ProductListState> = (state: State) => state.productList;

export const getProductListLineItems = createSelector<State, ProductListState, SavedProduct[]>(
    [getProductList],
    (productList) => productList?.data?.products || [],
);

export const getProductListStatus = createSelector<State, ProductListState, string>(
    [getProductList],
    (state) => state.status,
);

export const getProductListError = createSelector<State, ProductListState, null | Error>(
    [getProductList],
    (state) => state.error,
);
