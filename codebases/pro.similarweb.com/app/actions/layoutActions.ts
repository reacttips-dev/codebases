import * as layoutActions from "../action_types/layout_action_types";

export const toggleSideNav = () => {
    return {
        type: layoutActions.TOGGLE_SIDE_NAV,
    };
};

export const toggleSideNavGroup = (groupId) => {
    return {
        type: layoutActions.TOGGLE_SIDE_NAV_GROUP,
        groupId,
    };
};

// export const windowResizeAction = (width, height) => {
//     return {
//         type: layoutActions.WINDOW_RESIZE,
//         width,
//         height,
//     }
// };
