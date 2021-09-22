import type { SocialActivityNotificationPayload } from 'owa-app-notifications-core';

/**
 * Function to filter if a new like notification should be displayed to the user.
 * Return true to suppress the new like toast, or false to allow it to show
 */
export type NewLikeNotificationFilter = (
    notification: SocialActivityNotificationPayload
) => boolean;

const filters: NewLikeNotificationFilter[] = [];

export function registerNewLikeNotificationFilter(filter: NewLikeNotificationFilter) {
    filters.push(filter);
}

export function shouldNewLikeNotificationBeFiltered(
    notification: SocialActivityNotificationPayload
) {
    return filters.reduce((acc, filter) => acc || filter(notification), false);
}
