import getExtensibilityState from '../store/getExtensibilityState';
import type TaskPaneType from '../store/schema/TaskPaneType';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'terminateTaskPaneAddin',
    function terminateTaskPaneAddin(type: TaskPaneType, hostItemIndex: string) {
        const { taskPanes } = getExtensibilityState();

        if (taskPanes.has(hostItemIndex)) {
            taskPanes.get(hostItemIndex).delete(type);
            if (taskPanes.get(hostItemIndex).size === 0) {
                taskPanes.delete(hostItemIndex);
            }
        }
    }
);
