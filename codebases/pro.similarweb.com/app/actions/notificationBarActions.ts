import {
    NOTIFICATION_BAR_UPDATE_HEIGHT,
    PAGE_NOTIFICATION_BAR_ITEM_GENERATED,
    PAGE_NOTIFICATION_BAR_ITEM_REMOVED,
} from "../action_types/common_action_types";

export const updateNotificationBarHeight = (height) => {
    return {
        type: NOTIFICATION_BAR_UPDATE_HEIGHT,
        height,
    };
};

export const createPageNotificationBar = (notification) => {
    return {
        type: PAGE_NOTIFICATION_BAR_ITEM_GENERATED,
        notification,
    };
};

export const removePageNotificationBar = (notificationId) => {
    return {
        type: PAGE_NOTIFICATION_BAR_ITEM_REMOVED,
        notificationId,
    };
};
