import { markFunction } from 'owa-performance';
import createBootError from './createBootError';
import { getCacheKeys } from './utils/cacheStorageUtils';
import type { ServiceWorkerSource } from 'owa-serviceworker-common/lib/types/ServiceWorkerSource';
import { appendMiscData } from './miscData';
import { getClientVersion } from 'owa-config';

const thirtyDaysInMilleseconds = 2592000000;
const FindManifestKey = 'fme';

export const findManifestExpirationDate = markFunction(function (
    cachesToClean: ServiceWorkerSource | undefined
): Promise<number | null> {
    // browsers like ie11 don't have window.caches feature
    if (!cachesToClean) {
        appendMiscData(FindManifestKey, 'np');
        return Promise.resolve(null);
    }

    const keysPromise = getCacheKeys();
    if (!keysPromise) {
        appendMiscData(FindManifestKey, 'nk');
        return Promise.resolve(null);
    }

    return keysPromise.then(caches => {
        const filteredCaches = caches.filter(c => c.indexOf(cachesToClean) > -1);
        if (filteredCaches.length < 1) {
            appendMiscData(FindManifestKey, 'nc');
            return null;
        }

        // with the new service worker v2 the name of the cache should be in
        // this format. <app>_<version>_<manifest download time>
        // So if the fomrat matches this, we will try to extract the download time
        // we only need to check the cache that matches the current version loading
        const currentClientVersion = getClientVersion();
        for (const filteredCache of filteredCaches) {
            const filteredCacheParts = filteredCache.split('_');
            if (filteredCacheParts.length == 3 && currentClientVersion == filteredCacheParts[1]) {
                const manifestDate = parseInt(filteredCacheParts[2]);
                if (!isNaN(manifestDate)) {
                    appendMiscData(FindManifestKey, 'cn');
                    return manifestDate + thirtyDaysInMilleseconds;
                }
            }
        }

        if (process.env.__DEPRECATE_SW_V1__) {
            appendMiscData(FindManifestKey, 'n');
            return null;
        } else {
            filteredCaches.sort();
            const activeCacheName = filteredCaches[filteredCaches.length - 1];
            let activeCache: Cache | null;
            return window.caches
                .open(activeCacheName)
                .then(cache => {
                    activeCache = cache;
                    return cache && cache.keys();
                })
                .then(activeCacheKeys => {
                    if (activeCacheKeys) {
                        var requests = activeCacheKeys.filter(
                            key => key?.url && key.url.indexOf('.manifest') > -1
                        );
                        if (activeCache && requests && requests.length > 0) {
                            return activeCache.match(requests[0]);
                        }
                    }
                    return null;
                })
                .then(response => response && response.json())
                .then(manifest => {
                    if (manifest) {
                        // If we have a manifest but no date, then it is an old manifest so we should expire it
                        if (!manifest.date) {
                            throw createBootError(new Error('ManifestNoDate'), 'ExpiredBuild');
                        }
                        return new Date(manifest.date).getTime() + thirtyDaysInMilleseconds;
                    }
                    return null;
                })
                .catch(e => {
                    throw createBootError(e, 'Preboot');
                });
        }
    });
},
FindManifestKey);
