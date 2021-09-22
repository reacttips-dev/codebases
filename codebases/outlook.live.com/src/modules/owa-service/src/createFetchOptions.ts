import { createDefaultHeaders } from './createDefaultHeader';
import type {
    RequestOptions,
    InternalRequestOptions,
    HeadersWithoutIterator,
} from './RequestOptions';

export default function createFetchOptions(
    options?: RequestOptions
): Promise<InternalRequestOptions> {
    options = options || {};

    const headers: HeadersWithoutIterator = options.headers
        ? new Headers(<Headers>options.headers)
        : new Headers();

    let returnObj: InternalRequestOptions = {
        ...options,
        method: options.method || 'POST',
        credentials: 'include',
        headers,
    };

    const hasAuthHeader = headers?.has('Authorization');

    // Update the canary headers
    return createDefaultHeaders(hasAuthHeader, options.sourceId).then(defaultHeaders => {
        Object.keys(defaultHeaders).forEach(key => {
            headers.set(key, defaultHeaders[key]);
        });

        return returnObj;
    });
}
