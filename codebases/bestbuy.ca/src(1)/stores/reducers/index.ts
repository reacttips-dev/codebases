import { types } from "../actions";
export const initialState = {
    isLoading: false,
    nearbyStores: [],
};
export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.getNearbyStores:
            return Object.assign(Object.assign({}, state), { isLoading: true });
        case types.setNearbyStores:
            const setNearbyStoreAction = action;
            return { isLoading: false, nearbyStores: setNearbyStoreAction.nearbyStores };
        case types.onError:
            return Object.assign(Object.assign({}, state), { isLoading: false });
        default:
            return state;
    }
};
//# sourceMappingURL=index.js.map