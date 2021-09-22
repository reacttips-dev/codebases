import type NotificationBarData from '../store/schema/NotificationBarData';
import store from '../store/Store';
import { mutatorAction } from 'satcheljs';
import * as trace from 'owa-trace';

/**
 * adds the notification with the given id to the top of the stack in the store
 * @param id of the notification to be added
 * @param notification to be added
 */
export default mutatorAction(
    'pushNotification',
    function pushNotification(id: string, notification: NotificationBarData) {
        if (store.notificationsMap.has(id)) {
            trace.errorThatWillCauseAlert(
                'cannot add notification with the same id.  Please dismiss the notification before adding it again.'
            );
            return;
        }

        store.notificationsMap.set(id, notification);
        store.notificationStack.push(id);
    }
);
