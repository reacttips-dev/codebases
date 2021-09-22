import getBasePath from './getBasePath';
import { getQueryStringParameters, stringify } from 'owa-querystring';
import { removeHostedQueryParameters } from './removeHostedQueryParameters';

// Deeplink url without vdir, e.g.: deeplink/, 0/deeplink/
const DEEPLINK_URL = getBasePath().split('/').slice(1).join('/') + 'deeplink/';

/**
 * Get url for popout window, e.g. /mail/deeplink/compose
 * @param vdir Vdir of the popout window, either mail or calendar
 * @param route Route of the popout window, e.g. compose
 * @param skipOptInCheck Whether skip optIn check. When set to true, a param "minus" will be added to the url
 * @param parameters Additional parameters to put into querystring
 */
export default function getPopoutUrl(
    vdir: 'mail' | 'calendar',
    route: string,
    skipOptInCheck?: boolean,
    parameters?: Record<string, string>
) {
    if (skipOptInCheck) {
        // Adding "minus" as query parameter will skip optIn check and enable deeplink for users
        // who are opted-in to People app but not to Mail app
        parameters = parameters || {};
        parameters.minus = '';
    }

    let search = '';
    if (parameters) {
        const paramPairs = getQueryStringParameters();

        // Remove any OPX-specific parameters to allow popout deeplinks launched from OPX to work correctly
        removeHostedQueryParameters(paramPairs);

        // Add any additional parameters
        Object.keys(parameters)
            .filter(p => p)
            .forEach(key => (paramPairs[key] = parameters![key]));
        search = '?' + stringify(paramPairs);
    }

    let deepLinkUrl = `/${vdir}/${DEEPLINK_URL}`;

    return `${deepLinkUrl}${route}${search}`;
}
