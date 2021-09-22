import { getLoadState } from 'owa-calendar-events-loader';
import { getUpNextCalendarEventWithConflicts } from 'owa-upnext-event-loader';
import { getLockId } from './getLockId';

/**
 * Gets the UpNext event for the UpNext scenario id which is shared between TimePanel
 * and UpNext so that both scenarios show the same event as up-coming.
 *
 * Also gets the conflicting events if there exists an up next event
 */
export function getUpNextEventWithConflicts() {
    /**
     * We can only get the UpNext event when the events for the UpNext calendars
     * and date range are loaded in the calendar store/cache
     */
    if (getLoadState(getLockId()) !== 'DoesNotExist') {
        return getUpNextCalendarEventWithConflicts(getLockId());
    }

    return null;
}
