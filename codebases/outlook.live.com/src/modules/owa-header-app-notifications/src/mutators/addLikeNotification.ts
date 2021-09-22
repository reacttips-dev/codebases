import getStore from '../store/store';
import type { LikeNotificationData } from '../store/schema/LikeNotificationData';
import { mutatorAction } from 'satcheljs';

export const MAX_LIKE_NOTIFICATION_TO_SHOW = 2;

export default mutatorAction('ADD_LIKE_NOTIFICATION', (notification: LikeNotificationData) => {
    getStore().likeNotifications.unshift(notification);
    getStore().likeNotifications = getStore().likeNotifications.slice(
        0,
        MAX_LIKE_NOTIFICATION_TO_SHOW
    );
});
