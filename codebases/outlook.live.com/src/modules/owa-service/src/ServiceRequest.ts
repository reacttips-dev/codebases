import fetchWithRetry from './fetchWithRetry';
import type RequestOptions from './RequestOptions';
import { getConfig } from './config';
import { getApp } from 'owa-config';

export function makeServiceRequest<T>(
    actionName: string,
    parameters: any,
    options?: RequestOptions
): Promise<T> {
    const config = getConfig();
    let endpoint;
    if (options?.endpoint) {
        endpoint = options.endpoint;
    } else {
        const baseUrl = options?.customBaseUrl
            ? options.customBaseUrlSubPath
                ? options.customBaseUrl.concat(options.customBaseUrlSubPath)
                : options.customBaseUrl
            : config.baseUrl;
        endpoint = `${baseUrl}/service.svc?action=${actionName}`;
    }

    if (
        (config.isUserIdle !== undefined && config.isUserIdle()) ||
        options?.isUserActivity == false
    ) {
        endpoint += '&UA=0';
    }

    if (endpoint.indexOf('&app=') == -1 && endpoint.indexOf('?app=') == -1) {
        endpoint += `${endpoint.indexOf('?') > -1 ? '&' : '?'}app=${getApp()}`;
    }

    return fetchWithRetry(actionName, endpoint, 1, options, parameters);
}
