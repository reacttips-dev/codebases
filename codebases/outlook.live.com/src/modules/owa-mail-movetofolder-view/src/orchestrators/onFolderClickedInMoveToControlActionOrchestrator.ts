import { notEnoughPermissionText } from 'owa-locstrings/lib/strings/notenoughpermissiontext.locstring.json';
import loc from 'owa-localize';
import { orchestrator } from 'satcheljs';
import { onFolderClickedInMoveToControlAction } from 'owa-mail-moveto-control';
import { trace } from 'owa-trace';

import {
    MenuItemType,
    doesUserHaveSharedFolderPermissionForWithError,
} from 'owa-mail-filterable-menu-behavior';
import { confirm } from 'owa-confirm-dialog';

export default orchestrator(onFolderClickedInMoveToControlAction, actionMessage => {
    const { mailboxType, folderId } = actionMessage;
    if (mailboxType === 'SharedMailbox') {
        try {
            const doesUserHaveMoveToPermissions = doesUserHaveSharedFolderPermissionForWithError(
                MenuItemType.Move,
                folderId
            );
            // If we have enough data to calculate permission on frontend for moveto operation then we can show error dialog for no permission.
            if (!doesUserHaveMoveToPermissions) {
                confirm(
                    '' /* title */,
                    loc(notEnoughPermissionText) /* subtext */,
                    false /* resolveImmediately */,
                    {
                        hideCancelButton: true,
                    }
                );
            }
        } catch (e) {
            // This case will come when frontend doesn't have enough data to calculate if permission is there or not for moveto.
            // Although, moveto call will be made and it can be successful at the server end.
            trace.warn(e);
        }
    }
});
