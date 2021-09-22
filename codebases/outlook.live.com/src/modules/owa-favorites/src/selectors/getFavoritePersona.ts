import { isFeatureEnabled } from 'owa-feature-flags';
import { getStore as getSharedFavoritesStore } from '../store/store';
import type { FavoritePersonaNode, FavoritePersonaData } from 'owa-favorites-types';

export default function getFavoritePersona(
    favoriteId: string
): FavoritePersonaData | FavoritePersonaNode | null {
    const favoritesStore = getSharedFavoritesStore();
    return isFeatureEnabled('tri-favorites-roaming')
        ? (favoritesStore.outlookFavorites.get(favoriteId) as FavoritePersonaData)
        : favoritesStore.favoritesPersonaNodes.get(favoriteId);
}
