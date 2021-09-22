import { getStore } from '../store/store';
import { mutator } from 'satcheljs';
import { setCalendarLoadState } from '../actions/internalActions';
import { removeCalendarWithIDFromCalendarsCache } from 'owa-calendar-cache';

mutator(setCalendarLoadState, actionMessage => {
    const { calendarId, loadState } = actionMessage;
    getStore().calendarIdsLoadState.set(calendarId, loadState);
});

mutator(removeCalendarWithIDFromCalendarsCache, actionMessage => {
    const { calendarId, shouldPersistCalendarEntry } = actionMessage;
    // when we are deleting the calendar entry from the store, then removing the loading state entry as well.
    if (!shouldPersistCalendarEntry) {
        getStore().calendarIdsLoadState.delete(calendarId);
    }
});
