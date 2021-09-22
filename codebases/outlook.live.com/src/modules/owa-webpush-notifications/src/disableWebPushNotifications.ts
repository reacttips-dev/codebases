import { getClientId } from 'owa-config';
import { default as unregisterEndpoint } from './services/unregisterEndpoint';
import { default as unsubscribe } from './unsubscribe';

export default async function disableWebPushNotifications(windowObj: Window): Promise<boolean> {
    let endPoint = await unsubscribe(windowObj);
    let unregistered = true;
    if (endPoint) {
        let clientId = getClientId();
        unregistered = await unregisterEndpoint(endPoint, clientId);
    }

    return unregistered;
}
