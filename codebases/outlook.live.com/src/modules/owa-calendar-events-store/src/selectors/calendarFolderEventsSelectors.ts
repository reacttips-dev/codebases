import type { CalendarEventEntity } from '../store/schema/CalendarEventEntity';
import { EventsCacheLockId, getEventsWithKeysFromLock } from 'owa-events-cache';
import { getStore } from '../store/store';
import { logCacheUpdateForDiagnosticsAsync } from 'owa-calendar-cache-diagnostics';

export function filterCalendarEvents(
    folderId: string,
    predicate: (event: CalendarEventEntity) => boolean
) {
    const store = getStore();
    const cache = store.calendarFolderEvents.get(folderId);

    if (cache) {
        return [...cache.events.values()].filter(predicate);
    } else {
        return [];
    }
}

export function getCalendarEventWithId(
    eventId: string,
    folderId: string | null = null
): CalendarEventEntity | null {
    if (folderId) {
        const [event] = filterCalendarEvents(folderId, event => event.ItemId.Id === eventId);
        return event || null;
    } else {
        return filterCalendarEventAcrossAllFolders(e => e.ItemId.Id === eventId);
    }
}

export function getCalendarEventWithInstanceKey(
    instanceKey: string,
    folderId: string | null = null
): CalendarEventEntity | null {
    if (folderId) {
        const [event] = filterCalendarEvents(folderId, event => event.InstanceKey === instanceKey);
        return event || null;
    } else {
        return filterCalendarEventAcrossAllFolders(e => e.InstanceKey === instanceKey);
    }
}

export function getCalendarEventWithKey(
    key: string,
    folderId: string = null
): CalendarEventEntity | null {
    const store = getStore();
    if (folderId) {
        const cache = store.calendarFolderEvents.get(folderId);
        const event = cache.events.get(key);
        return event || null;
    } else {
        return getCalendarEventWithKeyForAnyFolder(key);
    }
}

export function getCalendarEventWithKeyFromLock(
    folderId: string | null,
    key: string,
    lockId: EventsCacheLockId
): CalendarEventEntity | null {
    let returnItem: CalendarEventEntity = null;
    if (folderId) {
        returnItem = getCalendarEventWithKeyForFolderFromLock(folderId, key, lockId);
    } else {
        returnItem = getCalendarEventWithKeyForAnyFolderFromLock(key, lockId);
    }

    // Log to diagnostics panel
    const diagnosticMessageItemsLength = returnItem ? '1' : 'no';
    logCacheUpdateForDiagnosticsAsync({
        lockId: lockId,
        updateMessage: `Got ${diagnosticMessageItemsLength} item from the cache for given folder and key`,
    });

    return returnItem;
}

function getCalendarEventWithKeyForFolderFromLock(
    folderId: string,
    key: string,
    lockId: EventsCacheLockId
): CalendarEventEntity | null {
    const store = getStore();
    const cache = store.calendarFolderEvents.get(folderId);

    if (cache) {
        const [event] = getEventsWithKeysFromLock([key], lockId, cache);
        return event || null;
    } else {
        return null;
    }
}

function getCalendarEventWithKeyForAnyFolderFromLock(
    key: string,
    lockId: EventsCacheLockId
): CalendarEventEntity | null {
    const store = getStore();

    const folderIds = [...store.calendarFolderEvents.keys()];

    for (let i = 0; i < folderIds.length; i++) {
        const folderId = folderIds[i];
        const cache = store.calendarFolderEvents.get(folderId);
        const [event] = cache ? getEventsWithKeysFromLock([key], lockId, cache) : [null];

        if (event) {
            return event;
        }
    }

    return null;
}

function getCalendarEventWithKeyForAnyFolder(key: string): CalendarEventEntity | null {
    const store = getStore();

    const folderIds = [...store.calendarFolderEvents.keys()];

    for (let i = 0; i < folderIds.length; i++) {
        const folderId = folderIds[i];
        const event = getCalendarEventWithKey(key, folderId);

        if (event) {
            return event;
        }
    }

    return null;
}

function filterCalendarEventAcrossAllFolders(
    predicate: (event: CalendarEventEntity) => boolean
): CalendarEventEntity | null {
    const store = getStore();

    const folderIds = [...store.calendarFolderEvents.keys()];

    for (let i = 0; i < folderIds.length; i++) {
        const folderId = folderIds[i];
        const cache = store.calendarFolderEvents.get(folderId);
        const [event] = cache ? [...cache.events.values()].filter(predicate) : [null];

        if (event) {
            return event;
        }
    }

    return null;
}
