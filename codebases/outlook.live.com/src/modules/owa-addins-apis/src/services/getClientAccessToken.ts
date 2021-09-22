import type ClientAccessTokenRequestType from 'owa-service/lib/contract/ClientAccessTokenRequestType';
import type ClientAccessTokenType from 'owa-service/lib/contract/ClientAccessTokenType';
import type GetClientAccessTokenJsonResponse from 'owa-service/lib/contract/GetClientAccessTokenJsonResponse';
import getClientAccessTokenOperation from 'owa-service/lib/operation/getClientAccessTokenOperation';
import getClientAccessTokenRequest from 'owa-service/lib/factory/getClientAccessTokenRequest';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';

// TODO: Remove this when owa-service has a true enum for ClientAccessTokenType
export const UserIdentityTokenType: ClientAccessTokenType = 'CallerIdentity';
export const ScopedTokenType: ClientAccessTokenType = 'ScopedToken';
export const RestTokenType: ClientAccessTokenType = 'ExtensionRestApiCallback';
export const ExtensionCallbackTokenType: ClientAccessTokenType = 'ExtensionCallback';

export function getClientAccessToken(
    extensionId: string,
    tokenTypes: ClientAccessTokenType[],
    scope: string
): Promise<GetClientAccessTokenJsonResponse> {
    const tokenRequests: ClientAccessTokenRequestType[] = new Array(tokenTypes.length);

    tokenTypes.forEach(
        (tokenType, index) =>
            (tokenRequests[index] = { TokenType: tokenType, Id: extensionId, Scope: scope })
    );

    const request = getClientAccessTokenRequest({ TokenRequests: tokenRequests });

    return getClientAccessTokenOperation({ Header: getJsonRequestHeader(), Body: request });
}
