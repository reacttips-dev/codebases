import type { WebPushNotificationsOptions } from 'owa-outlook-service-options';
import { default as registerWebPushServiceWorker } from './registerWebPushServiceWorker';
import { default as loadWebPushSubscriptions } from './services/loadWebPushSubscriptions';
import { default as subscribe } from './subscribe';
import { default as registerEndpoint } from './services/registerEndpoint';
import { getClientId } from 'owa-config';
import { trace } from 'owa-trace';
import { getWebPushNotificationTypesState } from './localWebPushUserSettingSelectors';

export default async function enableWebPushNotifications(
    webPushNotificationsOption: WebPushNotificationsOptions,
    windowObj: Window
): Promise<boolean> {
    let enabled: boolean = false;
    let serviceWorkerRegistration: ServiceWorkerRegistration = await registerWebPushServiceWorker(
        windowObj
    );
    if (serviceWorkerRegistration) {
        let subscription = await serviceWorkerRegistration.pushManager.getSubscription();
        if (subscription == null) {
            enabled = await subscribe(
                serviceWorkerRegistration,
                webPushNotificationsOption,
                windowObj
            );
        } else {
            let serverSubscriptions = await loadWebPushSubscriptions();
            let alreadyRegistered = false;
            if (serverSubscriptions) {
                for (let i = 0; i < serverSubscriptions.length; ++i) {
                    if (serverSubscriptions[i].endpoint == subscription.endpoint) {
                        alreadyRegistered = true;
                        break;
                    }
                }
            }

            if (alreadyRegistered) {
                // Renew the subsription with server
                let json: any = subscription.toJSON();
                json.clientId = getClientId();
                json.notificationEnabledState = getWebPushNotificationTypesState();
                await registerEndpoint(json);
                enabled = true;
            } else {
                trace.warn('[WebPush] Orphaned subsciption found, unsubscribing.');
                let unsubscribed = await subscription.unsubscribe();
                if (unsubscribed) {
                    enabled = await subscribe(
                        serviceWorkerRegistration,
                        webPushNotificationsOption,
                        windowObj
                    );
                } else {
                    trace.warn('[WebPush] Failed to unsubscribe.');
                }
            }
        }
    }
    return enabled;
}
