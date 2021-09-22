import type NotificationSubscription from './NotificationSubscription';
import type NotificationPayloadBase from 'owa-service/lib/contract/NotificationPayloadBase';

export const enum SubscriptionStatus {
    // Subscription was just added to the tracker
    Uninitialized,

    // Subscribe service request failed and has not yet succeeded since then
    Disconnected,

    // SubscribeToNotification OWS request is in-flight
    Pending,

    // Subscribed on the server, as far as the client knows
    Connected,
}

export interface NotificationCallback {
    (notification: NotificationPayloadBase): void;
    noSubscriptionFailureReload?: boolean;
}

export interface SubscriptionReference {
    // The actual subscription object
    subscription: NotificationSubscription;

    // We store the callback to find the reference to the subscription later
    callback: NotificationCallback;
}

export interface SubscriptionState {
    // Callback/Subscription pairs for this subscription ID
    refs: SubscriptionReference[];

    // Whether subscription is active on the server
    status: SubscriptionStatus;

    // Number of retries since last successful subscribe
    retries: number;

    // setTimeout handle for the current retry, used to cancel
    // setTimeout will always return a non-zero value
    pendingRetryHandle: number;
}

export interface SubscriptionTrackerState {
    [subscriptionId: string]: SubscriptionState;
}

export function initialSubscriptionTrackerState(): SubscriptionTrackerState {
    return {};
}
