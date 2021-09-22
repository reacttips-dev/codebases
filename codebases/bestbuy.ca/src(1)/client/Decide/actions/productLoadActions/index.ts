import {ActionCreatorsMapObject} from "redux";
import {routerActions} from "react-router-redux";
import {Dispatch, getStateFunc, ThunkResult} from "models";
import State from "store";
import routeManager from "utils/routeManager";

export const productLoadActionTypes = {
    initialLoad: "INITIAL_LOAD",
};

export interface ProductLoadActionCreators extends ActionCreatorsMapObject {
    loadProduct: (sku: string, seoText: string) => ThunkResult<void>;
    initialLoad: (sku: string) => ThunkResult<void>;
    route: (sku: string, seoText: string) => ThunkResult<void>;
}

export const productLoadActionCreators: ProductLoadActionCreators = (() => {
    const loadProduct = (sku: string, seoText: string) => {
        return async (dispatch: Dispatch) => {
            dispatch(initialLoad(sku));
            await dispatch(route(sku, seoText));
        };
    };

    const initialLoad = (sku: string) => {
        return (dispatch: Dispatch, getState: getStateFunc) => {
            const state: State = getState();
            const searchResult: any =
                state.search.searchResult &&
                state.search.searchResult.products.find((productsSku) => productsSku.sku === sku);
            if (!!searchResult) {
                const availability = state.search.availabilities[sku];
                const product = {
                    additionalImages: [searchResult.thumbnailImage500],
                    ...searchResult,
                    placeholderImage: state.app.screenSize.greaterThan.extraSmall
                        ? searchResult.thumbnailImage250
                        : searchResult.thumbnailImage150,
                    seoText: searchResult.seoName,
                };
                dispatch({type: productLoadActionTypes.initialLoad, product, availability});
            }
        };
    };

    const route = (sku: string, seoText: string) => {
        return (dispatch: Dispatch, getState: getStateFunc) => {
            const state: State = getState();
            const pathname = routeManager.getPathByKey(state.intl.language, "product", seoText, sku);
            dispatch(routerActions.push({pathname}));
        };
    };

    return {
        loadProduct,
        initialLoad,
        route,
    };
})();

export default ProductLoadActionCreators;
