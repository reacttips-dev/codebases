import getContextualRunningInstance from './getContextualRunningInstance';
import { getTaskPaneRunningInstanceByControlId } from '../utils/taskPaneUtils';
import { getUilessHostItemIndex } from './uilessUtils';

export default function getHostItemIndex(controlId: string): string {
    const taskPaneInstance = getTaskPaneRunningInstanceByControlId(controlId);
    if (taskPaneInstance) {
        return taskPaneInstance.hostItemIndex;
    }

    const contextualInstance = getContextualRunningInstance(controlId);
    if (contextualInstance) {
        return contextualInstance.hostItemIndex;
    }

    return getUilessHostItemIndex(controlId);
}
