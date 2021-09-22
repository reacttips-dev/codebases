import whenNoRunningUiLessAddinOnHostItem from './utils/UiLessObserver';
import {
    closeNonPersistentTaskPaneAddinCommand,
    removeExtensibilityFrameworkComponent,
} from 'owa-addins-view';
import { destroyExtensibilityNotifications } from 'owa-addins-apis';
import { deleteAdapter } from 'owa-addins-adapters';
import {
    destroyExtensibilityHostItem,
    isHostItemActive,
    closeAllAutoRunCommandsforHostItemIndex,
} from 'owa-addins-store';

export default function deinitializeAddinsForItem(
    hostItemIndex: string,
    targetWindow: Window = window
) {
    destroyExtensibilityNotifications(hostItemIndex);
    closeNonPersistentTaskPaneAddinCommand(hostItemIndex);
    destroyExtensibilityHostItem(hostItemIndex);
    closeAllAutoRunCommandsforHostItemIndex(hostItemIndex);
    whenNoRunningUiLessAddinOnHostItem(hostItemIndex, deinitializeAddinsForNonActiveHostItem);
    removeExtensibilityFrameworkComponent(targetWindow);
}

function deinitializeAddinsForNonActiveHostItem(hostItemIndex: string) {
    if (isHostItemActive(hostItemIndex)) {
        return;
    }

    deleteAdapter(hostItemIndex);
}
