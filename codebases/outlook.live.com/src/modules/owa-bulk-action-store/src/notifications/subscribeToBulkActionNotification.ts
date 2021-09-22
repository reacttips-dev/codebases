import type BulkActionNotificationPayload from 'owa-service/lib/contract/BulkActionNotificationPayload';
import BulkActionStateEnum from '../store/schema/BulkActionStateEnum';
import findBulkActionItemAction from '../actions/findBulkActionItemAction';
import onBulkActionNotification from '../actions/onBulkActionNotification';
import setBulkActionStateAttribute from '../mutators/setBulkActionStateAttribute';
import { lazySubscribe, NotificationSubscription } from 'owa-notification';
import * as trace from 'owa-trace';

function onBulkActionNotificationCallback(notification: BulkActionNotificationPayload): void {
    switch (notification.EventType) {
        case 'RowAdded':
        case 'RowModified':
            onBulkActionNotification(notification);
            break;
        case 'RowDeleted':
            setBulkActionStateAttribute(
                notification.BulkActionTargetFolderId,
                BulkActionStateEnum.Complete
            );
            break;
        case 'Reload':
            findBulkActionItemAction();
            break;
        default:
            trace.errorThatWillCauseAlert(
                'BulkActionNotification should only be fired on (RowAdded, RowModified, RowDeleted, Reload)'
            );
    }
}

export default function subscribeToBulkActionNotification() {
    const subscription: NotificationSubscription = {
        subscriptionId: 'BulkActionNotification',
        requiresExplicitSubscribe: true,
        subscriptionParameters: {
            NotificationType: 'BulkActionNotification',
        },
    };

    // subscribe and store the subscription object
    lazySubscribe.importAndExecute(subscription, onBulkActionNotificationCallback);
}
