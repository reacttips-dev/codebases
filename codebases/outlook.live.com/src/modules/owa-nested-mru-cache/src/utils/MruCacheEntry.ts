import { CACHE_ENTRY_TIME_TO_LIVE } from './NestedMruCacheDefaults';

/**
 * Base class for the type of cache entry objects stored in every MruCache in NestedMruCache.
 */
export default abstract class MruCacheEntry {
    // Timestamp of cache entry creation
    private cacheTime: number;

    // parentCacheKey is the first level key in the nested cache
    // childMruCacheKey is the second level/ MruCache key for each MruCache entry in the nested cache.
    constructor(public parentCacheKey: string, public childMruCacheKey: string) {
        this.cacheTime = Date.now();
    }

    /**
     * Returns true if the cache entry is older than CACHE_ENTRY_TIME_TO_LIVE
     */
    static isExpired(cacheEntry: MruCacheEntry): boolean {
        const currentTime = Date.now();
        const durationInMilliseconds: number = currentTime - cacheEntry.cacheTime;
        return durationInMilliseconds >= CACHE_ENTRY_TIME_TO_LIVE;
    }

    /**
     * Returns difference in milliseconds between creation time of two cache entries
     */
    static compareEntryCacheTime(cacheEntry1: MruCacheEntry, cacheEntry2: MruCacheEntry): number {
        return cacheEntry1.cacheTime - cacheEntry2.cacheTime;
    }
}
