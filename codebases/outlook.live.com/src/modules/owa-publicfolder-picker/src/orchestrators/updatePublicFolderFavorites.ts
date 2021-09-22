import removePublicFolderFromFavorites from '../actions/removePublicFolderFromFavorites';
import { updateResponseMessageInPicker } from '../actions/updatePublicFolderPickerProps';
import getPublicFolderFromFolderId from '../selectors/getPublicFolderFromFolderId';
import {
    favoritesStore,
    createOwsFavoriteFolderData,
    lazyAddFavoriteToStore,
    lazyAddFavoriteCompleted,
    lazyAddFavoriteFailed,
    convertServiceResponseToFavoriteData,
    getFavoriteIdFromFolderId,
    lazyRemoveFavoriteFromStore,
    lazyRemoveFavoriteCompleted,
    lazyRemoveFavoriteFailed,
    lazyDeleteOutlookFavoriteService,
    lazyCreateOutlookFavoriteService,
} from 'owa-favorites';
import { FavoritePublicFolderData, FolderForestNodeType } from 'owa-favorites-types';
import { isFeatureEnabled } from 'owa-feature-flags';
import type { MailFolder } from 'owa-graph-schema';
import { getGuid } from 'owa-guid';
import loc, { format } from 'owa-localize';
import { selectFolder } from 'owa-mail-folder-forest-actions';
import { getFolderIdForSelectedNode } from 'owa-mail-folder-forest-store';
import addPublicFolderToStore from 'owa-public-folder-favorite/lib/actions/addPublicFolderToStore';
import removeFavoriteFromPublicFolderStore from 'owa-public-folder-favorite/lib/actions/removeFavoriteFromPublicFolderStore';
import publicFolderFavoriteStore from 'owa-public-folder-favorite/lib/store/publicFolderFavoriteStore';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import { orchestrator } from 'satcheljs';
import {
    folderAddedToMailFavoritesText,
    folderAddedToCalendarFavoritesText,
    folderAddedToPeopleFavoritesText,
    errorCantAddToFavoritesText,
    errorFolderTypeInvalidText,
} from './updatePublicFolderFavorites.locstring.json';
import addPublicFolderToFavorites, {
    addPublicFolderToFavoritesCompleted,
} from '../actions/addPublicFolderToFavorites';
import { lazyAddFavoriteFolderV1, lazyRemoveFavoriteFolderV1 } from 'owa-mail-favorites-store';

orchestrator(addPublicFolderToFavorites, async actionMessage => {
    const currentfolder = getPublicFolderFromFolderId(actionMessage.folderId);
    let successMessage = null;
    switch (currentfolder.FolderClass) {
        case 'IPF.Note':
            successMessage = format(loc(folderAddedToMailFavoritesText), currentfolder.DisplayName);
            break;
        case 'IPF.Appointment':
            successMessage = format(
                loc(folderAddedToCalendarFavoritesText),
                currentfolder.DisplayName
            );
            break;
        case 'IPF.Contact':
            successMessage = format(
                loc(folderAddedToPeopleFavoritesText),
                currentfolder.DisplayName
            );
            break;
        default:
            break;
    }

    switch (currentfolder.FolderClass) {
        case 'IPF.Note':
        case 'IPF.Appointment':
        case 'IPF.Contact':
            const isSucceeded: boolean = await addFolderToFavorites(currentfolder);
            if (!isSucceeded) {
                updateResponseMessageInPicker(loc(errorCantAddToFavoritesText), true);
            } else {
                updateResponseMessageInPicker(successMessage, false);
            }
            break;
        default:
            updateResponseMessageInPicker(loc(errorFolderTypeInvalidText), true);
            break;
    }
});

async function addFolderToFavorites(folderToAdd: MailFolder) {
    let returnStatus = false;
    if (isFeatureEnabled('tri-favorites-roaming')) {
        const response = await addFavoritePublicFolderV2(folderToAdd);
        if (response) {
            returnStatus = true;
        }
    } else if (!publicFolderFavoriteStore.folderTable.has(folderToAdd.FolderId.Id)) {
        addPublicFolderToStore(publicFolderFavoriteStore, folderToAdd);
        lazyAddFavoriteFolderV1.importAndExecute(
            folderToAdd.FolderId.Id,
            FolderForestNodeType.PublicFolder
        );
        returnStatus = true;
    }

    return returnStatus;
}

