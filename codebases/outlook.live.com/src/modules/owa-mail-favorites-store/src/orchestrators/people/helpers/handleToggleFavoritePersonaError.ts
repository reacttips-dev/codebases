import { favoritesErrorCloseButtonText } from './handleToggleFavoritePersonaError.locstring.json';
import { favoritesRemoveErrorDescriptionText } from 'owa-locstrings/lib/strings/favoritesremoveerrordescriptiontext.locstring.json';
import { favoritesRemoveErrorTitleText } from 'owa-locstrings/lib/strings/favoritesremoveerrortitletext.locstring.json';
import { favoritesErrorDescriptionText } from 'owa-locstrings/lib/strings/favoriteserrordescriptiontext.locstring.json';
import { favoritesErrorTitleText } from 'owa-locstrings/lib/strings/favoriteserrortitletext.locstring.json';
import loc from 'owa-localize';

import {
    ensureNotificationHandlerRegistered,
    NotificationActionType,
    addNotification,
    NotificationViewState,
} from 'owa-header-toast-notification';

export default function handleToggleFavoritePersonaError(isRemoveFailure: boolean) {
    const notificationType = isRemoveFailure
        ? NotificationActionType.RemoveFavoritePersonaFailedNotification
        : NotificationActionType.AddFavoritePersonaFailedNotification;

    ensureNotificationHandlerRegistered(notificationType, null);

    const notification = {
        actionType: notificationType,
        title: isRemoveFailure ? loc(favoritesRemoveErrorTitleText) : loc(favoritesErrorTitleText),
        description: isRemoveFailure
            ? loc(favoritesRemoveErrorDescriptionText)
            : loc(favoritesErrorDescriptionText),
        actionLink: loc(favoritesErrorCloseButtonText),
    };

    addNotification(notification as NotificationViewState);
}
