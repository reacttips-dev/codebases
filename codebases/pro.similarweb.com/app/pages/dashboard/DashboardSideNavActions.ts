import { SET_SIDE_NAV_ITEMS } from "./DashboardSideNavActionTypes";
import { ShareDashboardService } from "./ShareDashboardService";
export const setSideNavItems = (sharedWithMeDashboards = [], navListLoaded = false) => {
    return {
        type: SET_SIDE_NAV_ITEMS,
        navListLoaded,
        sharedWithMeDashboards,
    };
};
export const setSharedWithMeDashboards = () => {
    return (dispatch) => {
        dispatch(setSideNavItems());
        ShareDashboardService.getSharedWithMe().then(({ dashboards }) => {
            return dispatch(setSideNavItems(dashboards, true));
        });
    };
};
