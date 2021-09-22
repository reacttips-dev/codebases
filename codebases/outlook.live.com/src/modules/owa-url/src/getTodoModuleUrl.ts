import { getUrlWithAddedQueryParameters } from './index';
import { nodeParseQueryString } from 'owa-querystring';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

const FALLBACK_TODO_APP_LINK = 'https://to-do.microsoft.com';

export default function getTodoModuleUrl(utmSource?: string, removeFromOwa?: boolean): string {
    const userConfig = getUserConfiguration();
    const userOptions = userConfig.UserOptions;
    const upn = userConfig.SessionSettings?.UserPrincipalName;

    let url = FALLBACK_TODO_APP_LINK;
    let queryParams = {};

    if (userOptions?.ReactOptinSettings?.TasksRedirectUrl) {
        let queryString = '';
        [url, queryString] = userOptions.ReactOptinSettings.TasksRedirectUrl.split('?');
        queryParams = nodeParseQueryString(queryString);

        if (upn) {
            queryParams['auth_upn'] = upn;
        }
    }
    if (utmSource) {
        queryParams['utm_source'] = utmSource;
    }
    if (removeFromOwa) {
        delete queryParams['fromOwa'];
    }

    if (Object.keys(queryParams).length > 0) {
        return getUrlWithAddedQueryParameters(url, queryParams);
    }

    return url;
}
