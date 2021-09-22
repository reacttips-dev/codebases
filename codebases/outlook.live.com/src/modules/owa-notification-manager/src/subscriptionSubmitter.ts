import * as batchState from './subscriptionBatchState';
import * as tracker from './subscriptionTracker';
import callAndCatch from './utils/callAndCatch';
import getNotificationEmitter from './getNotificationEmitter';
import NotificationEventType from './schema/NotificationEventType';
import type NotificationSubscription from './schema/NotificationSubscription';
import subscribeToNotificationOperation from 'owa-service/lib/operation/subscribeToNotificationOperation';
import type SubscriptionResponseData from 'owa-service/lib/contract/SubscriptionResponseData';
import unsubscribeToNotificationOperation from 'owa-service/lib/operation/unsubscribeToNotificationOperation';
import { emitWarn } from './utils/emitTrace';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import { subscriptionFailureReload } from './notificationHandler';
import { SubscriptionState, SubscriptionStatus } from './schema/SubscriptionTrackerState';

// How many retries to do quickly before throttling
const QUICK_RETRY_THROTTLE_THRESHOLD = 3;

// How many retries to do in total
const DELAYED_RETRY_THRESHOLD = 8;

// How long to wait before retrying the subscription once we start throttling
const RETRY_THROTTLE_TIMEOUT = 5 * 60000;

// How long to wait between the first subscription call and when to actually submit to the server
const BATCH_TIMEOUT = 500;

export function registerSubscription(subscription: NotificationSubscription) {
    if (!subscription.requiresExplicitSubscribe) {
        return;
    }

    let subscriptionState = tracker.getSubscriptionState(subscription.subscriptionId);
    if (subscriptionState.status === SubscriptionStatus.Uninitialized) {
        // First one of this subscription we're seeing
        getNotificationEmitter().emit(NotificationEventType.SubscriptionAdded, subscription);
        submitSubscribe(subscription);
    } else {
        updateSubscriptionLog(subscription, subscriptionState);
    }
}

export async function unregisterSubscription(subscription: NotificationSubscription) {
    // If a subscribe call was never made to server, don't make an unsubscribe call
    if (!subscription.requiresExplicitSubscribe) {
        return;
    }

    // Only unsubscribe if we've stopped tracking the subscription (no other handlers are left)
    if (!tracker.hasSubscription(subscription.subscriptionId)) {
        getNotificationEmitter().emit(NotificationEventType.SubscriptionRemoved, subscription);

        // Last subscription was just unregistered
        await submitUnsubscribe(subscription);
    }
}

export function reinitSubscriptions() {
    tracker.getSubscriptions().map(subscription => {
        submitSubscribe(subscription);
    });
}

export function reinitializeMissingSubscriptions(serverSubscriptionIds: string[]): string[] {
    let missingEntries: string[] = [];
    if (serverSubscriptionIds != null) {
        let serverEntries: { [index: string]: boolean } = {};
        for (let j = 0; j < serverSubscriptionIds.length; ++j) {
            if (serverSubscriptionIds[j] != null) {
                serverEntries[serverSubscriptionIds[j]] = true;
            }
        }

        let clientSubscriptions = tracker.getSubscriptions();
        for (let i = 0; i < clientSubscriptions.length; ++i) {
            let subscriptionState = tracker.getSubscriptionState(
                clientSubscriptions[i].subscriptionId
            );

            // If the previous state of notification was connected, then only try to retry missing subscription else it will be retried through its regular path
            if (
                subscriptionState.status == SubscriptionStatus.Connected &&
                !serverEntries[clientSubscriptions[i].subscriptionId]
            ) {
                missingEntries.push(clientSubscriptions[i].subscriptionId);
                submitSubscribe(clientSubscriptions[i]);
            }
        }
    }

    return missingEntries;
}

export function submitSubscribe(subscription: NotificationSubscription) {
    let subscriptionState = tracker.getSubscriptionState(subscription.subscriptionId);

    // Clear the setTimeout handle from retry if there was one
    if (subscriptionState.pendingRetryHandle !== 0) {
        window.clearTimeout(subscriptionState.pendingRetryHandle);
        subscriptionState.pendingRetryHandle = 0;
    }

    // Enter pending state until fetch resolves
    subscriptionState.status = SubscriptionStatus.Pending;

    updateSubscriptionLog(subscription, subscriptionState);

    batchState.addToBatch(subscription);
    if (!batchState.isPending()) {
        window.setTimeout(async () => {
            // Save the batch in this closure
            let submittedBatch = batchState.getBatch();

            // And clear the current batch so new subscriptions can start queueing
            batchState.clearBatch();
            batchState.setPending(false);
            await subscribeOnServer(submittedBatch);
        }, BATCH_TIMEOUT);
        batchState.setPending(true);
    }
}

