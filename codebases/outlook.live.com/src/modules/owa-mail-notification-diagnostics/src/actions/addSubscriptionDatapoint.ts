import type { NotificationSubscription } from 'owa-notification';
import type { SubscriptionDatapoint } from '../schema/SubscriptionDatapoint';
import getFolderName from '../utils/getFolderName';
import type { DiagnosticsLogger } from 'owa-diagnostics';
import { action } from 'satcheljs/lib/legacy';

export default action('addSubscriptionDatapoint')(function addSubscriptionDatapoint(
    subscription: NotificationSubscription,
    state: DiagnosticsLogger<SubscriptionDatapoint>
) {
    state.datapoints.push({
        id: subscription.subscriptionId,
        type: subscription.subscriptionParameters?.NotificationType
            ? subscription.subscriptionParameters.NotificationType
            : '',
        folder: subscription.subscriptionParameters
            ? getFolderName(subscription.subscriptionParameters.FolderId)
            : '',
        status: 'Uninitialized',
        handlers: 1,
        retries: 0,
        error: '',
    });
});
