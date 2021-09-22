import {sideNavigationActionTypes} from "actions/sideNavigationActions";
import { SideNavigationNode } from "models/SideNavigation";

export interface SideNavigationState {
    loading: boolean;
    tree?: SideNavigationNode;
}

export const initialSideNavigationState: SideNavigationState = {
    tree: undefined,
    loading: false,
};

export const sideNavigation = (state = initialSideNavigationState, action): SideNavigationState => {
    switch (action.type) {
        case sideNavigationActionTypes.fetchSideNavigation:
            return {
                ...state,
                loading: true,
            };
        case sideNavigationActionTypes.fetchSideNavigationSuccess:
            return {
                tree: action.tree,
                loading: false,
            };
        case sideNavigationActionTypes.fetchSideNavigationError:
            return {
                ...state,
                loading: false,
            };
        case sideNavigationActionTypes.clearSideNavigation:
            return initialSideNavigationState;
        default:
            return state;
    }
};
