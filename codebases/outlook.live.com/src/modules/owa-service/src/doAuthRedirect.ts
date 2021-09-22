import { stringify, getQueryStringParameters } from 'owa-querystring';
import { OwaWebServerAuthState } from './types/OwaWebServerAuthState';
import { getHostLocation } from './getHostLocation';

let isErrorAlreadyHandled: boolean = false;
export function doAuthRedirect(headers?: Headers) {
    if (!isErrorAlreadyHandled) {
        isErrorAlreadyHandled = true;
        const loc = getHostLocation();
        const query = getQueryStringParameters(loc);
        let needsRedirect = false;

        const claimsChallengeQuery = headers ? headers.get('X-OWA-ClaimChallenge') : undefined;
        if (claimsChallengeQuery && query.cc !== claimsChallengeQuery) {
            query.cc = decodeURIComponent(claimsChallengeQuery);
            needsRedirect = true;
        }

        if (query.authRedirect === undefined) {
            query.authRedirect = 'true';
            needsRedirect = true;
        }

        if (needsRedirect) {
            query.state = OwaWebServerAuthState.Login;
            loc.search = '?' + stringify(query);
        }
    }
}

export function test_reset() {
    isErrorAlreadyHandled = false;
}
