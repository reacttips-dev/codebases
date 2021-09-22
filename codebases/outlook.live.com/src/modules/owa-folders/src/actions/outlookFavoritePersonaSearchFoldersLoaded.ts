import { action } from 'satcheljs';
import type FolderType from 'owa-service/lib/contract/Folder';
import type { FavoritePersonaData, FavoritePrivateDistributionListData } from 'owa-favorites-types';

/**
 * Favorites have been loaded in store
 */
export default action(
    'PERSONA_SEARCH_FOLDERS_LOADED',
    (
        existingFolders: FolderType[],
        personaOrPdlFavorites: (FavoritePersonaData | FavoritePrivateDistributionListData)[]
    ) => {
        return {
            existingFolders,
            personaOrPdlFavorites,
        };
    }
);
