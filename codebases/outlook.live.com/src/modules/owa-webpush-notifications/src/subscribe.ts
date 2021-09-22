import type { WebPushNotificationsOptions } from 'owa-outlook-service-options';
import { default as registerEndpoint } from './services/registerEndpoint';
import { default as urlBase64ToUint8Array } from './urlBase64ToUint8Array';
import { getClientId } from 'owa-config';
import { getWebPushNotificationTypesState } from './localWebPushUserSettingSelectors';

export default async function subscribe(
    serviceWorkerRegistration: ServiceWorkerRegistration,
    webPushNotificationsOption: WebPushNotificationsOptions,
    windowObj: Window
): Promise<boolean> {
    let applicationServerKey = urlBase64ToUint8Array(
        webPushNotificationsOption.applicationServerKey,
        windowObj
    );
    let subscription = await serviceWorkerRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey,
    });
    let json: any = subscription.toJSON();
    json.clientId = getClientId();
    json.notificationEnabledState = getWebPushNotificationTypesState();
    let registered = await registerEndpoint(json);
    return registered;
}
