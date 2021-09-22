import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import { registerNewReactionNotificationFilter } from 'owa-header-app-notifications';
import { isFolderPaused } from 'owa-mail-list-store';
import { isFeatureEnabled } from 'owa-feature-flags';

export default function initializeNewReactionFilter() {
    registerNewReactionNotificationFilter(shouldSuppressNewReactionNotification);
}

function shouldSuppressNewReactionNotification() {
    return (
        isFolderPaused(folderNameToId('inbox')) ||
        !isFeatureEnabled('auth-reactionNotifications') ||
        !isFeatureEnabled('rp-reactions')
    );
}
