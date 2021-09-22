import { action } from 'satcheljs';
import type { LikeNotificationData } from '../store/schema/LikeNotificationData';

export default action('ON_LIKE_NOTIFICATION_CLICKED', (notification: LikeNotificationData) => ({
    notification,
}));
