import type { OutlookFavoriteServiceDataType } from 'owa-favorites-types';
import type CategoryType from 'owa-service/lib/contract/CategoryType';
import type { MailFolder } from 'owa-graph-schema';
import { getEffectiveFolderDisplayName } from 'owa-folders';
import { convertEWSFolderIdToRestFolderId } from '../utils/ewsRestFolderIdConverter';

export function createOwsFavoriteCategoryData(
    category: CategoryType,
    isMigration: boolean
): OutlookFavoriteServiceDataType {
    return {
        Type: 'category', // VSO 26094: Replace the custom string with server defined supported type
        DisplayName: category.Name,
        SingleValueSettings: [
            {
                Key: 'CategoryId',
                Value: category.Id,
            },
        ],
        Client: isMigration ? 'Migration' : 'OWA', // VSO 26094: Replace the custom string with server defined supported type
    };
}

export function createOwsFavoriteFolderData(
    folder: MailFolder,
    isMigration: boolean,
    newIndex?: number
): OutlookFavoriteServiceDataType {
    return {
        Type: 'folder',
        DisplayName: getEffectiveFolderDisplayName(folder),
        SingleValueSettings: [
            {
                Key: 'FolderId',
                Value: convertEWSFolderIdToRestFolderId(folder.FolderId.Id),
            },
            {
                Key: 'ChangeKey',
                Value: folder.FolderId.ChangeKey,
            },
        ],
        Client: isMigration ? 'Migration' : 'OWA',
        Index: newIndex,
    };
}
