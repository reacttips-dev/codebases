import type * as Schema from 'owa-graph-schema';
import setBulkActionCounts from '../mutators/setBulkActionCounts';

export default function onBulkActionHierarchyNotification(
    payload: Schema.HierarchyNotificationPayload
) {
    setBulkActionCounts(payload);
}
