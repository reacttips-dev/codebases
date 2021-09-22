import { mutatorAction } from 'satcheljs';
import getStore from '../store/store';

export default mutatorAction('REMOVE_NEW_IN_APP_MAIL_NOTIFICATION', (itemId: string) => {
    let queue = getStore().newMailNotifications;
    let notificationIndex = -1;

    for (let i = 0; i < queue.length; i++) {
        if (queue[i].ItemId === itemId) {
            notificationIndex = i;
            break;
        }
    }

    if (notificationIndex >= 0) {
        queue.splice(notificationIndex, 1);
    }
});
