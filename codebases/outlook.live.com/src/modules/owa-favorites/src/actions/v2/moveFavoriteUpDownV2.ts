import type { FolderForestNodeType } from 'owa-favorites-types';
import { action } from 'satcheljs';
import { addDatapointConfig } from 'owa-analytics-actions';

export default action(
    'MOVE_FAVORITE_UP_DOWN_V2',
    (favoriteId: string, isMoveUp: boolean, favoriteType: FolderForestNodeType) =>
        addDatapointConfig(
            {
                name: 'MoveOutlookFavoritesUpDown',
                options: {
                    isCore: true,
                },
                customData: [favoriteType],
            },
            {
                favoriteId,
                isMoveUp,
                favoriteType,
            }
        )
);
