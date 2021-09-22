import type ClientAccessTokenType from 'owa-service/lib/contract/ClientAccessTokenType';
import type GetClientAccessTokenJsonResponse from 'owa-service/lib/contract/GetClientAccessTokenJsonResponse';
import type GetClientAccessTokenResponseMessage from 'owa-service/lib/contract/GetClientAccessTokenResponseMessage';
import RequestedCapabilities from 'owa-service/lib/contract/RequestedCapabilities';
import type ResponseClass from 'owa-service/lib/contract/ResponseClass';
import type Token from 'owa-service/lib/contract/Token';
import type { IAddinCommand } from 'owa-addins-store';
import {
    cacheToken,
    getToken as getTokenFromCache,
    isCacheableTokenType,
} from './ClientAccessTokenCache';
import {
    ExtensionCallbackTokenType,
    getClientAccessToken,
    RestTokenType,
    ScopedTokenType,
    UserIdentityTokenType,
} from '../../services/getClientAccessToken';

const SuccessResponseClass: ResponseClass = 'Success';

export default async function getTokenForExtension(
    addinCommand: IAddinCommand,
    tokenType: ClientAccessTokenType,
    itemScopeForScopedTokens?: string
): Promise<Token> {
    if (isCacheableTokenType(tokenType)) {
        const token = getTokenFromCache(addinCommand.extension.Id, tokenType);
        if (token) {
            return token;
        }
    }

    const tokenTypes = [];

    if (!getTokenFromCache(addinCommand.extension.Id, UserIdentityTokenType)) {
        tokenTypes.push(UserIdentityTokenType);
    }

    if (
        addinCommand.extension.RequestedCapabilities == RequestedCapabilities.ReadWriteMailbox &&
        !getTokenFromCache(addinCommand.extension.Id, ExtensionCallbackTokenType)
    ) {
        tokenTypes.push(ExtensionCallbackTokenType);
    }

    if (tokenType == RestTokenType || tokenType == ScopedTokenType) {
        tokenTypes.push(tokenType);
    }

    let response;
    try {
        response = await getClientAccessToken(
            addinCommand.extension.Id,
            tokenTypes,
            itemScopeForScopedTokens
        );
    } catch (error) {
        // The service logs the failure and why it failed.
        // Since we can't do anything about the failure, we
        // return a null token and the API responds with a
        // GenericTokenError
        return null;
    }

    const items = cacheTokensAndGetResponseMessages(response);
    return getTokenByType(tokenType)(items);
}

function cacheTokensAndGetResponseMessages(
    response: GetClientAccessTokenJsonResponse
): GetClientAccessTokenResponseMessage[] {
    response.Body.ResponseMessages.Items.forEach(tryCacheToken);
    return response.Body.ResponseMessages.Items;
}

function tryCacheToken(tokenResponse: GetClientAccessTokenResponseMessage) {
    if (
        tokenResponse.ResponseCode == 'NoError' &&
        tokenResponse.ResponseClass == SuccessResponseClass &&
        isCacheableTokenType(tokenResponse.Token.TokenType)
    ) {
        cacheToken(tokenResponse.Token.Id, tokenResponse.Token);
    }
}

const getTokenByType = (tokenType: ClientAccessTokenType) => (
    responses: GetClientAccessTokenResponseMessage[]
): Token => {
    const response = responses.filter(isRequestedTokenType(tokenType))[0];
    return response ? response.Token : null;
};

const isRequestedTokenType = (tokenType: ClientAccessTokenType) => (
    tokenResponse: GetClientAccessTokenResponseMessage
): boolean => {
    return (
        tokenResponse.ResponseCode == 'NoError' &&
        tokenResponse.ResponseClass == SuccessResponseClass &&
        tokenResponse.Token.TokenType == tokenType
    );
};
