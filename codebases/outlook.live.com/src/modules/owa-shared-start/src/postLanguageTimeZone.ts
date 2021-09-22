import getScopedPath from 'owa-url/lib/getScopedPath';
import joinPath, { ensureLeadingSlash } from 'owa-url/lib/joinPath';
import { getOwaCanaryCookie } from 'owa-service/lib/canary';
import { getConfig } from 'owa-service/lib/config';
import { getOwsPath } from 'owa-config';

// TODO: Needs to handle IE11 which doesn't provide timezone
// https://outlookweb.visualstudio.com/Outlook%20Web/_workitems/edit/58316
export async function postLanguageTimeZone(): Promise<Response> {
    let timeZone = 'UTC';

    if (window.Intl && typeof window.Intl === 'object') {
        const options = window.Intl.DateTimeFormat().resolvedOptions();
        if (options?.timeZone) {
            timeZone = options.timeZone;
        }
    }

    const scopedPath = getScopedPath(getOwsPath());
    const languagePostEndpoint = ensureLeadingSlash(joinPath(scopedPath, 'lang.owa'));
    const languagePostHeaders = new Headers();
    const languagePostBody = `localeName=${window.navigator.language}&tzid=${timeZone}&saveLanguageAndTimezone=1`;
    const serviceConfig = getConfig();

    languagePostHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    languagePostHeaders.append('X-OWA-CANARY', getOwaCanaryCookie());

    if (!!serviceConfig && serviceConfig.getAuthToken) {
        const authToken = await serviceConfig.getAuthToken();
        if (authToken) {
            languagePostHeaders.append('Authorization', authToken);
        }
    }

    return fetch(languagePostEndpoint, {
        method: 'POST',
        credentials: 'include',
        headers: languagePostHeaders,
        body: languagePostBody,
    });
}
