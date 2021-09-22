import openPersistentTaskPaneAddinCommand from '../../entryPointOperations/openPersistentTaskPaneAddinCommand';
import { getMode } from '../NavigationConditions';
import { setNavigationState, resetNavigationState } from '../NavigationState';
import { TaskPaneType, terminateTaskPaneAddinCommand } from 'owa-addins-store';
import { PersistedAddinCommand, getPersistedAddin } from 'owa-addins-persistent';

export default function reOpenAddinNavigationOperation(
    navStateHostItemIndex: string,
    hostItemIndex: string
) {
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

    terminateTaskPaneAddinCommand(TaskPaneType.Persistent, navStateHostItemIndex);
    openPersistentTaskPaneAddinCommand(hostItemIndex);
}
