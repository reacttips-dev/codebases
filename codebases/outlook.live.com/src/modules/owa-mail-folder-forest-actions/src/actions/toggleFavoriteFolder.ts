import selectFolder from './selectFolder';
import { lazyAddFavoriteFolder, lazyRemoveFavoriteFolder } from 'owa-mail-favorites-store';
import { getFolderIdForSelectedNode } from 'owa-mail-folder-forest-store';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import type { ActionSource } from 'owa-mail-store';

/**
 * Toggle favorite state of a node
 * @param folder the folder
 */
export default async function toggleFavoriteFolder(
    folderId: string,
    isFavorite: boolean,
    actionSource: ActionSource
) {
    if (isFavorite) {
        // Reset the folder selection to inbox if unfavorite a selected node
        if (folderId == getFolderIdForSelectedNode()) {
            selectFolder(folderNameToId('inbox'), 'primaryFolderTree' /* treeType */, 'ResetInbox');
        }
        const removeFavoriteFolder = await lazyRemoveFavoriteFolder.import();
        removeFavoriteFolder(folderId, actionSource);
    } else {
        const addFavoriteFolder = await lazyAddFavoriteFolder.import();
        addFavoriteFolder(folderId, actionSource);
    }
}
