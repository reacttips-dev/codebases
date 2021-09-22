import { action } from 'satcheljs';
import type NotificationBarHostId from '../store/schema/NotificationBarHostId';

export const clearNotificationBar = action(
    'CLEAR_NOTIFICATION_BAR',
    (hostId: NotificationBarHostId) => ({ hostId })
);
