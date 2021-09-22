import type { ServiceWorkerSource } from 'owa-serviceworker-common/lib/types/ServiceWorkerSource';
import type CacheWrapper from './types/CacheWrapper';
import { ActiveCacheName } from './settings';
import { put, openCache } from './utils/cacheUtils';
import * as trace from './utils/trace';

const ScopePointerPrefix = 'https://active/';

let scopeToCacheMap: { [k in ServiceWorkerSource]?: CacheWrapper } = {};
export function updateCacheWrapper(scope: ServiceWorkerSource, wrapper: CacheWrapper) {
    // delete the old cache. We don't need to wait for it
    const oldWrapper = scopeToCacheMap[scope];
    if (oldWrapper) {
        trace.log(`Deleting old wrapper ${oldWrapper.name}`);
        self.caches.delete(oldWrapper.name);
    }
    scopeToCacheMap[scope] = wrapper;
    return getActiveCache().then(
        cache => !!cache && put(cache, ScopePointerPrefix + scope, new Response(wrapper.name))
    );
}

export async function getCacheWrapper(
    scope: ServiceWorkerSource
): Promise<CacheWrapper | undefined> {
    if (!scopeToCacheMap[scope]) {
        // if we don't have a cache wrapper in memory then we will construct one
        // based on the CacheStorage
        await createCacheWrapperFromStorage(scope);
    } else if (!(await self.caches.has(scopeToCacheMap[scope]!.name))) {
        // if we do have the cache wrapper, let's verify that it exists and delete it if it doesn't
        trace.log(
            `Cache no longer exists so clean up memory:scope=${scope},name=${
                scopeToCacheMap[scope]!.name
            }`
        );
        delete scopeToCacheMap[scope];
    }

    return scopeToCacheMap[scope];
}

export function getCacheWrapperSync(scope: ServiceWorkerSource): CacheWrapper | undefined {
    return scopeToCacheMap[scope];
}

export function getResourceScope(url: string): CacheWrapper | null {
    const scopes = Object.keys(scopeToCacheMap);
    for (const scope of scopes) {
        if (scopeToCacheMap[scope].requestMap[url]) {
            return scopeToCacheMap[scope];
        }
    }
    return null;
}

export function getCachedRequestMatch(match: string): string | undefined {
    const scopes = Object.keys(scopeToCacheMap);
    for (const scope of scopes) {
        const requests = Object.keys(scopeToCacheMap[scope].requestMap);
        for (const request of requests) {
            if (request.indexOf(match) > -1) {
                return request;
            }
        }
    }
    return undefined;
}

export async function createCacheWrapperFromStorage(scope: ServiceWorkerSource): Promise<void> {
    const activeCache = await getActiveCache();
    if (activeCache) {
        const name = await activeCache
            .match(ScopePointerPrefix + scope)
            .then(response => response && response.text());
        if (name && (await self.caches.has(name))) {
            const cache = await openCache(name);
            if (cache) {
                trace.log(`Add cachewrapper from storage to memory: scope=${scope},name=${name}`);
                const cacheKeys = await cache.keys();
                scopeToCacheMap[scope] = {
                    name,
                    scope,
                    version: name.split('_')[1],
                    cache,
                    requestMap: cacheKeys.reduce((agg, x) => {
                        agg[x.url] = true;
                        return agg;
                    }, {}),
                };
            }
        }
    }
}

export async function deleteScopeWrapper(scope: ServiceWorkerSource): Promise<boolean[]> {
    const activeCache = await getActiveCache();
    if (activeCache) {
        const promises = [activeCache.delete(ScopePointerPrefix + scope)];
        const wrapper = scopeToCacheMap[scope];
        if (wrapper) {
            trace.log(`Delete cache wrapper: scope=${scope}, name=${wrapper.name}`);
            promises.push(self.caches.delete(wrapper.name));
            delete scopeToCacheMap[scope];
        }
        return Promise.all(promises);
    }
    return [];
}

export function test_reset() {
    scopeToCacheMap = {};
}

function getActiveCache(): Promise<Cache | null> {
    return openCache(ActiveCacheName);
}
