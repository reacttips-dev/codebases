import closeNonPersistentTaskPaneAddinCommand from './closeNonPersistentTaskPaneAddinCommand';
import type { ExtensibilityModeEnum } from 'owa-addins-types';
import { getAdapter, TaskPaneAdapter } from 'owa-addins-adapters';
import { getPersistedAddin, PersistedAddinCommand } from 'owa-addins-persistent';
import {
    AddinCommand,
    getNextControlId,
    getTaskPaneRunningInstance,
    IAddinCommand,
    setTaskPaneAddinCommand,
    TaskPaneType,
} from 'owa-addins-store';

function isDuplicateAddinCommand(
    originalAddinCommand: IAddinCommand,
    newAddinCommand: IAddinCommand
): boolean {
    return (
        originalAddinCommand &&
        newAddinCommand &&
        originalAddinCommand.get_Id() === newAddinCommand.get_Id()
    );
}

function getAddinCommandTaskPaneType(
    addinCommand: AddinCommand,
    mode: ExtensibilityModeEnum
): TaskPaneType {
    const persistedAddinCommmand: PersistedAddinCommand = getPersistedAddin(mode);
    if (!persistedAddinCommmand) {
        return TaskPaneType.NonPersistent;
    }

    const { addinId, commandId } = persistedAddinCommmand;
    const isPersisted: boolean = addinCommand.get_Id() === `${addinId}${commandId}`;
    return isPersisted ? TaskPaneType.Persistent : TaskPaneType.NonPersistent;
}

export default function openNonPersistentTaskPaneAddinCommand(
    hostItemIndex: string,
    addinCommand: AddinCommand,
    mode: ExtensibilityModeEnum,
    initializationContext?: string
) {
    closeNonPersistentTaskPaneAddinCommand(hostItemIndex);

    const persistentInstance = getTaskPaneRunningInstance(TaskPaneType.Persistent, hostItemIndex);
    if (
        persistentInstance &&
        isDuplicateAddinCommand(persistentInstance.addinCommand, addinCommand)
    ) {
        return;
    }

    const adapter = getAdapter(hostItemIndex);
    if ((<TaskPaneAdapter>adapter)?.openTaskPane) {
        (<TaskPaneAdapter>adapter).openTaskPane();
    }

    const controlId = getNextControlId();
    setTaskPaneAddinCommand(
        controlId,
        hostItemIndex,
        addinCommand,
        getAddinCommandTaskPaneType(addinCommand, mode),
        mode,
        initializationContext
    );
}
