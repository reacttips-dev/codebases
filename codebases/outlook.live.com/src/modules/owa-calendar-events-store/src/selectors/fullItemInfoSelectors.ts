import { computed, IComputedValue } from 'mobx';
import type { EventsCacheLockId } from 'owa-events-cache';
import type { FullItemInfo, FullItemLoadState } from '../store/schema/FullItemsMruMap';
import { getStore } from '../store/store';
import type { CalendarEventItemResponseShapeType } from 'owa-calendar-services/lib/schema/CalendarEventItemResponseShapeType';

export type AllFullItemInfo = { [eventKey: string]: FullItemInfo };

export function getAllFullItemInfo() {
    return allFullItemInfoComputed.get();
}

/**
 *  Get the full item info for for `eventKey` with `itemResponseShapeType`.
 *
 * @param eventKey
 * @param itemResponseShapeType
 * @returns FullItemInfo if the store contains FullItemInfo for `eventKey` with the
 * specified `itemResponseShapeType`, otherwise returns null
 */
export function getFullItemInfoFromMRU(
    eventKey: string,
    itemResponseShapeType: CalendarEventItemResponseShapeType
): FullItemInfo | null {
    const info = getFullItemInfoForEventKeyFromMRU(eventKey);
    if (info && info.itemResponseShapeType === itemResponseShapeType) {
        return info;
    }
    return null;
}

/**
 * Get the full item info for the event, not considering `itemResponseShapeType`
 *
 * @param eventKey
 * @returns FullItemInfo if the store contains FullItemInfo for `eventKey`, otherwise returns null
 */
function getFullItemInfoForEventKeyFromMRU(eventKey: string): FullItemInfo | null {
    const allFullItemInfo = getAllFullItemInfo();
    const info = allFullItemInfo[eventKey];
    return info ? info : null;
}

/**
 * Get the full item info locked by `lockId` with `eventKey` and `itemResponseShapeType`.
 *
 * @param lockId
 * @param eventKey
 * @param itemResponseShapeType
 * @returns FullItemInfo if the lockId has `eventKey` locked, and the store contains FullItemInfo for `eventKey` with the
 * specified `itemResponseShapeType`, otherwise returns null
 */
export function getFullItemInfoForLockMRU(
    lockId: EventsCacheLockId,
    eventKey: string,
    itemResponseShapeType: CalendarEventItemResponseShapeType
): FullItemInfo | null {
    const store = getStore();

    const lockMru = store.fullItemsMruMap.get(lockId);

    if (lockMru) {
        const [fullItemInfo] = lockMru.eventInfos.filter(e => e.eventKey === eventKey);

        if (fullItemInfo && fullItemInfo.itemResponseShapeType === itemResponseShapeType) {
            return fullItemInfo;
        }
    }

    return null;
}

/**
 * Gets the `FullItemLoadState` for the eventKey.
 *
 * @param eventKey
 */
export function getFullItemLoadState(eventKey: string): FullItemLoadState | null {
    const info = getFullItemInfoForEventKeyFromMRU(eventKey);
    if (info) {
        return info.loadState;
    } else {
        return null;
    }
}

/**
 * This gets the item response shape type of the full item info idicated by eventKey.
 * If this eventKey is not in our full item store, we return the Default Full Item Response Shape Type.
 *
 * Use this function to get the `itemResponseShapeType` for eventKey when it is not specified.
 * @param eventKey
 */
export function getCurrentOrDefaultFullItemResponseShapeType(
    eventKey: string
): CalendarEventItemResponseShapeType {
    const currentFullItemResponseShapeType = getFullItemInfoForEventKeyFromMRU(eventKey)
        ?.itemResponseShapeType;
    return currentFullItemResponseShapeType
        ? currentFullItemResponseShapeType
        : getDefaultFullItemResponseShapeType();
}

export function getDefaultFullItemResponseShapeType(): CalendarEventItemResponseShapeType {
    return 'Default';
}

const allFullItemInfoComputed: IComputedValue<AllFullItemInfo> = computed(() => {
    const store = getStore();

    return [...store.fullItemsMruMap.keys()].reduce<AllFullItemInfo>((agg, lockId) => {
        const { eventInfos } = store.fullItemsMruMap.get(lockId);

        eventInfos.forEach(ei => (agg[ei.eventKey] = ei));

        return agg;
    }, {});
});
