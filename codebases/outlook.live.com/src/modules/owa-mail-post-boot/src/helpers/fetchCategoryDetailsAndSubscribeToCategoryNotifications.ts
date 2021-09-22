import { lazyFetchCategoryDetails, lazySubscribeToCategoryNotifications } from 'owa-categories';
import { favoritesStore } from 'owa-favorites';
import { isFeatureEnabled } from 'owa-feature-flags';
import type { FavoriteData } from 'owa-favorites-types';

export default function fetchCategoryDetailsAndSubscribeToCategoryNotifications() {
    lazyFetchCategoryDetails.importAndExecute().then(() => {
        // Only subscribe if favorite categories are present
        let shouldSubscribe = false;
        if (isFeatureEnabled('tri-favorites-roaming')) {
            shouldSubscribe = [...favoritesStore.outlookFavorites.values()].some(
                (favorite: FavoriteData) => {
                    return favorite.type === 'category';
                }
            );
        } else {
            shouldSubscribe = favoritesStore.favoriteCategories.size > 0;
        }
        if (shouldSubscribe) {
            lazySubscribeToCategoryNotifications.importAndExecute();
        }
    });
}
