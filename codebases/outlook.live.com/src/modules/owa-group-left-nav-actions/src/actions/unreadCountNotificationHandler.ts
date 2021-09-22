import * as Schema from 'owa-graph-schema';
import updateGroupUnreadCount from 'owa-groups-shared-store/lib/utils/updateGroupUnreadCount';
import { lazyAddUnreadCountNotificationDiagnostics } from 'owa-group-readunread-diagnostics';
import { GroupSubscriptionData } from '../notifications/subscribeToUnreadCountNotificationsUsingGql';

export function handleUnreadCountNotification(
    notification: Schema.UnreadItemNotificationPayload,
    props: GroupSubscriptionData
): void {
    if (notification.EventType === 'QueryResultChanged') {
        const groupId = getGroupIdFromNotification(notification.id);
        updateGroupUnreadCount(groupId.toLowerCase(), notification.UnreadCount);

        if (props) {
            if (!props.firstNotificationReceived) {
                props.unreadCountDataPoint.end();
                props.unreadCountDataPoint = null;
                props.firstNotificationReceived = true;
            }
        }
        // Tracking Unread Count notifications for the Diagnostics Panel
        lazyAddUnreadCountNotificationDiagnostics
            .import()
            .then(addUnreadCountNotificationDiagnosticsMutator =>
                addUnreadCountNotificationDiagnosticsMutator(groupId, notification)
            );
    }
    return;
}

function getGroupIdFromNotification(notificationId: string): string {
    return notificationId.replace('UnreadCountNotification_', '');
}
