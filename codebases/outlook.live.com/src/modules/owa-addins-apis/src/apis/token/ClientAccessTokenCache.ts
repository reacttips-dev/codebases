import { format } from 'owa-localize';
import type ClientAccessTokenType from 'owa-service/lib/contract/ClientAccessTokenType';
import type Token from 'owa-service/lib/contract/Token';

import { TokenTypeNotSupportedForCaching } from '../../utils/ExceptionConstants';
import {
    ExtensionCallbackTokenType,
    UserIdentityTokenType,
} from '../../services/getClientAccessToken';

const TTL_ERROR_MARGIN_IN_MIN = 15;

export interface CacheEntry {
    token: Token;
    cacheTime: number;
}

type TokenCache = { [extensionId: string]: CacheEntry };
const cachedUserIdentityTokens: TokenCache = {};
const cachedEwsTokens: TokenCache = {};

export function cacheToken(extensionId: string, token: Token) {
    const cache: TokenCache = getCache(token.TokenType);
    cache[extensionId] = createCacheEntry(token);
}

export function getToken(extensionId: string, type: ClientAccessTokenType): Token {
    const cache: TokenCache = getCache(type);

    if (hasToken(extensionId, type)) {
        const token = cache[extensionId].token;
        return token;
    }
    return null;
}

export function isCacheableTokenType(tokenType: ClientAccessTokenType): boolean {
    return tokenType == UserIdentityTokenType || tokenType == ExtensionCallbackTokenType;
}

function hasToken(extensionId: string, type: ClientAccessTokenType) {
    const cache: TokenCache = getCache(type);
    if (!!cache[extensionId] && isExpired(cache[extensionId])) {
        delete cache[extensionId];
    }

    return !!cache[extensionId];
}

export function getCache(type: ClientAccessTokenType) {
    switch (type) {
        case UserIdentityTokenType:
            return cachedUserIdentityTokens;
        case ExtensionCallbackTokenType:
            return cachedEwsTokens;
        default:
            throw format(TokenTypeNotSupportedForCaching, type);
    }
}

function createCacheEntry(token: Token) {
    return { cacheTime: Date.now(), token };
}

function isExpired(entry: CacheEntry) {
    const durationInMilliseconds = Date.now() - entry.cacheTime;
    const effectiveTTLInMilliseconds = (entry.token.TTL - TTL_ERROR_MARGIN_IN_MIN) * 1000 * 60;
    return durationInMilliseconds >= effectiveTTLInMilliseconds;
}
