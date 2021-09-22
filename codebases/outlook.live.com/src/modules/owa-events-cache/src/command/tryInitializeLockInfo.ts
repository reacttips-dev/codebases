import { createCacheLockInfo } from '../utils/createCacheLockInfo';
import type { EventEntity } from '../schema/EventEntity';
import type { EventsCache, EventsCacheLockId } from '../schema/EventsCache';

export function tryInitializeLockInfo<T extends EventEntity>(
    lockId: EventsCacheLockId,
    cache: EventsCache<T>
) {
    if (!cache.locksInfo.get(lockId)) {
        cache.locksInfo.set(lockId, createCacheLockInfo());
    }
}
