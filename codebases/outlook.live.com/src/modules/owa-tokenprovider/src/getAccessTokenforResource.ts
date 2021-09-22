import * as MemoryCache from 'memory-cache';
import addMinutes from 'owa-date-utc-fn/lib/addMinutes';
import addSeconds from 'owa-date-utc-fn/lib/addSeconds';
import {
    SCENARIO_NAME,
    getAccessTokenforResourceFromServerOrHostAppWithRetry,
} from './getAccessTokenforResourceFromServerOrHostApp';
import type TokenResponse from 'owa-service/lib/contract/TokenResponse';
import TokenResponseCode from 'owa-service/lib/contract/TokenResponseCode';
import { isFeatureEnabled } from 'owa-feature-flags';
import { enqueue } from './utils/accessTokenForResourceQueue';
import {
    getCachedPromiseForTokenRequest,
    removeCachedPromiseForTokenRequest,
    putPromiseForTokenRequestInCache,
} from './utils/tokenRequestPromiseCache';
import { logStartUsage } from 'owa-analytics-start';
import { getGuid } from 'owa-guid';
import type AccessTokenResponse from './schema/AccessTokenResponse';
import getAccessTokenResponse from './utils/getAccessTokenResponse';

const MIN_TIME_TO_EXPIRY_IN_MINUTES = 1;
const TIME_BEFORE_EXPIRY_TO_REFRESH_IN_MILLISECONDS = 8 * 1000; //try to refresh token 8 seconds before the token expiry
const NUM_OF_RETRIES = 3;
const RETRY_DELAY = 1500;

let cache: MemoryCache = null;

export function initializeTokenProvider(cacheObject: MemoryCache): void {
    cache = cacheObject;
}

export async function getAccessTokenforResource(
    resource: string,
    apiName?: string,
    requestId?: string,
    targetTenantId?: string,
    wwwAuthenticateHeader?: string,
    preferIdpToken?: boolean
): Promise<string | undefined> {
    requestId = requestId || getGuid();
    let [token, tokenPromise] = getAccessTokenforResourceAsLazy(
        resource,
        apiName,
        requestId,
        targetTenantId,
        wwwAuthenticateHeader,
        false /*showFullTokenResponse*/,
        preferIdpToken
    );

    if (!token) {
        token = (await tokenPromise) as string;
    }

    return token as string;
}

/**
 * Fetches the access token and returns the token immediately if it's cached, or if it's not cached, return the promise
 * that will return the access token
 * @param resource - the resource string
 * @param apiName - this can be used in case multiple apis are called from the same resource
 * @param requestId - the request correlation Id
 * @param targetTenantId - the tenantid for which the token is requested
 * @param wwwAuthenticateHeader - the WWW Authenticate Header
 * @param showFullTokenResponse - whether full token response with error should be returned
 * @param preferIdpToken - request the auth service to send an AAD token
 * @returns [0] - The AcccessToken Response or access token if it can be returned synchronously, null otherwise
 * @returns [1] - The promise that will return the AcccessToken Response or access token if it needs to be fetched async, null if token is returned synchronously.
 */
export function getAccessTokenforResourceAsLazy(
    resource: string,
    apiName?: string,
    requestId?: string,
    targetTenantId?: string,
    wwwAuthenticateHeader?: string,
    showFullTokenResponse?: boolean,
    preferIdpToken?: boolean
): [
    string | AccessTokenResponse | undefined,
    Promise<string | AccessTokenResponse | undefined> | undefined
] {
    requestId = requestId || getGuid();
    const cacheKey = getKey(resource, targetTenantId, preferIdpToken);
    let tokenResponse;

    if (!wwwAuthenticateHeader) {
        tokenResponse = getCachedToken(getCache(), cacheKey);
    }

    if (tokenResponse) {
        return [
            showFullTokenResponse
                ? getAccessTokenResponse(tokenResponse)
                : tokenResponse.AccessToken,
            undefined,
        ];
    } else {
        let cachedPromiseForResource = getCachedPromiseForTokenRequest(cacheKey);
        let promiseForResource;

        if (cachedPromiseForResource) {
            promiseForResource = cachedPromiseForResource;
        } else {
            promiseForResource = enqueue(
                resource,
                requestId,
                apiName,
                targetTenantId,
                wwwAuthenticateHeader,
                preferIdpToken
            );
            putPromiseForTokenRequestInCache(cacheKey, promiseForResource);
        }

        return [
            undefined,
            promiseForResource
                .then(value => {
                    removeCachedPromiseForTokenRequest(cacheKey);
                    return showFullTokenResponse
                        ? getAccessTokenResponse(value)
                        : value.AccessToken;
                })
                .catch(error => {
                    removeCachedPromiseForTokenRequest(cacheKey);
                    logStartUsage(
                        SCENARIO_NAME,
                        {
                            category: 'Promise_For_Token_Request_Failed',
                            err: error ? error.toString() : '',
                            message: error ? error.message : '',
                            stk: error ? error.stack : '',
                            resource: resource,
                            requestId: requestId,
                            targetTenantId: targetTenantId || '',
                            api: apiName,
                            wwwAuthenticateHeader: wwwAuthenticateHeader || '',
                            showFullTokenResponse: showFullTokenResponse || false,
                        },
                        {
                            isCore: isFeatureEnabled('auth-logAllDataPointForTokenFetching'),
                        }
                    );
                    return undefined;
                }),
        ];
    }
}

