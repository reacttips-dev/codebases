import { default as getWebPushRegistration } from './getWebPushRegistration';
import { trace } from 'owa-trace';

export default async function unsubscribe(windowObj: Window): Promise<string> {
    let endPoint: string = null;
    let webPushRegistration = await getWebPushRegistration(windowObj);
    if (webPushRegistration != null) {
        let pushSubscription = await webPushRegistration.pushManager.getSubscription();
        if (pushSubscription != null) {
            endPoint = pushSubscription.endpoint;
            let unsubscribed = await pushSubscription.unsubscribe();
            if (!unsubscribed) {
                trace.warn('[WebPush] Failed to unsubscribe.');
            }
        }

        // unregister the service worker
        await webPushRegistration.unregister();
    }

    return endPoint;
}
