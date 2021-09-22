import * as notificationGlobals from './notificationGlobals';
import * as notificationHandler from './notificationHandler';
import * as subscriptionSubmitter from './subscriptionSubmitter';
import configureSignalR from './configureSignalR';
import { emitChannelDataEvent } from './getNotificationEmitter';
import type NotificationPayloadBase from 'owa-service/lib/contract/NotificationPayloadBase';
import { ChannelState, NotificationManagerStore } from './schema/NotificationManagerStore';
import type { ChannelStateNotification } from './schema/ChannelStateNotification';
import { getOwaCanaryCookie } from 'owa-service/lib/canary';
import type { NotificationManagerConfig } from './schema/NotificationManagerConfig';
import { restartLivenessCheck, stopLivenessCheck, initializeLivenessCheck } from './livenessCheck';
import { logUsage } from 'owa-analytics';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import { isFeatureEnabled } from 'owa-feature-flags';

let connection: SignalR.Connection;
let connectionOptions: SignalR.ConnectionOptions;
let managerStore: NotificationManagerStore;
let managerConfig: NotificationManagerConfig;

const PENDING_GET_ID: string = 'pg';
const RELOAD_ALL_ID: string = 'ReloadAllNotification';
const NO_TIMER: number = -1;
const RECONNECT_FAILOVER_STAGGER_RANGE: number = 60 * 1000;
const RECONNECT_RECYCLE_STAGGER_RANGE: number = 30 * 1000;

// FIXME: Temporary workaround for const enums not being inlined
const enum ConnectionState {
    Connecting = 0,
    Connected = 1,
    Reconnecting = 2,
    Disconnected = 4,
}

function setConnectionCallbacks(): void {
    connection.received(connectionMessageReceivedHandler);
    connection.error(connectionErrorHandler);
    connection.disconnected(connectionDisconnectedHandler);
    connection.stateChanged(connectionStateChangedHandler);
}

async function setConnectionQueryParameters(): Promise<void> {
    connection.qs = {
        UA: '0',
        cid: managerStore.channelId,
        'X-OWA-CANARY': getOwaCanaryCookie(),
        app: managerConfig.appName,
        ...(managerConfig.getNotificationToken && {
            access_token: await getNotificationToken(),
        }),
    };
}

function setConnectionQueryParametersSync() {
    connection.qs = {
        UA: '0',
        cid: managerStore.channelId,
        'X-OWA-CANARY': getOwaCanaryCookie(),
        app: managerConfig.appName,
        ...(managerConfig.getNotificationToken && {
            access_token: getNotificationTokenFromCache(),
        }),
    };
}

function startConnection(): void {
    managerStore.giveUpReconnecting = false;
    managerStore.reconnectScheduled = false;
    connection.start(connectionOptions);
}

function connectionMessageReceivedHandler(message: any) {
    // Receiving notifications is activity, so it resets the timer
    restartLivenessCheck();

    let notifications: Array<NotificationPayloadBase> = message;

    for (let notification of notifications) {
        if (notification.id === PENDING_GET_ID) {
            handlePendingGetNotification(notification as ChannelStateNotification);
        } else if (notification.id === RELOAD_ALL_ID) {
            notificationHandler.reloadAll();
            emitChannelDataEvent('reload all');
            managerStore.mark++;
        } else {
            notificationHandler.handleNotification(notification);
            managerStore.mark++;
        }
    }
}

function handlePendingGetNotification(notification: ChannelStateNotification) {
    if (notification.data !== 'update') {
        emitChannelDataEvent(notification.data);
    }

    switch (notification.data) {
        case 'alive1':
            handleAliveNotification(notification);
            break;

        case 'reinitSubscriptions':
            subscriptionSubmitter.reinitSubscriptions();
            emitChannelDataEvent('reinit subscriptions');
            break;

        case 'validateSubscriptions':
            let missingEntries = subscriptionSubmitter.reinitializeMissingSubscriptions(
                notification.subscriptionIds
            );
            emitChannelDataEvent(`validate subscriptions:${missingEntries.join('|')}`);
            break;

        case 'update':
            checkMarksAndHandleMismatch(notification);
            break;

        case 'backendConnectionDropped':
            handleBackendConnectionDropped();
            emitChannelDataEvent('backend connection dropped');
            break;

        case 'diagnostic':
            // Server is going to terminate the connection
            emitChannelDataEvent(`diagnostic: ${notification.message}`);
            break;

        default:
            break;
    }
    return;
}