export async function fetchAndCacheTokenForResource(
    resource: string,
    apiName: string | undefined,
    requestId: string,
    targetTenantId?: string,
    wwwAuthenticateHeader?: string,
    preferIdpToken?: boolean
): Promise<TokenResponse> {
    let tokenResponse = await getAccessTokenforResourceFromServerOrHostAppWithRetry(
        resource,
        NUM_OF_RETRIES,
        RETRY_DELAY,
        requestId,
        apiName,
        targetTenantId,
        wwwAuthenticateHeader,
        preferIdpToken
    );

    if (
        tokenResponse != null &&
        tokenResponse.TokenResultCode == TokenResponseCode.Success &&
        tokenResponse.AccessTokenExpiry != null
    ) {
        if (tokenResponse.ExpiresIn && tokenResponse.ExpiresIn > 0) {
            tokenResponse.AccessTokenExpiry = addSeconds(
                Date.now(),
                tokenResponse.ExpiresIn
            ).toISOString();
        }

        const cacheKey = getKey(resource, targetTenantId, preferIdpToken);
        const cacheTimeout =
            new Date(tokenResponse.AccessTokenExpiry).getTime() -
            Date.now() -
            TIME_BEFORE_EXPIRY_TO_REFRESH_IN_MILLISECONDS;

        if (cacheTimeout > 0) {
            getCache().put(
                cacheKey,
                tokenResponse,
                cacheTimeout,
                function (key: string, value: TokenResponse) {
                    fetchAndCacheTokenForResource(
                        resource,
                        apiName,
                        requestId,
                        targetTenantId,
                        wwwAuthenticateHeader,
                        preferIdpToken
                    ).catch(error => {
                        // Ignore network errors.  If we fail to refresh the token now, the cache will
                        // be repopulated on demand the next time the token is requested.
                        logStartUsage(
                            SCENARIO_NAME,
                            {
                                category: 'Cache_Expired',
                                err: error ? error.toString() : '',
                                message: error ? error.message : '',
                                stk: error ? error.stack : '',
                                resource: key,
                                requestId: requestId,
                                targetTenantId: targetTenantId || '',
                                api: apiName,
                                wwwAuthenticateHeader: wwwAuthenticateHeader || '',
                                preferIdpToken: preferIdpToken,
                            },
                            {
                                isCore: isFeatureEnabled('auth-logAllDataPointForTokenFetching'),
                            }
                        );
                    });
                }
            );
        }
    }

    return tokenResponse;
}

export function getCachedToken(cache: MemoryCache, cacheKey: string): TokenResponse | undefined {
    const cachedToken = cache.get(cacheKey) as TokenResponse;
    let tokenResponse: TokenResponse | undefined = undefined;
    if (cachedToken?.AccessTokenExpiry && cachedToken.AccessToken) {
        const expiryDateTimeWithMargin = addMinutes(
            new Date(cachedToken.AccessTokenExpiry),
            -MIN_TIME_TO_EXPIRY_IN_MINUTES
        );

        // Check that token is valid for at least 1 minute.
        if (expiryDateTimeWithMargin > new Date(Date.now())) {
            tokenResponse = cachedToken;
        }
    }

    return tokenResponse;
}

function getCache(): MemoryCache {
    if (cache == null) {
        cache = new MemoryCache.Cache();
    }

    return cache;
}

export function getKey(
    resource: string,
    targetTenantId?: string,
    preferIdpToken?: boolean
): string {
    let key = resource;

    if (targetTenantId) {
        key += '|' + targetTenantId;
    }

    if (preferIdpToken) {
        key += '|IdpToken';
    }

    return key;
}
