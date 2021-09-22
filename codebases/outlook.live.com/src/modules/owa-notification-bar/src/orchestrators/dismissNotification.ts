import removeNotification from '../mutators/removeNotification';
import store from '../store/Store';
import {
    getNotificationBarCallback,
    removeNotificationBarCallback,
} from '../callbacksMap/notificationBarCallbacks';
import {
    notificationAutoDismissTimerCompleted,
    resetNotificationViewState,
} from '../actions/internalActions';
import { NotificationBarCallbackReason } from '../callbacksMap/NotificationBarCallbackReason';

const MILLISECONDS_IN_SECOND = 1000;

let autoDismissNotificationTimer: NodeJS.Timer = null;

/**
 * dismiss the notification
 * @param id of the notification to be dismissed
 */
export default function dismissNotification(id: string) {
    clearTimeout(autoDismissNotificationTimer);
    removeNotificationBarCallback(id);
    removeNotification(id);
    resetNotificationViewState();
}

/**
 * dismiss the notification
 * @param id of the notification to be dismissed when time it up
 * @param dismissInSeconds number of seconds to show the notification before it's auto dismissed
 * */
export function startAutoDismissTimer(id: string, dismissInSeconds: number) {
    autoDismissNotificationTimer = setTimeout(() => {
        notificationAutoDismissTimerCompleted();

        // If user is hovering on notifcation we don't want to auto dismiss
        if (
            !store.notificationBarViewState.isHovered &&
            !store.notificationBarViewState.isFocused
        ) {
            const notificationCallback = getNotificationBarCallback(id);

            // Note: dismissNotification removes the callback
            dismissNotification(id);

            if (notificationCallback) {
                notificationCallback(NotificationBarCallbackReason.AutoDismissed);
            }
        }
    }, dismissInSeconds * MILLISECONDS_IN_SECOND);
}
