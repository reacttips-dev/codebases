import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';
import { SearchRefinerScopeType } from '../actions/folderViewStatesActions';
import isSharedFolder from 'owa-mail-store/lib/utils/isSharedFolder';

export default function getDefaultSearchScopeForFolderView(
    folderId: string
): SearchRefinerScopeType {
    if (folderIdToName(folderId) == 'inbox' && !isSharedFolder(folderId)) {
        return SearchRefinerScopeType.SearchRefinerScopeAll;
    }

    return SearchRefinerScopeType.SearchRefinerScopeCurrentFolder;
}
