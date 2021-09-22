import { action } from 'satcheljs';
import type { ReactionNotificationData } from '../store/schema/ReactionNotificationData';

export default action(
    'ON_REACTION_NOTIFICATION_CLICKED',
    (notification: ReactionNotificationData) => ({
        notification,
    })
);
