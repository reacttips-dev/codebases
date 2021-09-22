import { action } from 'satcheljs';

export const addToOrderedFavoriteIdList = action(
    'ADD_TO_ORDERED_FAVORITE_ID_LIST',
    (favoriteId: string) => {
        return {
            favoriteId,
        };
    }
);
