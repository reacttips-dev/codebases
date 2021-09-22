import type { FolderForestNodeType } from 'owa-favorites-types';
import { action } from 'satcheljs';
import { addDatapointConfig } from 'owa-analytics-actions';

export default action(
    'UPDATE_FAVORITE_POSITION_V2',
    (
        favoriteIdToUpdate: string,
        destinationFavoriteId: string,
        favoriteType: FolderForestNodeType
    ) =>
        addDatapointConfig(
            {
                name: 'UpdateOutlookFavoritePosition',
                options: {
                    isCore: true,
                },
                customData: [favoriteType],
            },
            {
                favoriteIdToUpdate,
                destinationFavoriteId,
                favoriteType,
            }
        )
);
