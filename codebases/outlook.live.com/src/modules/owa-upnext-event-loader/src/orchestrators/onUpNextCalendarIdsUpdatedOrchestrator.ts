import { orchestrator } from 'satcheljs';
import { onCalendarIdsUpdated } from 'owa-calendar-events-loader';
import { refreshUpNextCalendarEvent } from './refreshUpNextCalendarEvent';
import { isUpNextScenarioInitialized } from '../selectors/upNextStoreSelectors';

export const onUpNextCalendarIdsUpdatedOrchestrator = orchestrator(
    onCalendarIdsUpdated,
    actionMessage => {
        const { eventsCacheLockId } = actionMessage;
        if (isUpNextScenarioInitialized(eventsCacheLockId)) {
            refreshUpNextCalendarEvent(eventsCacheLockId);
        }
    }
);
