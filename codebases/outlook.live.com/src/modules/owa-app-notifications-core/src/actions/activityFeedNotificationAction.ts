import ActivityFeedNotificationPayload from 'owa-service/lib/contract/ActivityFeedNotificationPayload';
import { action } from 'satcheljs';

export default action(
    'ACTIVITYFEED_NOTIFICATION',
    (notification: ActivityFeedNotificationPayload) => ({
        notification,
    })
);
