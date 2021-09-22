import updateFavoritesUserOption from '../../actions/v1/updateFavoritesUserOption';
import favoritesStore from '../../store/store';
import { action } from 'satcheljs/lib/legacy';

/**
 * Remove a favorite category from the favorite store
 * @param id of the category
 * @param actionSource where the remove favorite category comes from
 */
export default action('removeFavoriteCategory')(function removeFavoriteCategory(id: string) {
    // Check if favoriteCategories doesn't contain the category
    if (!favoritesStore.favoriteCategories.has(id)) {
        throw new Error('Cannot find the category in favorite category list.');
    }

    // Remove favorite from the store
    favoritesStore.orderedFavoritesNodeIds.splice(
        favoritesStore.orderedFavoritesNodeIds.indexOf(id),
        1
    );
    favoritesStore.favoriteCategories.delete(id);

    // Update user options service which is used by OWA
    updateFavoritesUserOption();
});
