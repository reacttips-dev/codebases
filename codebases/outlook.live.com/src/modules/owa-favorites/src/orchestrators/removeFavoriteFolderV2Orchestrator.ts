import { orchestrator } from 'satcheljs';
import removeFavoriteFolderV2 from '../actions/v2/removeFavoriteFolderV2';
import deleteOutlookFavoriteService from '../services/v2/deleteOutlookFavoriteService';
import {
    removeFavoriteFromStore,
    removeFavoriteCompleted,
    removeFavoriteFailed,
} from '../actions/v2/removeFavoriteActions';
import { isGuid } from 'owa-guid';
import getFavoriteIdFromFolderId from '../selectors/v2/getFavoriteIdFromFolderId';
import { logUsage } from 'owa-analytics';
import isOutlookFavoritingInProgress from '../selectors/v2/isOutlookFavoritingInProgress';
import { favoritesStore } from '../index';

/**
 * Remove the given folderId from the favorite folder store
 * @param folderIdToRemove the id of the folder to remove
 */
export default orchestrator(removeFavoriteFolderV2, async actionMessage => {
    const folderIdToRemove = actionMessage.folderIdToRemove;
    const favoriteId = getFavoriteIdFromFolderId(folderIdToRemove);

    // Check wheter we are trying to remove a temp id due to double clicks. This should be a no-op.
    if (isGuid(favoriteId)) {
        logUsage('RemoveOutlookFavoriteFolder: attempting to remove guid', { guid: favoriteId });
        return;
    }

    if (isOutlookFavoritingInProgress(folderIdToRemove)) {
        // No-op
        return;
    }

    const favoriteData = favoritesStore.outlookFavorites.get(favoriteId);

    // The folder is not in favorite list
    if (!favoriteData) {
        return;
    }

    removeFavoriteFromStore(favoriteData);

    // Use Favorite Roaming API to remove an outlook favorite
    return deleteOutlookFavoriteService(favoriteId)
        .then(() => {
            removeFavoriteCompleted(favoriteData);
        })
        .catch(error => {
            removeFavoriteFailed(error, favoriteData);
        });
});
