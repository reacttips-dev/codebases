import { orchestrator } from 'satcheljs';
import { loadFullEvent } from '../actions/publicActions';
import { getEventLockCacheId } from '../selectors/calendarEventsLoaderStoreSelectors';
import { getLockedCalendarEventsStore } from '../selectors/calendarEventsLockedStoreSelectors';

export const loadFullEventOrchestrator = orchestrator(loadFullEvent, actionMessage => {
    const { eventsCacheLockId, parentFolderId, id } = actionMessage;
    const lockId = getEventLockCacheId(eventsCacheLockId);
    const { fetchFullCalendarEvent } = getLockedCalendarEventsStore(lockId);
    fetchFullCalendarEvent(
        id,
        parentFolderId ? parentFolderId.Id : null /** folderId */,
        undefined /** getExistingCalendarEvent */,
        undefined /** isfetchFullSeriesMasterCalendarEventFromEventInstance */,
        { fetchSource: eventsCacheLockId } /** customData */
    );
});
