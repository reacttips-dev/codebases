import { mutatorAction } from 'satcheljs';
import type NewMailNotificationPayload from 'owa-service/lib/contract/NewMailNotificationPayload';
import getStore from '../store/store';

export default mutatorAction(
    'ADD_NEW_IN_APP_MAIL_NOTIFICATION',
    (notification: NewMailNotificationPayload) => {
        getStore().newMailNotifications.push(notification);
    }
);
