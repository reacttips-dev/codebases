import getExtensibilityState from '../store/getExtensibilityState';
import type TaskPaneRunningInstance from '../store/schema/TaskPaneRunningInstance';
import TaskPaneType from '../store/schema/TaskPaneType';

export function getTaskPaneRunningInstance(
    type: TaskPaneType,
    hostItemIndex: string
): TaskPaneRunningInstance {
    const { taskPanes } = getExtensibilityState();
    return taskPanes?.get(hostItemIndex)?.get(type);
}

export function isHostItemOpenInMultipleWindows(hostItemIndex: string) {
    const { frameworkComponentHostItemIndexMap } = getExtensibilityState();
    let count = 0;
    for (let index of frameworkComponentHostItemIndexMap.values()) {
        if (index === hostItemIndex) {
            count++;
            if (count >= 2) {
                return true;
            }
        }
    }
    return false;
}

export function getTaskPaneRunningInstanceByControlId(controlId: string): TaskPaneRunningInstance {
    const { taskPanes } = getExtensibilityState();
    if (!taskPanes) {
        return null;
    }

    for (let taskPaneAddins of taskPanes.values()) {
        for (let instance of taskPaneAddins.values()) {
            if (instance.controlId === controlId) {
                return instance;
            }
        }
    }
    return null;
}

export function getTaskPaneType(controlId: string): TaskPaneType {
    const { taskPanes } = getExtensibilityState();
    if (!taskPanes) {
        return null;
    }

    for (let taskPaneAddins of taskPanes.values()) {
        for (let [type, taskPaneInstance] of taskPaneAddins) {
            if (taskPaneInstance.controlId === controlId) {
                return type;
            }
        }
    }
    return null;
}

export function getConverseTaskPaneType(type: TaskPaneType): TaskPaneType {
    return type === TaskPaneType.Persistent ? TaskPaneType.NonPersistent : TaskPaneType.Persistent;
}
