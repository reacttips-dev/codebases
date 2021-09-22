import deleteSsoApiCallback from '../utils/deleteSsoApiCallback';
import invokeSsoApiCallback from '../utils/invokeSsoApiCallback';
import mapAdalErrorToSsoApiError from '../utils/mapAdalErrorToSsoApiError';
import { getAccessTokenOnBehalfOfResource } from 'owa-tokenprovider';
import { getWebApplicationResourceForAddin } from 'owa-addins-store';
// eslint-disable-next-line node/no-deprecated-api
import { resolve as urlResolve } from 'url';

const ADDIN_CLIENT_ID: string = 'bc59ab01-8403-45c6-8796-ac3ef710b3e3'; // Exchange AAD application id
const RELATIVE_REDIRECT_URL: string = '/owa/extSSO.aspx';

export default function getAccessTokenOnBehalfOfAddin(
    controlId: string,
    authChallenge: string,
    allowConsentPrompt: boolean
): void {
    const addinResource = getWebApplicationResourceForAddin(controlId);
    const redirectUri = getRedirectUri();

    try {
        getAccessTokenOnBehalfOfResource(
            ADDIN_CLIENT_ID,
            redirectUri,
            addinResource,
            authChallenge,
            allowConsentPrompt,
            getAccessTokenCallbackMethod
        );
    } catch (error) {
        getAccessTokenCallbackMethod(error, undefined);
    }
}

function getRedirectUri(): string {
    return urlResolve(window.location.origin, RELATIVE_REDIRECT_URL);
}

export function getAccessTokenCallbackMethod(error: string, token: string): void {
    if (token) {
        invokeSsoApiCallback(null /* error */, token);
    } else {
        invokeSsoApiCallback(mapAdalErrorToSsoApiError(error));
    }
    deleteSsoApiCallback();
}
