import { orchestrator } from 'satcheljs';
import { initializeUpNextEventLoader } from '../actions/publicActions';
import { updateUpNextEvent } from '../actions/internalActions';
import { initializeCalendarEventsLoader } from 'owa-calendar-events-loader';
import { getUpNextDateRange } from '../selectors/dateTimeStoreSelectors';
import { isUpNextScenarioInitialized } from '../selectors/upNextStoreSelectors';

export const initializeUpNextEventLoaderOrchestrator = orchestrator(
    initializeUpNextEventLoader,
    actionMessage => {
        const { calendarIds, eventsCacheLockId } = actionMessage;
        const upNextDateRange = getUpNextDateRange();
        if (!isUpNextScenarioInitialized(eventsCacheLockId)) {
            /**
             * initializeUpNextPollOrchestrator in this package will be triggered every time calendarEventsLoaderInitialized
             * action fires, regardless if this is an up next scenario or not. We initialize the scenario in our store here so that we can
             * distinguish between scenarios that are up next, and those that are not when calendarEventsLoaderInitialized is triggered
             *  */
            updateUpNextEvent(null, eventsCacheLockId);
        }
        initializeCalendarEventsLoader(eventsCacheLockId, calendarIds, upNextDateRange);
    }
);
