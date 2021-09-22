import type IAddinCommand from './schema/interfaces/IAddinCommand';
import TaskPaneErrorType from './schema/TaskPaneErrorType';
import type TaskPaneRunningInstance from './schema/TaskPaneRunningInstance';
import type { ExtensibilityModeEnum } from 'owa-addins-types';

export default function createTaskPaneRunningInstance(
    controlId: string,
    addinCommand: IAddinCommand,
    hostItemIndex: string,
    mode?: ExtensibilityModeEnum,
    errorType?: TaskPaneErrorType,
    initializationContext?: string
): TaskPaneRunningInstance {
    return {
        controlId,
        addinCommand,
        hostItemIndex,
        mode,
        errorType: errorType || TaskPaneErrorType.None,
        initializationContext,
    };
}
