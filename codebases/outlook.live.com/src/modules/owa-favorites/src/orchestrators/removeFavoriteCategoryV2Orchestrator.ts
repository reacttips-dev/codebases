import deleteOutlookFavoriteService from '../services/v2/deleteOutlookFavoriteService';
import getFavoriteIdFromCategoryId from '../selectors/v2/getFavoriteIdFromCategoryId';
import removeFavoriteCategoryV2 from '../actions/v2/removeFavoriteCategoryV2';
import {
    removeFavoriteFromStore,
    removeFavoriteCompleted,
    removeFavoriteFailed,
} from '../actions/v2/removeFavoriteActions';
import { orchestrator } from 'satcheljs';
import { isGuid } from 'owa-guid';
import { logUsage } from 'owa-analytics';
import isOutlookFavoritingInProgress from '../selectors/v2/isOutlookFavoritingInProgress';
import { favoritesStore } from '../index';

/**
 * Remove a favorite category from the favorite store
 * @param id of the category
 * @param actionSource where the remove favorite category comes from
 */
export default orchestrator(removeFavoriteCategoryV2, async actionMessage => {
    const { categoryId } = actionMessage;
    let favoriteData;
    try {
        const favoriteId = getFavoriteIdFromCategoryId(categoryId);

        // Check if category is actually in favorites
        if (!favoriteId) {
            // This function should not be called when trying to remove a category which is not a favorite. Do nothing
            return;
        }

        // Check wheter we are trying to remove a temp id due to double clicks. This should be a no-op.
        if (isGuid(favoriteId)) {
            logUsage('RemoveOutlookFavoriteCategory: attempting to remove guid', {
                guid: favoriteId,
            });
            return;
        }

        if (isOutlookFavoritingInProgress(categoryId)) {
            // No-op
            return;
        }

        const favoriteData = favoritesStore.outlookFavorites.get(favoriteId);

        // Remove from favorite from the store
        removeFavoriteFromStore(favoriteData);

        // Use Favorite Roaming API to remove an outlook favorite
        await deleteOutlookFavoriteService(favoriteId);

        removeFavoriteCompleted(favoriteData);
    } catch (error) {
        removeFavoriteFailed(error, favoriteData);
    }
});
