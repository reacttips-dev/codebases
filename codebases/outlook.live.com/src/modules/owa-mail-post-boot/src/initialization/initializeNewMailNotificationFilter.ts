import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import { registerNewMailNotificationFilter } from 'owa-header-app-notifications';
import { isFolderPaused } from 'owa-mail-list-store';
import type NewMailNotificationPayload from 'owa-service/lib/contract/NewMailNotificationPayload';
import { isPersonaInFavorites } from 'owa-favorites';

export default function initializeNewMailNotificationFilter() {
    registerNewMailNotificationFilter(shouldSuppressNewMailNotification);
}

function shouldSuppressNewMailNotification(notification: NewMailNotificationPayload) {
    const inboxId = folderNameToId('inbox');
    return (
        isFolderPaused(inboxId) &&
        !isPersonaInFavorites(
            null /* personaId - null because we don't have it here */,
            notification.SenderSmtpEmailAddress
        )
    );
}
