import { createRetriableFunction, createExponentialBackoffFunction } from 'owa-retriable-function';
import { trace } from 'owa-trace';
import { updateShouldAutoOpenTimePanelService } from 'owa-scenario-settings';

const createRetriableFunc = createRetriableFunction({
    maximumAttempts: 3,
    timeBetweenRetryInMS: createExponentialBackoffFunction(1000),
});

let currentRequest: { retriableFunc: () => Promise<void>; cancel: () => void } = null;

export async function updateShouldAutoOpenTimePanel(isOpen: boolean) {
    try {
        // if there is a request out to update, cancel it
        if (currentRequest) {
            currentRequest.cancel();
        }
        currentRequest = createRetriableFunc(() => updateShouldAutoOpenTimePanelService(isOpen));
        await currentRequest.retriableFunc();
    } catch (error) {
        trace.warn(
            `updateShouldAutoOpenTimePanel: updateShouldAutoOpenTimePanelService with retry failed: ${error}`
        );
    }
    currentRequest = null;
}
