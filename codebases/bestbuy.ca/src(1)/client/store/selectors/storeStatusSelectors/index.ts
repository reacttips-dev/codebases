import {createSelector, Selector} from "reselect";
import {State} from "store";
import {RetailStoreStatus, StoreLocationById} from "models";
import {get} from "lodash-es";

export const getStoresStatus: Selector<State, RetailStoreStatus> = (state: State) => state.storesStatus;

export const getStoreLocations = createSelector<State, RetailStoreStatus, StoreLocationById>(
    [getStoresStatus],
    (storesStatuses) => get(storesStatuses, "statuses"),
);
