import { addDays, differenceInCalendarDays } from 'owa-datetime';
import { convertToCalendarEventEntity } from '../utils/lockedCalendarEvents/convertToCalendarEventEntity';
import type { DateRange } from 'owa-datetime-utils';
import { getAllFullItemInfo } from '../selectors/fullItemInfoSelectors';
import {
    getCalendarEventWithKey,
    getCalendarEventWithId,
} from '../selectors/calendarFolderEventsSelectors';
import { getEventsCache } from '../selectors/eventsCacheSelectors';
import { getStore } from '../store/store';
import { isCalendarEventEntity } from '../utils/typeGuards';
import { isRecurringMaster, hasRequiredOrOptionalAttendees } from 'owa-calendar-event-capabilities';
import { MAX_DATE_RANGE_IN_DAYS_PER_LOCKED_CACHE } from '../constants';
import { mutator } from 'satcheljs';
import {
    upsertEvents,
    addEventsInDateRangeForLock,
    releaseLock,
    removeEvents,
    createEventsCache,
    evictEventsExceptInDateRangeForLock,
    updateEventProperties,
    replaceEvents,
} from 'owa-events-cache';
import {
    upsertCalendarEventsToEventsCache,
    internalCalendarEventsInDateRangeLoadedForLock,
    fullCalendarEventLoaded,
    releaseEventsCacheLock,
    internalRemoveCalendarEventWithInstanceKeyFromEventsCache,
    internalRemoveCalendarEventsFromEventsCacheMatchingFilter,
    updateFullCalendarEventFromPartialCalendarEvent,
    internalDeleteEventsCache,
    updateItem,
    mergeEnhancedEventsIntoCache,
} from '../actions/eventsCacheActions';
import type { CalendarEvent } from 'owa-calendar-types';
import getEventKey from '../utils/getEventKey';

import assign from 'object-assign';

mutator(releaseEventsCacheLock, actionMessage => {
    const { lockId } = actionMessage;
    const store = getStore();

    // Go over all the calendar folder caches and release the lock
    [...store.calendarFolderEvents.keys()].forEach(folderId => {
        if (store.calendarFolderEvents.get(folderId).locksInfo.get(lockId)) {
            releaseLock(lockId, store.calendarFolderEvents.get(folderId));
        }
    });

    // Remove the full items info for the lock
    store.fullItemsMruMap.delete(lockId);
});

mutator(fullCalendarEventLoaded, actionMessage => {
    const { folderId, eventKey, event } = actionMessage;

    const existingCalendarEvent = getCalendarEventWithKey(eventKey, folderId);

    if (existingCalendarEvent) {
        // We only update the existing partial item to full item.
        // We force override the existing calendar event with the full calendar event
        // so that even though some properties might be undefined in full item
        // but we should use that as we don't want any old properties linger from older
        // partial item.
        updateEventProperties(existingCalendarEvent, event, true /* forceOverrideAllProperties */);
    }
});

mutator(updateFullCalendarEventFromPartialCalendarEvent, actionMessage => {
    let { partialCalendarEvent } = actionMessage;
    updateFullCalendarEventFromPartialCalendarEventInternal(partialCalendarEvent);
});

mutator(mergeEnhancedEventsIntoCache, actionMessage => {
    const { events } = actionMessage;
    events.forEach(event => {
        const existingCalendarEvent = getCalendarEventWithId(event.ItemId.Id);
        if (existingCalendarEvent) {
            // Skip updating event with REST attendees if client already has cached attendees from GetCalendarEvent.
            // This is because calendarView++ doesn't return RoutingType, and we don't want it to override the
            // RequiredAttendees and OptionalAttendees from GetCalendarEvent
            if (hasRequiredOrOptionalAttendees(existingCalendarEvent)) {
                delete event.RequiredAttendees;
                delete event.OptionalAttendees;
            }
            updateEventProperties(existingCalendarEvent, event);
        }
    });
});

mutator(internalCalendarEventsInDateRangeLoadedForLock, actionMessage => {
    const { lockId, folderId, dateRange, calendarEvents } = actionMessage;
    tryInitializeCalendarFolderEventsCache(folderId);

    const eventsCache = getEventsCache(folderId);

    // As `CalendarEvent` does not contain key so we convert
    // it to `CalendarEventEntity` by adding the `Key` field
    const allFullItemInfos = getAllFullItemInfo();

    // We convert entities to CalendarEventEntity and filter all the events that
    // are already maintained as full so that they dont get updated by the partial event
    // we also filter out all the RecurringMaster events from here, as they are only maintained as Full Items and never shown partial on any surface
    const calendarEventEntities = calendarEvents
        .filter(event => !isRecurringMaster(event.CalendarItemType))
        .map(event => convertToCalendarEventEntity(event.ItemId.Id, event))
        .filter(eventEntity => !allFullItemInfos[eventEntity.Key]);

    // Add the events in the cache for the provided lock
    addEventsInDateRangeForLock(dateRange, calendarEventEntities, lockId, eventsCache);

    const { lockedDateRange } = eventsCache.locksInfo.get(lockId);
    const datesCached = differenceInCalendarDays(lockedDateRange.end, lockedDateRange.start);

    if (datesCached > MAX_DATE_RANGE_IN_DAYS_PER_LOCKED_CACHE) {
        // If the cached range is greater than max that needs to maintained
        // then evict the rest
        const dateRangeToRetain = getDateRangeToRetain(
            lockedDateRange,
            dateRange,
            MAX_DATE_RANGE_IN_DAYS_PER_LOCKED_CACHE
        );

        evictEventsExceptInDateRangeForLock(dateRangeToRetain, lockId, eventsCache);
    }
});

