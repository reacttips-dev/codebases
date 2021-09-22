import getStore from '../store/store';
import type { ReactionNotificationData } from '../store/schema/ReactionNotificationData';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'ADD_REACTION_NOTIFICATION',
    (notification: ReactionNotificationData) => {
        getStore().reactionNotifications.unshift(notification);
    }
);
