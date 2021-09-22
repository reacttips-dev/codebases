import {
    webpushSuccessNotificationTitle,
    webpushSuccessNotificationBody,
} from './sendWebPushSetupAcknowledgeNotification.locstring.json';
import loc from 'owa-localize';
import { default as registerWebPushServiceWorker } from './registerWebPushServiceWorker';
import { webPushSetupAcknowledge } from './services/webPushSetupAcknowledge';
import { getClientId } from 'owa-config';

export async function sendWebPushSetupAcknowledgeNotification(windowObj: Window) {
    let registration: ServiceWorkerRegistration = await registerWebPushServiceWorker(windowObj);
    if (registration) {
        let subscription = await registration.pushManager.getSubscription();
        if (subscription != null) {
            let json: any = subscription.toJSON();
            json.clientId = getClientId();
            json.title = loc(webpushSuccessNotificationTitle);
            json.body = loc(webpushSuccessNotificationBody);
            await webPushSetupAcknowledge(json);
        }
    }
}
