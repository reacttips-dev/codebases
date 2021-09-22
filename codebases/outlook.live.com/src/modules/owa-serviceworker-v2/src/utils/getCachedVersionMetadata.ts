import type VersionMetadata from '../types/VersionMetadata';
import { MetadataVersionField, MetadataCacheName } from '../settings';
import { openCache } from '../utils/cacheUtils';

let cachedVersionMetadata: Promise<VersionMetadata>;
export default function getCachedVersionMetadata(): Promise<VersionMetadata> {
    if (!cachedVersionMetadata) {
        cachedVersionMetadata = openCache(MetadataCacheName)
            .then(cache => cache && cache.match(MetadataVersionField))
            .then(response => response?.json());
    }
    return cachedVersionMetadata;
}
