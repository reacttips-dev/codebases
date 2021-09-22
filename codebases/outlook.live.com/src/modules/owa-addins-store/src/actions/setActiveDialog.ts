import getExtensibilityState from '../store/getExtensibilityState';
import type { ActiveDialog } from '../store/schema/interfaces/Dialog';
import { mutatorAction } from 'satcheljs';

export default mutatorAction('setActiveDialog', setActiveDialog);

function setActiveDialog(activeDialog: ActiveDialog, hostItemIndex: string);
function setActiveDialog(activeDialog: null);
function setActiveDialog(activeDialog: ActiveDialog, hostItemIndex?: string) {
    const { activeDialogs } = getExtensibilityState();
    if (activeDialog) {
        activeDialogs.set(hostItemIndex, activeDialog);
    } else {
        activeDialogs.delete(hostItemIndex);
    }
}
