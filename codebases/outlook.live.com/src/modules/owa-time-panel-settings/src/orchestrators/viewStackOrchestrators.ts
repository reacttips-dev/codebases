import { updateTopTimePanelView } from '../actions/publicActions';
import type { PanelView } from '../store/schema/TimePanelSettingsStore';
import { isSupportedViewForUser } from '../utils/isSupportedViewForUser';
import { createExponentialBackoffFunction, createRetriableFunction } from 'owa-retriable-function';
import { trace } from 'owa-trace';
import { orchestrator } from 'satcheljs';
import {
    updateTimePanelSelectedViewService,
    TimePanelSelectedViewType,
} from 'owa-scenario-settings';

const createRetriableFunc = createRetriableFunction({
    maximumAttempts: 3,
    timeBetweenRetryInMS: createExponentialBackoffFunction(1000),
});
let currentRequest: { retriableFunc: () => Promise<void>; cancel: () => void } = null;
orchestrator(updateTopTimePanelView, async actionMessage => {
    const { updatedView } = actionMessage;
    if (isTimePanelSelectedViewType(updatedView) && isSupportedViewForUser(updatedView)) {
        try {
            // if there is a request out to update the selected view, cancel it
            if (currentRequest) {
                currentRequest.cancel();
            }
            currentRequest = createRetriableFunc(() =>
                updateTimePanelSelectedViewService(updatedView)
            );
            await currentRequest.retriableFunc();
        } catch (error) {
            trace.warn(
                `viewStackOrchestrator: updateTimePanelSelectedViewService with retry failed: ${error}`
            );
        }
        currentRequest = null;
    }
});

function isTimePanelSelectedViewType(viewType: PanelView): viewType is TimePanelSelectedViewType {
    return viewType === 'Tasks' || viewType === 'Calendar';
}
