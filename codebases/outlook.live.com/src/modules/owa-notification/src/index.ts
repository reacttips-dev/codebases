import { LazyAction, LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "Notification"*/ 'owa-notification-manager')
);

// Lazy functions for notification consumers
export const lazySubscribe = new LazyAction(lazyModule, m => m.subscribe);
export const lazyUnsubscribe = new LazyAction(lazyModule, m => m.unsubscribe);
export const lazyGetChannelId = new LazyImport(lazyModule, m => m.getChannelId);
export const lazyGetChannelReady = new LazyAction(lazyModule, m => m.getChannelReady);
export const lazyRetryDisconnectionWithMinimumReconnectInterval = new LazyAction(
    lazyModule,
    m => m.retryDisconnectionWithMinimumReconnectInterval
);
export const lazySetup = new LazyAction(lazyModule, m => m.setup);
export const lazyHandleNotification = new LazyAction(lazyModule, m => m.handleNotification);
export const lazyStopConnection = new LazyAction(lazyModule, m => m.stopConnection);

// Lazy functions for channel initialization
export const lazyInitializeNotificationManager = new LazyAction(
    lazyModule,
    m => m.initializeNotificationManager
);

export const lazyGetNotificationEmitter = new LazyImport(lazyModule, m => m.getNotificationEmitter);

// Interfaces & Enums

export type {
    NotificationSubscription,
    NotificationCallback,
    SubscriptionState,
} from 'owa-notification-manager';

export { default as NotificationEventType } from './schema/NotificationEventType';

/**
 * Exporting const enum SubscriptionStatus using this syntax to workaround the TS bug
 * https://github.com/Microsoft/TypeScript/issues/23514
 * Also exporting with exact file path to avoid bundling of complete owa-notification-manager into owa-notification.
 */
export { SubscriptionStatus } from 'owa-notification-manager/lib/schema/SubscriptionTrackerState';
