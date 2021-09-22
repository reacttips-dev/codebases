import type { FavoriteData } from 'owa-favorites-types';
import getSecondaryKey from '../../utils/getSecondaryKey';
import favoritesStore from '../../store/store';

export default function removeFavoriteDataFromStore(favoriteData: FavoriteData) {
    const {
        favoriteSecondaryKeyMap,
        orderedOutlookFavoritesIds,
        outlookFavorites,
    } = favoritesStore;

    // Remove from favorite from the store
    favoritesStore.orderedOutlookFavoritesIds = orderedOutlookFavoritesIds.filter(
        id => id !== favoriteData.favoriteId
    );
    outlookFavorites.delete(favoriteData.favoriteId);
    favoriteSecondaryKeyMap.delete(getSecondaryKey(favoriteData));
}
