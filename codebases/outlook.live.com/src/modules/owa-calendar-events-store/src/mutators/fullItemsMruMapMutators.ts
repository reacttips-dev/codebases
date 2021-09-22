import { clearAllFullCalendarEvents } from '../actions/publicEventsCacheActions';
import { convertToCalendarEventEntity } from '../utils/lockedCalendarEvents/convertToCalendarEventEntity';
import { FullItemLoadState } from '../store/schema/FullItemsMruMap';
import { getStore } from '../store/store';
import { mutator } from 'satcheljs';
import {
    clearMruList,
    removeFromMruList,
    upsertToMruList,
    touchEventKeyInMruList,
} from '../utils/fullItemsMruListCRUD';
import {
    addEventForLock,
    createEventsCache,
    EventsCacheLockId,
    evictEventsWithKeysForLock,
    aggEvents,
    LockEvents,
} from 'owa-events-cache';
import {
    fetchingFullCalendarEventForLock,
    fetchingFullCalendarEventForLockFailed,
    fullCalendarEventLoadedForLock,
    removeFullCalendarEventInfo,
    removeAllFullCalendarEventsInfoForCache,
    fullCalendarEventWasUsed,
} from '../actions/eventsCacheActions';

mutator(fetchingFullCalendarEventForLock, actionMessage => {
    const {
        eventKey,
        folderId,
        lockId,
        partialCalendarEvent,
        itemResponseShapeType,
    } = actionMessage;
    tryInitializeCalendarFolderEventsCache(folderId);

    const store = getStore();

    if (partialCalendarEvent) {
        // If we have a partial calendar event then add it to the cache. If its already
        // in the cache then it would just assign the properties from it to the existing event in cache
        const calendarEventEntity = convertToCalendarEventEntity(eventKey, partialCalendarEvent);
        addEventForLock(calendarEventEntity, lockId, store.calendarFolderEvents.get(folderId));
    }

    // Add the full item info which indicates that this calendar event is being maintained
    // as full calendar event, along with its load state
    upsertToMruList(
        {
            eventKey: eventKey,
            itemResponseShapeType: itemResponseShapeType,
            folderId: folderId,
            loadState: FullItemLoadState.Loading,
        },
        lockId,
        store.fullItemsMruMap,
        onFullItemDeletedFromMruFunc(lockId, folderId)
    );
});

mutator(fetchingFullCalendarEventForLockFailed, actionMessage => {
    const { eventKey, folderId, lockId, itemResponseShapeType } = actionMessage;

    tryInitializeCalendarFolderEventsCache(folderId);
    const store = getStore();

    upsertToMruList(
        {
            eventKey: eventKey,
            itemResponseShapeType: itemResponseShapeType,
            folderId: folderId,
            loadState: FullItemLoadState.Error,
        },
        lockId,
        store.fullItemsMruMap,
        onFullItemDeletedFromMruFunc(lockId, folderId)
    );
});

mutator(fullCalendarEventLoadedForLock, actionMessage => {
    const {
        lockId,
        eventKey,
        folderId,
        event,
        hasEventChanged,
        itemResponseShapeType,
        forceOverrideAllPropertiesForEventIfAvailable,
    } = actionMessage;
    tryInitializeCalendarFolderEventsCache(folderId);

    const store = getStore();
    const calendarEventEntity = convertToCalendarEventEntity(eventKey, event);

    // As the event that was added before can be changed when fetching series master
    // so we pass the correct flag here so that cache can update accordingly if the
    // the time has been changed.

    addEventForLock(
        calendarEventEntity,
        lockId,
        store.calendarFolderEvents.get(folderId),
        hasEventChanged,
        forceOverrideAllPropertiesForEventIfAvailable
    );
    upsertToMruList(
        {
            eventKey: eventKey,
            itemResponseShapeType: itemResponseShapeType,
            folderId: folderId,
            loadState: FullItemLoadState.Loaded,
        },
        lockId,
        store.fullItemsMruMap,
        onFullItemDeletedFromMruFunc(lockId, folderId)
    );
});

mutator(removeFullCalendarEventInfo, actionMessage => {
    const { folderId, eventKey } = actionMessage;

    const store = getStore();

    const eventsCache = store.calendarFolderEvents.get(folderId);

    if (eventsCache) {
        // If the cache exists then go over all the locks and remove
        // the full calendar event info for the specific event key
        [...store.fullItemsMruMap.keys()].forEach((lockId: EventsCacheLockId) => {
            removeFromMruList(eventKey, lockId, store.fullItemsMruMap);
        });
    }
});

mutator(removeAllFullCalendarEventsInfoForCache, actionMessage => {
    const { folderId } = actionMessage;

    const store = getStore();

    const eventsCache = store.calendarFolderEvents.get(folderId);

    if (eventsCache) {
        // Get list of all the unique keys that are locked by key
        const uniqueLockedEventKeysMap = [...eventsCache.locksInfo.entries()].reduce<LockEvents>(
            aggEvents(),
            {}
        );
        const uniqueLockedEventKeys = Object.keys(uniqueLockedEventKeysMap);

        // For each of these unique keys clear the full calendar event info
        [...store.fullItemsMruMap.keys()].forEach((lockId: EventsCacheLockId) => {
            uniqueLockedEventKeys.forEach(eventKey =>
                removeFromMruList(eventKey, lockId, store.fullItemsMruMap)
            );
        });
    }
});

mutator(clearAllFullCalendarEvents, () => {
    const store = getStore();

    [...store.fullItemsMruMap.keys()].forEach(lockId => {
        clearMruList(lockId as EventsCacheLockId, store.fullItemsMruMap);
    });
});

mutator(fullCalendarEventWasUsed, actionMessage => {
    const store = getStore();
    const { lockId, eventKey } = actionMessage;

    touchEventKeyInMruList(eventKey, lockId, store.fullItemsMruMap);
});

function tryInitializeCalendarFolderEventsCache(folderId: string) {
    if (!folderId) {
        return;
    }

    const store = getStore();

    if (!store.calendarFolderEvents.get(folderId)) {
        store.calendarFolderEvents.set(folderId, createEventsCache());
    }
}

/**
 * As we use an MRU list to maintain the full item, if the item is not being used
 * any more then we should evict it from the cache for that particular lock
 * @param lockId The lock id for which to delete the event
 * @param folderId The calendar folder from whose cache we need to evict
 */
function onFullItemDeletedFromMruFunc(lockId: EventsCacheLockId, folderId: string) {
    return (eventKey: string) => {
        evictEventsWithKeysForLock(
            [eventKey],
            lockId,
            getStore().calendarFolderEvents.get(folderId)
        );
    };
}