mutator(internalRemoveCalendarEventWithInstanceKeyFromEventsCache, actionMessage => {
    const { folderId, instanceKey, onEventsRemoved } = actionMessage;
    tryInitializeCalendarFolderEventsCache(folderId);

    const eventsCache = getEventsCache(folderId);

    const eventsRemoved = removeEvents(event => event.InstanceKey === instanceKey, eventsCache);

    onEventsRemoved(eventsRemoved);
});

mutator(internalRemoveCalendarEventsFromEventsCacheMatchingFilter, actionMessage => {
    const { folderId, predicate, onEventsRemoved } = actionMessage;
    tryInitializeCalendarFolderEventsCache(folderId);

    const eventsCache = getEventsCache(folderId);

    const eventsRemoved = removeEvents(predicate, eventsCache);

    onEventsRemoved(eventsRemoved);
});

mutator(internalDeleteEventsCache, actionMessage => {
    const { folderId } = actionMessage;

    // Delete the calendar folder cache
    const store = getStore();
    store.calendarFolderEvents.delete(folderId);
});

mutator(upsertCalendarEventsToEventsCache, actionMessage => {
    const { folderId, calendarEvents, dateRanges, forceReplace } = actionMessage;
    tryInitializeCalendarFolderEventsCache(folderId);

    const calendarEventEntities = calendarEvents.map(event =>
        convertToCalendarEventEntity(event.ItemId.Id, event)
    );

    const eventsCache = getEventsCache(folderId);

    if (forceReplace) {
        replaceEvents(calendarEventEntities, eventsCache, dateRanges);
    } else {
        upsertEvents(calendarEventEntities, eventsCache.events);
    }
});

mutator(updateItem, actionMessage => {
    assign(actionMessage.existingItem, actionMessage.updatedItem);
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
 * This returns the date range which should be retained with the constraint of the provided max days
 * @param completeRange The range that we have
 * @param requestedRange The range which should be maintained as much as we can
 * @param maxDays The maximum days we can retain
 */
function getDateRangeToRetain(
    completeRange: DateRange,
    requestedRange: DateRange,
    maxDays: number
): DateRange {
    const daysInRequestedRange = differenceInCalendarDays(requestedRange.end, requestedRange.start);

    if (daysInRequestedRange === maxDays) {
        // If the requested range number of days is same as the max we can retain then we return it
        return requestedRange;
    } else if (daysInRequestedRange > maxDays) {
        // If the requested range is bigger than the max days we can retain then
        // we get the range upto max days from the start of requested range
        return {
            start: requestedRange.start,
            end: addDays(requestedRange.start, maxDays),
        };
    } else {
        // The number of days in requested range is less than max days that
        // we can retain. We will try adding more dates to it from the `completeRange`
        let otherDaysThatCanBeCached = maxDays - daysInRequestedRange;
        const requestEndToCompleteRange = Math.abs(
            differenceInCalendarDays(requestedRange.end, completeRange.end)
        );
        const requestStartToCompleteRange = Math.abs(
            differenceInCalendarDays(completeRange.start, requestedRange.start)
        );

        let { start, end } = requestedRange;

        if (requestEndToCompleteRange > 0) {
            // If there are some number of days between the requestedRage.end and completeRange.end
            // then add it to the range we need to retain
            const daysToAdd = Math.min(otherDaysThatCanBeCached, requestEndToCompleteRange);

            end = addDays(end, daysToAdd);
            otherDaysThatCanBeCached -= daysToAdd;
        }

        if (otherDaysThatCanBeCached > 0 && requestStartToCompleteRange > 0) {
            // If we have not exceeded the max days and there are days in between the
            // requestedRange.start and completeRange.start then add it to the range
            const daysToSub = Math.min(otherDaysThatCanBeCached, requestStartToCompleteRange);

            start = addDays(start, -1 * daysToSub);
        }

        return { start, end };
    }
}

function updateFullCalendarEventFromPartialCalendarEventInternal(eventToMerge: CalendarEvent) {
    if (isCalendarEventEntity(eventToMerge)) {
        // If the event is a calendar event entity then we
        // get the object that is without the key so that when
        // we use `assign` to update the properties of `existingCalendarEvent`
        // then the key doesnt get changed.
        const { Key: _, ...restOfObject } = eventToMerge;

        eventToMerge = restOfObject;
    }

    const eventKey = getEventKey(eventToMerge);

    const folderId = eventToMerge.ParentFolderId?.Id;

    if (folderId) {
        const existingCalendarEvent = getCalendarEventWithKey(eventKey, folderId);

        if (existingCalendarEvent) {
            updateEventProperties(existingCalendarEvent, eventToMerge);
        }
    }
}
