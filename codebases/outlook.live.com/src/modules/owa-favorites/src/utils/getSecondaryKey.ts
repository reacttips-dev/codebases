import type {
    FavoriteData,
    FavoriteCategoryData,
    FavoriteGroupData,
    FavoriteFolderData,
    FavoritePersonaData,
    FavoritePublicFolderData,
} from 'owa-favorites-types';

export default function getSecondaryKey(clientFavoriteData: FavoriteData) {
    switch (clientFavoriteData.type) {
        case 'folder':
            return (clientFavoriteData as FavoriteFolderData).folderId;

        case 'group':
            return (clientFavoriteData as FavoriteGroupData).groupId.toLowerCase();

        case 'category':
            return (clientFavoriteData as FavoriteCategoryData).categoryId;

        case 'persona':
            const personaData = clientFavoriteData as FavoritePersonaData;
            return personaData.personaId || personaData.mainEmailAddress;

        case 'privatedistributionlist':
            // 'FavoritePdl' is the secondary key used to detect if another PDL is in progress.
            // Instead of hardcoding, we should export and call getSecondaryKey
            // https://msfast.visualstudio.com/FAST/_workitems/edit/272238
            return 'FavoritePdl';

        case 'publicFolder':
            return (clientFavoriteData as FavoritePublicFolderData).publicFolderId;

        default:
            return undefined;
    }
}
