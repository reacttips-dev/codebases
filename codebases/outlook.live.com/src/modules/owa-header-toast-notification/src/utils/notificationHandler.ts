import NotificationViewState, {
    NotificationActionType,
} from '../store/schema/NotificationViewState';
import removeNotification from '../actions/removeNotification';

let notificationHandlers: {
    [actionType: string]: (notification: NotificationViewState) => void;
} = {};

export function ensureNotificationHandlerRegistered(
    actionType: NotificationActionType,
    handler: (notification: NotificationViewState) => void
) {
    let actionTypeString = NotificationActionType[actionType];
    if (!notificationHandlers[actionTypeString]) {
        notificationHandlers[actionTypeString] = handler;
    }
}

export function handleNotification(notification: NotificationViewState) {
    let handler = notificationHandlers[NotificationActionType[notification.actionType]];
    if (handler) {
        handler(notification);
    }
    removeNotification(notification);
}
