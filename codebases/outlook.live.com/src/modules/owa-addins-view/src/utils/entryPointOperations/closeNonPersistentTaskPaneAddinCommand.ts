import {
    terminateTaskPaneAddinCommand,
    getTaskPaneRunningInstance,
    TaskPaneType,
    isHostItemOpenInMultipleWindows,
} from 'owa-addins-store';

export default function closeNonPersistentTaskPaneAddinCommand(hostItemIndex: string) {
    // if same host item is open in more than one window, do not remove taskpane from map
    if (isHostItemOpenInMultipleWindows(hostItemIndex)) {
        return;
    }

    const runningTaskPane = getTaskPaneRunningInstance(TaskPaneType.NonPersistent, hostItemIndex);
    if (!runningTaskPane || (hostItemIndex && runningTaskPane.hostItemIndex !== hostItemIndex)) {
        return;
    }

    terminateTaskPaneAddinCommand(TaskPaneType.NonPersistent, hostItemIndex);
}
