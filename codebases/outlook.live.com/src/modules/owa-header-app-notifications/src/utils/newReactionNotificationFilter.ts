import type { SocialActivityNotificationPayload } from 'owa-app-notifications-core';

/**
 * Function to filter if a new reaction notification should be displayed to the user.
 * Return true to suppress the new reaction toast, or false to allow it to show
 */
export type NewReactionNotificationFilter = (
    notification: SocialActivityNotificationPayload
) => boolean;

const filters: NewReactionNotificationFilter[] = [];

export function registerNewReactionNotificationFilter(filter: NewReactionNotificationFilter) {
    filters.push(filter);
}

export function shouldNewReactionNotificationBeFiltered(
    notification: SocialActivityNotificationPayload
) {
    return filters.reduce((acc, filter) => acc || filter(notification), false);
}
