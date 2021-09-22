import UserSocialActivityActionType from 'owa-service/lib/contract/UserSocialActivityActionType';
import { orchestrator } from 'satcheljs';
import {
    activityFeedNotificationAction,
    ActivityFeedNotificationPayload,
} from 'owa-app-notifications-core';
import { lazyLoadActivityFeed } from 'owa-activity-feed';
import { ActivityFeedTypeIds } from 'owa-activity-feed/lib/service/ActivityFeedSettingType';
import { getActivityFeedSettingsStore } from 'owa-activity-feed/lib/store/notificationSettingStore';

let readyToFetchActivityFeed = true;

export default orchestrator(activityFeedNotificationAction, message => {
    const notification = message.notification as ActivityFeedNotificationPayload;
    if (notification.EventType === 'Reload') {
        return;
    }

    // We only care about activityfeed notification
    // Also we do not care about reaction types since there is a separate channel for reaction.
    let type = ActivityFeedTypeIds[notification.ActivityFeedNotificationType];
    if (
        notification.Action !== UserSocialActivityActionType.ActivityFeedNotification ||
        type === ActivityFeedTypeIds.Reactions ||
        !getActivityFeedSettingsStore().get(type)
    ) {
        return;
    }

    if (!readyToFetchActivityFeed) {
        return;
    }

    readyToFetchActivityFeed = false;

    /// Auto refresh Activity Feed.
    lazyLoadActivityFeed.importAndExecute();
    window.setTimeout(() => {
        readyToFetchActivityFeed = true;
    }, 5000);
});