export async function subscribeOnServer(subscriptions: NotificationSubscription[]) {
    try {
        // Make owa-service call to subscribe on the server
        let responses = await subscribeToNotificationOperation({
            request: {
                Header: getJsonRequestHeader(),
            },
            subscriptionData: subscriptions.map(subscription => {
                return {
                    SubscriptionId: subscription.subscriptionId,
                    Parameters: subscription.subscriptionParameters,
                };
            }),
        });

        forEachTrackedSubscription(subscriptions, (subscriptionState, subscription) => {
            let maybeResponse = responses.filter(
                response => response.SubscriptionId === subscription.subscriptionId
            );

            if (maybeResponse.length !== 0) {
                handleSubscriptionResponse(maybeResponse[0], subscription, subscriptionState);
            } else {
                handleSubscriptionFailure(
                    subscription,
                    subscriptionState,
                    new Error(`${subscription.subscriptionId} not in subscription responses`)
                );
            }
        });
    } catch (error) {
        forEachTrackedSubscription(subscriptions, (subscriptionState, subscription) => {
            handleSubscriptionFailure(subscription, subscriptionState, error);
        });
    }
}

async function submitUnsubscribe(subscription: NotificationSubscription) {
    try {
        // Make a call to the server to unsubscribe
        await unsubscribeToNotificationOperation({
            subscriptionData: [
                {
                    SubscriptionId: subscription.subscriptionId,
                    Parameters: subscription.subscriptionParameters,
                },
            ],
        });
    } catch (error) {
        emitWarn(`Subscription unsubscribe failed: ${error.message}`);
    }
}

function handleSubscriptionResponse(
    response: SubscriptionResponseData,
    subscription: NotificationSubscription,
    subscriptionState: SubscriptionState
) {
    if (!response.SuccessfullyCreated) {
        // Subscription failure
        retrySubscription(subscription, subscriptionState, response.ErrorInfo);
    } else {
        // Subscription succeeded
        if (subscriptionState.retries > 0) {
            // Subscription reconnect, call handlers if they exist
            let refs = tracker.getRefs(subscription.subscriptionId);
            for (let i = 0; i < refs.length; i++) {
                let ref = refs[i];
                if (ref.subscription.onReconnected) {
                    callAndCatch(ref.subscription.onReconnected);
                }
            }
        }

        subscriptionState.retries = 0;
        subscriptionState.pendingRetryHandle = 0;
        subscriptionState.status = SubscriptionStatus.Connected;

        updateSubscriptionLog(subscription, subscriptionState, '');
    }
}

function handleSubscriptionFailure(
    subscription: NotificationSubscription,
    subscriptionState: SubscriptionState,
    error: Error
) {
    retrySubscription(subscription, subscriptionState, error.message);
}

function retrySubscription(
    subscription: NotificationSubscription,
    subscriptionState: SubscriptionState,
    reason: string
) {
    // Send reloads on each failure so subscribers can stay at least partially up to date
    subscriptionFailureReload(subscription.subscriptionId);

    if (subscriptionState.retries === 0) {
        // For the subscriptions that have custom logic for handling subscription disconnects
        let refs = tracker.getRefs(subscription.subscriptionId);
        for (let i = 0; i < refs.length; i++) {
            let ref = refs[i];
            if (ref.subscription.onDisconnected) {
                callAndCatch(() => {
                    ref.subscription.onDisconnected(reason);
                });
            }
        }
    }

    subscriptionState.retries += 1;
    subscriptionState.status = SubscriptionStatus.Disconnected;

    if (subscriptionState.retries < QUICK_RETRY_THROTTLE_THRESHOLD) {
        // The first few retries will retry quickly
        submitSubscribe(subscription);
    } else if (subscriptionState.retries < DELAYED_RETRY_THRESHOLD) {
        // Retry after a long interval so we don't spam the server
        subscriptionState.pendingRetryHandle = window.setTimeout(() => {
            subscriptionState.pendingRetryHandle = 0;
            submitSubscribe(subscription);
        }, RETRY_THROTTLE_TIMEOUT);
    }

    updateSubscriptionLog(subscription, subscriptionState, reason);
}

function forEachTrackedSubscription(
    subscriptions: NotificationSubscription[],
    callback: (subscriptionState: SubscriptionState, subscription: NotificationSubscription) => void
) {
    subscriptions.map(subscription => {
        let subscriptionState = tracker.getSubscriptionState(subscription.subscriptionId);
        if (!subscriptionState) {
            // If the subscription id wasn't present in the tracker
            // This can happen if the subscribe call takes a while and the client unsubscribes in the meantime,
            // so when we try to run this callback, the subscription tracker entry is already gone.
            return;
        }

        callback(subscriptionState, subscription);
    });
}

function updateSubscriptionLog(
    subscription: NotificationSubscription,
    subscriptionState: SubscriptionState,
    error?: string
) {
    getNotificationEmitter().emit(
        NotificationEventType.SubscriptionUpdated,
        subscription,
        subscriptionState,
        error
    );
}
