import type { NotificationDatapoint } from '../schema/NotificationDatapoint';
import getFolderName from '../utils/getFolderName';
import getSubject from '../utils/getSubject';
import getTimeString from '../utils/getTimeString';
import insertWithBound from '../utils/insertWithBound';
import type { DiagnosticsLogger } from 'owa-diagnostics';
import type HierarchyNotificationPayload from 'owa-service/lib/contract/HierarchyNotificationPayload';
import type NotificationPayloadBase from 'owa-service/lib/contract/NotificationPayloadBase';
import type RowNotificationPayload from 'owa-service/lib/contract/RowNotificationPayload';
import { action } from 'satcheljs/lib/legacy';

const MAX_NOTIFICATION_DATAPOINTS = 1000;

export default action('addNotificationDatapoint')(function addNotificationDatapoint(
    notification: NotificationPayloadBase,
    state: DiagnosticsLogger<NotificationDatapoint>
) {
    const rowNotification: RowNotificationPayload = notification as RowNotificationPayload;
    const hierarchyNotification: HierarchyNotificationPayload = notification as HierarchyNotificationPayload;

    insertWithBound(
        state.datapoints,
        {
            id: notification.id,
            type: notification.EventType,
            folder: getFolderName(rowNotification.FolderId || hierarchyNotification.folderId),
            subject: getSubject(rowNotification),
            timestamp: getTimeString(),
        },
        MAX_NOTIFICATION_DATAPOINTS
    );
});
