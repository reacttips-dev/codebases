import { getStore as getSharedFavoriteStore } from 'owa-favorites';
import { getPersonaNodeIdFromExtendedProperty } from 'owa-mail-persona-search-folder-services';
import folderStore from 'owa-folders';
import { action } from 'satcheljs/lib/legacy';
import type FolderType from 'owa-service/lib/contract/Folder';
import { mapOWSFolderToGql } from 'owa-folder-gql-mappers';
import { getUserMailboxInfo } from 'owa-client-ids';

export default action('setupFavoritePersona')(function setupFavoritePersona(
    personaSearchFolder: FolderType
) {
    const favoriteNodeId = getPersonaNodeIdFromExtendedProperty(personaSearchFolder);

    // The persona search folder includes a guid in the displayName which surfaces
    // in certain dialogs, for example "Delete All". By changing the display name here,
    // the folder doesn't need any special treatment.

    const favoritePersona = getSharedFavoriteStore().favoritesPersonaNodes.get(favoriteNodeId);

    if (favoritePersona) {
        const searchFolder = {
            ...mapOWSFolderToGql(personaSearchFolder, getUserMailboxInfo()),
            DisplayName: favoritePersona.displayName,
        };
        folderStore.folderTable.set(personaSearchFolder.FolderId.Id, searchFolder);

        const newSearchFolderId = searchFolder.FolderId.Id;

        if (favoritePersona.searchFolderId !== newSearchFolderId) {
            favoritePersona.searchFolderId = newSearchFolderId;
        }
    }
});
