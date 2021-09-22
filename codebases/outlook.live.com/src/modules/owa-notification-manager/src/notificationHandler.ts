import * as tracker from './subscriptionTracker';
import callAndCatch from './utils/callAndCatch';
import type NotificationPayloadBase from 'owa-service/lib/contract/NotificationPayloadBase';
import NotificationEventType from './schema/NotificationEventType';
import getNotificationEmitter from './getNotificationEmitter';

const RELOAD_NOTIFICATION_TYPE = 'Reload';

export function handleNotification(notification: NotificationPayloadBase): void {
    getNotificationEmitter().emit(NotificationEventType.NotificationData, notification);

    let handlers = tracker.getHandlers(notification.id);
    for (let handler of handlers) {
        callAndCatch(() => {
            handler(notification);
        });
    }
}

function generateReloadNotification(subscriptionId: string): NotificationPayloadBase {
    return {
        id: subscriptionId,
        EventType: RELOAD_NOTIFICATION_TYPE,
    };
}

export function reloadAll(): void {
    let subscriptions = tracker.getSubscriptions();
    for (let subscription of subscriptions) {
        let reloadNotification = generateReloadNotification(subscription.subscriptionId);
        handleNotification(reloadNotification);
    }
}

export function subscriptionFailureReload(subscriptionId: string): void {
    let reloadNotification = generateReloadNotification(subscriptionId);

    let refs = tracker.getRefs(subscriptionId);
    for (let ref of refs) {
        // Don't deliver reloads to subscribers that explicitly request not to
        if (ref.subscription.noSubscriptionFailureReload !== true) {
            callAndCatch(() => {
                ref.callback(reloadNotification);
            });
        }
    }
}
