import { convertEWSFolderIdToRestFolderId } from '../index';
import type { FavoriteFolderData, OutlookFavoriteServiceDataType } from 'owa-favorites-types';
import { getEffectiveFolderDisplayName } from 'owa-folders';
import type { MailFolder } from 'owa-graph-schema';

export function createInitialFavoriteFolderData(
    favoriteId: string,
    folder: MailFolder,
    isAddDefault: boolean
): FavoriteFolderData {
    return {
        folderId: folder.FolderId.Id,
        treeType: 'favorites',
        type: 'folder',
        favoriteId: favoriteId,
        displayName: getEffectiveFolderDisplayName(folder),
        client: isAddDefault ? 'MigrateDefault' : 'OWA',
    };
}

export function createAddFavoriteFolderServicePayload(
    folder: MailFolder,
    isAddDefault: boolean
): OutlookFavoriteServiceDataType {
    return {
        Type: 'folder',
        DisplayName: getEffectiveFolderDisplayName(folder),
        SingleValueSettings: [
            {
                Key: 'FolderId',
                Value: convertEWSFolderIdToRestFolderId(folder.FolderId.Id),
            },
        ],
        Client: isAddDefault ? 'MigrateDefault' : 'OWA',
    };
}