function handleAliveNotification(notification: ChannelStateNotification) {
    if (managerStore.state === ChannelState.Ready) {
        emitChannelDataEvent('alive1 when channel was already ready');
    }

    // Channel id is generated on the client. The server should always match the same channel id.
    emitChannelDataEvent(`channel ids: local ${managerStore.channelId} server ${notification.cid}`);
    emitChannelDataEvent(`client mark: ${managerStore.mark}, server mark: ${notification.mark}`);
    managerStore.channelId = notification.cid;
    managerStore.state = ChannelState.Ready;

    // Also configure connection to send CID always from now on
    setConnectionQueryParametersSync();

    // Check Marks
    checkMarksAndHandleMismatch(notification);

    // Every alive1 notification resets marks back to 0
    managerStore.mark = 0;

    // Resolve the channel ready promise the first time
    // Subsequent resolve calls do nothing
    notificationGlobals.resolveChannelReady();
}

function checkMarksAndHandleMismatch(notification: ChannelStateNotification): void {
    if (notification.mark !== managerStore.mark) {
        emitChannelDataEvent(
            `mark mismatch local: ${managerStore.mark}, server: ${notification.mark}`
        );

        notificationHandler.reloadAll();

        // Take the server's mark count to put us back in alignment
        managerStore.mark = notification.mark;
    }
}

function connectionErrorHandler(error: SignalR.ConnectionError) {
    stopLivenessCheck();

    if (error.context) {
        if (error.context.status === 401 || error.context.status === 440) {
            emitChannelDataEvent('session timed out');
            managerStore.giveUpReconnecting = true;

            if (managerConfig.handleSessionTimeout) {
                managerConfig.handleSessionTimeout();
            }

            if (isHostAppFeatureEnabled('componentTokenProvider')) {
                managerStore.giveUpReconnecting = false;
                // update the query parameter with new access token
                setConnectionQueryParametersSync();
            }
        } else if (error.context.status === 449) {
            emitChannelDataEvent('Canary cookie expiration');

            // And update the query parameter to match the new canary
            setConnectionQueryParametersSync();
        }
    }
}

export function stopConnection(): void {
    if (managerStore) {
        emitChannelDataEvent('connection stopped');

        stopLivenessCheck();

        managerStore.state = ChannelState.Disconnected;
        managerStore.giveUpReconnecting = true;
        connection.stop();
    } else {
        emitChannelDataEvent('attempting to stop connection before initialization');
    }
}

function handleBackendConnectionDropped(): void {
    // When OWA loses connection to the backend server, it needs the client to restart the connection.
    // In a failover scenario, this will cause the notification channel to be routed to the new backend server.
    stopConnection();

    // We want to wait a little while before attempting a reconnect. This will give some time for the failover to complete.
    managerStore.reconnectTimeout = managerConfig.backoffMaximum;
    retryConnectionWithBackOff(
        'ChannelReconnectConnectionDropped',
        RECONNECT_FAILOVER_STAGGER_RANGE
    );
}

function connectionDisconnectedHandler(connectImmediate: boolean = false): void {
    stopLivenessCheck();

    if (managerStore.state == ChannelState.Initialized) {
        managerStore.state = ChannelState.Uninitialized;
    } else if (
        managerStore.state == ChannelState.Ready ||
        managerStore.state == ChannelState.Reconnecting
    ) {
        managerStore.state = ChannelState.Disconnected;
    }

    if (connectImmediate) {
        managerStore.reconnectTimeout = Math.abs(managerConfig.minimumReconnectInterval);
    }

    if (managerStore.giveUpReconnecting !== true) {
        retryConnectionWithBackOff(
            'ChannelReconnectConnectionDisconnected',
            connectImmediate ? 0 : RECONNECT_RECYCLE_STAGGER_RANGE
        );
    }
}

