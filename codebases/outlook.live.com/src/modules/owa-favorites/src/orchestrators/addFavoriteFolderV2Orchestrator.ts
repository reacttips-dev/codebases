import addFavoriteFolderV2 from '../actions/v2/addFavoriteFolderV2';
import { default as folderStore } from 'owa-folders';
import { getGuid } from 'owa-guid';
import { orchestrator } from 'satcheljs';
import createOutlookFavoriteService from '../services/v2/createOutlookFavoriteService';
import { convertServiceResponseToFavoriteData } from '../utils/favoriteServiceDataUtils';
import {
    addFavoriteToStore,
    addFavoriteCompleted,
    addFavoriteFailed,
} from '../actions/v2/addFavoriteActions';
import isOutlookFavoritingInProgress from '../selectors/v2/isOutlookFavoritingInProgress';
import { createClientFavoriteFolderData } from '../utils/createClientFavoriteData';
import { createOwsFavoriteFolderData } from '../utils/createOwsFavoriteData';

/**
 * Add a folder to the favorite store
 * @param folderIdToAdd the id to update
 * @param state the state which contains outlookFavoriteFolders and orderedOutlookFavoritesIds
 */

export default orchestrator(addFavoriteFolderV2, async actionMessage => {
    const { folderIdToAdd, newIndex } = actionMessage;
    const folder = folderStore.folderTable.get(folderIdToAdd);

    const temporaryGuid = getGuid();
    const favoriteFolderData = createClientFavoriteFolderData(
        temporaryGuid,
        folder,
        false /* isMigration */
    );

    if (isOutlookFavoritingInProgress(folderIdToAdd)) {
        // No-op, an operation is in progress
        return;
    }

    // Local update to add Folder to favorites store
    addFavoriteToStore(favoriteFolderData, newIndex);

    const owsFavoriteFolderData = createOwsFavoriteFolderData(
        folder,
        false /* isMigration */,
        newIndex
    );

    // Use Favorite Roaming API to create a new outlook favorite
    createOutlookFavoriteService(owsFavoriteFolderData)
        .then(response => {
            const asFolder = convertServiceResponseToFavoriteData(response, 'folder');
            addFavoriteCompleted(favoriteFolderData, asFolder, newIndex);
        })
        .catch(error => {
            addFavoriteFailed(error, favoriteFolderData);
        });
});
