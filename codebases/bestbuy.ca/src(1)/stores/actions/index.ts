var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const types = {
    getNearbyStores: "scm/stores/getNearbyStores",
    onError: "scm/stores/onError",
    setNearbyStores: "scm/stores/setNearbyStores",
};
export function getActionCreators(storeProvider) {
    const actionCreators = {
        getNearbyStores: (postalCode) => (dispatch) => __awaiter(this, void 0, void 0, function* () {
            try {
                dispatch({ type: types.getNearbyStores });
                const nearbyStores = yield storeProvider.getNearbyStores(postalCode);
                dispatch(actionCreators.setNearbyStores(nearbyStores));
            }
            catch (error) {
                dispatch(actionCreators.onError());
                throw error;
            }
        }),
        onError: () => ({ type: types.onError }),
        setNearbyStores: (nearbyStores) => ({
            nearbyStores,
            type: types.setNearbyStores,
        }),
    };
    return actionCreators;
}
//# sourceMappingURL=index.js.map