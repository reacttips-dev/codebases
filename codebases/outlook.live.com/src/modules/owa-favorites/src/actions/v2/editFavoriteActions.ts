import { action } from 'satcheljs';
import type { FavoriteData } from 'owa-favorites-types';

export const editExistingFavoriteInStore = action(
    'editExistingFavoriteInStore',
    (updatedFavoriteData: Partial<FavoriteData>) => ({ updatedFavoriteData })
);
