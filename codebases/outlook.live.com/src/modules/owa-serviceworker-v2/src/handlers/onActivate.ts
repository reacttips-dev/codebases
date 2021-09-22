import * as trace from '../utils/trace';
import getCachedVersionMetadata from '../utils/getCachedVersionMetadata';
import { cacheVersion, MetadataVersionField, MetadataCacheName, swVersion } from '../settings';
import type VersionMetadata from '../types/VersionMetadata';
import { logError } from '../analytics/logDatapoint';
import { put, openCache } from '../utils/cacheUtils';

declare var self: ServiceWorkerGlobalScope;

export function onActivate(event: ExtendableEvent) {
    const endGroupTrace = trace.group('InstallCache');
    trace.log('OnActivate');
    event.waitUntil(
        Promise.all([
            self.clients.claim(),
            upgradeCacheSchema()
                .catch(error => {
                    logError(error, 'Activate');
                    return Promise.resolve(null);
                })
                .then(endGroupTrace),
        ])
    );
}

async function upgradeCacheSchema(): Promise<void> {
    const versionMetadata = await getCachedVersionMetadata();
    // If this is the first installation or cache version has changed then drop all the caches for the given scope and update the metadata table with new versions
    if (!versionMetadata || versionMetadata.cacheVersion !== cacheVersion) {
        trace.log('Upgrading cache schema');
        const cacheNames = await self.caches.keys();
        await Promise.all(cacheNames.map(c => self.caches.delete(c)));
        const metaCache = await openCache(MetadataCacheName);
        if (metaCache) {
            const newVersionMetadata: VersionMetadata = { swVersion, cacheVersion };
            await put(
                metaCache,
                MetadataVersionField,
                new Response(JSON.stringify(newVersionMetadata))
            );
        }
    }
}
