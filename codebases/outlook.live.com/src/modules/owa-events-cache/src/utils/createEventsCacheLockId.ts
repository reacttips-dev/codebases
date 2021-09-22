import type { EventsCacheLockId } from '../schema/EventsCache';

let nextLockIdNum = 0;
export function createEventsCacheLockId(id?: string): EventsCacheLockId {
    const lockId = id ? id : `events_cache_lock_${nextLockIdNum}`;
    nextLockIdNum++;

    return lockId as EventsCacheLockId;
}
