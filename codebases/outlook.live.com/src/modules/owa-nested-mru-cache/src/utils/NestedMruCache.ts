import { ObservableMap } from 'mobx';
import { MruCache } from 'owa-mru-cache';
import MruCacheEntry from './MruCacheEntry';
import {
    NUMBER_OF_ENTRIES_TO_REMOVE,
    EXPIRED_ENTRY_CLEAR_UP_INTERVAL,
    CACHE_LIMIT,
} from './NestedMruCacheDefaults';
import { action } from 'satcheljs/lib/legacy';
/**
 * Generic nested MRU cache with items of type MruCacheEntry.
 * The cache needs to be initialized before use with a observable map containing MruCache objects.
 */
export default class NestedMruCache<T extends MruCacheEntry> {
    private lastExpiredEntryClearedTime: number;
    private cache: ObservableMap<string, MruCache<T>>;
    private comparer: (v1: T, v2: T) => number;
    private cacheLimit: number;

    constructor(
        comparer: (v1: T, v2: T) => number,
        cacheLimit: number = CACHE_LIMIT,
        lastExpiredEntryClearedTime: number = Date.now()
    ) {
        this.comparer = comparer;
        this.cacheLimit = cacheLimit;
        this.lastExpiredEntryClearedTime = lastExpiredEntryClearedTime;
        this.cache = new ObservableMap<string, MruCache<T>>();
    }

    /**
     * To initialize the nested MRU cache with an observable map.
     */
    initialize(nestedMruCache: NestedMruCache<T>) {
        this.cache = nestedMruCache.cache;
    }

    /**
     * Add a new entry of type MruCacheEntry to the cache for a given parent level key
     */
    add(key: string, value: T) {
        action('NestedMruCache_add')(() => {
            this.clearOldEntriesIfNeeded();

            let mruCache: MruCache<T> = null;
            if (this.cache.has(key)) {
                mruCache = this.cache.get(key);
            } else {
                mruCache = new MruCache<T>(this.cacheLimit);
                mruCache.initialize(new ObservableMap<string, T>());
                this.cache.set(key, mruCache);
            }
            mruCache.add(value.childMruCacheKey, value);
        })();
    }

    /**
     * Returns true if nested cache contains entry for a given parent level key and child level key
     */
    containsValueForKey(parentCacheKey: string, childMruCacheKey: string): boolean {
        if (!this.cache.has(parentCacheKey)) {
            return false;
        }

        const mruCache = this.cache.get(parentCacheKey);
        const result = mruCache.get(childMruCacheKey);
        return result && !MruCacheEntry.isExpired(result) ? true : false;
    }

    /**
     * Gets cache entry for a given parent level key and child level key for the nested cache.
     */
    get(parentCacheKey: string, childMruCacheKey: string): T {
        let mruCacheEntry: T = null;
        if (this.containsValueForKey(parentCacheKey, childMruCacheKey)) {
            mruCacheEntry = this.cache.get(parentCacheKey).get(childMruCacheKey);
        }
        return mruCacheEntry;
    }

    /**
     * Clears expired entries from the cache
     */
    clearUpExpiredEntries() {
        const duration = Date.now() - this.lastExpiredEntryClearedTime;

        if (duration < EXPIRED_ENTRY_CLEAR_UP_INTERVAL) {
            return;
        }

        for (let cache of this.cache.values()) {
            // Remove expired entries from every sender's cache.
            cache.getItemIds().forEach(key => {
                if (MruCacheEntry.isExpired(cache.get(key))) {
                    cache.remove(key);
                }
            });
        }

        this.lastExpiredEntryClearedTime = Date.now();
    }

    /**
     * Remove entries from Mru cache for a given sender address.
     */
    remove(parentCacheKey: string) {
        action('NestedMruCache_remove')(() => {
            if (this.cache.has(parentCacheKey)) {
                const mruCache = this.cache.get(parentCacheKey);
                const recipientKeyList = mruCache.getItemIds();
                recipientKeyList.map(key => {
                    mruCache.remove(key);
                });
            }
        })();
    }

    /**
     * Clears all entries from the cache
     */
    clear() {
        action('NestedMruCache_clear')(() => {
            // Try purge all the items
            const senderKeyList = this.cache.keys();
            for (let key of senderKeyList) {
                this.remove(key);
            }
        })();
    }

    /**
     * Count total number of entries in the cache, including all entries in all Mru caches
     */
    countTotalNumberOfEntries() {
        let totalEntries = 0;
        if (this.cache) {
            for (let cache of this.cache.values()) {
                totalEntries += cache.getItemIds().length;
            }
        }
        return totalEntries;
    }

    /**
     * Returns array of Mru cache entries from the nested cache.
     */
    returnAllMailTipsCacheEntries(): T[] {
        let mruCacheEntryCollection: T[] = [];
        if (this.cache) {
            for (let cache of this.cache.values()) {
                !!cache &&
                    cache.getItemIds().map(mruCacheEntryId => {
                        const mruCacheEntry = cache.get(mruCacheEntryId);
                        mruCacheEntryCollection.push(mruCacheEntry);
                    });
            }
        }
        return mruCacheEntryCollection;
    }

    /**
     * Clears old entries if cache is full after clearing expired entries.
     */
    private clearOldEntriesIfNeeded() {
        if (this.countTotalNumberOfEntries() >= CACHE_LIMIT) {
            this.clearUpExpiredEntries();
        }

        if (this.countTotalNumberOfEntries() >= CACHE_LIMIT) {
            let arrayOfCacheEntries: T[] = [];
            for (let cache of this.cache.values()) {
                cache.getItemIds().forEach(key => {
                    arrayOfCacheEntries.push(cache.get(key));
                });
            }

            arrayOfCacheEntries.sort(this.comparer);

            for (let i = 0; i < NUMBER_OF_ENTRIES_TO_REMOVE; i++) {
                const parentCacheKey = arrayOfCacheEntries[i].parentCacheKey;
                const childMruCacheKey = arrayOfCacheEntries[i].childMruCacheKey;
                this.cache.get(parentCacheKey).remove(childMruCacheKey);
            }
        }
    }
}
