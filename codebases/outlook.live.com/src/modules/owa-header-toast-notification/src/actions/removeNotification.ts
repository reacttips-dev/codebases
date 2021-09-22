import type NotificationViewState from '../store/schema/NotificationViewState';
import { mutatorAction } from 'satcheljs';
import store from '../store/store';

export default mutatorAction(
    'removeNotification',
    function removeNotification(notification: NotificationViewState) {
        let index = store.notificationViewStates.indexOf(notification);

        if (index >= 0) {
            store.notificationViewStates.splice(index, 1);
        }
    }
);
