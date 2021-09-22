import { orchestrator } from 'satcheljs';
import { updateIsTaskListSelected } from '../actions/publicActions';
import { updateIsTimePanelCalendarViewTaskListSelectedService } from 'owa-scenario-settings';
import { createRetriableFunction, createExponentialBackoffFunction } from 'owa-retriable-function';
import { trace } from 'owa-trace';

const createRetriableFunc = createRetriableFunction({
    maximumAttempts: 3,
    timeBetweenRetryInMS: createExponentialBackoffFunction(1000),
});
let currentRequest: { retriableFunc: () => Promise<void>; cancel: () => void } = null;

orchestrator(updateIsTaskListSelected, async actionMessage => {
    const { isSelected } = actionMessage;
    try {
        // if there is a request out to update the selected view, cancel it
        if (currentRequest) {
            currentRequest.cancel();
        }
        currentRequest = createRetriableFunc(() =>
            updateIsTimePanelCalendarViewTaskListSelectedService(isSelected)
        );
        await currentRequest.retriableFunc();
    } catch (error) {
        trace.warn(
            `updateIsTaskListSelectedOrchestrator: updateIsTimePanelCalendarViewTaskListSelectedService with retry failed: ${error}`
        );
    }
    currentRequest = null;
});
