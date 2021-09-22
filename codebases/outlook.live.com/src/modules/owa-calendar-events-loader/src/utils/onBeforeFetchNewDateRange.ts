import { updateLoadedDateRange, resetCalendarEventLoadStates } from '../actions/internalActions';
import type { EventsCacheLockId } from 'owa-calendar-events-store';

export function onBeforeFetchNewDateRange(eventsCacheLockId: EventsCacheLockId) {
    // Reset all the calendars' calendar event load states to `NotLoaded` to reflect the fact we are fetching
    // a new date range of calendar events
    resetCalendarEventLoadStates(eventsCacheLockId);
    updateLoadedDateRange(null, eventsCacheLockId);
}
