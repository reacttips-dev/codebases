import selectFolder from './selectFolder';
import selectDefaultFolder from './selectDefaultFolder';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import { isFolderInFavorites } from 'owa-favorites';
import { isValidMailFolder, ActionSource } from 'owa-mail-store';

export default function (folderIdToSelect: string, actionSource: ActionSource) {
    // folderIdToSelect could be distinguished folderId like 'inbox', 'sentitems'
    const folderId = folderNameToId(folderIdToSelect) || folderIdToSelect;

    // Invalid Id specified in the URL, fallback to default folder
    if (!isValidMailFolder(folderId)) {
        selectDefaultFolder(actionSource);
        return;
    }

    // Valid folder in favorites
    if (isFolderInFavorites(folderId)) {
        selectFolder(folderId, 'favorites' /* treeType */, actionSource);
        return;
    }

    // Valid folder not in favorites
    selectFolder(folderId, 'primaryFolderTree' /* treeType */, actionSource);
}
