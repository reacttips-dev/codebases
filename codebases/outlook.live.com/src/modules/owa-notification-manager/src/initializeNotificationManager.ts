import { initializeSignalR, retryDisconnection } from './notificationManager';
import type { NotificationManagerConfig } from './schema/NotificationManagerConfig';
import { ChannelState, NotificationManagerStore } from './schema/NotificationManagerStore';
import { isFeatureEnabled } from 'owa-feature-flags';
import { logUsage } from 'owa-analytics';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import { getAccessTokenforResourceAsLazy, AccessTokenResponse } from 'owa-tokenprovider';
import { getScopedPath, getOrigin } from 'owa-url';
import { getApp } from 'owa-config';

export async function initializeNotificationManager(
    config: NotificationManagerConfig
): Promise<void> {
    /*
     * Exposing window.$ is the only way signalr will load currently.
     * This should be removed along with the jQuery dependency.
     *
     * The import has been moved to the inside of the initialization function to remove
     * the side effect of importing this file. SignalR's effectful initialization step
     * on import will still be run in all cases when the notification manager is really
     * being initialized, but not simply when the file is required (such as in tests).
     */

    // For logging errors from within the SignalR library
    (window as any).owaLogSignalRError = (message: string, diagnostics: any) => {
        if (isFeatureEnabled('auth-reportSignalRError')) {
            logUsage('ChannelInitNetworkFailure', diagnostics, { isCore: true });
        }
    };

    const jQuery = (await import('jquery')).default;
    (<any>window).$ = jQuery;
    (<any>window).jQuery = jQuery;

    // We have checked in our own copy of the SignalR library in order to add custom logging for network issues
    await import('./jquery.signalR');

    // If a component has passed in a token provider, use it.
    // Else use the token provider only for OPX right now.
    if (
        isHostAppFeatureEnabled('componentTokenProvider') &&
        config.getNotificationToken == undefined
    ) {
        config.getNotificationToken = getNotificationToken;
    }

    if (config.appName == undefined) {
        config.appName = getApp();
    }

    let initialState: NotificationManagerStore = {
        state: ChannelState.Uninitialized,
        channelId: null,
        mark: 0,
        reconnectTimeout: config.minimumReconnectInterval,
        reconnectScheduled: false,
        giveUpReconnecting: false,
        checkReadyTimer: -1,
        notificationInactivityTimer: -1,
    };

    // Replace SignalR getUrl to use passed in url to handle explicit logon url
    let signalRGetUrl = $.signalR.transports._logic.getUrl;
    $.signalR.transports._logic.getUrl = (
        connection: SignalR.Connection,
        transport: SignalR.Transport,
        reconnecting?: boolean,
        poll?: boolean,
        ajaxPost?: boolean
    ): string => {
        connection.appRelativeUrl = connection.url;
        return signalRGetUrl(connection, transport, reconnecting, poll, ajaxPost);
    };

    let connection: SignalR.Connection = $.connection(config.channelEndpoint);

    let connectionOptions: SignalR.ConnectionOptions = {
        transport: [
            // We currently support Server Sent Events and Forever Frame (IE, Edge)
            $.signalR.transports.serverSentEvents.name,
            $.signalR.transports.foreverFrame.name,
        ],
        pingInterval: config.pingInterval,
    };

    initializeSignalR(connection, connectionOptions, initialState, config);
}

export function retryDisconnectionWithMinimumReconnectInterval(): void {
    retryDisconnection();
}

function getNotificationToken(): [
    string | AccessTokenResponse | undefined,
    Promise<string | AccessTokenResponse | undefined> | undefined
] {
    return getAccessTokenforResourceAsLazy(
        getOrigin() + getScopedPath('/owa') + '/notificationchannel/',
        'OwaNotifications'
    );
}
