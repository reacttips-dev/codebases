import type ExtensibilityState from './schema/ExtensibilityState';
import getExtensibilityState from './getExtensibilityState';
import type TaskPaneRunningInstance from './schema/TaskPaneRunningInstance';

export default function getAllActiveControlIds(hostItemIndex: string): string[] {
    const state = getExtensibilityState();
    const taskPaneIds = getTaskPaneControlIds(hostItemIndex, state);
    const uilessIds = getUilessControlIds(hostItemIndex, state);
    const contextualIds = getContextualControlIds(hostItemIndex, state);
    return [...taskPaneIds, ...uilessIds, ...contextualIds];
}

function getTaskPaneControlIds(hostItemIndex: string, state: ExtensibilityState): string[] {
    let taskpanesForHostItemIndex = state.taskPanes.get(hostItemIndex);
    if (!taskpanesForHostItemIndex) {
        return [];
    }

    return [...taskpanesForHostItemIndex.values()].map(
        (taskPane: TaskPaneRunningInstance) => taskPane.controlId
    );
}

function getUilessControlIds(hostItemIndex: string, state: ExtensibilityState): string[] {
    const uilessAddins = state.runningUILessExtendedAddinCommands;
    if (uilessAddins.has(hostItemIndex)) {
        return [...uilessAddins.get(hostItemIndex).keys()];
    }
    return [];
}

function getContextualControlIds(hostItemIndex: string, state: ExtensibilityState): string[] {
    const contextualAddins = state.runningContextualAddinCommand;
    if (contextualAddins && contextualAddins.hostItemIndex === hostItemIndex) {
        return [state.runningContextualAddinCommand.controlId];
    }
    return [];
}
