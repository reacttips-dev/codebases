import { createLockedCalendarEventsStore, EventsCacheLockId } from 'owa-calendar-events-store';
import { UpNextCalendarEventsLoaderScenarioId } from '../UpNextV2Constants';

const lockedCalendarEventsStore = createLockedCalendarEventsStore(
    UpNextCalendarEventsLoaderScenarioId
);

export function getLockId(): EventsCacheLockId {
    return lockedCalendarEventsStore.getLockId();
}
