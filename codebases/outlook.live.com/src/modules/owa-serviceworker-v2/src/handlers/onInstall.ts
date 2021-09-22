import { createCacheWrapperFromStorage } from '../cacheWrapperMap';
import getCachedVersionMetadata from '../utils/getCachedVersionMetadata';
import { swVersion, ActiveCacheName } from '../settings';
import * as trace from '../utils/trace';
import { logError } from '../analytics/logDatapoint';
import { openCache } from '../utils/cacheUtils';
import type { ServiceWorkerSource } from 'owa-serviceworker-common/lib/types/ServiceWorkerSource';

declare var self: ServiceWorkerGlobalScope;

interface ExtendableEvent extends Event {
    waitUntil(f: any): void;
}

export function onInstall(event: ExtendableEvent) {
    const endGroupTrace = trace.group('OnInstall');
    event.waitUntil(
        Promise.all([
            populateMemoryFromStorage(),
            getCachedVersionMetadata()
                .then(versionMetadata => {
                    return !versionMetadata || versionMetadata.swVersion != swVersion
                        ? self.skipWaiting()
                        : null;
                })
                .catch(error => {
                    logError(error, 'Upgrade');
                    self.skipWaiting();
                }),
        ]).then(endGroupTrace)
    );
}

export function populateMemoryFromStorage() {
    return openCache(ActiveCacheName)
        .then(cache => {
            if (cache) {
                cache.keys().then(keys => {
                    return Promise.all(
                        keys.map(k =>
                            createCacheWrapperFromStorage(
                                k.url.split('/')[0] as ServiceWorkerSource
                            )
                        )
                    );
                });
            }
        })
        .catch(e => {
            trace.warn('populateMemoryFromStorage error', e);
        });
}
