import { getAdapter, TaskPaneAdapter } from 'owa-addins-adapters';
import {
    terminateTaskPaneAddinCommand,
    getTaskPaneRunningInstanceByControlId,
    getTaskPaneType,
    TaskPaneType,
} from 'owa-addins-store';
import { action } from 'satcheljs';

export const resetNavigationStateAction = action('resetNavigationState');

export default function closeTaskPaneAddinCommandByControlId(controlId: string) {
    let runningTaskPane = getTaskPaneRunningInstanceByControlId(controlId);
    if (!runningTaskPane) {
        return;
    }

    const hostItemIndex = runningTaskPane.hostItemIndex;
    const taskPaneType = getTaskPaneType(controlId);

    if (taskPaneType == TaskPaneType.Persistent) {
        resetNavigationStateAction();
    }
    terminateTaskPaneAddinCommand(taskPaneType, hostItemIndex);

    const adapter = getAdapter(hostItemIndex);
    if (!!adapter && (<TaskPaneAdapter>adapter).closeTaskPane) {
        (<TaskPaneAdapter>adapter).closeTaskPane();
    }
}
