import { action } from 'satcheljs';
import { addDatapointConfig } from 'owa-analytics-actions';
import type { FavoriteData, FavoriteOperationError } from 'owa-favorites-types';

export const addFavoriteCompleted = action(
    'addFavoriteCompleted',
    (temporaryData: FavoriteData, favoriteData: FavoriteData, newIndex?: number) =>
        addDatapointConfig(
            {
                name: 'AddFavoriteCompleted',
                customData: {
                    temporaryFavoriteId: temporaryData.favoriteId,
                    favoriteId: favoriteData.favoriteId,
                    favoriteKind: favoriteData.type,
                },
            },
            {
                temporaryData,
                favoriteData,
                newIndex,
            }
        )
);

export const addMultipleFavoritesCompleted = action(
    'addMultipleFavoritesCompleted',
    (temporaryFavorites: FavoriteData[], favoritesData: FavoriteData[]) =>
        addDatapointConfig(
            {
                name: 'AddMultipleFavoritesCompleted',
            },
            {
                temporaryFavorites,
                favoritesData,
            }
        )
);

export const addFavoriteFailed = action(
    'addFavoriteFailed',
    (error: FavoriteOperationError, favoriteData: FavoriteData) =>
        addDatapointConfig(
            {
                name: 'AddFavoriteFailed',
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

export const addFavoriteToStore = action(
    'addFavoriteToStore',
    (favoriteData: FavoriteData, newIndex?: number) =>
        addDatapointConfig(
            {
                name: 'AddFavoriteToStore',
                customData: {
                    favoriteId: favoriteData.favoriteId,
                    favoriteKind: favoriteData.type,
                },
            },
            {
                favoriteData,
                newIndex,
            }
        )
);

export const addFavoriteToStoreInitial = action(
    'addFavoriteToStoreInitial',
    (favoriteData: FavoriteData) =>
        addDatapointConfig(
            {
                name: 'AddFavoriteToStoreInitial',
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

export const addMultipleFavoritesToStore = action(
    'addMultipleFavoritesToStore',
    (favoritesData: FavoriteData[]) =>
        addDatapointConfig(
            {
                name: 'AddMultipleFavoritesToStore',
            },
            {
                favoritesData,
            }
        )
);
