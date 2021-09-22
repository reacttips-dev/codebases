import store from '../store/Store';
import { mutatorAction } from 'satcheljs';
import { trace } from 'owa-trace';

/**
 * remove the notification with given id from the store
 * @param id of the notification to be removed
 */
export default mutatorAction('removeNotification', function removeNotification(id: string) {
    let index = store.notificationStack.indexOf(id);

    if (index < 0) {
        trace.warn('notification id cannot be found in removeNotification');
        return;
    }

    store.notificationStack.splice(index, 1);
    store.notificationsMap.delete(id);
});
