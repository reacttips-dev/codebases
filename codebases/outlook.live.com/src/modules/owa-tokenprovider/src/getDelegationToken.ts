import * as MemoryCache from 'memory-cache';
import type TokenResponse from 'owa-service/lib/contract/TokenResponse';
import TokenResponseCode from 'owa-service/lib/contract/TokenResponseCode';
import { Options } from './fetchDelegationAccessTokenFromMsa';
import {
    getCachedPromiseForTokenRequest,
    putPromiseForTokenRequestInCache,
    removeCachedPromiseForTokenRequest,
} from './utils/tokenRequestPromiseCache';
import { enqueue } from './utils/delegationTokenQueue';
import { logStartUsage } from 'owa-analytics-start';
import { getOrigin } from 'owa-url/lib/getOrigin';
import { getGuid } from 'owa-guid';

let cache: MemoryCache = null;
const SCENARIO_NAME = 'OWA_GetDelegationAccessToken';
const AUTHORIZATION_URI = 'https://login.live.com/oauth20_authorize.srf';
const RETURN_URL_PATH = '/owa/auth/dt.aspx';
const CLIENT_ID = '292841';

export async function getDelegationTokenForOwa(
    scope: string,
    apiName?: string,
    requestId?: string
): Promise<string | undefined> {
    let options: Options = {
        scope: scope,
        client_id: '',
        authorization_uri: '',
        redirect_uri: '',
        requestId: requestId || getGuid(),
    };
    let accessToken: string | undefined;

    try {
        return await getDelegationToken(getAuthUrlFromConfig(options));
    } catch (exception) {
        logStartUsage(SCENARIO_NAME + ' GetDelegationToken Operation failed ', {
            err: exception.toString(),
            message: exception.message,
            stk: exception.stack || '',
            scope: scope,
            requestId: options.requestId,
            api: apiName,
        });
        return accessToken;
    }
}

export async function getDelegationToken(
    opts: Options,
    apiName?: string
): Promise<string | undefined> {
    let cacheKey = opts.client_id + opts.scope;
    let tokenResponse = getCachedToken(getCache(), cacheKey);

    if (tokenResponse?.AccessToken) {
        return tokenResponse.AccessToken;
    } else {
        let cachedPromiseForToken = getCachedPromiseForTokenRequest(cacheKey);
        let promiseForToken;

        if (cachedPromiseForToken) {
            promiseForToken = cachedPromiseForToken;
        } else {
            promiseForToken = enqueue(opts);
            putPromiseForTokenRequestInCache(cacheKey, promiseForToken);
        }

        return promiseForToken
            .then(value => {
                cacheToken(cacheKey, value);
                removeCachedPromiseForTokenRequest(cacheKey);
                return value.AccessToken;
            })
            .catch(error => {
                removeCachedPromiseForTokenRequest(cacheKey);
                logStartUsage(SCENARIO_NAME, {
                    category: 'Promise_For_Token_Request_Failed',
                    err: error ? error.toString() : '',
                    message: error ? error.message : '',
                    scope: opts.scope,
                    requestId: opts.requestId,
                    api: apiName,
                });
                return undefined;
            });
    }
}

export function cacheToken(cacheKey: string, tokenResponse: TokenResponse) {
    if (
        tokenResponse &&
        tokenResponse.TokenResultCode == TokenResponseCode.Success &&
        tokenResponse.AccessTokenExpiry
    ) {
        const cacheTimeout = new Date(tokenResponse.AccessTokenExpiry).getTime() - Date.now();
        if (cacheTimeout > 0) {
            getCache().put(cacheKey, tokenResponse, cacheTimeout);
        }
    }
}

export function initializeTokenProvider(cacheObject: MemoryCache): void {
    cache = cacheObject;
}

function getCache(): MemoryCache {
    if (cache == null) {
        cache = new MemoryCache.Cache();
    }

    return cache;
}

function getAuthUrlFromConfig(opts: Options): Options {
    opts.redirect_uri = getOrigin() + RETURN_URL_PATH;
    opts.authorization_uri = AUTHORIZATION_URI;
    opts.client_id = CLIENT_ID;
    return opts;
}

export function getCachedToken(cache: MemoryCache, cacheKey: string): TokenResponse | undefined {
    const cachedToken = cache.get(cacheKey) as TokenResponse;
    let tokenResponse: TokenResponse | undefined = undefined;
    if (cachedToken?.AccessTokenExpiry) {
        const expiryDateTime = new Date(cachedToken.AccessTokenExpiry);

        if (expiryDateTime > new Date(Date.now())) {
            tokenResponse = cachedToken;
        }
    }

    return tokenResponse;
}
