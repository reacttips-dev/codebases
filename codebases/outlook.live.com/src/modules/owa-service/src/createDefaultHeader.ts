import { getConfig } from './config';
import { addImmutableIdPreference } from './addImmutableIdPreference';
import { getCanaryHeaders } from './setCanaryHeader';
import { getApp } from 'owa-config';

export const AuthorizationHeaderName = 'Authorization';

interface PromiseWithBestEffort<T> extends Promise<T> {
    bestEffort?: T;
}

export function createDefaultHeaders(
    hasAuthHeader?: boolean,
    sourceId?: string
): PromiseWithBestEffort<{ [key: string]: string }> {
    const defaultHeaders = getCanaryHeaders();
    defaultHeaders['X-Req-Source'] = getApp();

    const config = getConfig();
    if (config.isFeatureEnabled('fwk-useJsonNetSerializer')) {
        defaultHeaders['X-UseJsonNetSerializer'] = '1';
    }

    let bestEffortPromise: PromiseWithBestEffort<{ [key: string]: string }> = Promise.resolve(
        defaultHeaders
    );

    if (!hasAuthHeader && config.getAuthToken) {
        bestEffortPromise = config
            .getAuthToken(undefined /* response headers */, sourceId)
            .then(authToken => {
                if (authToken) {
                    defaultHeaders[AuthorizationHeaderName] = authToken;
                }
                return defaultHeaders;
            });
    }

    addImmutableIdPreference(defaultHeaders);

    bestEffortPromise.bestEffort = defaultHeaders;
    return bestEffortPromise;
}
