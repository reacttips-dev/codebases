import type CalendarEvent from 'owa-calendar-types/lib/types/CalendarEvent';
import { action } from 'satcheljs';
import type { CalendarEventEntity } from '../store/schema/CalendarEventEntity';
import type { DateRange } from 'owa-datetime-utils';
import type { EventsCacheLockId } from 'owa-events-cache';
import type { CalendarEventItemResponseShapeType } from 'owa-calendar-services/lib/schema/CalendarEventItemResponseShapeType';

/**
 * This file centralizes the actions which result in events cache updates. `removeCalendarEventsFromEventsCacheMatchingFilter` is not an action
 * but it does result in updates to the events cache, similar to the actions in this file. So, we export it here to maintain this centralized location for cache updates.
 */
export { removeCalendarEventsFromEventsCacheMatchingFilter } from '../utils/eventsCache/removeCalendarEventsFromEventsCacheMatchingFilter';

/**
 * Full calendar event related actions
 */
export const fetchingFullCalendarEventForLock = action(
    'CALENDAR_EVENTS_FETCHING_FULL_CALENDAR_EVENT_FOR_LOCK',
    (
        lockId: EventsCacheLockId,
        folderId: string,
        eventKey: string,
        itemResponseShapeType: CalendarEventItemResponseShapeType,
        partialCalendarEvent: CalendarEvent | null
    ) => ({
        lockId,
        folderId,
        eventKey,
        itemResponseShapeType,
        partialCalendarEvent,
    })
);

export const fetchingFullCalendarEventForLockFailed = action(
    'CALENDAR_EVENTS_FETCHING_FULL_CALENDAR_EVENT_FOR_LOCK_FAILED',
    (
        lockId: EventsCacheLockId,
        folderId: string,
        eventKey: string,
        itemResponseShapeType: CalendarEventItemResponseShapeType
    ) => ({
        lockId,
        folderId,
        eventKey,
        itemResponseShapeType,
    })
);

export const fullCalendarEventLoadedForLock = action(
    'CALENDAR_EVENTS_FULL_CALENDAR_EVENT_LOADED_FOR_LOCK',
    (
        lockId: EventsCacheLockId,
        folderId: string,
        eventKey: string,
        itemResponseShapeType: CalendarEventItemResponseShapeType,
        event: CalendarEvent,
        hasEventChanged: boolean,
        forceOverrideAllPropertiesForEventIfAvailable: boolean
    ) => ({
        lockId,
        folderId,
        eventKey,
        itemResponseShapeType,
        event,
        hasEventChanged,
        forceOverrideAllPropertiesForEventIfAvailable,
    })
);

export const fullCalendarEventLoaded = action(
    'CALENDAR_EVENTS_FULL_CALENDAR_EVENT_LOADED',
    (
        folderId: string,
        eventKey: string,
        itemResponseShapeType: CalendarEventItemResponseShapeType,
        event: CalendarEvent
    ) => ({
        folderId,
        eventKey,
        itemResponseShapeType,
        event,
    })
);

/**
 * Update full calendar events related actions
 */
export const updateFullCalendarEventFromServer = action(
    'CALENDAR_EVENTS_UPDATE_FULL_CALENDAR_EVENT_FROM_SERVER',
    (partialCalendarEvent: CalendarEvent) => ({ partialCalendarEvent })
);

export const updateFullCalendarEventFromPartialCalendarEvent = action(
    'CALENDAR_EVENTS_UPDATE_FULL_CALENDAR_EVENT_FROM_PARTIAL_CALENDAR_EVENT',
    (partialCalendarEvent: CalendarEvent) => ({ partialCalendarEvent })
);

export const mergeEnhancedEventsIntoCache = action(
    'CALENDAR_EVENT_MERGE_EVENTS_INTO_CACHE',
    (events: Partial<CalendarEvent>[]) => ({
        events,
    })
);

/**
 * Remove full calendar events related actions
 */
export const removeFullCalendarEventInfo = action(
    'CALENDAR_EVENTS_REMOVE_FULL_CALENDAR_EVENT',
    (folderId: string, eventKey: string) => ({ folderId, eventKey })
);

