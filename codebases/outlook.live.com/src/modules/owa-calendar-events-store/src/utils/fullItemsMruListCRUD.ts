import type { EventsCacheLockId } from 'owa-events-cache';
import type {
    FullItemInfo,
    FullItemsMruList,
    FullItemsMruMap,
} from '../store/schema/FullItemsMruMap';
import { getMruListSize } from './fullItemsMruListSize';

export const MAX_SIZE_PER_MRU = 5;

export type DeletedFromMruCallback = (key: string) => void;

/**
 * It inserts (if not present) or update the full item info in the MRU list
 * @param fullItemInfo The full item info to update/insert
 * @param lockId The lock id for the MRU
 * @param mruPerLock The mapping of lock id to MRU list
 * @param deleteCallback The callback that will be invoked when something from MRU is deleted
 */
export function upsertToMruList(
    fullItemInfo: FullItemInfo,
    lockId: EventsCacheLockId,
    mruPerLock: FullItemsMruMap,
    deleteCallback: DeletedFromMruCallback
) {
    tryInitializeMru(lockId, mruPerLock);

    const { eventKey } = fullItemInfo;
    const mru = mruPerLock.get(lockId);
    const { eventInfos } = mru;

    const [eventInfo] = eventInfos.filter(ei => ei.eventKey === eventKey);
    if (eventInfo) {
        const index = mru.eventInfos.indexOf(eventInfo);
        touch(index, fullItemInfo, mru);
    } else {
        eventInfos.push(fullItemInfo);
        purgeIfNecessary(mru, deleteCallback);
    }

    // TODO VSO 84144: Update `FullItemsMRUMap` logic to store each `FullItemInfo` a single time
    // The below code ensures that the itemResponseShapeType for all duplicate fullItemInfo entries in the mru map
    // remain in sync. When we complete VSO 84144, each FullItemInfo will only be stored 1x, so we will not need this logic.
    [...mruPerLock.keys()].forEach(lockId => {
        const { eventInfos } = mruPerLock.get(lockId);
        eventInfos.forEach(ei => {
            if (fullItemInfo.eventKey === ei.eventKey) {
                ei.itemResponseShapeType = fullItemInfo.itemResponseShapeType;
            }
        });
    });
}

/**
 *
 * @param eventKey The event key for which to delete FullItemInfo
 * @param lockId The lock id for the MRU list
 * @param mruPerLock The mapping of lock to MRU list
 * @param deleteCallback The callback that will be invoked when something from MRU is deleted
 */
export function removeFromMruList(
    eventKey: string,
    lockId: EventsCacheLockId,
    mruPerLock: FullItemsMruMap,
    deleteCallback: DeletedFromMruCallback = () => {}
): boolean {
    tryInitializeMru(lockId, mruPerLock);

    const mru = mruPerLock.get(lockId);
    const [eventInfo] = mru.eventInfos.filter(ei => ei.eventKey === eventKey);
    const index = mru.eventInfos.indexOf(eventInfo);

    if (index !== -1) {
        removeAtIndex(index, mru, deleteCallback);
    }

    return index !== -1;
}

/**
 *
 * @param eventKey The event key to get FullItemInfo for
 * @param lockId The lock id for the MRU list
 * @param mruPerLock The mapping of lock to MRU list
 */
export function getFromMruList(
    eventKey: string,
    lockId: EventsCacheLockId,
    mruPerLock: FullItemsMruMap
): FullItemInfo | null {
    tryInitializeMru(lockId, mruPerLock);

    const mru = mruPerLock.get(lockId);

    const [eventInfo] = mru.eventInfos.filter(ei => ei.eventKey === eventKey);

    return eventInfo || null;
}

export function touchEventKeyInMruList(
    eventKey: string,
    lockId: EventsCacheLockId,
    mruPerLock: FullItemsMruMap
) {
    tryInitializeMru(lockId, mruPerLock);

    const mru = mruPerLock.get(lockId);
    const { eventInfos } = mru;
    const [eventInfo] = eventInfos.filter(ei => ei.eventKey === eventKey);
    if (eventInfo) {
        const index = mru.eventInfos.indexOf(eventInfo);
        touch(index, eventInfo, mru);
    }
}

export function removeMruList(lockId: EventsCacheLockId, mruPerLock: FullItemsMruMap) {
    mruPerLock.delete(lockId);
}

export function clearMruList(lockId: EventsCacheLockId, mruPerLock: FullItemsMruMap) {
    tryInitializeMru(lockId, mruPerLock);
    mruPerLock.get(lockId).eventInfos = [];
}

function tryInitializeMru(lockId: EventsCacheLockId, mruPerLock: FullItemsMruMap) {
    if (!mruPerLock.get(lockId)) {
        const maxSize = getMruListSize(lockId);
        mruPerLock.set(lockId, { eventInfos: [], maxSize });
    }
}

/**
 * This makes the item at `index` to be the most recently used and also replaces it
 * with the `eventInfo`. So it does both updating the object and considering it to be
 * most recently used.
 * @param index is the index of the `FullItemInfo` in the MRU list to mark it as the recently used
 * @param eventInfo is the `FullItemInfo` that would be replaced with the object at the `index`
 * @param mru is the MRU list
 */
function touch(index: number, eventInfo: FullItemInfo, mru: FullItemsMruList) {
    if (index === -1) {
        // This is an extra validation if the index passed in is incorrect then we should fail
        // here as it indicates a bug in the caller
        throw new Error(`Item with eventKey ${eventInfo.eventKey} does not exist in the MRU`);
    }

    mru.eventInfos.splice(index, 1);
    mru.eventInfos.push(eventInfo);
}

function purgeIfNecessary(mru: FullItemsMruList, deleteCallback: DeletedFromMruCallback) {
    purgeTillSize(mru, mru.maxSize || MAX_SIZE_PER_MRU, deleteCallback);
}

function purgeTillSize(
    mru: FullItemsMruList,
    size: number,
    deleteCallback: DeletedFromMruCallback
) {
    let i = 0;
    while (mru.eventInfos.length > size && i < mru.eventInfos.length) {
        removeAtIndex(i, mru, deleteCallback);
    }
}

function removeAtIndex(
    index: number,
    mru: FullItemsMruList,
    deleteCallback: DeletedFromMruCallback
) {
    if (index < 0 || index >= mru.eventInfos.length) {
        throw new Error(`Invalid index to remove ${index}`);
    }

    const eventInfo = mru.eventInfos[index];
    mru.eventInfos.splice(index, 1);
    deleteCallback(eventInfo.eventKey);
}
