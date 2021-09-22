import updateIsGlimpseOpen from '../actions/updateIsGlimpseOpen';
import type { SkypeNotification } from '../store/schema/swcTypes';
import store from '../store/store';
import { logUsage } from 'owa-analytics';
import { SkypeNotificationType, lazyGetUserSkypeOptions } from 'owa-skype-option';
import {
    addNotification,
    ensureNotificationHandlerRegistered,
    NotificationActionType,
    SkypeNotificationViewState,
    CALL_NOTIFICATION_TYPE,
    IM_NOTIFICATION_TYPE,
    SUMMARY_NOTIFICATION_TYPE,
} from 'owa-header-toast-notification';
import type { SkypeNotificationOptions } from 'owa-outlook-service-options';

const ACCEPT_ACTION_INDEX = 0;
const IGNORE_ACTION_INDEX = 1;

export default function onNotificationReceived(value: SkypeNotification): void {
    let { type, title, description, actions, avatarUrl } = value;
    let skypeOptions = lazyGetUserSkypeOptions.tryImportForRender();
    if (skypeOptions && shouldShowNotification(skypeOptions(), type)) {
        ensureNotificationHandlerRegistered(
            NotificationActionType.SkypeNotification,
            handleNotification
        );

        let notification = {
            actionType: NotificationActionType.SkypeNotification,
            title: title,
            description: description,
            actionLink:
                actions.length > ACCEPT_ACTION_INDEX ? actions[ACCEPT_ACTION_INDEX].title : null,
            cancelLink:
                actions.length > IGNORE_ACTION_INDEX ? actions[IGNORE_ACTION_INDEX].title : null,
            image: avatarUrl,
            actionContext: value,
            ignore: false,
            playSound: shouldPlayNotificationSound(skypeOptions(), type),
            type: value.type,
        };

        addNotification(notification as SkypeNotificationViewState);
    }
}

function handleNotification(notification: SkypeNotificationViewState) {
    let { actions, type } = notification.actionContext as SkypeNotification;
    let { ignore, timedOut } = notification;

    if (ignore && actions.length > IGNORE_ACTION_INDEX) {
        actions[IGNORE_ACTION_INDEX].action();
    } else if (!(ignore || timedOut) && actions.length > ACCEPT_ACTION_INDEX) {
        actions[ACCEPT_ACTION_INDEX].action();

        // On accept action of summary notification:
        // Open the skype glimpse, as swc doesn't have the ability to access the element
        if (type === SUMMARY_NOTIFICATION_TYPE) {
            updateIsGlimpseOpen(true);
        }
    }

    logUsage('Skype_Notification', [type, timedOut ? null : ignore, timedOut]);
}

function shouldShowNotification(
    skypeOptions: SkypeNotificationOptions,
    notificationType: string
): boolean {
    switch (notificationType) {
        case IM_NOTIFICATION_TYPE:
        case SUMMARY_NOTIFICATION_TYPE:
            return store.isGlimpseOpen
                ? false
                : skypeOptions.skypeMessageNotification !== SkypeNotificationType.None;
        case CALL_NOTIFICATION_TYPE:
            return skypeOptions.skypeCallingNotification !== SkypeNotificationType.None;
        default:
            return null;
    }
}

/* When this is called, the following should already be established:
 * - The OWS' option should allow for toasts for the given notification type */
function shouldPlayNotificationSound(
    skypeOptions: SkypeNotificationOptions,
    notificationType: string
): boolean {
    switch (notificationType) {
        case IM_NOTIFICATION_TYPE:
        case SUMMARY_NOTIFICATION_TYPE:
            return skypeOptions.skypeMessageNotification !== SkypeNotificationType.ToastOnly;
        case CALL_NOTIFICATION_TYPE:
            return skypeOptions.skypeCallingNotification !== SkypeNotificationType.ToastOnly;
        default:
            return false;
    }
}
