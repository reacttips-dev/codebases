import type { ServiceResponseCallback } from 'owa-analytics-types/lib/types/ServiceResponseCallback';
import type { InternalRequestOptions } from 'owa-service/lib/RequestOptions';
import type { OwsRequestOptions } from './OwsRequestOptions';

var serviceResponseCallbackNumber = 0;
var createServiceResponseCallbacks: { [key: number]: ServiceResponseCallback } = {};

// this returns a function that will unregister it
export function registerCreateServiceResponseCallback(
    callback: ServiceResponseCallback
): () => void {
    let id = serviceResponseCallbackNumber++;
    createServiceResponseCallbacks[id] = callback;

    return () => {
        delete createServiceResponseCallbacks[id];
    };
}

export function callResponseCallbacks(
    requestOptions: InternalRequestOptions,
    options: OwsRequestOptions,
    promise: Promise<Response>,
    actionName: string,
    url: string
) {
    let callbackKeys = Object.keys(createServiceResponseCallbacks);
    if (options.datapoint) {
        requestOptions.datapoint = options.datapoint;
    }
    for (let i = 0; i < callbackKeys.length; i++) {
        createServiceResponseCallbacks[callbackKeys[i]](
            promise,
            actionName || 'OWS',
            url,
            0,
            requestOptions
        );
    }
}
