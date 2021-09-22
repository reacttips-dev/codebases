import { loadingCalendarEvents } from 'owa-calendar-events-store';
import { mutator } from 'satcheljs';
import {
    getCalendarEventsLoadStates,
    getCalendarEventsLoadStatesKeys,
    isCalendarEventsLoaderLockId,
} from '../selectors/calendarEventsLoaderStoreSelectors';
import {
    updateCalendarEventLoadStates,
    resetCalendarEventLoadStates,
} from '../actions/internalActions';

/**
 * Sets loading state of calendar events for a particular calendar and lockID,
 * In other words, this sets the load state of calendar events from calendar Calendar, and date range DateRange.
 * where DateRange is the date range locked by lockId, and Calendar is one of the calendars locked by lockId.
 */
mutator(loadingCalendarEvents, actionMessage => {
    const { calendarId, loadingState, lockId } = actionMessage;
    const isStoredLockId = isCalendarEventsLoaderLockId(lockId);
    if (isStoredLockId.value) {
        const eventsCacheLockId = isStoredLockId.eventsCacheLockId;
        const loadStates = getCalendarEventsLoadStates(eventsCacheLockId);
        if (calendarId && loadStates.has(calendarId.id)) {
            loadStates.set(calendarId.id, loadingState);
        }
    }
});

/**
 * Updates the calendar load states to reflect an updated set of calendar ids set by a lock consumer.
 */
mutator(updateCalendarEventLoadStates, actionMessage => {
    const { calendarIds, eventsCacheLockId } = actionMessage;
    let calendarEventsLoadState = getCalendarEventsLoadStates(eventsCacheLockId);

    // Add new calendars in calendarIds to calendarEventsLoadState
    calendarIds.forEach(id => {
        /**
         * If the calendar already exists in `calendarEventsLoadState` maintain its previous value.
         * If it does not, add it to `calendarEventsLoadState` with a load state of `NotLoaded` indicating that events
         * have not been loaded for this calendar.
         **/
        if (!calendarEventsLoadState.has(id)) {
            calendarEventsLoadState.set(id, 'NotLoaded');
        }
    });

    // Remove calendars not in calendarIds from calendarEventsLoadState
    getCalendarEventsLoadStatesKeys(eventsCacheLockId).forEach(calendarId => {
        if (!calendarIds.some(id => id === calendarId)) {
            calendarEventsLoadState.delete(calendarId);
        }
    });
});

/**
 * Resets all of the loading values to `NotLoaded`.
 */
mutator(resetCalendarEventLoadStates, actionMessage => {
    const { eventsCacheLockId } = actionMessage;
    let calendarEventsLoadState = getCalendarEventsLoadStates(eventsCacheLockId);

    getCalendarEventsLoadStatesKeys(eventsCacheLockId).forEach(calendarId => {
        calendarEventsLoadState.set(calendarId, 'NotLoaded');
    });
});
