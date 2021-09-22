import type { NotificationBarCallbackReason } from './NotificationBarCallbackReason';

let notificationBarCallbacksMap: {
    [id: string]: (reason: NotificationBarCallbackReason) => void;
} = {};

/**
 * gets the notification bar callback function for the given id
 * @param id of the notification to retrive the callback
 * @return callback function for the given notification id
 */
export function getNotificationBarCallback(
    id: string
): (reason: NotificationBarCallbackReason) => void {
    return notificationBarCallbacksMap[id];
}

/**
 * sets the notification bar callback function for the given id
 * @param id of the notification whose callback function is being set
 * @param callback function for the given notification
 */
export function setNotificationBarCallback(
    id: string,
    callback: (reason: NotificationBarCallbackReason) => void
) {
    if (notificationBarCallbacksMap[id] !== undefined) {
        throw new Error('Cannot over write an existing notification callback.');
    }

    notificationBarCallbacksMap[id] = callback;
}

/**
 * remove the notification bar callback function for the given id
 * @param id of the notification whose callback function is to be removed
 */
export function removeNotificationBarCallback(id: string) {
    delete notificationBarCallbacksMap[id];
}
