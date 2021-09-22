import {createSelector, Selector} from "reselect";
import {RequiredProductsState} from "@bbyca/ecomm-checkout-components/dist/redux";

import {State} from "store";

export const getRequiredProducts: Selector<State, RequiredProductsState> = (state: State) => state.requiredProducts;

export const getWarrantyTypeForRequiredProductSku = (sku: string) =>
    createSelector<State, RequiredProductsState, string>([getRequiredProducts], (state) => {
        return state[sku] && state[sku].warranties && state[sku].warranties[0] && state[sku].warranties[0].type;
    });
