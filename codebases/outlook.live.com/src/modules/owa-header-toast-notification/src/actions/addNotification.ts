import type NotificationViewState from '../store/schema/NotificationViewState';
import { mutatorAction } from 'satcheljs';
import store from '../store/store';

let nextId = 0;

export default mutatorAction(
    'addNotification',
    function addNotification(notificationViewState: NotificationViewState) {
        let notification = {
            id: nextId++,
            ...notificationViewState,
        };
        store.notificationViewStates.push(notification);
    }
);
