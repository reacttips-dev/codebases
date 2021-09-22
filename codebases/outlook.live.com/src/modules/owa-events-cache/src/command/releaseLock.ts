import type { EventEntity } from '../schema/EventEntity';
import type { EventsCache, EventsCacheLockId } from '../schema/EventsCache';
import { evictEventsForLock, EvictEventsForLockType } from './evictEventsForLock';

export function releaseLock<T extends EventEntity>(
    lockId: EventsCacheLockId,
    eventsCache: EventsCache<T>
) {
    evictEventsForLock(EvictEventsForLockType.All, lockId, eventsCache);

    eventsCache.locksInfo.delete(lockId);
}
