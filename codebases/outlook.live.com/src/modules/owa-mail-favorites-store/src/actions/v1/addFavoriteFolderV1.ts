import addRemoveFavoriteService from '../../services/v1/addRemoveFavoriteService';
import type { ObservableMap } from 'mobx';
import { default as folderStore } from 'owa-folders';
import type { MailFolder } from 'owa-graph-schema';
import { action } from 'satcheljs/lib/legacy';
import { favoritesStore, updateFavoritesUserOption } from 'owa-favorites';
import { FolderForestNode, FolderForestNodeType } from 'owa-favorites-types';
import publicFolderFavoriteStore from 'owa-public-folder-favorite/lib/store/publicFolderFavoriteStore';

export interface AddFavoriteState {
    favoritesFolderNodes: ObservableMap<string, FolderForestNode>;
    orderedFavoritesNodeIds: string[];
    folder: MailFolder;
}

/**
 * Add a folder to the favorite store
 * @param folderIdToAdd the id to update
 * @param folderType the folder type
 * @param state the state which contains the favoritesFolderNodes and the folder to update
 */
export default action('addFavoriteFolderV1')(function addFavoriteFolderV1(
    folderIdToAdd: string,
    folderType: FolderForestNodeType = FolderForestNodeType.Folder,
    state: AddFavoriteState = {
        favoritesFolderNodes: favoritesStore.favoritesFolderNodes,
        orderedFavoritesNodeIds: favoritesStore.orderedFavoritesNodeIds,
        folder:
            folderType == FolderForestNodeType.Folder
                ? folderStore.folderTable.get(folderIdToAdd)
                : publicFolderFavoriteStore.folderTable.get(folderIdToAdd),
    }
) {
    // Check if favoritesFolderNodes already has the same folder id
    if (state.favoritesFolderNodes.has(folderIdToAdd)) {
        throw new Error('addFavoriteFolderV1: Cannot add duplicate folder to favorites.');
    }
    // Add to favorite to favorites store
    state.orderedFavoritesNodeIds.push(folderIdToAdd);
    state.favoritesFolderNodes.set(folderIdToAdd, <FolderForestNode>{
        id: folderIdToAdd,
        type: folderType,
    });
    // Update user options service which is used by OWA
    updateFavoritesUserOption();
    // Service request for FAI that used by outlook desktop
    addRemoveFavoriteService(state.folder, true /* isAdd */);
});
