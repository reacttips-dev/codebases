import {RouteActions, routerActions} from "react-router-redux";
import {ActionCreatorsMapObject} from "redux";

export const routingActionTypes = {
    locationChange: "@@router/LOCATION_CHANGE",
    setAltLangHrefs: "ROUTING_SET_ALT_LANG_HREFS",
    setPageKey: "ROUTER_SET_PAGE_KEY",
};

export interface RoutingActionCreators extends ActionCreatorsMapObject {
    setAltLangHrefs: (altLangHrefs: any) => any;
    setPageKey: (pageKey: string) => any;
}

export const routingActionCreators: RoutingActionCreators & RouteActions = (() => {
    const setAltLangHrefs = (altLangHrefs: {altLangUrl: string; curLangUrl: string}) => {
        return {
            ...altLangHrefs,
            type: routingActionTypes.setAltLangHrefs,
        };
    };

    const setPageKey = (pageKey: string) => {
        return {
            pageKey,
            type: routingActionTypes.setPageKey,
        };
    };

    return {
        setAltLangHrefs,
        setPageKey,
        ...routerActions,
    };
})();
