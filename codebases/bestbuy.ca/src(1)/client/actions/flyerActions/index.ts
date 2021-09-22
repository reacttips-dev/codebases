import {routingActionCreators} from "actions";
import routeManager from "utils/routeManager";
import {ActionCreatorsMapObject} from "redux";
export const flyerActionTypes = {
    flyerPageLoad: "FLYER_PAGE_LOAD",
    syncFlyerStateWithLocation: "SYNC_FLYER_STATE_WITH_LOCATION",
};

export interface FlyerActionCreators extends ActionCreatorsMapObject {
    trackFlyerPageLoad: () => any;
    syncFlyerStateWithLocation: (location) => any;
}

export const flyerActionCreators: FlyerActionCreators = (() => {
    const trackFlyerPageLoad = () => {
        return {
            type: flyerActionTypes.flyerPageLoad,
        };
    };

    const syncFlyerStateWithLocation = (location) => {
        return async (dispatch, getState) => {
            const {
                intl: {language},
            } = getState();
            await dispatch(
                routingActionCreators.setAltLangHrefs({
                    altLangUrl: routeManager.getAltLangPathByKey(language, "flyer"),
                    curLangUrl: routeManager.getCurrLang(location.pathname),
                }),
            );
            dispatch({
                type: flyerActionTypes.syncFlyerStateWithLocation,
            });
        };
    };

    return {
        trackFlyerPageLoad,
        syncFlyerStateWithLocation,
    };
})();
