import { default as getServiceWorkerPath } from './getServiceWorkerPath';
import getRootVdirName from 'owa-url/lib/getRootVdirName';
import { hasQueryStringParameter, getQueryStringParameter } from 'owa-querystring';
import { PerformanceDatapoint, DatapointStatus } from 'owa-analytics';

const SERVICEWORKER_FILENAME: string = 'sw_webpush.js';
export const SERVICEWORKER_SCOPE: string = '/webpush/';

export default async function registerWebPushServiceWorker(
    windowObj: Window
): Promise<ServiceWorkerRegistration> {
    const datapoint = new PerformanceDatapoint('RegisterWebPushSW');
    let rootVdir = getRootVdirName();
    let serviceWorkerPath = getServiceWorkerPath(rootVdir);
    let serviceworkerUrl =
        serviceWorkerPath != null
            ? `${serviceWorkerPath}/${SERVICEWORKER_FILENAME}`
            : `/${SERVICEWORKER_FILENAME}`;
    let options: RegistrationOptions = { scope: SERVICEWORKER_SCOPE };

    ['branch', 'ring', 'version'].some(el => {
        if (hasQueryStringParameter(el)) {
            serviceworkerUrl += `?${el}=${getQueryStringParameter(el)}`;
            return true;
        }

        return false;
    });

    return windowObj.navigator.serviceWorker
        .register(serviceworkerUrl, options)
        .then((registration: ServiceWorkerRegistration) => {
            let worker = null;
            if (registration.installing != null) {
                worker = registration.installing;
            } else if (registration.waiting != null) {
                worker = registration.waiting;
            } else if (registration.active != null) {
                worker = registration.active;
            }
            if (worker.state == 'activated') {
                return registration;
            } else {
                return new Promise<ServiceWorkerRegistration>((resolve, reject) => {
                    worker.onstatechange = function () {
                        if (worker.state == 'activated') {
                            worker.onstatechange = null;
                            return resolve(registration);
                        }
                    };
                });
            }
        })
        .then((registration: ServiceWorkerRegistration) => {
            // Trigger explicit update as invoking register is not fetching new worker
            // This is most likely due to the worker registered to different path.
            return registration.update().then(() => {
                datapoint.end();
                return registration;
            });
        })
        .catch((e: Error) => {
            datapoint.endWithError(DatapointStatus.ClientError, e);
            return null;
        });
}
