import createTaskPaneRunningInstance from '../store/createTaskPaneRunningInstance';
import getExtensibilityState from '../store/getExtensibilityState';
import type IAddinCommand from '../store/schema/interfaces/IAddinCommand';
import type TaskPaneType from '../store/schema/TaskPaneType';
import type { ExtensibilityModeEnum } from 'owa-addins-types';
import { mutatorAction } from 'satcheljs';
import type TaskPaneRunningInstance from '../store/schema/TaskPaneRunningInstance';
import { ObservableMap } from 'mobx';

export default mutatorAction(
    'setTaskPaneAddinCommand',
    function setTaskPaneAddinCommand(
        controlId: string,
        hostItemIndex: string,
        addinCommand: IAddinCommand,
        type: TaskPaneType,
        mode: ExtensibilityModeEnum,
        initializationContext?: string
    ) {
        const { taskPanes } = getExtensibilityState();

        const newTaskPane = createTaskPaneRunningInstance(
            controlId,
            addinCommand,
            hostItemIndex,
            mode,
            null /* errorType */,
            initializationContext
        );
        if (!taskPanes.has(hostItemIndex)) {
            taskPanes.set(
                hostItemIndex,
                new ObservableMap<TaskPaneType, TaskPaneRunningInstance>()
            );
        }
        taskPanes.get(hostItemIndex).set(type, newTaskPane);
    }
);
