import { NestedMruCache } from 'owa-nested-mru-cache';
import MailTipsCacheEntry from '../store/schema/MailTipsCacheEntry';

export default function recreateNestedMruCacheFromMailTipsCacheEntries(
    mruCacheEntries: MailTipsCacheEntry[]
): NestedMruCache<MailTipsCacheEntry> {
    const observableMruCache = new NestedMruCache<MailTipsCacheEntry>(
        MailTipsCacheEntry.compareEntryCacheTime
    );
    mruCacheEntries.map(mruCacheEntry => {
        observableMruCache.add(mruCacheEntry.parentCacheKey, mruCacheEntry);
    });
    return observableMruCache;
}
