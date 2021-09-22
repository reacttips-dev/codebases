import getExtensibilityState from '../store/getExtensibilityState';
import type TaskPaneRunningInstance from '../store/schema/TaskPaneRunningInstance';
import type TaskPaneType from '../store/schema/TaskPaneType';
import { getConverseTaskPaneType, getTaskPaneRunningInstance } from '../utils/taskPaneUtils';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'toggleTaskPaneType',
    function toggleTaskPaneType(type: TaskPaneType, hostItemIndex: string) {
        const taskPane: TaskPaneRunningInstance = getTaskPaneRunningInstance(type, hostItemIndex);
        if (!taskPane) {
            return;
        }

        const { taskPanes } = getExtensibilityState();
        if (taskPanes.has(hostItemIndex)) {
            taskPanes.get(hostItemIndex).delete(type);
            taskPanes.get(hostItemIndex).set(getConverseTaskPaneType(type), taskPane);
        }
    }
);
