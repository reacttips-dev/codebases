import {
    DiagnosticsLogger,
    lazyGetDiagnosticsLogState,
    lazyRegisterDiagnostics,
} from 'owa-diagnostics';
import type { NotificationSubscription, SubscriptionState } from 'owa-notification';
import type { SubscriptionDatapoint } from '../schema/SubscriptionDatapoint';
import addSubscriptionDatapoint from '../actions/addSubscriptionDatapoint';
import disconnectSubscriptionDatapoint from '../actions/disconnectSubscriptionDatapoint';
import setSubscriptionDatapointStatus from '../actions/setSubscriptionDatapointStatus';

const loggerName = 'Subscriptions';
let subscriptionLogger: DiagnosticsLogger<SubscriptionDatapoint>;

let initialized = false;

async function ensureInitialized() {
    if (!initialized) {
        initialized = true;

        subscriptionLogger = {
            name: loggerName,
            datapoints: [],
        };

        const getDiagnosticsLogState = await lazyGetDiagnosticsLogState.import();
        const registerDiagnostics = await lazyRegisterDiagnostics.import();

        const diagnosticsLogState = getDiagnosticsLogState();
        registerDiagnostics(subscriptionLogger);
        subscriptionLogger = diagnosticsLogState.loggers.get(loggerName);
    }
}

export function onSubscriptionAdded(subscription: NotificationSubscription) {
    ensureInitialized();
    addSubscriptionDatapoint(subscription, subscriptionLogger);
}

export function onSubscriptionUpdated(
    subscription: NotificationSubscription,
    subscriptionState: SubscriptionState,
    error?: string
) {
    ensureInitialized();
    setSubscriptionDatapointStatus(
        subscription.subscriptionId,
        subscriptionState.status,
        subscriptionState.refs.length,
        subscriptionState.retries,
        error,
        subscriptionLogger
    );
}

export function onSubscriptionRemoved(subscription: NotificationSubscription) {
    ensureInitialized();
    disconnectSubscriptionDatapoint(subscription.subscriptionId, subscriptionLogger);
}
