import type NotificationCallback from './schema/NotificationCallback';
import type NotificationSubscription from './schema/NotificationSubscription';
import { unregisterSubscription } from './subscriptionSubmitter';
import * as tracker from './subscriptionTracker';

export default function unsubscribe(
    subscription: NotificationSubscription,
    callback: NotificationCallback
) {
    tracker.remove(subscription, callback);
    unregisterSubscription(subscription);
}
