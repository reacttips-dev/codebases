import { SET_SIDE_NAV_ITEMS } from "./DashboardSideNavActionTypes";
import { navObj } from "./config/dashboardNavObj";

const DEFAULT_DASHBOARD_SIDE_NAV_STATE = { navList: [], navListLoaded: false };
export default function (state = DEFAULT_DASHBOARD_SIDE_NAV_STATE, action) {
    switch (action.type) {
        case SET_SIDE_NAV_ITEMS:
            return {
                ...state,
                navListLoaded: action.navListLoaded,
                navList: [...navObj(action).navList],
            };
        default:
            return {
                ...state,
            };
    }
}
