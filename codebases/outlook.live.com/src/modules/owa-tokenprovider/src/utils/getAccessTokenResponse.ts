import type TokenResponse from 'owa-service/lib/contract/TokenResponse';
import type AccessTokenResponse from '../schema/AccessTokenResponse';
import type AccessTokenError from '../schema/AccessTokenError';

/**
 * Returns an response of type AccessTokenResponse that has the access token issued
 * and a suberrorcode if token fetching failed due to AdalException. Some of the
 * possible values are: interaction_required, login_required etc. (these are an indication
 * that AAD did not issue a token to OWA until user/ partner teams remediate it)
 */
export default function getAccessTokenResponse(tokenResponse: TokenResponse): AccessTokenResponse {
    let accessTokenError: AccessTokenError = {
        subErrorCode: tokenResponse?.SubErrorCode,
    };

    let accessTokenResponse: AccessTokenResponse = {
        error: accessTokenError,
        accessToken: tokenResponse?.AccessToken,
    };

    return accessTokenResponse;
}
