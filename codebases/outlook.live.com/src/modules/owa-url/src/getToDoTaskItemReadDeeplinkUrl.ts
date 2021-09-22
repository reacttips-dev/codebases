import { convertEwsIdToRestId } from 'owa-identifiers';
import { nodeParseQueryString, stringify } from 'owa-querystring';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

const FALLBACK_TODO_APP_LINK = 'https://to-do.microsoft.com';

export default function getToDoTaskItemReadDeeplinkUrl(
    taskId: string,
    utmSource?: string,
    removeFromOwa?: boolean
): string {
    const userConfig = getUserConfiguration();
    const userOptions = userConfig.UserOptions;
    const upn = userConfig.SessionSettings?.UserPrincipalName;

    let url = FALLBACK_TODO_APP_LINK;
    if (userOptions?.ReactOptinSettings?.TasksRedirectUrl) {
        url = userOptions.ReactOptinSettings.TasksRedirectUrl;
    }

    const segments = url.split('/');
    const [protocol, , host] = segments;

    const queryParams = nodeParseQueryString(url.slice(url.indexOf('?') + 1));
    if (upn) {
        queryParams['auth_upn'] = upn;
    }
    if (utmSource) {
        queryParams['utm_source'] = utmSource;
    }
    if (removeFromOwa) {
        delete queryParams['fromOwa'];
    }

    return `${protocol}//${host}/tasks/id/${convertEwsIdToRestId(taskId)}/details?${stringify(
        queryParams
    )}`;
}
