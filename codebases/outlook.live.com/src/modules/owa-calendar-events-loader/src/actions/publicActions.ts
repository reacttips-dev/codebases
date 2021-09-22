import { action } from 'satcheljs';
import type { DateRange } from 'owa-datetime-utils';
import type { EventsCacheLockId } from 'owa-calendar-events-store';
import type { ClientItemId } from 'owa-client-ids';

/**
 * triggered when a scenario is finished initializing, meaning the caledar events
 * for the scenario initialized via initializeCalendarEventsLoader are loaded
 *
 * @param eventsCacheLockId - The eventsCacheLockId initialized
 */
export const calendarEventsLoaderInitialized = action(
    'calendarEventsLoaderInitialized',
    (eventsCacheLockId: EventsCacheLockId) => ({
        eventsCacheLockId,
    })
);

/**
 * loads events for the updated set of calendars into the store, and updates the calendars loaded for the scenario
 *
 * @param userIdentity - The email address of the user account
 * @param eventsCacheLockId - The eventsCacheLockId to update
 * @param calendarIds - The data used to get the calendar folder ids used to get events from the events store
 */
export const updateCalendarIds = action(
    'updateCalendarIds',
    (calendarIds: string[], eventsCacheLockId: EventsCacheLockId) => ({
        calendarIds,
        eventsCacheLockId,
    })
);

/**
 * notify scenario consumers that updateFolderIds is complete, meaning that events have been loaded
 * for the updated set of calendarIds specified
 *
 * @param eventsCacheLockId - The eventsCacheLockId to update
 */
export const onCalendarIdsUpdated = action(
    'onCalendarIdsUpdated',
    (eventsCacheLockId: EventsCacheLockId) => ({
        eventsCacheLockId,
    })
);

/**
 * notify scenario consumers that updateDateRange is complete, meaning that events have been loaded
 * for the updated dateRange
 *
 * @param eventsCacheLockId - The eventsCacheLockId updated
 * @param dateRange - The updated date range of events loaded
 */
export const onDateRangeUpdated = action(
    'onDateRangeUpdated',
    (dateRange: DateRange, eventsCacheLockId: EventsCacheLockId) => ({
        dateRange,
        eventsCacheLockId,
    })
);

/**
 * loads the full event
 *
 * @param eventsCacheLockId - The eventsCacheLockId to update
 * @param id - The id of the event to load
 * @param parentFolderId - The parentFolderId of the event to load
 */
export const loadFullEvent = action(
    'loadFullEvent',
    (eventsCacheLockId: EventsCacheLockId, id: ClientItemId, parentFolderId?: ClientItemId) => ({
        eventsCacheLockId,
        id,
        parentFolderId,
    })
);

/**
 * loads events for the updated date range into the store, and updates the date range loaded for the scenario
 *
 * @param eventsCacheLockId - The eventsCacheLockId to update
 * @param dateRange - The dateRange to load events for
 */
export const updateDateRange = action(
    'updateDateRange',
    (dateRange: DateRange, eventsCacheLockId: EventsCacheLockId) => ({
        dateRange,
        eventsCacheLockId,
    })
);

/**
 * loads events for the expanded date range (current date range loaded + numberOfDays to load) into the store,
 * and updates the date range loaded for the scenario
 *
 * @param eventsCacheLockId - The eventsCacheLockId to update
 * @param numberOfDays - The numberOfDays to expand the current loaded date range
 */
export const expandDateRange = action(
    'expandDateRange',
    (numberOfDays: number, eventsCacheLockId: EventsCacheLockId) => ({
        numberOfDays,
        eventsCacheLockId,
    })
);
