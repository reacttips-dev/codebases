import { routingActionTypes } from "actions";
import { Location } from "history";
import { Key } from "@bbyca/apex-components";
import { routerReducer, RouterState } from "react-router-redux";
import routeManager from "utils/routeManager";

export interface RoutingState {
    pageKey?: Key;
    altLangUrl?: string;
    curLangUrl?: string;
    locationBeforeTransitions?: Location;
    previousLocationBeforeTransitions?: Location;
}

export const initialRoutingState: RouterState = {
    locationBeforeTransitions: undefined,
};

export const router = (state = initialRoutingState, action) => {

    const updatedState = routerReducer(state, action);

    switch (action.type) {
        // locationChange dispatches only on client side
        case routingActionTypes.locationChange:
            const pathname = action.payload.pathname;
            return {
                ...updatedState as RouterState,
                pageKey: pathname && routeManager.getKeyByPath(pathname.substring(1, 3), pathname),
                previousLocationBeforeTransitions: state.locationBeforeTransitions,
            };

        case routingActionTypes.setPageKey:
            return {
                ...updatedState,
                pageKey: action.pageKey,
            };

        case routingActionTypes.setAltLangHrefs:
            return {
                ...updatedState,
                altLangUrl: action.altLangUrl,
                curLangUrl: action.curLangUrl,
            };

        default:
            return state;
    }
};

export default router;
