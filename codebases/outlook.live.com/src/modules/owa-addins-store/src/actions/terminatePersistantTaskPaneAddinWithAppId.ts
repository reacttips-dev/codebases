import getExtensibilityState from '../store/getExtensibilityState';
import type TaskPaneRunningInstance from '../store/schema/TaskPaneRunningInstance';
import TaskPaneType from '../store/schema/TaskPaneType';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'terminatePersistantTaskPaneAddinWithAppId',
    function terminatePersistantTaskPaneAddinWithAppId(addinId: string) {
        const { taskPanes } = getExtensibilityState();
        for (let [hostItemIndex, taskPaneAddins] of taskPanes) {
            const persistentTaskpane: TaskPaneRunningInstance = taskPaneAddins.get(
                TaskPaneType.Persistent
            );
            if (persistentTaskpane?.addinCommand?.extension?.Id === addinId) {
                taskPanes.get(hostItemIndex).delete(TaskPaneType.Persistent);
                if (taskPanes.get(hostItemIndex).size === 0) {
                    taskPanes.delete(hostItemIndex);
                }
            }
        }
    }
);
