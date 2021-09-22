import getContextualRunningInstance from '../utils/getContextualRunningInstance';
import type IAddinCommand from './schema/interfaces/IAddinCommand';
import { getTaskPaneRunningInstanceByControlId } from '../utils/taskPaneUtils';
import { getUilessAddinCommand } from '../utils/uilessUtils';

export default function getAddinCommandForControl(controlId: string): IAddinCommand {
    const taskPaneInstance = getTaskPaneRunningInstanceByControlId(controlId);
    if (taskPaneInstance) {
        return taskPaneInstance.addinCommand;
    }

    const contextualInstance = getContextualRunningInstance(controlId);
    if (contextualInstance) {
        return contextualInstance.addinCommand;
    }

    return getUilessAddinCommand(controlId);
}
