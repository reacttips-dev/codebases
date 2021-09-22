import store from '../store/Store';
import { orchestrator } from 'satcheljs';
import { clearNotificationBar } from '../actions/clearNotificationBar';
import dismissNotification from './dismissNotification';

orchestrator(clearNotificationBar, actionMessage => {
    for (const notificationId of store.notificationStack) {
        const notificationData = store.notificationsMap.get(notificationId);
        if (notificationData.hostId === actionMessage.hostId && notificationData.allowClear) {
            dismissNotification(notificationId);
        }
    }
});
