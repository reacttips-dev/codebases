import type { FavoriteData } from 'owa-favorites-types';
import favoritesStore from '../../store/store';
import getSecondaryKey from '../../utils/getSecondaryKey';

export function addFavoriteDataInProgress(favoriteData: FavoriteData): void {
    const { favoritingInProgressMap } = favoritesStore;
    favoritingInProgressMap.set(getSecondaryKey(favoriteData), true);
}

export function removeFavoriteDataInProgress(favoriteData: FavoriteData): void {
    const { favoritingInProgressMap } = favoritesStore;
    favoritingInProgressMap.delete(getSecondaryKey(favoriteData));
}
