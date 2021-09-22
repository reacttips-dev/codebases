import { getNavigationState } from './NavigationState';
import { getAdapter, MessageReadAdapter } from 'owa-addins-adapters';
import { ExtensibilityModeEnum } from 'owa-addins-types';
import {
    addinCommandSupportsSharedFolders,
    getTaskPaneRunningInstance,
    shouldAddinsActivate,
    TaskPaneType,
} from 'owa-addins-store';

export function doesItemSupportAddins(hostItemIndex: string): boolean {
    const adapter = getAdapter(hostItemIndex);
    const mode = adapter.mode;

    if (adapter.isSharedItem?.()) {
        return false;
    }

    if (mode === ExtensibilityModeEnum.MessageRead) {
        return shouldAddinsActivate(
            (adapter as MessageReadAdapter).getItemWithUnsafeIdsImmediate()
        );
    }
    return true;
}

export function isItemPartSelected(hostItemIndex: string): boolean {
    const adapter = getAdapter(hostItemIndex);
    const mode = adapter.mode;

    if (mode === ExtensibilityModeEnum.MessageRead) {
        return (adapter as MessageReadAdapter).isItemSelected();
    }
    return true;
}

export function isInlineComposeOpen(hostItemIndex: string): boolean {
    const adapter = getAdapter(hostItemIndex);
    const mode = adapter.mode;

    if (mode === ExtensibilityModeEnum.MessageRead) {
        return (adapter as MessageReadAdapter).isInlineComposeOpen();
    }
    return false;
}

export function isEventDuplicate(hostItemIndex: string): boolean {
    return hostItemIndex === getNavigationState().hostItemIndex;
}

export function isModeChanged(hostItemIndex: string): boolean {
    return getMode(hostItemIndex) !== getNavigationState().mode;
}

export function getMode(hostItemIndex: string): ExtensibilityModeEnum {
    switch (getAdapter(hostItemIndex).mode) {
        case ExtensibilityModeEnum.MessageRead:
        case ExtensibilityModeEnum.MeetingRequest:
            return ExtensibilityModeEnum.MessageRead;
        case ExtensibilityModeEnum.MessageCompose:
            return ExtensibilityModeEnum.MessageCompose;
        default:
            return ExtensibilityModeEnum.Unknown;
    }
}

/** Returns true if there is a persisted add-in and it doesn't support the delegate scenario on the current item  */
export function delegateScenarioNotSupportedOnPersistedAddinOnItem(hostItemIndex: string): boolean {
    const adapter = getAdapter(hostItemIndex);
    const taskPane = getTaskPaneRunningInstance(TaskPaneType.Persistent, hostItemIndex);

    if (!taskPane) {
        return false;
    }

    if (addinCommandSupportsSharedFolders(taskPane.addinCommand)) {
        return false;
    }

    if (!adapter || !adapter.isSharedItem || !adapter.isSharedItem()) {
        return false;
    }

    return true;
}
