import { WaitForActionDialogText } from './showActionBlockedDialog.locstring.json';
import loc, { format } from 'owa-localize';
import { confirm } from 'owa-confirm-dialog';

/**
 * Should dialog box when S/MIME response is either disabled or blocked
 */
const showActionBlockedDialog = itemActionString => {
    const messageString = format(loc(WaitForActionDialogText), itemActionString);
    confirm(null /* title */, messageString, false /* resolveImmediately */, {
        hideCancelButton: true,
    });
};

export default showActionBlockedDialog;
