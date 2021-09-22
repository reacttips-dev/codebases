import type NotificationCallback from './schema/NotificationCallback';
import type NotificationSubscription from './schema/NotificationSubscription';
import {
    initialSubscriptionTrackerState,
    SubscriptionReference,
    SubscriptionState,
    SubscriptionStatus,
    SubscriptionTrackerState,
} from './schema/SubscriptionTrackerState';
import { emitWarn } from './utils/emitTrace';

let state: SubscriptionTrackerState;
let initialized = false;

export function getSubscriptions(): NotificationSubscription[] {
    if (!initialized) {
        initialize();
    }

    let subscriptionIds: string[] = Object.keys(state);
    return subscriptionIds.map(subscriptionId => {
        return state[subscriptionId].refs[0].subscription;
    });
}

export function getHandlers(subscriptionId: string): NotificationCallback[] {
    return getRefs(subscriptionId).map(ref => {
        return ref.callback;
    });
}

export function getRefs(subscriptionId: string): SubscriptionReference[] {
    if (!initialized) {
        initialize();
    }

    return hasSubscription(subscriptionId) ? state[subscriptionId].refs : [];
}

export function add(subscription: NotificationSubscription, callback: NotificationCallback): void {
    if (!initialized) {
        initialize();
    }

    if (!hasSubscription(subscription.subscriptionId)) {
        // First time we're seeing this subscription ID
        state[subscription.subscriptionId] = {
            refs: [],
            status: SubscriptionStatus.Uninitialized,
            retries: 0,
            pendingRetryHandle: 0,
        };
    }

    // Add this ref to the cache
    state[subscription.subscriptionId].refs.push({
        subscription: subscription,
        callback: callback,
    });
}

export function remove(
    subscription: NotificationSubscription,
    callback: NotificationCallback
): void {
    if (!hasSubscription(subscription.subscriptionId)) {
        // Called remove on an untracked subscription
        emitWarn(
            `Tried to remove ${subscription.subscriptionId} from the subscription tracker when it didn't exist`
        );

        return;
    }

    let refs = state[subscription.subscriptionId].refs;

    for (let i = 0; i < refs.length; i++) {
        if (refs[i].callback === callback) {
            refs.splice(i, 1);
            break;
        }
    }

    if (refs.length === 0) {
        // If there was a pending retry, cancel it
        if (state[subscription.subscriptionId].pendingRetryHandle !== 0) {
            window.clearTimeout(state[subscription.subscriptionId].pendingRetryHandle);
        }

        // That was the last callback for that id, stop tracking the subscription
        delete state[subscription.subscriptionId];
    }
}

export function getSubscriptionState(subscriptionId: string): SubscriptionState {
    return state[subscriptionId];
}

export function hasSubscription(subscriptionId: string): boolean {
    return subscriptionId in state;
}

export function initialize() {
    state = initialSubscriptionTrackerState();
    initialized = true;
}
