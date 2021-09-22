import type { EventsCacheLockId } from 'owa-events-cache';

const mruListSizes = new Map<EventsCacheLockId, number>();

export function setMruListSize(lockId: EventsCacheLockId, size: number | undefined) {
    if (size) {
        mruListSizes.set(lockId, size);
    } else {
        mruListSizes.delete(lockId);
    }
}

export function getMruListSize(lockId: EventsCacheLockId) {
    return mruListSizes.get(lockId);
}
