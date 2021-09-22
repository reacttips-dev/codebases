import { orchestrator } from 'satcheljs';
import { updateSelectedCalendarView } from '../actions/publicActions';
import { updateSelectedCalendarListViewService } from 'owa-scenario-settings';
import { createRetriableFunction, createExponentialBackoffFunction } from 'owa-retriable-function';
import { trace } from 'owa-trace';
import { updateSelectedCalendarViewInStore } from '../actions/internalActions';

const createRetriableFunc = createRetriableFunction({
    maximumAttempts: 3,
    timeBetweenRetryInMS: createExponentialBackoffFunction(1000),
});

let currentRequest: { retriableFunc: () => Promise<void>; cancel: () => void } = null;
orchestrator(updateSelectedCalendarView, async actionMessage => {
    const { updatedView } = actionMessage;
    // update the selected Agenda/ Day selection regardless of the success saving the option
    updateSelectedCalendarViewInStore(updatedView);
    try {
        // if there is a request out to update the selected view, cancel it
        if (currentRequest) {
            currentRequest.cancel();
        }
        currentRequest = createRetriableFunc(() =>
            updateSelectedCalendarListViewService(updatedView)
        );
        await currentRequest.retriableFunc();
    } catch (error) {
        trace.warn(
            `updateSelectedCalendarViewOrchestrator: updateSelectedCalendarView with retry failed: ${error}`
        );
    }
    currentRequest = null;
});
