import {
    NOTIFICATION_BAR_ITEM_GENERATED,
    NOTIFICATION_BAR_ITEM_REMOVED,
    NOTIFICATION_BUBBLE_OPEN,
    NOTIFICATION_BUBBLE_REMOVE,
} from "../action_types/common_action_types";
import {
    UPDATE_USER_WORKSPACE_OPTIN_STATE,
    WORKSPACE_OPTIN_DISMISS_DOT_SHOW,
} from "../action_types/optIn_workspace_action_types";

export const createWorkspaceTrialInvitationNotificationBar = (notification) => {
    return {
        type: NOTIFICATION_BAR_ITEM_GENERATED,
        notification,
    };
};

export const removeWorkspaceTrialInvitationNotificationBar = (notificationId) => {
    return {
        type: NOTIFICATION_BAR_ITEM_REMOVED,
        notificationId,
    };
};

export const createWorkspaceEndTrialBubble = (bubbleNotification) => {
    return {
        type: NOTIFICATION_BUBBLE_OPEN,
        bubbleNotification,
    };
};

export const createWorkspaceTrialDismissDot = () => {
    return {
        type: WORKSPACE_OPTIN_DISMISS_DOT_SHOW,
    };
};

export const removeWorkspaceTrialBubble = (bubbleNotification) => {
    return {
        type: NOTIFICATION_BUBBLE_REMOVE,
        bubbleNotification,
    };
};

export const updateUserWorkspaceOptInState = (optInState) => {
    return {
        type: UPDATE_USER_WORKSPACE_OPTIN_STATE,
        optInState,
    };
};

export const createWorkspaceTrialBubble = (bubbleNotification) => {
    return {
        type: NOTIFICATION_BUBBLE_OPEN,
        bubbleNotification,
    };
};