async function addFavoritePublicFolderV2(folder: MailFolder): Promise<any> {
    const temporaryGuid = getGuid();
    const favoriteFolderData = createClientFavoritePublicFolderData(
        temporaryGuid,
        folder,
        false //isMigration
    );

    //Verify that PublicFolder is not already favorited
    if (shouldAddFavoritePublicFolder(favoriteFolderData)) {
        // Add favorite to public folder store
        addPublicFolderToStore(publicFolderFavoriteStore, folder);

        if (folder.FolderClass == 'IPF.Note') {
            // Local update to add MailFolder to favorites store
            const addFavoriteToStore = await lazyAddFavoriteToStore.import();
            addFavoriteToStore(favoriteFolderData);
        }

        const owsFavoriteFolderData = createOwsFavoriteFolderData(folder, false /* isMigration */);

        // Use Favorite Roaming API to create a new outlook favorite
        return lazyCreateOutlookFavoriteService
            .importAndExecute(owsFavoriteFolderData)
            .then(async response => {
                const asPublicFolder = convertServiceResponseToFavoriteData(
                    response,
                    'publicFolder'
                );

                // MailFolder id returned in the response of CreateOutlookFavoriteService for public folders is malformed
                // and the favoriteData ends up having the invalid folder id stamped, correcting it here.
                const publicFolderFavoriteData = asPublicFolder as FavoritePublicFolderData;
                publicFolderFavoriteData.publicFolderId = folder.FolderId.Id;

                if (folder.FolderClass == 'IPF.Note') {
                    const addFavoriteCompleted = await lazyAddFavoriteCompleted.import();
                    addFavoriteCompleted(favoriteFolderData, asPublicFolder);
                }

                // Needed by People Hub to know when Public Folders are added to favorites
                if (folder.FolderClass == 'IPF.Contact') {
                    addPublicFolderToFavoritesCompleted(
                        folder.FolderId.Id,
                        folder.DisplayName,
                        publicFolderFavoriteData.favoriteId
                    );
                }

                return response;
            })
            .catch(async error => {
                const addFavoriteFailed = await lazyAddFavoriteFailed.import();
                addFavoriteFailed(error.message, favoriteFolderData);
                return null;
            });
    } else {
        return null;
    }
}

function createClientFavoritePublicFolderData(
    favoriteId: string,
    folder: MailFolder,
    isMigration: boolean
): FavoritePublicFolderData {
    return {
        treeType: 'favorites',
        type: 'publicFolder',
        favoriteId: favoriteId,
        displayName: folder.DisplayName,
        publicFolderId: folder.FolderId.Id,
        client: isMigration ? 'Migration' : 'OWA',
    };
}

function shouldAddFavoritePublicFolder(favoriteData: FavoritePublicFolderData): boolean {
    if (publicFolderFavoriteStore.folderTable.size === 0) {
        return true;
    }

    return !publicFolderFavoriteStore.folderTable.has(favoriteData.publicFolderId);
}

/**
 * Remove the given folderId from the favorite folder store
 * @param folder folder to remove
 */
orchestrator(removePublicFolderFromFavorites, async actionMessage => {
    const folder = actionMessage.folder;
    const folderId = folder.FolderId.Id;

    if (isFeatureEnabled('tri-favorites-roaming')) {
        const favoriteId = getFavoriteIdFromFolderId(folderId);
        const favoriteData = favoritesStore.outlookFavorites.get(favoriteId);
        if (folderId === getFolderIdForSelectedNode()) {
            selectFolder(folderNameToId('inbox'), 'primaryFolderTree' /* treeType */, 'ResetInbox');
        }

        const removeFavoriteFromStore = await lazyRemoveFavoriteFromStore.import();
        removeFavoriteFromStore(favoriteData);
        removeFavoriteFromPublicFolderStore(folderId);

        // Use Favorite Roaming API to remove an outlook favorite
        return lazyDeleteOutlookFavoriteService
            .importAndExecute(favoriteId)
            .then(async () => {
                const removeFavoriteCompleted = await lazyRemoveFavoriteCompleted.import();
                removeFavoriteCompleted(favoriteData);
            })
            .catch(async error => {
                const removeFavoriteFailed = await lazyRemoveFavoriteFailed.import();
                removeFavoriteFailed(error, favoriteData);
            });
    } else {
        lazyRemoveFavoriteFolderV1.importAndExecute(folderId);
    }
});