function connectionStateChangedHandler(connectionState: SignalR.StateChanged): void {
    switch (connectionState.newState) {
        case ConnectionState.Connected:
            if (managerStore.state === ChannelState.Uninitialized) {
                managerStore.state = ChannelState.Initialized;
                emitChannelDataEvent('channel initialized');
            } else if (managerStore.state === ChannelState.Disconnected) {
                managerStore.state = ChannelState.Reconnecting;
                emitChannelDataEvent('channel reconnecting');
            }
            // On a successful connection, reset the reconnect back-off timeout
            managerStore.reconnectTimeout = Math.abs(managerConfig.minimumReconnectInterval);

            // Make sure the channel becomes ready soon after connection is established
            startChannelReadyTimer();
            break;

        // Disconnected and Reconnecting are the same as far as the channel state is concerned
        case ConnectionState.Disconnected:
        case ConnectionState.Reconnecting:
            stopLivenessCheck();

            if (managerStore.state === ChannelState.Initialized) {
                managerStore.state = ChannelState.Uninitialized;
                emitChannelDataEvent('channel uninitialized');
            } else if (managerStore.state === ChannelState.Ready) {
                managerStore.state = ChannelState.Reconnecting;
                emitChannelDataEvent('channel reconnecting');
            }
            // Cancel the ready check because a disconnect has happened
            stopChannelReadyTimer();
            break;

        default:
            break;
    }
}

function retryConnectionWithBackOff(retryEventName: string, maxInitialDelay: number): void {
    let timeout: number = Math.abs(managerStore.reconnectTimeout);
    timeout += Math.floor(Math.random() * maxInitialDelay);

    emitChannelDataEvent(`retrying connection with backoff ${timeout}`);

    if (isFeatureEnabled('auth-notificationChannelTelemetry')) {
        logUsage(
            retryEventName,
            {
                domain: window.location.hostname,
                delay: timeout,
            },
            { isCore: true }
        );
    }

    window.setTimeout(startConnection, timeout);
    managerStore.reconnectTimeout = Math.min(
        Math.abs(managerStore.reconnectTimeout) * 2,
        Math.abs(managerConfig.backoffMaximum)
    );
    managerStore.reconnectScheduled = true;
}

function startChannelReadyTimer(): void {
    managerStore.checkReadyTimer = window.setTimeout(
        checkIfChannelIsReady,
        managerConfig.readyCheckTimeout
    );
}

function stopChannelReadyTimer(): void {
    if (managerStore.checkReadyTimer !== NO_TIMER) {
        window.clearTimeout(managerStore.checkReadyTimer);
        managerStore.checkReadyTimer = NO_TIMER;
    }
}

function checkIfChannelIsReady(): void {
    // If the connection was established but no alive notification was received after the timeout period, try restarting the connection.
    if (managerStore.state !== ChannelState.Ready) {
        emitChannelDataEvent('ready check timer expired');
        stopConnection();
        retryConnectionWithBackOff('ChannelReconnectNotReady', 0 /* maxInitialDelay */);
    }
}

function handleLivenessFailure(): void {
    // On liveness failure, make sure the subscribers reload for fresh data
    notificationHandler.reloadAll();

    logUsage(
        'ChannelLivenessFailure',
        {
            domain: window.location.hostname,
        },
        { isCore: true }
    );

    // Restart the channel
    emitChannelDataEvent('restarting channel due to liveness check failure');
    stopConnection();
    startConnection();

    // And schedule another liveness check
    restartLivenessCheck();
}

function getNotificationTokenFromCache(): string {
    let [token] = managerConfig.getNotificationToken();
    return token as string;
}

async function getNotificationToken(): Promise<string> {
    let [token, tokenPromise] = managerConfig.getNotificationToken();

    // If token is not returned synchronously, we need to await on the tokenPromise
    if (!token) {
        token = (await tokenPromise) as string;
    }

    return token as string;
}

export function retryDisconnection() {
    if (managerStore) {
        // if signal was not initialized, ignore reconnection attempt
        connectionDisconnectedHandler(true /* connectImmediate */);
    }
}

export async function initializeSignalR(
    conn: SignalR.Connection,
    connOpts: SignalR.ConnectionOptions,
    state: NotificationManagerStore,
    config: NotificationManagerConfig
): Promise<void> {
    connection = conn;
    connectionOptions = connOpts;
    managerStore = state;
    managerConfig = config;

    managerStore.channelId = notificationGlobals.getChannelId();

    setConnectionCallbacks();

    await setConnectionQueryParameters();

    // Replace SignalR connection.stop to always use an asynchronous XHR
    let signalRStop = connection.stop.bind(connection);
    connection.stop = (async?: boolean, notifyServer?: boolean): any => {
        signalRStop(true, notifyServer);
    };

    initializeLivenessCheck(handleLivenessFailure);

    configureSignalR();

    if (isFeatureEnabled('auth-notificationChannelTelemetry')) {
        logUsage(
            'ChannelInitialization',
            {
                domain: window.location.hostname,
            },
            { isCore: true }
        );
    }

    startConnection();
}
