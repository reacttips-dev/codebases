import type { FavoriteData } from 'owa-favorites-types';
import favoritesStore from '../../store/store';
import getSecondaryKey from '../../utils/getSecondaryKey';

export default function addFavoriteDataToStore(favoriteData: FavoriteData, newIndex?: number) {
    const {
        favoriteSecondaryKeyMap,
        orderedOutlookFavoritesIds,
        outlookFavorites,
    } = favoritesStore;

    // Check whether this favoriteId already exists in the list.
    // If so, do nothing as Prime returned an already existing favorite (Upsert).
    if (orderedOutlookFavoritesIds.some(id => id === favoriteData.favoriteId)) {
        return;
    }

    // Local update to add node to favorites store
    if (newIndex !== undefined) {
        orderedOutlookFavoritesIds.splice(newIndex, 0, favoriteData.favoriteId);
    } else {
        orderedOutlookFavoritesIds.push(favoriteData.favoriteId);
    }

    outlookFavorites.set(favoriteData.favoriteId, <FavoriteData>{
        treeType: 'favorites',
        ...favoriteData,
    });

    favoriteSecondaryKeyMap.set(getSecondaryKey(favoriteData), favoriteData.favoriteId);
}
