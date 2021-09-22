import subscribe from './subscribe';
import { isFeatureEnabled } from 'owa-feature-flags';
import sendChannelRoundTripNotificationOperation from 'owa-service/lib/operation/sendChannelRoundTripNotificationOperation';
import { emitChannelDataEvent } from './getNotificationEmitter';

const NO_TIMER: number = -1;

// How long to wait to receive the round trip payload from the server
const ROUND_TRIP_TIMEOUT = 60 * 1000;

// How long after the liveness confirmation before performing another liveness check
const LIVENESS_CHECK_DELAY_MIN = 5 * 60 * 1000;
const LIVENESS_CHECK_DELAY_MAX = 15 * 60 * 1000;

let initialized = false;
let handleLivenessCheckFailure: () => void;

// The timer waiting for the server to respond to the round trip request
let pendingRoundTripTimer: number = NO_TIMER;
// The timer which delays the liveness check for some time after the last liveness confirmation
let livenessCheckTimer: number = NO_TIMER;

/**
 * Starts (or restarts) the liveness check.
 * This should be called every time we get confirmation that the channel is alive.
 */
export function restartLivenessCheck() {
    if (!isFeatureEnabled('auth-SignalRActivityTimer')) {
        return;
    }

    // Stop the existing liveness check
    if (livenessCheckTimer !== NO_TIMER) {
        window.clearTimeout(livenessCheckTimer);
    }

    // If we managed to get a notification in the short time when we were performing the round trip
    if (pendingRoundTripTimer !== NO_TIMER) {
        window.clearTimeout(pendingRoundTripTimer);
    }

    // Get a random delay between LIVENESS_CHECK_DELAY_MAX and LIVENESS_CHECK_DELAY_MIN
    let delay = Math.floor(
        Math.random() * (LIVENESS_CHECK_DELAY_MAX - LIVENESS_CHECK_DELAY_MIN + 1) +
            LIVENESS_CHECK_DELAY_MIN
    );

    // Start a new liveness check

    livenessCheckTimer = window.setInterval(sendRoundTripNotification, delay);
}

/**
 * Stop the liveness check.
 * This should be called when the channel itself is not connected to the server.
 */
export function stopLivenessCheck() {
    if (livenessCheckTimer !== NO_TIMER) {
        window.clearTimeout(livenessCheckTimer);
    }

    if (pendingRoundTripTimer !== NO_TIMER) {
        window.clearTimeout(pendingRoundTripTimer);
    }
}

/**
 * When the server failed to complete the round trip check in time
 */
function onRoundTripTimeoutElapsed() {
    // Tell the notification manager that the liveness check has failed
    handleLivenessCheckFailure();
}

/**
 * Send a round trip request to the server and wait for it to respond.
 * If the server doesn't respond in time, we'll call the liveness check failure handler.
 */
function sendRoundTripNotification() {
    emitChannelDataEvent('Channel inactive, starting liveness round-trip check');
    sendChannelRoundTripNotificationOperation({});
    pendingRoundTripTimer = window.setTimeout(onRoundTripTimeoutElapsed, ROUND_TRIP_TIMEOUT);
}

/**
 * When we get the round trip notification response from the server, we know the channel is still
 * working in some capacity.
 */
function handleRoundTripNotification() {
    emitChannelDataEvent('Received liveness round-trip payload, channel still live');

    // Stop waiting for the round trip notification since we got it.
    window.clearTimeout(pendingRoundTripTimer);

    // Since the channel is still alive, we'll schedule the next liveness check.
    restartLivenessCheck();
}

/**
 * You MUST call this before starting the liveness check timer.
 * @param onLivenessCheckFailure Called when the liveness check fails, indicating that the channel is not receiving data properly from the server.
 */
export function initializeLivenessCheck(onLivenessCheckFailure: () => void) {
    if (!initialized) {
        initialized = true;

        handleLivenessCheckFailure = onLivenessCheckFailure;

        subscribe(
            {
                subscriptionId: 'RoundTrip',
                requiresExplicitSubscribe: false,
                subscriptionParameters: {},
                noSubscriptionFailureReload: true,
            },
            handleRoundTripNotification
        );
    }
}
