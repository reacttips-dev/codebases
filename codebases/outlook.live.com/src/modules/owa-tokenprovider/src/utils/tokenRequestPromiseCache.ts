import * as MemoryCache from 'memory-cache';
import type TokenResponse from 'owa-service/lib/contract/TokenResponse';

let promiseForTokenRequestCache: MemoryCache = null;
const TIMEOUT_FOR_TOKEN_REQUEST_PROMISE = 30 * 1000;

/**
 * This provides caching to store promise to token request mapping (both business and consumer scenarios).
 * Used when similar requests are made for the same cacheKey, this cache
 * is looked up to return an existing promise to the caller.
 */
function getPromiseForTokenRequestCache(): MemoryCache {
    if (promiseForTokenRequestCache == null) {
        promiseForTokenRequestCache = new MemoryCache.Cache();
    }
    return promiseForTokenRequestCache;
}

export function getCachedPromiseForTokenRequest(cacheKey: string): Promise<TokenResponse> {
    const cachedTokenRequest = getPromiseForTokenRequestCache().get(
        cacheKey
    ) as Promise<TokenResponse>;
    return cachedTokenRequest;
}

export function removeCachedPromiseForTokenRequest(cacheKey: string): boolean {
    return getPromiseForTokenRequestCache().del(cacheKey);
}

export function putPromiseForTokenRequestInCache(
    cacheKey: string,
    promise: Promise<TokenResponse>
) {
    getPromiseForTokenRequestCache().put(cacheKey, promise, TIMEOUT_FOR_TOKEN_REQUEST_PROMISE);
}
