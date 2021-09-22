import { orchestrator } from 'satcheljs';
import { newMailNotificationAction } from 'owa-app-notifications-core';
import type NewMailNotificationPayload from 'owa-service/lib/contract/NewMailNotificationPayload';
import addNewMailNotification from '../mutators/addNewMailNotification';
import removeNewMailNotification from '../mutators/removeNewMailNotification';
import getStore from '../store/store';
import { getUserConfiguration } from 'owa-session-store';
import { shouldNewMailNotificationBeFiltered } from '../utils/newMailNotificationFilter';
import isNewMailToastEnabled from '../selectors/isNewMailToastEnabled';
import isNewMailSoundEnabled from '../selectors/isNewMailSoundEnabled';
import { playSound } from 'owa-audio';
import { getPackageBaseUrl } from 'owa-config';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import {
    getNotificationSettingsStore,
    DesktopNotificationSetting,
} from 'monarch-desktop-notifications-settings';
export const MAX_CONCURRENT_EMAIL_NOTIFICATIONS = 2;
export const EMAIL_NOTIFICATION_TIMEOUT = 5000;
export const NEW_MAIL_SOUND_URI = 'resources/sounds/notifications/newmail.mp3';

export default orchestrator(newMailNotificationAction, message => {
    const notification = message.notification;

    if (notification.EventType === 'Reload') {
        return;
    }
    const desktopNotificationSetting = getNotificationSettingsStore().settings;
    if (
        isHostAppFeatureEnabled('nativeResolvers') &&
        desktopNotificationSetting.get(DesktopNotificationSetting.DesktopSettingEnabled) &&
        desktopNotificationSetting.get(DesktopNotificationSetting.NewMailNotificationSettingEnabled)
    ) {
        addNewMailNotification(notification);
        return;
    }

    if (
        isMailFocused(notification) &&
        // In the rare case of an email-storm, we only show the first 2 messages (that haven't been dismissed or timed out)
        // Any beyond that are "dropped" for the purposes of notifications
        getStore().newMailNotifications.length < MAX_CONCURRENT_EMAIL_NOTIFICATIONS &&
        !shouldNewMailNotificationBeFiltered(notification)
    ) {
        if (isNewMailToastEnabled()) {
            addNewMailNotification(notification);
            setTimeout(
                () => removeNewMailNotification(notification.ItemId),
                EMAIL_NOTIFICATION_TIMEOUT
            );
        }

        if (isNewMailSoundEnabled()) {
            playSound(`${getPackageBaseUrl()}${NEW_MAIL_SOUND_URI}`);
        }
    }
});

function isMailFocused(notification: NewMailNotificationPayload) {
    return (
        notification.InferenceClassification === 'Focused' ||
        !getUserConfiguration().UserOptions.IsFocusedInboxEnabled
    );
}
