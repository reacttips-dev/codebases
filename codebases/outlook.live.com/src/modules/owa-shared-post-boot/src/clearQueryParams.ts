import { stringify } from 'querystring';
import { getQueryStringParameters } from 'owa-querystring';
import { getOrigin } from 'owa-url';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';

export function clearQueryParams(location: Location, history: History) {
    const parametersToClear: string[] = ['bO', 'bR', 'anonRetry', 'native'];

    // dont clear session id in native host
    if (!isHostAppFeatureEnabled('nativeQsp')) {
        parametersToClear.push('sessionId');
    }

    let params = getQueryStringParameters(location);
    let shouldReplaceUrl = false;

    for (var ii = 0; ii < parametersToClear.length; ii++) {
        const value = parametersToClear[ii];
        if (params[value]) {
            delete params[value];
            shouldReplaceUrl = true;
        }
    }

    if (shouldReplaceUrl) {
        let newQuery = stringify(params);
        if (newQuery) {
            newQuery = `?${newQuery}`;
        }
        const url = `${getOrigin()}${location.pathname}${newQuery}${location.hash}`;
        history.replaceState(null, null, url);
    }
}
