import { orchestrator } from 'satcheljs';
import { poll } from 'owa-request-manager';
import { calendarEventsLoaderInitialized, EventsCacheLockId } from 'owa-calendar-events-loader';
import { refreshUpNextCalendarEvent } from './refreshUpNextCalendarEvent';
import { isUpNextScenarioInitialized } from '../selectors/upNextStoreSelectors';

const REFRESH_UP_NEXT_INTERVAL = 10000;

export const initializeUpNextPollOrchestrator = orchestrator(
    calendarEventsLoaderInitialized,
    async actionMessage => {
        const { eventsCacheLockId } = actionMessage;
        if (isUpNextScenarioInitialized(eventsCacheLockId)) {
            await refreshUpNextCalendarEvent(eventsCacheLockId);
            /** Refresh the up next calendar event on an interval so that the up next
             * event stays up to date as time progresses */
            poll(() => pollRefresh(eventsCacheLockId), eventsCacheLockId, REFRESH_UP_NEXT_INTERVAL);
        }
    }
);

async function pollRefresh(eventsCacheLockId: EventsCacheLockId): Promise<{}> {
    await refreshUpNextCalendarEvent(eventsCacheLockId);
    return null;
}
