import throttledFetch from './throttledFetch';
import fetchHandler from './fetchHandler';
import isRetriableStatus from './isRetriableStatus';
import addFetchRetryHeaders from './addFetchRetryHeaders';
import type RequestOptions from './RequestOptions';
import type { ServiceResponseCallback } from 'owa-analytics-types/lib/types/ServiceResponseCallback';
import getRequestNumber from './getRequestNumber';
import createOptionsForServiceRequest from './createOptionsForServiceRequest';
import isRetriableAuthError from './isRetriableAuthError';
import { AuthorizationHeaderName } from './createDefaultHeader';
import sleep from 'owa-sleep';
import { getConfig } from './config';
import isExplicitLogonRequest from './isExplicitLogonRequest';

const DEFAULT_MAX_ATTEMPT: number = 2;
const TIMEOUT_ON_DISCONNECT = 5000;

let serviceResponseCallbackNumber = 0;
const createServiceResponseCallbacks: { [key: number]: ServiceResponseCallback } = {};

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

export default function fetchWithRetry(
    actionName: string,
    originalUrl: string,
    attemptCount: number,
    requestOptions: RequestOptions | undefined,
    parameters?: any
): Promise<any> {
    const optionsPromise = createOptionsForServiceRequest(requestOptions, parameters, actionName);
    const url = originalUrl + '&n=' + getRequestNumber();
    const promise = throttledFetch(url, optionsPromise);
    const callbackKeys = Object.keys(createServiceResponseCallbacks);
    for (let ii = 0; ii < callbackKeys.length; ii++) {
        createServiceResponseCallbacks[callbackKeys[ii]](
            promise,
            actionName,
            url,
            attemptCount,
            optionsPromise
        );
    }

    return optionsPromise.then(options => {
        // We would like to know where this function was invoked from so let's create the callstack here
        // and pass it through just in case we need it.
        const callstackAtRequest = new Error().stack;
        const { retryCount: maxRetryCount = DEFAULT_MAX_ATTEMPT } = options;
        return promise.then(
            async function (response: Response) {
                let shouldRetry: boolean = false;
                let endpoint: string = originalUrl;
                if (
                    (options?.shouldRetry?.(response.status) ||
                        isRetriableStatus(response.status)) &&
                    attemptCount < maxRetryCount
                ) {
                    if (options?.onBeforeRetry) {
                        const retryOptions = await options.onBeforeRetry(response);

                        // if we have retryOptions, then let's try to retry again
                        if (retryOptions) {
                            shouldRetry = true;
                            if (retryOptions.delay) {
                                await sleep(retryOptions.delay);
                            }
                            if (retryOptions.endpoint) {
                                endpoint = retryOptions.endpoint;
                            }
                        }
                    } else {
                        shouldRetry = true;
                    }
                }

                if (shouldRetry) {
                    // if the error is a retriable auth error, then let's try to get a new auth token
                    if (
                        isRetriableAuthError(response.status) &&
                        !isExplicitLogonRequest(requestOptions)
                    ) {
                        const config = getConfig();

                        // we should clear the auth token since we know it failed to authenticate
                        config.onAuthFailed?.();

                        // lets try to get a new auth token
                        const authToken = await config.getAuthToken!(
                            response.headers,
                            requestOptions?.sourceId
                        );
                        if (authToken) {
                            options.headers.set(AuthorizationHeaderName, authToken);
                        } else if (options.headers.has(AuthorizationHeaderName)) {
                            options.headers.delete(AuthorizationHeaderName);
                        }
                    }
                    addFetchRetryHeaders(++attemptCount, options.headers);
                    return fetchWithRetry(actionName, endpoint, attemptCount, options, parameters);
                }
                return fetchHandler<any>(actionName, response, options, callstackAtRequest);
            },
            function (error: any) {
                if (error.retriable && attemptCount < maxRetryCount) {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            try {
                                addFetchRetryHeaders(++attemptCount, options.headers);
                                resolve(
                                    fetchWithRetry(
                                        actionName,
                                        originalUrl,
                                        attemptCount,
                                        options,
                                        parameters
                                    )
                                );
                            } catch (e) {
                                if (e.message) {
                                    e.message = actionName + ':' + e.message;
                                }
                                reject(e);
                            }
                        }, TIMEOUT_ON_DISCONNECT);
                    });
                } else {
                    error.networkError = true;
                    throw error;
                }
            }
        );
    });
}
