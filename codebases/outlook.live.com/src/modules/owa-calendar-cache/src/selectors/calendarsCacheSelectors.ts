import type {
    CalendarEntry,
    CalendarGroup,
    CalendarId,
    LinkedCalendarEntry,
    LocalCacheForRemoteCalendarEntry,
    LocalCalendarEntry,
} from 'owa-graph-schema';
import getCalendarGroupKey from '../utils/getCalendarGroupKey';
import getStore from '../store/store';
import { getUserMailboxInfo } from 'owa-client-ids';
import { getCalculatedFolderId } from 'owa-calendar-properties';
export { extractTrueProperty, joinFolderIdAndChannelId } from 'owa-calendar-properties';
import { findInArray } from 'owa-calendar-data-utils/lib/findInArray';

export function getDefaultCalendar(userIdentity?: string): CalendarEntry | null {
    if (!userIdentity) {
        // get default account's userIdentity
        userIdentity = getUserMailboxInfo().userIdentity;
    }
    return getStore().defaultCalendars.get(userIdentity);
}

export function isDefaultCalendar(calendarId: CalendarId, userIdentity?: string): boolean | null {
    const defaultCalendar = getDefaultCalendar(userIdentity);
    return defaultCalendar && calendarId === defaultCalendar.calendarId;
}

export function getCalendarEntries(): CalendarEntry[] {
    const { calendarEntryMapping, calendarIdOrderedList } = getStore();

    // always return ordered list
    return calendarIdOrderedList.map(calendarId => calendarEntryMapping.get(calendarId));
}

export function getCalendarIndex(calendarId: string): number {
    const calendarIdFindResult = findInArray(
        getStore().calendarIdOrderedList,
        id => id === calendarId
    );
    if (calendarIdFindResult) {
        return calendarIdFindResult.index;
    } else {
        return -1;
    }
}

export function getCalendarIdOrderedList(): string[] {
    return getStore().calendarIdOrderedList;
}

export function getCalendarGroups(): CalendarGroup[] {
    const { calendarGroupsMapping, calendarGroupKeyOrderedList } = getStore();

    // always return ordered list
    return calendarGroupKeyOrderedList.map(calendarGroupKey =>
        calendarGroupsMapping.get(calendarGroupKey)
    );
}

export function getCalendarGroupIndex(calendarGroupId: string, userIdentity: string): number {
    const groupKey = getCalendarGroupKey(userIdentity, calendarGroupId);
    const calendarGroupKeyFindResult = findInArray(
        getStore().calendarGroupKeyOrderedList,
        key => key === groupKey
    );
    if (calendarGroupKeyFindResult) {
        return calendarGroupKeyFindResult.index;
    } else {
        return -1;
    }
}

export function getCalendarGroupKeyOrderedList(): string[] {
    return getStore().calendarGroupKeyOrderedList;
}

export function getCalendarGroupByGroupId(
    calendarGroupId: string,
    userIdentity: string
): CalendarGroup {
    const { calendarGroupsMapping } = getStore();
    const groupKey = getCalendarGroupKey(userIdentity, calendarGroupId);
    return calendarGroupsMapping.get(groupKey);
}

/**
 * **Important:** Even when the calendar cache is initialized, it is not a guarantee that the folder id associated with an
 * event will be present in the cache, because some calendar folder ids need to be updated after initialization. This is true
 * of all cache functions that use calendar folder id to select data.
 * See `getAndUpdateActualFolderId` for details.
 *
 * @param folderId the calendar folder id
 */
export function getCalendarIdByFolderId(folderId: string): CalendarId | null {
    const { folderIdToCalendarId } = getStore();
    return folderIdToCalendarId.get(folderId);
}

export function getCalendarEntryByCalendarId(calendarId: string) {
    const { calendarEntryMapping } = getStore();
    return calendarEntryMapping.get(calendarId);
}

export function getCalendarEntryByFolderId(folderId: string) {
    const calendarId = getCalendarIdByFolderId(folderId);

    // If the calendar ID is present then get the CalendarEntry for it otherwise return undefined
    return calendarId ? getCalendarEntryByCalendarId(calendarId.id) : undefined;
}

export function getCalendarFolderId(calendar: CalendarEntry): string {
    return getFolderIdByCalendarID(calendar.calendarId.id);
}

export function getFolderIdByCalendarID(calendarId: string): string | null {
    const { calendarEntryMapping } = getStore();
    const calendarEntry = calendarEntryMapping.get(calendarId);
    if (calendarEntry && (calendarEntry.FolderId || calendarEntry.DistinguishedFolderId)) {
        return calendarEntry.FolderId
            ? calendarEntry.FolderId.Id
            : calendarEntry.DistinguishedFolderId;
    } else {
        return getCalculatedFolderIdByCalendarID(calendarId);
    }
}

export function getCalculatedFolderIdByCalendarID(calendarId: string): string {
    const { calendarEntryMapping } = getStore();

    const calendarEntry = calendarEntryMapping.get(calendarId);
    if (calendarEntry) {
        const folderId = getCalculatedFolderId(calendarEntry);
        return folderId ? folderId.Id : null;
    }
    return null;
}

export function getCalculatedFolderIdForDefaultCalendar(userIdentity?: string) {
    const defaultCalendar = getDefaultCalendar(userIdentity);
    return defaultCalendar ? getCalculatedFolderId(defaultCalendar).Id : null;
}

export function calendarIsInCache(calendarId: string): boolean {
    return getCalendarEntryByCalendarId(calendarId) ? true : false;
}

