import type { ErrorRetryParamKey } from './interfaces/ErrorRetryParamKey';
import type RetryStrategy from './interfaces/RetryStrategy';
import { getSessionId } from 'owa-config';
import { getQueryStringParameters, stringify } from 'owa-querystring';
const extraQueryStringParameters = {};

export function doErrorRetryRedirect(retryStrategy: RetryStrategy, extraKey?: string): boolean {
    let queryStringKey: ErrorRetryParamKey = 'bO';

    // if we didn't find it, then let's add it
    const params = getQueryStringParameters(window.location);
    for (const key of Object.keys(extraQueryStringParameters)) {
        params[key] = extraQueryStringParameters[key];
    }
    const hasRetryStrategy = params[queryStringKey] !== retryStrategy.strategy;
    if (hasRetryStrategy) {
        params[queryStringKey] = retryStrategy.strategy;
        params['sessionId'] = getSessionId();
        if (extraKey) {
            params[extraKey] = '';
        }
        redirectToUrlAfterTimeout(`?${stringify(params)}`, retryStrategy.timeout || 0);
    }

    return hasRetryStrategy;
}

function redirectToUrlAfterTimeout(url: string, timeout: number) {
    if (timeout > 0) {
        setTimeout(() => {
            window.location.search = url;
        }, timeout);
    } else {
        window.location.search = url;
    }
}

export function addQueryStringParameterForRedirect(key: string, value: string) {
    extraQueryStringParameters[key] = value;
}
