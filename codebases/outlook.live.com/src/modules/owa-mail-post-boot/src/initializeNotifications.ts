import { lazyInitializeNotificationDiagnostics } from 'owa-mail-notification-diagnostics';
import { lazyInitializeNotificationManager } from 'owa-notification';
import { doAuthRedirect } from 'owa-service/lib/doAuthRedirect';
import { getScopedPath } from 'owa-url';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';

export default async function initializeNotifications() {
    const initializeNotificationDiagnostics = await lazyInitializeNotificationDiagnostics.import();
    await initializeNotificationDiagnostics();
    await lazyInitializeNotificationManager.importAndExecute({
        channelEndpoint: getScopedPath('/owa') + '/notificationchannel',
        pingInterval: 300000,
        backoffMaximum: 64000,
        minimumReconnectInterval: 1000,
        readyCheckTimeout: 60000,
        handleSessionTimeout: () => {
            if (isHostAppFeatureEnabled('authRedirectOnSessionTimeout')) {
                doAuthRedirect();
            }
        },
    });
}
