import isSharedFolder from 'owa-mail-store/lib/utils/isSharedFolder';
import { isPublicFolder } from 'owa-folders';
import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';
import { isDumpsterFolderFromAnyMailbox } from 'owa-mail-store';
import { FolderView } from '../actions/folderViewStatesActions';

export default function getDefaultFolderView(folderId: string): FolderView {
    const distinguishedFolderIdName = folderIdToName(folderId);

    if (isSharedFolder(folderId) || isPublicFolder(folderId)) {
        return FolderView.DateViewOnly;
    }

    if (
        distinguishedFolderIdName == 'drafts' ||
        distinguishedFolderIdName == 'junkemail' ||
        distinguishedFolderIdName == 'outbox' ||
        distinguishedFolderIdName == 'notes'
    ) {
        return FolderView.DateViewOnly;
    }

    if (distinguishedFolderIdName == 'deleteditems' || isDumpsterFolderFromAnyMailbox(folderId)) {
        return FolderView.DateView;
    }

    return FolderView.ConversationView;
}