/**
 * Returns whether this folder is a LocalCalendarEntry or a LocalCacheForRemoteCalendarEntry
 * that has a valid CalendarFolderId
 * @param folderId FolderId of the calendar folder
 */
export function isLocalCalendarEntry(folderId: string): boolean {
    const { folderIdToCalendarId, calendarEntryMapping } = getStore();

    const calendarId = folderIdToCalendarId.get(folderId);
    if (calendarId) {
        const calendarEntry: any = calendarEntryMapping.get(calendarId.id);

        // Group mailboxes are Linked calendar entries
        return (
            calendarEntry &&
            !calendarEntry.IsGroupMailboxCalendar &&
            calendarEntry.LocalCalendarFolderId != undefined
        );
    } else {
        return false;
    }
}

/**
 * Returns whether the given folder is a readonly local calendar entry
 * @param folderId The folder id
 * @returns True if it's a read only local calendar entry, false otherwise
 */
export function isReadOnlyLocalCalendar(folderId: string): boolean {
    if (isLocalCalendarEntry(folderId)) {
        let calendarEntry: LocalCalendarEntry = getCalendarEntryByFolderId(
            folderId
        ) as LocalCalendarEntry;
        return calendarEntry?.IsReadOnly;
    }
    return false;
}

/**
 * Checks whether the calendarEntry has been marked as an invalid folder
 * @param calendarEntry the calendar folder to check for validity
 */
export function isValidCalendarEntry(calendarEntry: CalendarEntry) {
    const { validEntryMapping } = getStore();

    return calendarEntry && validEntryMapping.get(calendarEntry.calendarId.id);
}

/**
 * Checks if the calendar folder id needs to be updated.
 * @returns true if the calendar is an old-model shared calendar i.e. `LinkedCalendarEntry` calendar that has not been
 * updated via `getAndUpdateActualFolderId`, otherwise returns false.
 *
 * When the cache is initialized LinkedCalendarEntry
 * calendar entries do not have accurate folder ids. These ids can be fetched/ updated
 * using `getAndUpdateActualFolderId`. Once the folder Id is updated for the calendar, this
 * calendar entry is marked as valid, and `calendarFolderIdNeedsUpdate` will return false.
 */
export function calendarFolderIdNeedsUpdate(calendarId: string): boolean {
    const folderId = getFolderIdByCalendarID(calendarId);
    if (!isLocalCalendarEntry(folderId)) {
        const calendarEntry = getCalendarEntryByCalendarId(calendarId);
        return !isValidCalendarEntry(calendarEntry);
    }
    return false;
}

export function getCalendarEntryByEmailAddress(emailAddress: string): CalendarEntry | undefined {
    const { folderIdToCalendarId, calendarEntryMapping } = getStore();
    const calendarId = folderIdToCalendarId.get(emailAddress);
    let calendarEntry;

    // If the calendar ID is present then get the CalendarEntry for it,
    // otherwise search through calendar entries for a LocalCacheForRemoteCalendarEntry
    if (calendarId) {
        calendarEntry = calendarEntryMapping.get(calendarId.id);
    } else {
        let entries = [...calendarEntryMapping.values()] as (
            | LinkedCalendarEntry
            | LocalCacheForRemoteCalendarEntry
        )[];

        calendarEntry = entries.filter(entry => {
            return (
                entry.OwnerEmailAddress &&
                entry.OwnerEmailAddress.toLowerCase() == emailAddress.toLowerCase()
            );
        })[0];
    }

    return calendarEntry;
}

export function isTeamsCalendarEntry(calendarEntry): boolean {
    return calendarEntry?.id?.mailboxInfo?.type == 'TeamsMailbox';
}

export function getCalendarGroupsForUser(
    userIdentity: string
): {
    userCalendarGroups: CalendarGroup[];
    groupCalendarGroups: CalendarGroup[];
    teamsCalendarGroups: CalendarGroup[];
} {
    const calendarGroups = getCalendarGroups();
    const userCalendarGroups = calendarGroups.filter(
        calendarGroup =>
            calendarGroup.calendarGroupId.mailboxInfo.type === 'UserMailbox' &&
            calendarGroup.calendarGroupId.mailboxInfo.userIdentity == userIdentity
    );
    const groupCalendarGroups = calendarGroups.filter(
        calendarGroup =>
            calendarGroup.calendarGroupId.mailboxInfo.type === 'GroupMailbox' &&
            calendarGroup.calendarGroupId.mailboxInfo.userIdentity == userIdentity
    );

    const teamsCalendarGroups = calendarGroups.filter(
        calendarGroup =>
            calendarGroup.calendarGroupId.mailboxInfo.type === 'TeamsMailbox' &&
            calendarGroup.calendarGroupId.mailboxInfo.userIdentity == userIdentity
    );

    return { userCalendarGroups, groupCalendarGroups, teamsCalendarGroups };
}

export function getCalendarsForCalendarGroup(userIdentity: string, parentGroupId: string) {
    const calendars = getCalendarEntries().filter(calendarEntry => {
        return (
            calendarEntry &&
            calendarEntry.ParentGroupId === parentGroupId &&
            calendarEntry.calendarId.mailboxInfo.userIdentity === userIdentity
        );
    });

    return calendars;
}

export function getShareableCalendars(): CalendarEntry[] {
    let result: CalendarEntry[] = [];
    getCalendarEntries().forEach(calendar => {
        if (calendar.CanShare) {
            result.push(calendar);
        }
    });
    return result;
}
