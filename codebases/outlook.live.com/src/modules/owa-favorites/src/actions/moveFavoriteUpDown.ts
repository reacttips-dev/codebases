import type { FolderForestNodeType } from 'owa-favorites-types';
import { action } from 'satcheljs';

/**
 * Update the favorite node position to 1 index before the specified destination node
 * @param favoriteId the id to be moved
 * @param isMoveUp whether to move up/down
 * @param favoriteType the favorite type
 */
export default action(
    'MOVE_FAVORITE_UP_DOWN',
    (favoriteId: string, isMoveUp: boolean, favoriteType: FolderForestNodeType) => {
        return {
            favoriteId,
            isMoveUp,
            favoriteType,
        };
    }
);
