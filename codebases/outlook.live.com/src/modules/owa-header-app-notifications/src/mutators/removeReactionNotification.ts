import getStore from '../store/store';
import type { ReactionNotificationData } from '../store/schema/ReactionNotificationData';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'REMOVE_REACTION_NOTIFICATION',
    (notification: ReactionNotificationData) => {
        let queue = getStore().reactionNotifications;
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
    }
);
