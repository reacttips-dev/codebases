import { getQueryStringParameters } from 'owa-querystring';
import { getSessionId } from 'owa-config';
import getRootVdirName from 'owa-url/lib/getRootVdirName';
import getScopedPath from 'owa-url/lib/getScopedPath';
import { getHostLocation } from 'owa-url/lib/hostLocation';
import getUrlWithAddedQueryParameters from 'owa-url/lib/getUrlWithAddedQueryParameters';
import { OwaWebServerAuthState } from 'owa-service/lib/types/OwaWebServerAuthState';
import getPathForAuthRedirect from 'owa-url/lib/getFullPathForAuthRedirect';

const STATE_QUERY_PARAM_KEY = 'state';

export function redirect(
    location: Location,
    queryStringKey: string,
    value: string,
    addSessionId?: boolean,
    shouldAddStateParam?: boolean
): boolean {
    // if we didn't find it, then let's add it
    const params = getQueryStringParameters(location);
    const hasQueryStringParam = params[queryStringKey] !== value;
    if (hasQueryStringParam) {
        params[queryStringKey] = value;
        if (addSessionId) {
            params['sessionId'] = getSessionId();
        }

        const vdir = getRootVdirName() || 'mail';
        let rootPath = `${getScopedPath(`/${vdir}`)}/`;

        if (shouldAddStateParam) {
            params[STATE_QUERY_PARAM_KEY] = OwaWebServerAuthState.Login;
            rootPath = `${getPathForAuthRedirect(`/${vdir}`)}`;
        }

        location.assign(getUrlWithAddedQueryParameters(rootPath, params));
    }

    return hasQueryStringParam;
}

export function redirectTo(url: string): true {
    getHostLocation().assign(url);
    return true;
}
