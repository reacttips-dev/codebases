import type { CalendarEntry, CalendarGroup, CalendarId } from 'owa-graph-schema';
import type CalendarFolder from 'owa-service/lib/contract/CalendarFolder';
import { action } from 'satcheljs';

export const initializeCalendarsCacheInStore = action(
    'initializeCalendarsCacheInStore',
    (
        defaultCalendarEntry: CalendarEntry,
        calendarEntries: { [key: string]: CalendarEntry },
        calendarGroups: { [key: string]: CalendarGroup },
        folderIdMapping: { [key: string]: CalendarId }
    ) => {
        return {
            defaultCalendarEntry,
            calendarEntries,
            calendarGroups,
            folderIdMapping,
        };
    }
);

export const addToCalendarsCache = action(
    'addToCalendarsCache',
    (calendarEntry: CalendarEntry, indexToInsert: number = -1) => {
        return {
            calendarEntry,
            indexToInsert,
        };
    }
);

export const addCalendarGroupToCalendarsCache = action(
    'addCalendarGroupToCalendarsCache',
    (calendarGroup: CalendarGroup, indexToInsert: number = -1) => {
        return {
            calendarGroup,
            indexToInsert,
        };
    }
);

export const removeCalendarGroupFromCalendarsCache = action(
    'removeCalendarGroupFromCalendarsCache',
    (calendarGroup: CalendarGroup) => {
        return {
            calendarGroup,
        };
    }
);

export const updateCalendarEntry = action(
    'updateCalendarEntry',
    (id: string, calendarEntry: Partial<CalendarEntry>) => ({ id, calendarEntry })
);

export const updateCalendarFolder = action(
    'updateCalendarFolder',
    (calendar: CalendarEntry, calendarFolder: Partial<CalendarFolder>) => ({
        calendar,
        calendarFolder,
    })
);

export const markCalendarEntryAsValid = action(
    'markCalendarEntryAsValid',
    (calendarEntry: CalendarEntry) => ({ calendarEntry })
);

export const removeCalendarWithIDFromCalendarsCache = action(
    'removeCalendarWithIDFromCalendarsCache',
    (calendarId: string, shouldPersistCalendarEntry: boolean = false) => ({
        calendarId,
        shouldPersistCalendarEntry,
    })
);

export const updateCalendarGroup = action(
    'updateCalendarGroup',
    (groupId: string, userIdentity: string, calendarGroup: Partial<CalendarGroup>) => ({
        groupId,
        userIdentity,
        calendarGroup,
    })
);

export const updateCalendarIdOrderedList = action(
    'updateCalendarIdOrderedList',
    (indexToUpdate: number, idToAdd?: string) => ({
        indexToUpdate,
        idToAdd,
    })
);

export const updateCalendarGroupKeyOrderedList = action(
    'updateCalendarGroupKeyOrderedList',
    (indexToUpdate: number, idToAdd?: string) => ({
        indexToUpdate,
        idToAdd,
    })
);
