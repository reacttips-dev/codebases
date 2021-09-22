/**
 * Created by Eyal.Albilia on 05/04/2017.
 */
import { combineReducers } from "redux";
import {
    COMMON_RESET_BETA_VS_LIVE_TOGGLE,
    COMMON_UPDATE_BETA_VS_LIVE_TOGGLE,
    COMMON_SW_SETTINGS_READY,
    COMMON_UPDATE_ESTIMATED_VS_GA_TOGGLE,
    CREATE_USERMANAGEMENT_LINK,
    EMPTY_TOP_BAR,
    HIDE_COUNTRY_TOOLTIP,
    HIDE_TOP_NAV,
    HIDE_WEBSOURCE_TOOLTIP,
    NOTIFICATION_BAR_ITEM_GENERATED,
    NOTIFICATION_BAR_ITEM_REMOVED,
    NOTIFICATION_BAR_UPDATE_HEIGHT,
    NOTIFICATION_BUBBLE_OPEN,
    NOTIFICATION_BUBBLE_REMOVE,
    PAGE_NOTIFICATION_BAR_ITEM_GENERATED,
    PAGE_NOTIFICATION_BAR_ITEM_REMOVED,
    POPULATE_TOP_BAR,
    REMOVE_USERMANAGEMENT_LINK,
    SHOW_TOP_NAV,
    UNSUPPORTED_COUNTRY_REDIRECT,
    UNSUPPORTED_WEBSOURCE_REDIRECT,
    COMMON_UPDATE_BETA_VS_LIVE_TOGGLE_CCOMPLETED,
    TOGGLE_RESET_BETA_VS_LIVE_MODAL,
} from "../../action_types/common_action_types";

function showGAApprovedData(state = false, action) {
    switch (action.type) {
        case COMMON_UPDATE_ESTIMATED_VS_GA_TOGGLE:
            return action.showGAApprovedData;
        case COMMON_SW_SETTINGS_READY:
            return !!action.swSettings.components.Home.resources
                .IsWebsiteAnalysisVerifiedDataEnabled;
        default:
            return state;
    }
}

function showBetaBranchData(state = { isUpdating: false, value: null }, action) {
    switch (action.type) {
        case COMMON_UPDATE_BETA_VS_LIVE_TOGGLE:
            return {
                value: action.value,
                isUpdating: action.isUpdating,
            };
        case COMMON_UPDATE_BETA_VS_LIVE_TOGGLE_CCOMPLETED:
            return {
                ...state,
                isUpdating: false,
            };
        case COMMON_RESET_BETA_VS_LIVE_TOGGLE:
            return {
                value: null,
                isUpdating: false,
            };
        default:
            return state;
    }
}

function resetBetaModalState(state = { isOpen: false, updateParams: null }, action) {
    switch (action.type) {
        case TOGGLE_RESET_BETA_VS_LIVE_MODAL:
            return {
                isOpen: action.isOpen,
                updateParams: action.updateParams,
            };
        default:
            return state;
    }
}

function showWebSourceTooltip(state = false, action) {
    switch (action.type) {
        case UNSUPPORTED_WEBSOURCE_REDIRECT:
            return true;
        case HIDE_WEBSOURCE_TOOLTIP:
            return false;
        default:
            return state;
    }
}

function showCountryTooltip(state = false, action) {
    switch (action.type) {
        case UNSUPPORTED_COUNTRY_REDIRECT:
            return true;
        case HIDE_COUNTRY_TOOLTIP:
            return false;
        default:
            return state;
    }
}

function isTopNavShown(state = true, action) {
    switch (action.type) {
        case SHOW_TOP_NAV:
            return true;
        case HIDE_TOP_NAV:
            return false;
        default:
            return state;
    }
}

function isTopBarEmpty(state = false, action) {
    switch (action.type) {
        case EMPTY_TOP_BAR:
            return true;
        case POPULATE_TOP_BAR:
            return false;
        default:
            return state;
    }
}
//appears below subNav
function pageNotificationList(state = [], action) {
    switch (action.type) {
        case PAGE_NOTIFICATION_BAR_ITEM_GENERATED:
            // remove item before adding, to make sure it does not appear twice
            return state
                .filter((notification) => notification.id === action.id)
                .concat(action.notification);
        case PAGE_NOTIFICATION_BAR_ITEM_REMOVED:
            return state.filter((notification) => notification.id === action.id);
        default:
            return state;
    }
}
//appears above the entire page layout
function notificationList(state = [], action) {
    switch (action.type) {
        case NOTIFICATION_BAR_ITEM_GENERATED:
            // remove item before adding, to make sure it does not appear twice
            return state
                .filter((notification) => notification.id === action.id)
                .concat(action.notification);
        case NOTIFICATION_BAR_ITEM_REMOVED:
            return state.filter((notification) => notification.id === action.id);
        default:
            return state;
    }
}

function notificationListHeight(state = 0, action) {
    switch (action.type) {
        case NOTIFICATION_BAR_UPDATE_HEIGHT:
            // remove item before adding, to make sure it does not appear twice
            return action.height;
        default:
            return state;
    }
}

function bubblesNotificationList(state = [], action) {
    switch (action.type) {
        case NOTIFICATION_BUBBLE_OPEN:
            if (state.find((bubble) => bubble.id === action.bubbleNotification.id)) {
                return state;
            } else {
                return state.concat(action.bubbleNotification);
            }
        case NOTIFICATION_BUBBLE_REMOVE:
            return state.filter((bubbleNotification) => bubbleNotification.id !== action.id);
        default:
            return state;
    }
}

function userManagementLinksContainer(state = [], action) {
    switch (action.type) {
        case CREATE_USERMANAGEMENT_LINK:
            if (state.find((link) => link.id === action.userManagementLink.id)) {
                return state;
            } else {
                return state.concat(action.userManagementLink);
            }
        case REMOVE_USERMANAGEMENT_LINK:
            return state.filter((userManagementLink) => userManagementLink.id === action.linkId);
        default:
            return state;
    }
}

export default combineReducers({
    showGAApprovedData,
    showWebSourceTooltip,
    showCountryTooltip,
    pageNotificationList,
    notificationList,
    bubblesNotificationList,
    userManagementLinksContainer,
    notificationListHeight,
    isTopNavShown,
    isTopBarEmpty,
    showBetaBranchData,
    isResetBetaModalOpen: resetBetaModalState,
});
