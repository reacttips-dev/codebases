import getStore from '../store/store';
import type { LikeNotificationData } from '../store/schema/LikeNotificationData';
import { mutatorAction } from 'satcheljs';

export default mutatorAction('REMOVE_LIKE_NOTIFICATION', (notification: LikeNotificationData) => {
    let queue = getStore().likeNotifications;
    let notificationIndex = -1;

    for (let i = 0; i < queue.length; i++) {
        if (queue[i].targetLogicalId === notification.targetLogicalId) {
            notificationIndex = i;
            break;
        }
    }

    if (notificationIndex >= 0) {
        queue.splice(notificationIndex, 1);
    }
});
