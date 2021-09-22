import subscribe from './subscribe';
import unsubscribe from './unsubscribe';
import { getChannelId } from './notificationGlobals';

// Synchronously expose notification functions
export {
    // Notification consumers
    subscribe,
    unsubscribe,
    getChannelId,
};

/**
 * Exporting const enum SubscriptionStatus using this syntax to workaround the TS bug
 * https://github.com/Microsoft/TypeScript/issues/23514
 */
export { SubscriptionStatus } from './schema/SubscriptionTrackerState';

interface OwaNotification {
    subscribe: typeof subscribe;
    unsubscribe: typeof unsubscribe;
    getChannelId: typeof getChannelId;
}

/* tslint:disable:no-namespace */
declare global {
    interface Window {
        owaNotification: OwaNotification;
    }
}
/* tslint:enable:no-namespace */

export function setup() {
    window.owaNotification = {
        subscribe: subscribe,
        unsubscribe: unsubscribe,
        getChannelId: getChannelId,
    };

    // If it isn't yet populated, it should register a listener to the 'owaNotificationLoaded' event.
    // After that event fires, window.owaNotification will definitely be populated.
    window.dispatchEvent(new Event('owaNotificationLoaded'));
}

export type { SubscriptionState } from './schema/SubscriptionTrackerState';
export type { NotificationManagerConfig } from './schema/NotificationManagerConfig';
export { getChannelReady } from './notificationGlobals';

export type {
    default as NotificationSubscription,
    NotificationSubscriptionData,
} from './schema/NotificationSubscription';
export { default as NotificationEventType } from './schema/NotificationEventType';
export type { default as NotificationCallback } from './schema/NotificationCallback';
export {
    initializeNotificationManager,
    retryDisconnectionWithMinimumReconnectInterval,
} from './initializeNotificationManager';
export { default as getNotificationEmitter } from './getNotificationEmitter';
export { handleNotification } from './notificationHandler';
export { stopConnection } from './notificationManager';
