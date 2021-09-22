import type NotificationCallback from './schema/NotificationCallback';
import type NotificationSubscription from './schema/NotificationSubscription';
import { registerSubscription } from './subscriptionSubmitter';
import * as tracker from './subscriptionTracker';

export default function subscribe(
    subscription: NotificationSubscription,
    callback: NotificationCallback
): void {
    tracker.add(subscription, callback);
    registerSubscription(subscription);
}
