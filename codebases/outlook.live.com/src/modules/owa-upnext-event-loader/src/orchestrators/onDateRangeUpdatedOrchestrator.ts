import { orchestrator } from 'satcheljs';
import { onDateRangeUpdated } from 'owa-calendar-events-loader';
import { refreshUpNextCalendarEvent } from './refreshUpNextCalendarEvent';
import { isUpNextScenarioInitialized } from '../selectors/upNextStoreSelectors';

export const onDateRangeUpdatedOrchestrator = orchestrator(onDateRangeUpdated, actionMessage => {
    const { eventsCacheLockId } = actionMessage;
    if (isUpNextScenarioInitialized(eventsCacheLockId)) {
        refreshUpNextCalendarEvent(eventsCacheLockId);
    }
});
