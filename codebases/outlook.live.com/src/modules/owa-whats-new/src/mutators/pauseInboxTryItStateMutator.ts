import { mutator } from 'satcheljs';
import { onSelectFolderComplete } from 'owa-mail-shared-actions/lib/onSelectFolderComplete';
import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';
import { getStore } from '../store/store';

mutator(onSelectFolderComplete, actionMessage => {
    getStore().disablePauseInboxTryIt = folderIdToName(actionMessage.selectedFolderId) != 'inbox';
});
