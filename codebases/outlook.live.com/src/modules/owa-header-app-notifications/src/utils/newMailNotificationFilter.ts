import type NewMailNotificationPayload from 'owa-service/lib/contract/NewMailNotificationPayload';

/**
 * Function to filter if a new mail notification should be displayed to the user.
 * Return true to suppress the new mail toast, or false to allow it to show
 */
export type NewMailNotificationFilter = (notification: NewMailNotificationPayload) => boolean;

const filters: NewMailNotificationFilter[] = [];

export function registerNewMailNotificationFilter(filter: NewMailNotificationFilter) {
    filters.push(filter);
}

export function shouldNewMailNotificationBeFiltered(notification: NewMailNotificationPayload) {
    return filters.reduce((acc, filter) => acc || filter(notification), false);
}
