import { orchestrator } from 'satcheljs';
import { updateIsDatePickerExpanded } from '../actions/publicActions';
import { updateIsTimePanelDatePickerExpandedService } from 'owa-scenario-settings';
import { createRetriableFunction, createExponentialBackoffFunction } from 'owa-retriable-function';
import { trace } from 'owa-trace';

const createRetriableFunc = createRetriableFunction({
    maximumAttempts: 3,
    timeBetweenRetryInMS: createExponentialBackoffFunction(1000),
});
let currentRequest: { retriableFunc: () => Promise<void>; cancel: () => void } = null;

orchestrator(updateIsDatePickerExpanded, async actionMessage => {
    const { isExpanded } = actionMessage;
    try {
        // if there is a request out to update the selected view, cancel it
        if (currentRequest) {
            currentRequest.cancel();
        }
        currentRequest = createRetriableFunc(() =>
            updateIsTimePanelDatePickerExpandedService(isExpanded)
        );
        await currentRequest.retriableFunc();
    } catch (error) {
        trace.warn(
            `updateIsDatePickerExpandedOrchestrator: updateIsTimePanelDatePickerExpandedService with retry failed: ${error}`
        );
    }
    currentRequest = null;
});
