import { onUpNextEventUpdated } from '../actions/publicActions';
import { updateUpNextEvent } from '../actions/internalActions';
import { getUpNextCalendarEventId } from '../selectors/upNextStoreSelectors';
import { getCurrentUpNextEvent } from '../selectors/calendarLoaderStoreSelectors';
import type { EventsCacheLockId } from 'owa-calendar-events-loader';

export async function refreshUpNextCalendarEvent(
    eventsCacheLockId: EventsCacheLockId
): Promise<void> {
    const refreshedUpNextEvent = getCurrentUpNextEvent(eventsCacheLockId);
    const refreshedUpNextEventId = refreshedUpNextEvent ? refreshedUpNextEvent.ItemId : null;

    if (getUpNextCalendarEventId(eventsCacheLockId) === refreshedUpNextEventId) {
        return;
    }

    /** set the up next calendar in the store only if it has changed
     * to avoid unecessary component rerenders */
    updateUpNextEvent(refreshedUpNextEventId, eventsCacheLockId);
    onUpNextEventUpdated(
        refreshedUpNextEventId,
        refreshedUpNextEvent ? refreshedUpNextEvent.ParentFolderId : null,
        eventsCacheLockId
    );
}
