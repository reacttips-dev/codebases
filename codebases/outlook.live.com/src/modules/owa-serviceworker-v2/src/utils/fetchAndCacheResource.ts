import { validateFetch, validateBlob } from './validate';
import * as trace from './trace';
import getRootKey from './getRootKey';
import type CacheWrapper from '../types/CacheWrapper';
import { ClientMessage, CachePriorityStrategy } from 'owa-serviceworker-common';
import { put } from './cacheUtils';
import { logDatapoint } from '../analytics/logDatapoint';
import type SWError from '../types/SWError';

// Request option for static resources fetched from cdn. If we pass headers to this requests then browser will do preflight check for CORS which we have yet not enabled on cdn server
const staticResourceFetchOptions: RequestInit = {
    credentials: 'same-origin',
    redirect: 'manual',
    mode: 'cors',
};

const MaxRetryCount = 2;

export default function fetchAndCacheResource(
    cacheWrapper: CacheWrapper,
    url: string,
    isDynamic: boolean,
    message: ClientMessage,
    retryCount: number
): Promise<void> {
    url = addProtocol(url);
    let fetchUrl = makeRootRelativeUrl(url, isDynamic, message.rootUrl);
    let fetchOptions = staticResourceFetchOptions;
    if (isDynamic) {
        const versionQueryComponentKey = `${fetchUrl.indexOf('?') > -1 ? '&' : '?'}version`;
        fetchUrl += `${versionQueryComponentKey}=${cacheWrapper.version}`;
        if (message.dynamicQueryString) {
            fetchUrl += `&${message.dynamicQueryString}`;
        }

        const myHeaders: Headers = new Headers();
        myHeaders.append('x-sw-cache', '1');
        if (message.dynamicRequestHeaders) {
            for (const headerKey of Object.keys(message.dynamicRequestHeaders)) {
                myHeaders.append(headerKey, message.dynamicRequestHeaders[headerKey]);
            }
        }

        // Request option for dynamic resources fetched from server
        fetchOptions = {
            credentials: 'same-origin',
            redirect: 'manual',
            headers: myHeaders,
        };
    }
    return self
        .fetch(fetchUrl, fetchOptions)
        .then(response => validateFetch(response, 'CannotFetchResource'))
        .then(validateBlob)
        .then(async response => {
            const success = await put(
                cacheWrapper.cache,
                isDynamic ? getRootKey(message.source, message.hxVersion) : url,
                response
            );
            if (success) {
                trace.log(`Cached ${url} in ${cacheWrapper.name}`);
                if (!isDynamic) {
                    cacheWrapper.requestMap[url] = true;
                }
            }
            if (isDynamic && message.expectedXAppNameHeader) {
                const actual = response.headers.get('x-app-name');
                if (actual && message.expectedXAppNameHeader != actual) {
                    const expected = message.expectedXAppNameHeader;
                    trace.log(`App mismatch:actual${actual},expected${expected}`);
                    logDatapoint(
                        'SwAppMismatch',
                        {
                            actual,
                            expected,
                        },
                        message.source
                    );
                }
            }
        })
        .catch((error: SWError): Promise<void> | void => {
            if (retryCount < MaxRetryCount) {
                return fetchAndCacheResource(cacheWrapper, url, isDynamic, message, ++retryCount);
            }
            // we would like the caching to be a best effort so we ignore the error if it comes
            trace.warn('CouldNotCache:' + url);
            if (message.priorityStrategy == CachePriorityStrategy.Resources) {
                throw error;
            }
            return;
        });
}

function addProtocol(url: string) {
    // make sure we add the protocol so we can properly match the request on the fetch
    if (url.indexOf('//') == 0) {
        url = 'https:' + url;
    }
    return url;
}

function makeRootRelativeUrl(url: string, isDynamic: boolean, rootUrl: string): string {
    // e.g., convert URLs of the form ./opx/ into /calendar/opx/
    let rv = url;

    if (isDynamic && rv.indexOf('./') == 0) {
        rv = `${rootUrl}${rv.substr(2)}`;
    }

    return rv;
}
