import addRemoveFavoriteService from '../../services/v1/addRemoveFavoriteService';
import { recordLastRemoveFavorite } from '../helpers/recentlyRemovedFavorite';
import type { ObservableMap } from 'mobx';
import { favoritesStore, updateFavoritesUserOption } from 'owa-favorites';
import folderStore from 'owa-folders';
import { FolderForestNode, FolderForestNodeType } from 'owa-favorites-types';
import publicFolderFavoriteStore from 'owa-public-folder-favorite/lib/store/publicFolderFavoriteStore';
import { action } from 'satcheljs/lib/legacy';

export interface RemoveFavoriteFolderState {
    favoritesFolderNodes: ObservableMap<string, FolderForestNode>;
    orderedFavoritesNodeIds: string[];
}

/**
 * Add or remove the given folderId from the favorite folder list
 * @param folderIdToRemove the id of the folder to remove
 * @param state the state which contains the favoritesFolderNodes and the folder to update
 */
export default action('removeFavoriteFolderV1')(function removeFavorite(
    folderIdToRemove: string,
    state: RemoveFavoriteFolderState = {
        favoritesFolderNodes: favoritesStore.favoritesFolderNodes,
        orderedFavoritesNodeIds: favoritesStore.orderedFavoritesNodeIds,
    }
) {
    // Check if favoritesFolderNodes doesn't contain the id
    if (!state.favoritesFolderNodes.has(folderIdToRemove)) {
        throw new Error(
            'removeFavoriteFolderV1: Cannot find the folder id in favorite folder list.'
        );
    }
    const folder =
        favoritesStore.favoritesFolderNodes.get(folderIdToRemove).type ==
        FolderForestNodeType.Folder
            ? folderStore.folderTable.get(folderIdToRemove)
            : publicFolderFavoriteStore.folderTable.get(folderIdToRemove);
    // Remove from favorite from the store
    state.orderedFavoritesNodeIds.splice(
        state.orderedFavoritesNodeIds.indexOf(folderIdToRemove),
        1
    );
    state.favoritesFolderNodes.delete(folderIdToRemove);
    // Update user options service which is used by OWA
    updateFavoritesUserOption();
    // Record the last removed folder so we can correlate accidental removes
    recordLastRemoveFavorite(folderIdToRemove);
    // Service request for FAI that used by outlook desktop
    addRemoveFavoriteService(folder, false /* isAdd */);
});
