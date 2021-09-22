import {Location} from "history";
import {ActionCreatorsMapObject} from "redux";
import {State} from "store";
import routeManager from "utils/routeManager";
import {createBrandStoreNavigationProvider} from "providers";
import {SideNavigationNode} from "models";

export const sideNavigationActionTypes = {
    fetchSideNavigation: "FETCH_SIDE_NAVIGATION",
    fetchSideNavigationError: "FETCH_SIDE_NAVIGATION_ERROR",
    fetchSideNavigationSuccess: "FETCH_SIDE_NAVIGATION_SUCCESS",
    clearSideNavigation: "CLEAR_SIDE_NAVIGATION",
};

export interface SideNavigationActionCreators extends ActionCreatorsMapObject {
    syncSideNavigationStateWithLocation: (location: Location) => any;
    fetch: (...ids: string[]) => any;
    clearSideNavigation: () => void;
}

export const sideNavigationActionCreators: SideNavigationActionCreators = (() => {
    const syncSideNavigationStateWithLocation = (location: Location) => {
        return async (dispatch, getState) => {
            const state: State = getState();
            const validateParam = (str) => {
                return str.toString().replace(/[^a-z0-9]/g, "");
            };

            const language = state.intl.language;
            const params = routeManager.getParams(language, location.pathname) as {name: string; id: string};
            const name = params.name;
            const id = validateParam(params.id);

            await dispatch(fetch(name, id));
        };
    };

    const fetch = (...ids: string[]) => {
        return async (dispatch, getState) => {
            dispatch({type: sideNavigationActionTypes.fetchSideNavigation});
            const state = getState();
            const mappedProvider = _createProvider(state.routing.pageKey);
            const provider = mappedProvider(state.config.dataSources.contentApiUrl, state.intl.locale, ...ids);

            try {
                const tree = (await provider.getNavigation()) as SideNavigationNode;
                dispatch({type: sideNavigationActionTypes.fetchSideNavigationSuccess, tree});
            } catch (error) {
                dispatch({type: sideNavigationActionTypes.fetchSideNavigationError});
                dispatch(clearSideNavigation());
                // Do not dispatch errorActionCreator, b/c that will 404 content page
            }
        };
    };

    const clearSideNavigation = () => {
        return async (dispatch) => {
            dispatch({type: sideNavigationActionTypes.clearSideNavigation});
        };
    };

    const _createProvider = (pageKey: string) => {
        const providerMap = {
            brandStore: createBrandStoreNavigationProvider,
        };
        return providerMap[pageKey];
    };

    return {
        syncSideNavigationStateWithLocation,
        fetch,
        clearSideNavigation,
    };
})();
