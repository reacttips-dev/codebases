import { action } from 'satcheljs';
import { addDatapointConfig } from 'owa-analytics-actions';
import type { FavoriteData, FavoriteOperationError } from 'owa-favorites-types';

export const removeFavoriteCompleted = action(
    'removeFavoriteCompleted',
    (favoriteData: FavoriteData) =>
        addDatapointConfig(
            {
                name: 'RemoveFavoriteCompleted',
                customData: {
                    favoriteId: favoriteData.favoriteId,
                    favoriteKind: favoriteData.type,
                },
            },
            {
                favoriteData,
            }
        )
);

export const removeFavoriteFailed = action(
    'removeFavoriteFailed',
    (error: FavoriteOperationError, favoriteData: FavoriteData) =>
        addDatapointConfig(
            {
                name: 'RemoveFavoriteFailed',
                customData: {
                    errorMessage: error ? error.message : 'Undefined error',
                    cV: error ? error.correlationVector : 'Undefined error',
                    favoriteId: favoriteData.favoriteId,
                    favoriteKind: favoriteData.type,
                },
            },
            {
                error,
                favoriteData,
                favoriteKind: favoriteData.type,
            }
        )
);

export const removeFavoriteFromStore = action(
    'removeFavoriteFromStore',
    (favoriteData: FavoriteData) =>
        addDatapointConfig(
            {
                name: 'RemoveFavoriteFromStore',
                customData: {
                    favoriteId: favoriteData.favoriteId,
                    favoriteKind: favoriteData.type,
                },
            },
            {
                favoriteData,
            }
        )
);
