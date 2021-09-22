import type { FolderForestNodeType } from 'owa-favorites-types';
import { action } from 'satcheljs';

/**
 * Update the favorite node position to 1 index before the specified destination node
 * @param favoriteIdToUpdate the id to be moved
 * @param destinationFavoriteId the id to be inserted before
 */
export default action(
    'UPDATE_FAVORITE_POSITION',
    (
        favoriteIdToUpdate: string,
        destinationFavoriteId: string,
        favoriteType: FolderForestNodeType
    ) => {
        return {
            favoriteIdToUpdate,
            destinationFavoriteId,
            favoriteType,
        };
    }
);
