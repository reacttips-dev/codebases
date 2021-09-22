import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import { registerNewLikeNotificationFilter } from 'owa-header-app-notifications';
import { isFolderPaused } from 'owa-mail-list-store';
import type { SocialActivityNotificationPayload } from 'owa-app-notifications-core';
import { isFeatureEnabled } from 'owa-feature-flags';

export default function initializeNewLikeFilter() {
    registerNewLikeNotificationFilter(shouldSuppressNewLikeNotification);
}

function shouldSuppressNewLikeNotification(notification: SocialActivityNotificationPayload) {
    return isFolderPaused(folderNameToId('inbox')) || isFeatureEnabled('rp-reactions');
}
