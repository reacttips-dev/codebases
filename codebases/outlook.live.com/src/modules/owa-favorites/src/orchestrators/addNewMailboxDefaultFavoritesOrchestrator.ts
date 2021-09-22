import { orchestrator } from 'satcheljs';
import addNewMailboxDefaultFavorites from '../actions/v2/addNewMailboxDefaultFavorites';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import folderStore from 'owa-folders';
import { convertServiceResponseToFavoriteData } from '../utils/favoriteServiceDataUtils';
import {
    createAddFavoriteFolderServicePayload,
    createInitialFavoriteFolderData,
} from '../utils/convertFolderFavorite';
import { getGuid } from 'owa-guid';
import { addFavoriteFailed, addMultipleFavoritesCompleted } from '../actions/v2/addFavoriteActions';
import createMultipleOutlookFavoritesService from '../services/v2/createMultipleOutlookFavoritesService';
import type { FavoriteData, FavoriteFolderData } from 'owa-favorites-types';

export default orchestrator(addNewMailboxDefaultFavorites, async actionMessage => {
    const defaultFavoriteFolderIds = [
        folderNameToId('inbox'),
        folderNameToId('drafts'),
        folderNameToId('archive'),
    ];
    const batchedOwsFavoriteFolderData = [];
    const batchTempData: FavoriteFolderData[] = [];

    for (const folderId of defaultFavoriteFolderIds) {
        // Generate temp guid for favorite
        const guid = getGuid();
        const folder = folderStore.folderTable.get(folderId);
        const owsFavoriteFolderData = createAddFavoriteFolderServicePayload(
            folder,
            true /* isMigrateDefault */
        );
        const initialFolderData: FavoriteFolderData = createInitialFavoriteFolderData(
            guid,
            folder,
            true /* isMigrateDefault */
        );

        batchedOwsFavoriteFolderData.push(owsFavoriteFolderData);
        batchTempData.push(initialFolderData);
    }

    try {
        // Use Favorite Roaming API to create a new outlook favorite
        const response = await createMultipleOutlookFavoritesService(batchedOwsFavoriteFolderData);

        const convertedResponses: FavoriteData[] = (response.value || []).map(favorite =>
            convertServiceResponseToFavoriteData(favorite, 'folder')
        );

        // On success, add default favorites to store
        addMultipleFavoritesCompleted(batchTempData, convertedResponses);
    } catch (error) {
        // In case of error, fire an action that callers can listen to
        batchTempData.forEach(favoriteFolderData => addFavoriteFailed(error, favoriteFolderData));
    }
});
