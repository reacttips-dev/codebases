import { SERVICEWORKER_SCOPE } from './registerWebPushServiceWorker';
import { PerformanceDatapoint, DatapointStatus } from 'owa-analytics';

export default async function getWebPushRegistration(
    windowObj: Window
): Promise<ServiceWorkerRegistration> {
    let origin: string = windowObj.location.origin + SERVICEWORKER_SCOPE;
    let serviceWorker: ServiceWorkerContainer = windowObj.navigator.serviceWorker;
    const datapoint = new PerformanceDatapoint('GetWebPushSWRegistration');

    return serviceWorker
        .getRegistration(origin)
        .then((registration: ServiceWorkerRegistration) => {
            datapoint.end();
            return registration.scope === origin ? registration : null;
        })
        .catch((e: Error) => {
            datapoint.endWithError(DatapointStatus.ClientError, e);
            return null;
        });
}
