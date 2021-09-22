import type SocialActivityNotificationPayload from 'owa-service/lib/contract/SocialActivityNotificationPayload';
import { action } from 'satcheljs';

export default action(
    'SOCIAL_ACTIVITY_NOTIFICATION',
    (notification: SocialActivityNotificationPayload) => ({
        notification,
    })
);
