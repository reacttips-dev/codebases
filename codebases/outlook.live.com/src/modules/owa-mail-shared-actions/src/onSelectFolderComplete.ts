import { action } from 'satcheljs';
import type MailListItemSelectionSource from 'owa-mail-store/lib/store/schema/MailListItemSelectionSource';
import type { ActionSource } from 'owa-mail-store';
export let onSelectFolderComplete = action(
    'ON_SELECT_FOLDER_COMPLETE',
    (
        selectedFolderId: string,
        previousFolderId: string,
        isExitingSearch: boolean,
        selectedTableViewId: string,
        mailListItemSelectionSource: MailListItemSelectionSource,
        isInImmersiveView: boolean,
        actionSource: ActionSource
    ) => ({
        selectedFolderId,
        previousFolderId,
        isExitingSearch,
        selectedTableViewId,
        mailListItemSelectionSource,
        isInImmersiveView,
        actionSource,
    })
);
