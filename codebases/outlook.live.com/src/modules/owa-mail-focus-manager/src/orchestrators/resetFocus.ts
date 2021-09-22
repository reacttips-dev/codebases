import { orchestrator } from 'satcheljs';
import { onFolderClickedInMoveToControlAction } from 'owa-mail-moveto-control';
import { resetFocus } from '../mailModuleAutoFocusManager';

export default orchestrator(onFolderClickedInMoveToControlAction, actionMessage => {
    resetFocus();
});
