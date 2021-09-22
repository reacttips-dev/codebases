import { getStore } from '../../../store/store';
import * as favoriteNodeParser from '../../helpers/favoriteNodeParser';
import * as favoritesBitFlagsActions from '../../helpers/favoritesBitFlagsActions';
import { loadFavoriteNodesToStore, tryAddSingleFavoriteFolderToStore } from '../loadFavoritesV1';
import { FolderForestNodeType, FolderForestNode } from 'owa-favorites-types';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import { updateUserConfigurationAndService } from 'owa-session-store';

/**
 * Migrate single favorite folder
 * @param folderId the folder to be migrated
 */
function tryMigrateSingleFavoriteFolder(folderId: string) {
    const favoriteFolderNode = <FolderForestNode>{
        id: folderId,
        type: FolderForestNodeType.Folder,
    };

    tryAddSingleFavoriteFolderToStore(favoriteFolderNode);
}

/**
 * Migrate the favorites for the first run experience
 * @param state the MigrateFavoritesState
 */
export default function migrateFavorites() {
    // 1. Automatically populate default folders it they don't exist in favorites
    const defaultFavoriteFolderIds = [
        folderNameToId('inbox'),
        folderNameToId('drafts'),
        folderNameToId('archive'),
    ];
    defaultFavoriteFolderIds.forEach(folderId => tryMigrateSingleFavoriteFolder(folderId));

    // 2. Load existing UserOptions.FavoriteNodes to store if there is any
    const favoritesStore = getStore();
    loadFavoriteNodesToStore(favoritesStore);

    // 3. Migrate de-duped UserOptions.FavoriteFolders(used by JsMVVM) to FavoriteNodes(used by React), if there is any
    const userOptions = getUserConfiguration().UserOptions;
    if (userOptions.FavoriteFolders) {
        userOptions.FavoriteFolders.forEach(folderId => tryMigrateSingleFavoriteFolder(folderId));
    }

    // 4. Submit the service call to update UserOptions on the client and server
    const newFavoritesNodesRaw = favoriteNodeParser.serialize(
        favoritesStore.orderedFavoritesNodeIds,
        favoritesStore.favoritesFolderNodes,
        favoritesStore.favoritesPersonaNodes,
        favoritesStore.favoriteSearches,
        favoritesStore.favoriteCategories
    );

    // Update the local user configuration store
    favoritesBitFlagsActions.setBit(
        true /* value*/,
        favoritesBitFlagsActions.FavoritesBitFlagsMasks.FirstRunFavoritesMigration
    );

    updateUserConfigurationAndService(
        userConfig => {
            userConfig.UserOptions.FavoriteNodes = newFavoritesNodesRaw;
        },
        [
            {
                key: 'FavoriteNodes',
                valuetype: 'StringArray',
                value: newFavoritesNodesRaw,
            },
            {
                key: 'FavoritesBitFlags',
                valuetype: 'Integer32',
                value: [`${getUserConfiguration().UserOptions.FavoritesBitFlags}`],
            },
        ]
    );
}
