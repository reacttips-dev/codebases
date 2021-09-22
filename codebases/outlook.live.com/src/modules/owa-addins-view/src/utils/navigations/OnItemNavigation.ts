import ignoreNavigationOperation from './operation/ignoreNavigationOperation';
import reOpenAddinNavigationOperation from './operation/reOpenAddinNavigationOperation';
import sendErrorToAddinNavigationOperation from './operation/sendErrorToAddinNavigationOperation';
import sendItemUpdateToAddinNavigationOperation from './operation/sendItemUpdateToAddinNavigationOperation';
import { doesItemExist } from 'owa-addins-apis';
import {
    isExtensibilityContextInitialized,
    TaskPaneErrorType,
    updateFrameworkComponentHostItemIndexMap,
} from 'owa-addins-store';
import { isPersistedAddinsInitialized } from 'owa-addins-persistent';
import { isPersistentTaskpaneEnabled } from 'owa-addins-feature-flags';
import { SelectionType } from './SelectionType';
import {
    delegateScenarioNotSupportedOnPersistedAddinOnItem,
    doesItemSupportAddins,
    isEventDuplicate,
    isInlineComposeOpen,
    isItemPartSelected,
    isModeChanged,
} from './NavigationConditions';
import { getNavigationState, resetNavigationState } from './NavigationState';
import openPersistentTaskPaneAddinCommand from '../entryPointOperations/openPersistentTaskPaneAddinCommand';

export default function onItemNavigation(
    selectionType: SelectionType,
    hostItemIndex: string = undefined,
    targetWindow: Window = window
) {
    if (!isPersistentTaskpaneEnabled()) {
        return;
    }

    switch (selectionType) {
        case SelectionType.NotSupported:
            sendErrorToAddinNavigationOperation(TaskPaneErrorType.NotSupported);
            break;

        case SelectionType.Empty:
            sendErrorToAddinNavigationOperation(TaskPaneErrorType.Empty);

            // This to to fix the issue when we don't have any read item selected and we open compose and pop it out.
            // ExtensibilityFrameworkComponent for mainwindow still looks for taskpane state of last hostitemindex which we popped out.
            // So when we open any addin in popout window for that hostitemindex, it was getting opened in mainwindow also. (only happens when there is no item selected in mainwindow)
            updateFrameworkComponentHostItemIndexMap('exfc_main');
            break;

        case SelectionType.Multi:
            sendErrorToAddinNavigationOperation(TaskPaneErrorType.Multi);
            break;

        case SelectionType.Single:
            // intializeAddinsForItem always pass SelectionType.Single.
            // So, only this selection type can happen in main window and popout window.
            // Other selection types are only for mainwindow.
            hostItemIndex && handleSingleSelectionType(hostItemIndex, targetWindow);
            break;
    }
}

function handleSingleSelectionType(hostItemIndex: string, targetWindow: Window) {
    if (
        !doesItemExist(hostItemIndex) ||
        !isExtensibilityContextInitialized() ||
        !isPersistedAddinsInitialized() ||
        isInlineComposeOpen(hostItemIndex) ||
        !isItemPartSelected(hostItemIndex) ||
        (targetWindow == window && isEventDuplicate(hostItemIndex))
    ) {
        ignoreNavigationOperation();
        return;
    }

    if (targetWindow == window) {
        if (!doesItemSupportAddins(hostItemIndex)) {
            sendErrorToAddinNavigationOperation(TaskPaneErrorType.NotSupported);
        } else if (delegateScenarioNotSupportedOnPersistedAddinOnItem(hostItemIndex)) {
            sendErrorToAddinNavigationOperation(TaskPaneErrorType.SharedItemsNotSupported);
        } else if (isModeChanged(hostItemIndex)) {
            const navStateHostItemIndex = getNavigationState()?.hostItemIndex;
            reOpenAddinNavigationOperation(navStateHostItemIndex, hostItemIndex);
        } else {
            sendItemUpdateToAddinNavigationOperation(hostItemIndex);
        }
    } else {
        // projection popout case
        if (
            doesItemSupportAddins(hostItemIndex) &&
            !delegateScenarioNotSupportedOnPersistedAddinOnItem(hostItemIndex)
        ) {
            resetNavigationState();
            openPersistentTaskPaneAddinCommand(hostItemIndex);
        }
    }
}
