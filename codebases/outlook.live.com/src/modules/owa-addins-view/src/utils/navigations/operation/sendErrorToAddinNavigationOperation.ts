import { getNavigationState, resetNavigationState } from '../NavigationState';
import { sendItemNullEvent } from '../SendItemEvent';
import {
    TaskPaneErrorType,
    TaskPaneRunningInstance,
    getTaskPaneRunningInstance,
    TaskPaneType,
    terminateTaskPaneAddinCommand,
} from 'owa-addins-store';

export default function sendErrorToAddinNavigationOperation(errorType: TaskPaneErrorType) {
    const navStateHostItemIndex = getNavigationState()?.hostItemIndex;
    const persistentTaskpaneRunningInstance: TaskPaneRunningInstance = getTaskPaneRunningInstance(
        TaskPaneType.Persistent,
        navStateHostItemIndex
    );
    const controlId = persistentTaskpaneRunningInstance?.controlId;

    if (errorType === TaskPaneErrorType.Empty || errorType === TaskPaneErrorType.Multi) {
        sendItemNullEvent(controlId);
    }

    resetNavigationState();
    terminateTaskPaneAddinCommand(TaskPaneType.Persistent, navStateHostItemIndex);
}
