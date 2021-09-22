import openPersistentTaskPaneAddinCommand from '../../entryPointOperations/openPersistentTaskPaneAddinCommand';
import { getMode } from '../NavigationConditions';
import { sendItemUpdatedEvent } from '../SendItemEvent';
import { getNavigationState, setNavigationState, resetNavigationState } from '../NavigationState';
import {
    getTaskPaneRunningInstance,
    TaskPaneType,
    updatePersistentTaskPaneHostItem,
    TaskPaneRunningInstance,
} from 'owa-addins-store';
import { PersistedAddinCommand, getPersistedAddin } from 'owa-addins-persistent';

export default function sendItemUpdateToAddinNavigationOperation(hostItemIndex: string) {
    const navStateHostItemIndex = getNavigationState()?.hostItemIndex;
    const persistentTaskpaneRunningInstance: TaskPaneRunningInstance = getTaskPaneRunningInstance(
        TaskPaneType.Persistent,
        navStateHostItemIndex
    );

    const mode = getMode(hostItemIndex);
    const persistedAddin: PersistedAddinCommand = getPersistedAddin(mode);
    if (!persistedAddin) {
        resetNavigationState();
    } else {
        setNavigationState({
            hostItemIndex: hostItemIndex,
            mode: mode,
        });
    }

    if (persistentTaskpaneRunningInstance) {
        updatePersistentTaskPaneHostItem(navStateHostItemIndex, hostItemIndex);
        sendItemUpdatedEvent(hostItemIndex, persistentTaskpaneRunningInstance.controlId);
    } else {
        openPersistentTaskPaneAddinCommand(hostItemIndex);
    }
}
