import TaskPaneType from '../store/schema/TaskPaneType';
import { getTaskPaneRunningInstance } from '../utils/taskPaneUtils';
import { mutatorAction } from 'satcheljs';
import getExtensibilityState from '../store/getExtensibilityState';
import type TaskPaneRunningInstance from '../store/schema/TaskPaneRunningInstance';
import { ObservableMap } from 'mobx';
import TaskPaneErrorType from '../store/schema/TaskPaneErrorType';

export default mutatorAction(
    'updatePersistentTaskPaneHostItem',
    function updatePersistentTaskPaneHostItem(
        prevNavStateHostItemIndex: string,
        hostItemIndex: string
    ) {
        const { taskPanes, frameworkComponentHostItemIndexMap } = getExtensibilityState();

        if (taskPanes.has(prevNavStateHostItemIndex)) {
            //get persitent addin from previous item and update hostitemindex
            const persistentTaskPane = getTaskPaneRunningInstance(
                TaskPaneType.Persistent,
                prevNavStateHostItemIndex
            );
            persistentTaskPane.hostItemIndex = hostItemIndex;
            persistentTaskPane.errorType = TaskPaneErrorType.None;

            //remove from map for previous hostitemindex
            taskPanes.get(prevNavStateHostItemIndex).delete(TaskPaneType.Persistent);
            if (taskPanes.get(prevNavStateHostItemIndex).size === 0) {
                taskPanes.delete(prevNavStateHostItemIndex);
            }

            //set persitent addin for new item in map
            if (!taskPanes.has(hostItemIndex)) {
                taskPanes.set(
                    hostItemIndex,
                    new ObservableMap<TaskPaneType, TaskPaneRunningInstance>()
                );
            }
            taskPanes.get(hostItemIndex).set(TaskPaneType.Persistent, persistentTaskPane);
            frameworkComponentHostItemIndexMap.set('exfc_main', hostItemIndex);
        }
    }
);
