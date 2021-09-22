import { TOGGLE_SIDE_NAV, TOGGLE_SIDE_NAV_GROUP } from "../../action_types/layout_action_types";
import { loadState, saveState } from "../../actions/localStorage.utils";

declare var window;

interface ILayoutState {
    sideNavIsOpen: boolean;
}

/**
 * Get default state. id the screen width is less than 1200px, the sidebar is closed by default;
 * @returns {ILayoutState}
 */
function getDefaultState(): ILayoutState {
    return {
        sideNavIsOpen: false,
    };
}

function layout(state: ILayoutState = getDefaultState(), action): object {
    switch (action.type) {
        case TOGGLE_SIDE_NAV: {
            const sideNavIsOpen = !state.sideNavIsOpen;
            return Object.assign({}, state, { sideNavIsOpen });
        }
        case TOGGLE_SIDE_NAV_GROUP: {
            const sideNavIsOpen = !state.sideNavIsOpen;
            return Object.assign({}, state, { sideNavIsOpen });
        }
        default:
            return state;
    }
}

export default layout;
