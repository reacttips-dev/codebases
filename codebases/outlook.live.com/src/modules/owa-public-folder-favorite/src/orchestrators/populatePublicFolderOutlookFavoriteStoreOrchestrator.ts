import populatePublicFolderOutlookFavoriteStore from '../actions/populatePublicFolderOutlookFavoriteStore';
import type {
    OutlookFavoriteServiceDataType,
    FavoritePublicFolderData,
    FavoriteDataClient,
} from 'owa-favorites-types';
import getFavorites from 'owa-session-store/lib/utils/getFavorites';
import {
    favoritesStore,
    addFavoriteToStoreInitial,
    getSingleValueSettingValueForKey,
} from 'owa-favorites';
import publicFolderFavoriteStore from '../store/publicFolderFavoriteStore';
import { createLazyOrchestrator } from 'owa-bundling';

export default createLazyOrchestrator(
    populatePublicFolderOutlookFavoriteStore,
    'clone_populatePublicFolderOutlookFavoriteStore',
    actionMessage => {
        const outlookFavorites = getFavorites()?.value;
        if (!outlookFavorites) {
            // Nothing to populate
            return;
        }

        outlookFavorites.forEach((serviceData: OutlookFavoriteServiceDataType) => {
            const isPublicFolderSetting = getSingleValueSettingValueForKey(
                serviceData,
                'IsPublicFolder'
            );

            if (
                serviceData.Type.toLowerCase() === 'folder' &&
                isPublicFolderSetting &&
                isPublicFolderSetting.toLowerCase() === 'true'
            ) {
                const favoriteData: FavoritePublicFolderData = {
                    treeType: 'favorites',
                    favoriteId: serviceData.Id,
                    type: 'publicFolder',
                    displayName: serviceData.DisplayName,
                    publicFolderId: getSingleValueSettingValueForKey(serviceData, 'FolderId'),
                    client: serviceData.Client as FavoriteDataClient,
                    lastModifiedTime: serviceData.LastModifiedTime,
                };

                tryAddSingleFavoritePublicFolderToStore(favoriteData);
            }
        });
    }
);

function tryAddSingleFavoritePublicFolderToStore(favoriteData: FavoritePublicFolderData) {
    if (shouldAddFavoritePublicFolder(favoriteData)) {
        addFavoriteToStoreInitial(favoriteData);
    }
}

/**
 * Should add public folder to favorite list
 */
function shouldAddFavoritePublicFolder(favoriteData: FavoritePublicFolderData): boolean {
    if (publicFolderFavoriteStore.folderTable.size === 0) {
        // Do not add the folder if the folder store hasn't been initiated yet
        return false;
    }

    return (
        !favoritesStore.outlookFavorites.has(favoriteData.favoriteId) &&
        publicFolderFavoriteStore.folderTable.has(favoriteData.publicFolderId)
    );
}
