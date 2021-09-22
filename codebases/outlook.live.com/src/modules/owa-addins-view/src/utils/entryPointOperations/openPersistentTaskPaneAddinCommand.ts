import { getCommandWithGivenId, isMinorForbidden } from './AddinChecker';
import { CommonAdapter, getAdapter } from 'owa-addins-adapters';
import { getPersistedAddin, PersistedAddinCommand, setPersistedAddin } from 'owa-addins-persistent';
import type { ExtensibilityModeEnum } from 'owa-addins-types';
import {
    addinCommandSupportsSharedFolders,
    setTaskPaneAddinCommand,
    getNextControlId,
    TaskPaneType,
    IAddinCommand,
    isExtensibilityContextInitialized,
} from 'owa-addins-store';

export default function openPersistentTaskPaneAddinCommand(
    hostItemIndex: string,
    initializationContext?: string
): void {
    const adapter = getAdapter(hostItemIndex) as CommonAdapter;
    if (!adapter) {
        return;
    }

    const mode: ExtensibilityModeEnum = adapter.mode;
    const persistedAddin: PersistedAddinCommand = getPersistedAddin(mode);
    if (!persistedAddin) {
        return;
    }

    const addinCommand: IAddinCommand = getCommandWithGivenId(
        persistedAddin.addinId,
        persistedAddin.commandId,
        mode
    );

    if (adapter.isSharedItem?.()) {
        if (!addinCommandSupportsSharedFolders(addinCommand)) {
            return;
        }
    }

    if (!addinCommand || isMinorForbidden(addinCommand)) {
        if (!addinCommand && isExtensibilityContextInitialized()) {
            setPersistedAddin(mode, null /* persistedAddin */);
        }
        return;
    }

    const controlId = getNextControlId();
    setTaskPaneAddinCommand(
        controlId,
        hostItemIndex,
        addinCommand,
        TaskPaneType.Persistent,
        mode,
        initializationContext
    );
}
