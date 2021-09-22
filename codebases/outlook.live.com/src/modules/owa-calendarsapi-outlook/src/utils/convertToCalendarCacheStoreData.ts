import CalendarFolderTypeEnum from 'owa-service/lib/contract/CalendarFolderTypeEnum';
import { getCalendarGroupKey, CalendarCacheStoreData } from 'owa-calendar-cache';
import { getCalculatedFolderId } from 'owa-calendar-properties';
import { shouldAddCalendarToCache } from './shouldAddCalendarToCache';
import type { CalendarGroup, CalendarEntry, CalendarId } from 'owa-graph-schema';

export function convertToCalendarCacheStoreData(
    groups: CalendarGroup[],
    userIdentity?: string
): CalendarCacheStoreData {
    let defaultCalendar: CalendarEntry;
    let calendarEntryMapping: { [key: string]: CalendarEntry } = {};
    let folderIdMapping: { [key: string]: CalendarId } = {};
    let calendarGroupMapping: { [key: string]: CalendarGroup } = {};

    groups.forEach((group: CalendarGroup) => {
        const groupKey = getCalendarGroupKey(
            group.calendarGroupId.mailboxInfo.userIdentity,
            group.serverGroupId
        );
        calendarGroupMapping[groupKey] = group;
        group.Calendars.forEach(calendarEntry => {
            if (
                shouldAddCalendarToCache(calendarEntry, [
                    calendarEntry.calendarId.mailboxInfo.userIdentity,
                ])
            ) {
                let entryId = calendarEntry.calendarId.id;
                let calcFolderId = getCalculatedFolderId(calendarEntry).Id;

                if (calendarEntry.CalendarFolderType == CalendarFolderTypeEnum.DefaultCalendar) {
                    defaultCalendar = calendarEntry;
                }

                // Do not override any existent mapping.
                // One case it protects for is when user shares its own calendar with himself.
                !calendarEntryMapping[entryId] && (calendarEntryMapping[entryId] = calendarEntry);
                !folderIdMapping[calcFolderId] &&
                    (folderIdMapping[calcFolderId] = calendarEntry.calendarId);
            }
        });
    });

    return {
        defaultCalendar: defaultCalendar,
        calendarEntryMapping: calendarEntryMapping,
        folderIdMapping: folderIdMapping,
        calendarGroupMapping: calendarGroupMapping,
    };
}
