import { isFeatureEnabled } from 'owa-feature-flags';
import { getStore as getSharedFavoritesStore } from '../index';

export default function getFavoriteIdsForPersonaFavorites(): string[] {
    const favoritesStore = getSharedFavoritesStore();
    return isFeatureEnabled('tri-favorites-roaming')
        ? [...favoritesStore.outlookFavorites.entries()]
              .filter(([favoriteId, favorite]) => favorite.type === 'persona')
              .map(([favoriteId, favorite]) => favoriteId)
        : [...favoritesStore.favoritesPersonaNodes.keys()];
}
