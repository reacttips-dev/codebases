import { OutlookEventDispId, unregisterApiEvent } from 'owa-addins-events';
import {
    getExtensibilityState,
    InvokeAppAddinCommandStatusCode,
    terminateUiLessExtendedAddinCommand,
} from 'owa-addins-store';

const unregisterDialogBeforeTermination = function (controlId: string): void {
    const { activeDialogs } = getExtensibilityState();
    for (let activeDialog of activeDialogs.values()) {
        if (activeDialog.parentControlId == controlId) {
            unregisterApiEvent({
                eventDispId: OutlookEventDispId.DISPLAY_DIALOG_DISPID,
                controlId: controlId,
            });
        }
    }
};

export default function closeUILessAddinCommand(
    controlId: string,
    hostItemIndex: string,
    status: InvokeAppAddinCommandStatusCode
) {
    unregisterDialogBeforeTermination(controlId);
    terminateUiLessExtendedAddinCommand(controlId, hostItemIndex, status);
}
