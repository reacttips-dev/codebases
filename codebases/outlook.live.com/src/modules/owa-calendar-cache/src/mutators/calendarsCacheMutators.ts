import {
    addCalendarGroupToCalendarsCache,
    addToCalendarsCache,
    initializeCalendarsCacheInStore,
    removeCalendarGroupFromCalendarsCache,
    removeCalendarWithIDFromCalendarsCache,
} from '../actions/publicActions';
import { findInArray } from 'owa-calendar-data-utils/lib/findInArray';
import type { ObservableMap } from 'mobx';
import getCalendarGroupKey from '../utils/getCalendarGroupKey';
import { getFolderIdByCalendarID } from '../selectors/calendarsCacheSelectors';
import getStore from '../store/store';
import { mutator } from 'satcheljs';

function addEntries<T>(map: ObservableMap<string, T>, obj: { [key: string]: T }) {
    Object.keys(obj).forEach(key => map.set(key, obj[key]));
}

mutator(initializeCalendarsCacheInStore, ({ defaultCalendarEntry }) => {
    if (defaultCalendarEntry) {
        getStore().defaultCalendars.set(
            defaultCalendarEntry.calendarId.mailboxInfo.userIdentity,
            defaultCalendarEntry
        );
    }
});

mutator(initializeCalendarsCacheInStore, ({ calendarEntries }) => {
    const store = getStore();
    addEntries(store.calendarEntryMapping, calendarEntries);

    store.calendarIdOrderedList = store.calendarIdOrderedList.concat(Object.keys(calendarEntries));
});

mutator(initializeCalendarsCacheInStore, ({ folderIdMapping }) => {
    addEntries(getStore().folderIdToCalendarId, folderIdMapping);
});

mutator(initializeCalendarsCacheInStore, ({ calendarGroups }) => {
    const store = getStore();
    addEntries(store.calendarGroupsMapping, calendarGroups);

    store.calendarGroupKeyOrderedList = store.calendarGroupKeyOrderedList.concat(
        Object.keys(calendarGroups)
    );
});

mutator(addToCalendarsCache, actionMessage => {
    const { calendarEntry, indexToInsert } = actionMessage;

    const store = getStore();

    store.calendarEntryMapping.set(calendarEntry.calendarId.id, calendarEntry);

    if (indexToInsert > -1) {
        store.calendarIdOrderedList.splice(indexToInsert, 0, calendarEntry.calendarId.id);
    } else {
        store.calendarIdOrderedList.push(calendarEntry.calendarId.id);
    }

    // When we don't have the proper FolderId for the Group Mailbox or linked calendar, we will read the DistinguishedFolderId.
    if (calendarEntry.FolderId) {
        store.folderIdToCalendarId.set(calendarEntry.FolderId.Id, {
            id: calendarEntry.calendarId.id,
            changeKey: calendarEntry.calendarId.changeKey,
            mailboxInfo: calendarEntry.calendarId.mailboxInfo,
        });
    } else if (calendarEntry.DistinguishedFolderId) {
        store.folderIdToCalendarId.set(calendarEntry.DistinguishedFolderId, {
            id: calendarEntry.calendarId.id,
            changeKey: calendarEntry.calendarId.changeKey,
            mailboxInfo: calendarEntry.calendarId.mailboxInfo,
        });
    }
});

mutator(addCalendarGroupToCalendarsCache, actionMessage => {
    const { calendarGroup, indexToInsert } = actionMessage;

    const store = getStore();

    const groupKey = getCalendarGroupKey(
        calendarGroup.calendarGroupId.mailboxInfo.userIdentity,
        calendarGroup.serverGroupId
    );

    store.calendarGroupsMapping.set(groupKey, calendarGroup);

    if (indexToInsert > -1) {
        store.calendarGroupKeyOrderedList.splice(indexToInsert, 0, groupKey);
    } else {
        store.calendarGroupKeyOrderedList.push(groupKey);
    }
});

mutator(removeCalendarGroupFromCalendarsCache, actionMessage => {
    const { calendarGroup } = actionMessage;

    const store = getStore();

    const groupKey = getCalendarGroupKey(
        calendarGroup.calendarGroupId.mailboxInfo.userIdentity,
        calendarGroup.serverGroupId
    );

    store.calendarGroupsMapping.delete(groupKey);

    const calendarGroupKeyFindResult = findInArray(
        store.calendarGroupKeyOrderedList,
        key => key === groupKey
    );
    if (calendarGroupKeyFindResult) {
        store.calendarGroupKeyOrderedList.splice(calendarGroupKeyFindResult.index, 1);
    }
});

mutator(removeCalendarWithIDFromCalendarsCache, actionMessage => {
    const { calendarId, shouldPersistCalendarEntry } = actionMessage;
    const folderId = getFolderIdByCalendarID(calendarId);

    // When we get a folder value from getCalendarFolderconfig, calendarEntry map/s key is unchanged
    // and remoteCategories are added in the value, if present. Hence there is no need to delete and readd
    // the same entry in the calendarEntryMapping map, so persist it - in those cases shouldPersistCalendarEntry is sent as True (default value for this action)
    removeCalendarWithId(calendarId, folderId, shouldPersistCalendarEntry);
});

function removeCalendarWithId(
    calendarId: string,
    folderId?: string,
    shouldPersistCalendarEntry?: boolean
) {
    const store = getStore();

    const calendarIdFindResult = findInArray(store.calendarIdOrderedList, id => id === calendarId);

    if (calendarIdFindResult) {
        store.calendarIdOrderedList.splice(calendarIdFindResult.index, 1);
    }

    if (!shouldPersistCalendarEntry) {
        store.calendarEntryMapping.delete(calendarId);
        store.validEntryMapping.delete(calendarId);
    }

    if (folderId) {
        store.folderIdToCalendarId.delete(folderId);
    }
}