export const removeAllFullCalendarEventsInfoForCache = action(
    'CALENDAR_EVENTS_REMOVE_ALL_FULL_CALENDAR_EVENTS_INFO_FOR_CACHE',
    (folderId: string) => ({ folderId })
);

/**
 * Insert or Update calendar events related actions
 */

export const upsertCalendarEventsToEventsCache = action(
    'ADD_CALENDAR_EVENTS_TO_EVENTS_CACHE',
    (
        folderId: string,
        calendarEvents: CalendarEvent[],
        dateRanges: DateRange[],
        forceReplace: boolean = false
    ) => ({
        folderId,
        calendarEvents,
        dateRanges,
        forceReplace,
    })
);

export const addCalendarEventsWithinCurrentLockedDateRanges = action(
    'ADD_CALENDAR_EVENTS_WITHING_CURRENT_LOCKED_DATE_RANGES',
    (folderId: string, calendarEvents: CalendarEvent[]) => ({ folderId, calendarEvents })
);

/**
 * Remove calendar events related actions
 */
export const removeCalendarEventWithInstanceKeyFromEventsCache = action(
    'REMOVE_CALENDAR_EVENT_WITH_INSTANCE_KEY_FROM_EVENTS_CACHE',
    (folderId: string, instanceKey: string) => ({ folderId, instanceKey })
);

export const internalRemoveCalendarEventWithInstanceKeyFromEventsCache = action(
    'INTERNAL_REMOVE_CALENDAR_EVENT_WITH_INSTANCE_KEY_FROM_EVENTS_CACHE',
    (
        folderId: string,
        instanceKey: string,
        onEventsRemoved: (removedEvents: CalendarEventEntity[]) => void
    ) => ({ folderId, instanceKey, onEventsRemoved })
);

export const internalRemoveCalendarEventsFromEventsCacheMatchingFilter = action(
    'INTERNAL_REMOVE_CALENDAR_EVENTS_FROM_EVENTS_CACHE_MATCHING_FILTER',
    (
        folderId: string,
        predicate: (event: CalendarEventEntity) => boolean,
        onEventsRemoved: (removedEvents: CalendarEventEntity[]) => void
    ) => ({ folderId, predicate, onEventsRemoved })
);

/**
 * Other events cache related actions
 */
export const releaseEventsCacheLock = action(
    'CALENDAR_EVENTS_RELEASE_LOCK',
    (lockId: EventsCacheLockId) => ({ lockId })
);

export const releaseLock = action('RELEASE_LOCK', (lockId: EventsCacheLockId) => ({ lockId }));

export const calendarEventsInEventsCacheReloaded = action(
    'CALENDAR_EVENTS_IN_EVENTS_CACHE_RELOADED',
    (
        folderId: string,
        eventsReloaded: CalendarEvent[],
        dateRanges: DateRange[],
        forceReplace: boolean = false
    ) => ({
        folderId,
        eventsReloaded,
        dateRanges,
        forceReplace,
    })
);

export const calendarEventsInDateRangeLoadedForLock = action(
    'CALENDAR_EVENTS_IN_DATE_RANGE_LOADED_FOR_LOCK',
    (
        lockId: EventsCacheLockId,
        folderId: string,
        dateRange: DateRange,
        calendarEvents: CalendarEvent[]
    ) => ({ lockId, folderId, dateRange, calendarEvents })
);

export const internalCalendarEventsInDateRangeLoadedForLock = action(
    'INTERNAL_CALENDAR_EVENTS_IN_DATE_RANGE_LOADED_FOR_LOCK',
    (
        lockId: EventsCacheLockId,
        folderId: string,
        dateRange: DateRange,
        calendarEvents: CalendarEvent[]
    ) => ({ lockId, folderId, dateRange, calendarEvents })
);

export const internalDeleteEventsCache = action(
    'INTERNAL_DELETE_EVENTS_CACHE',
    (folderId: string) => ({ folderId })
);

export const fullCalendarEventWasUsed = action(
    'CALENDAR_EVENTS_FULL_CALENDAR_EVENT_WAS_USED',
    (lockId: EventsCacheLockId, eventKey: string) => ({
        lockId,
        eventKey,
    })
);

export const updateItem = action(
    'UpdateItem',
    (existingItem: CalendarEvent, updatedItem: CalendarEvent) => ({
        existingItem,
        updatedItem,
    })
);
