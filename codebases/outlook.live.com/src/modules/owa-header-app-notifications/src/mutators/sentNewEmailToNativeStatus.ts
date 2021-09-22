import { mutatorAction } from 'satcheljs';
import getStore from '../store/store';
import type NewMailNotificationPayload from 'owa-service/lib/contract/NewMailNotificationPayload';

export default mutatorAction(
    'SET_NEW_MAIL_SENT_TO_HOST',
    (itemId: string, newEmail: NewMailNotificationPayload) => {
        getStore().newMailNotificationsSentToHost.set(itemId, newEmail);
    }
);
