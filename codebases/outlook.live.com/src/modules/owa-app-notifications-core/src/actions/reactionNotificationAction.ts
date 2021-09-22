import type SocialActivityNotificationPayload from 'owa-service/lib/contract/SocialActivityNotificationPayload';
import { action } from 'satcheljs';

export default action(
    'REACTION_NOTIFICATION',
    (notification: SocialActivityNotificationPayload) => ({
        notification,
    })
);
