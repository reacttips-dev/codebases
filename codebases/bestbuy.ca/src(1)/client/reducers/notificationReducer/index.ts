import { Action, notificationActionType } from "../../actions";

export interface NotificationState {
    message: string;
    open: boolean;
    action?: Action;
    autoHideDuration?: number;
}

export const initialNotificationState: NotificationState = {
    message: "",
    open: false,
};

export const notification = (state = initialNotificationState, action): NotificationState => {

    switch (action.type) {
        case notificationActionType.notify:
            return {
                action: action.action,
                autoHideDuration: action.autoHideDuration,
                message: action.message,
                open: true,
            };
        case notificationActionType.close:
            return {
                action: null,
                message: state.message,
                open: false,
            };
        default:
            return state;
    }
};

export default notification;
