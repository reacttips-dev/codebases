import type { CalendarEventEntity } from '../store/schema/CalendarEventEntity';
import { getAllCalendarEvents, getAllLockedDateRanges } from '../selectors/eventsCacheSelectors';
import { getCalendarEventsOverlappingDateRanges } from '../utils/getCalendarEventsOverlappingDateRanges';
import { orchestrator } from 'satcheljs';
import {
    calendarEventsInDateRangeLoadedForLock,
    internalCalendarEventsInDateRangeLoadedForLock,
    upsertCalendarEventsToEventsCache,
    addCalendarEventsWithinCurrentLockedDateRanges,
    calendarEventsInEventsCacheReloaded,
    removeCalendarEventWithInstanceKeyFromEventsCache,
    internalRemoveCalendarEventWithInstanceKeyFromEventsCache,
    removeAllFullCalendarEventsInfoForCache,
    internalDeleteEventsCache,
    removeFullCalendarEventInfo,
} from '../actions/eventsCacheActions';
import {
    cacheReloaded,
    calendarEventsAdded,
    calendarEventsRemoved,
    deleteEventsCache,
} from '../actions/publicActions';
import { unsubscribeNotifications } from '../utils/CalendarItemNotifications';

orchestrator(cacheReloaded, actionMessage => {
    const { previousEvents, reloadedEvents } = actionMessage;
    if (reloadedEvents) {
        if (previousEvents) {
            // When cache reloads trigger an event with
            // what events were removed (which were previously in cache)
            calendarEventsRemoved(previousEvents);
        }

        // Trigger an event which indicates which events got added
        // due to cache being reloaded
        calendarEventsAdded(reloadedEvents);
    }
});

orchestrator(removeCalendarEventWithInstanceKeyFromEventsCache, actionMessage => {
    const { folderId, instanceKey } = actionMessage;

    let eventsRemoved: CalendarEventEntity[] = null;
    internalRemoveCalendarEventWithInstanceKeyFromEventsCache(folderId, instanceKey, er => {
        eventsRemoved = er;
    });

    if (eventsRemoved) {
        // For the events being removed trigger a corresponding remove of full item info
        // and trigger the action indicating events that got removed
        eventsRemoved.forEach(event => removeFullCalendarEventInfo(folderId, event.Key));
        calendarEventsRemoved(eventsRemoved);
    }
});

orchestrator(calendarEventsInDateRangeLoadedForLock, actionMessage => {
    const { lockId, folderId, dateRange, calendarEvents } = actionMessage;

    internalCalendarEventsInDateRangeLoadedForLock(lockId, folderId, dateRange, calendarEvents);

    if (calendarEvents) {
        calendarEventsAdded(calendarEvents);
    }
});

orchestrator(addCalendarEventsWithinCurrentLockedDateRanges, actionMessage => {
    const { folderId, calendarEvents } = actionMessage;

    const lockedDateRanges = getAllLockedDateRanges(folderId);
    const { eventsOverlapping } = getCalendarEventsOverlappingDateRanges(
        calendarEvents,
        lockedDateRanges
    );

    if (eventsOverlapping.length > 0) {
        // If there are events that overlap with the current locked date ranges
        // then add those to cache, ignore the rest
        upsertCalendarEventsToEventsCache(folderId, eventsOverlapping, lockedDateRanges);
        calendarEventsAdded(eventsOverlapping);
    }
});

orchestrator(calendarEventsInEventsCacheReloaded, actionMessage => {
    const { folderId, eventsReloaded, dateRanges, forceReplace } = actionMessage;

    // get a cloned copy of array so it does not hold a reference to cache.events
    // and can be passed to cacheReloaded action even after modifitions to actual cache.events via upsertCalendarEventsToEventsCache
    const originalItems = getAllCalendarEvents(folderId);
    const { eventsOverlapping } = getCalendarEventsOverlappingDateRanges(originalItems, dateRanges);

    upsertCalendarEventsToEventsCache(folderId, eventsReloaded, dateRanges, forceReplace);

    cacheReloaded(eventsOverlapping, eventsReloaded);
});

orchestrator(deleteEventsCache, actionMessage => {
    const { folderId } = actionMessage;
    unsubscribeNotifications(folderId);
    removeAllFullCalendarEventsInfoForCache(folderId);
    internalDeleteEventsCache(folderId);
});
