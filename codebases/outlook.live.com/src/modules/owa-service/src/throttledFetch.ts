import { isInPrefetchMode, getPrefetchPriority } from './prefetch';
import type { TraceErrorObject } from 'owa-trace';
import type { RequestOptions } from './RequestOptions';
import { getConfig } from './config';

export default function throttledFetch(
    url: RequestInfo,
    init: RequestOptions | Promise<RequestOptions>
): Promise<Response> {
    const inPrefetchMode = isInPrefetchMode();
    const prefetchPriority = getPrefetchPriority();

    // check if it is a promise to see if we have to await for the request options to come back
    if ((<Promise<RequestOptions>>init).then) {
        return (<Promise<RequestOptions>>init).then(i =>
            internalFetch(url, i, inPrefetchMode, prefetchPriority)
        );
    }

    return internalFetch(url, <RequestOptions>init, inPrefetchMode, prefetchPriority);
}

function internalFetch(
    url: RequestInfo,
    init: RequestOptions,
    inPrefetchMode: boolean,
    prefetchPriority: number | undefined
): Promise<Response> {
    const config = getConfig();
    if (config.disableAllRequests) {
        const error: TraceErrorObject = new Error(
            'Service request blocked because disableAllRequests is enabled.'
        );
        error.diagnosticInfo = `URL: ${url}`;
        error.fetchErrorType = 'RequestNotComplete';
        error.retriable = false;
        return Promise.reject(error);
    }
    if (inPrefetchMode) {
        return config.prefetchTaskQueue.add(
            () => fetch(url, <RequestInit>init),
            prefetchPriority || init.priority
        );
    } else if (config.serviceActionTaskQueue) {
        return config.serviceActionTaskQueue.add(() => nonPrefetchFetch(url, init), init.priority);
    } else {
        return nonPrefetchFetch(url, init);
    }
}

function nonPrefetchFetch(url: RequestInfo, init: RequestOptions): Promise<Response> {
    return new Promise<Response>((resolve, reject) => {
        const timeoutMS = init.timeoutMS || getConfig().timeoutMS || -1;
        const fetchOptions = <RequestInit>init;

        let timerHandle: number = 0;
        if (timeoutMS > 0) {
            let controller: AbortController | undefined;
            const isTimeoutFeatureEnabled = getConfig().isFeatureEnabled('fwk-request-timeout');
            if ('AbortController' in window && isTimeoutFeatureEnabled) {
                // We need an abort controller to abort the fetch request on tiemout
                controller = new AbortController();
                fetchOptions.signal = controller.signal;
            }

            timerHandle = window.setTimeout(() => {
                if (isTimeoutFeatureEnabled && controller) {
                    controller.abort();
                } else {
                    const error: TraceErrorObject = new Error(
                        `Service request would have timed out after ${timeoutMS}ms if flight were enabled.`
                    );
                    error.diagnosticInfo = `URL: ${url}`;
                    error.fetchErrorType = 'RequestTimeout';
                    if (init.timeoutMS) {
                        reject(error);
                    } else {
                        throw error;
                    }
                }
            }, timeoutMS);
        }

        fetch(url, fetchOptions)
            .then(response => {
                window.clearTimeout(timerHandle);
                resolve(response);
            })
            .catch(err => {
                const error: TraceErrorObject = err;

                error.fetchErrorType = 'RequestNotComplete';
                error.retriable = true;

                if (error.name === 'AbortError') {
                    Object.defineProperty(error, 'message', {
                        value: `Service request timed out after ${timeoutMS}ms. URL: ${url}`,
                    });
                    error.fetchErrorType = 'RequestTimeout';
                } else if (error.message) {
                    Object.defineProperty(error, 'message', {
                        value: `${error.message}. URL: ${url}`,
                    });
                }

                window.clearTimeout(timerHandle);
                reject(error);
            });
    });
}
