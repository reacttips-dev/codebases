import { getPageSettings } from "reducers/_reducers/pageSettingsReducer";
import * as routingActions from "../action_types/routing_action_types";
import {
    SET_CHOSEN_ITEMS,
    SET_CHOSEN_ITEMS_HEADER_DATA,
    TOGGLE_PINK_BADGE,
    SET_PAGE_TRANSITION,
} from "../action_types/routing_action_types";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";

export const changePage = ({
    page,
    module,
    stateId,
    params,
    stateConfig,
}: {
    page: string;
    module: string;
    stateId: string;
    params: any;
    stateConfig: any;
}) => {
    return {
        type: routingActions.CURRENT_PAGE,
        page,
        module,
        stateId,
        params,
        stateConfig,
        pageTitleConfig: getPageSettings(stateConfig),
    };
};

export const urlChange = ({ toParams, stateConfig }: { stateConfig: any; toParams }) => {
    return {
        type: routingActions.URL_CHANGE,
        params: toParams,
        pageTitleConfig: getPageSettings(stateConfig),
    };
};

export const chosenItemsChange = (chosenItems) => {
    return {
        type: SET_CHOSEN_ITEMS,
        chosenItems,
    };
};

export const chosenItemsSetHeaderData = (items) => {
    return {
        type: SET_CHOSEN_ITEMS_HEADER_DATA,
        items,
    };
};

export const addPinkBadge = (pinkBadgeTitle) => {
    return {
        type: TOGGLE_PINK_BADGE,
        pinkBadgeTitle,
    };
};

export const hidePinkBadge = () => {
    return {
        type: TOGGLE_PINK_BADGE,
        pinkBadgeTitle: null,
    };
};

export const setIsPageTransitioning = (isPageTransitioning) => {
    return {
        type: SET_PAGE_TRANSITION,
        isPageTransitioning,
    };
};

export const applyCurrentPage = () => (dispatch, getState) => {
    const state = getState();

    // if page is not in transitioning mode, then do nothing to apply current page
    if (!state.routing.isPageTransitioning) {
        return;
    }

    // get current page state and params from swNavigator, and update current page
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const curState = swNavigator.current();
    const curParams = swNavigator.getParams();
    dispatch(
        changePage({
            page: curState.name,
            module: swNavigator.getCurrentModule(),
            stateId: curParams[curState.stateId],
            params: curParams,
            stateConfig: curState,
        }),
    );
    dispatch(setIsPageTransitioning(false));
};
