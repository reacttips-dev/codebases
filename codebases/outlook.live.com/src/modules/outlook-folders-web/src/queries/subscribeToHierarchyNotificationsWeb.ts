import type * as Schema from 'owa-graph-schema';
import {
    lazySubscribe,
    NotificationSubscription,
    NotificationCallback,
    lazyUnsubscribe,
} from 'owa-notification';
import { createSubscriptionResolver, SubscriptionFactory } from 'create-subscription-resolver';

export const subscribeToHierarchyNotificationsWeb = createSubscriptionResolver(
    createSubscriptionFactory
);

/**
 * function that returns a SubscriptionFactory with subscribe and unSubscribe functions
 */
function createSubscriptionFactory(): Promise<
    SubscriptionFactory<
        Schema.HierarchyNotificationPayload,
        (payload: Schema.HierarchyNotificationPayload) => void
    >
> {
    const subscription: NotificationSubscription = {
        subscriptionId: 'HierarchyNotification',
        requiresExplicitSubscribe: true,
        subscriptionParameters: {
            NotificationType: 'HierarchyNotification',
        },
    };
    return Promise.resolve({
        subscribe: callback => subscribeToServiceNotifications(subscription, callback),
        unSubscribe: callback => unSubscribeToServiceNotifications(subscription, callback),
    });
}

/**
 * subscribes to owa server notifications and registers callback function to act on the incoming notifications
 * @param callback callback function to handle the incoming notifications
 */
async function subscribeToServiceNotifications(
    subscription: NotificationSubscription,
    callback: (payload: Schema.HierarchyNotificationPayload) => void
) {
    await lazySubscribe.importAndExecute(subscription, callback as NotificationCallback);

    // return callback so it will be available in unSubscribe
    return callback;
}

/**
 * unsubscribes to the server notifications
 * @param callback callback function that was registered at the time of subscribe
 */
async function unSubscribeToServiceNotifications(
    subscription: NotificationSubscription,
    callback: (payload: Schema.HierarchyNotificationPayload) => void
) {
    await lazyUnsubscribe.importAndExecute(subscription, callback as NotificationCallback);
}
