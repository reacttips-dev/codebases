import getExtensibilityState from './getExtensibilityState';
import getContextualRunningInstance from '../utils/getContextualRunningInstance';
import { getTaskPaneRunningInstanceByControlId } from '../utils/taskPaneUtils';
import { getUilessAddinCommand } from '../utils/uilessUtils';
import ExtensionEntryPointEnum from './schema/enums/ExtensionEntryPointEnum';

export default function getEntryPointForControl(controlId: string): ExtensionEntryPointEnum {
    const { activeDialogs } = getExtensibilityState();
    for (let activeDialog of activeDialogs.values()) {
        if (activeDialog && controlId === activeDialog.controlId) {
            return ExtensionEntryPointEnum.Dialog;
        }
    }

    const taskPaneInstance = getTaskPaneRunningInstanceByControlId(controlId);
    if (taskPaneInstance) {
        return ExtensionEntryPointEnum.TaskPane;
    }

    const contextualInstance = getContextualRunningInstance(controlId);
    if (contextualInstance) {
        return ExtensionEntryPointEnum.Contextual;
    }

    const uilessInstance = getUilessAddinCommand(controlId);
    if (uilessInstance) {
        return ExtensionEntryPointEnum.UILess;
    }

    return ExtensionEntryPointEnum.Unknown;
}
