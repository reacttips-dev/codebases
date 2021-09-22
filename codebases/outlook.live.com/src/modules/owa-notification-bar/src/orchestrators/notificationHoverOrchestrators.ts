import dismissNotification from './dismissNotification';
import store from '../store/Store';
import { getNotificationBarCallback } from '../callbacksMap/notificationBarCallbacks';
import { NotificationBarCallbackReason } from '../callbacksMap/NotificationBarCallbackReason';
import { notificationMouseLeave, setNotificationIsHovered } from '../actions/internalActions';
import { orchestrator } from 'satcheljs';

orchestrator(notificationMouseLeave, actionMessage => {
    if (store.notificationBarViewState.autoDismissTimerCompleted) {
        const notificationCallBack = getNotificationBarCallback(actionMessage.notificationId);

        // Note: dismissNotification removes the callback
        dismissNotification(actionMessage.notificationId);

        if (notificationCallBack) {
            notificationCallBack(NotificationBarCallbackReason.MouseLeaveAfterTimerCompleted);
        }
    }

    setNotificationIsHovered(false);
});
