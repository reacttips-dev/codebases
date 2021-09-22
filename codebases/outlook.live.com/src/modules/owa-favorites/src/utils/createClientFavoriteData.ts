import type CategoryType from 'owa-service/lib/contract/CategoryType';
import type { FavoriteCategoryData, FavoriteFolderData } from 'owa-favorites-types';
import type { MailFolder } from 'owa-graph-schema';
import { getEffectiveFolderDisplayName } from 'owa-folders';

export function createClientFavoriteCategoryData(
    favoriteId: string,
    category: CategoryType,
    isMigration: boolean
): FavoriteCategoryData {
    return {
        treeType: 'favorites',
        type: 'category', // VSO 26094: Replace the custom string with server defined supported type
        favoriteId: favoriteId,
        displayName: category.Name,
        categoryId: category.Id,
        client: isMigration ? 'Migration' : 'OWA', // VSO 26094: Replace the custom string with server defined supported type
    };
}

export function createClientFavoriteFolderData(
    favoriteId: string,
    folder: MailFolder,
    isMigration: boolean
): FavoriteFolderData {
    return {
        treeType: 'favorites',
        type: 'folder',
        favoriteId: favoriteId,
        displayName: getEffectiveFolderDisplayName(folder),
        folderId: folder.FolderId.Id,
        client: isMigration ? 'Migration' : 'OWA',
    };
}
