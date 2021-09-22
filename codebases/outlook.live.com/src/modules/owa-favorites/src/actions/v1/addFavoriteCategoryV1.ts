import createDropViewState from 'owa-dnd/lib/utils/createDropViewState';
import { isCategoryInFavorites } from '../../selectors/isInFavorites';
import { FavoriteCategoryNode, FolderForestNodeType } from 'owa-favorites-types';
import updateFavoritesUserOption from '../../actions/v1/updateFavoritesUserOption';
import favoritesStore from '../../store/store';
import { action } from 'satcheljs/lib/legacy';

/**
 * Add a favorite category from the favorite store
 * @param id of the category
 * @param actionSource where the remove favorite category comes from
 */
export default action('addFavoriteCategory')(function addFavoriteCategoryV1(id: string) {
    // Check if category is already in favorites
    if (isCategoryInFavorites(id)) {
        // This function should not be called when duplicate category is added to favorites
        throw new Error('Cannot add duplicate category to favorites.');
    }

    // Add favorite category to favorite store
    favoritesStore.orderedFavoritesNodeIds.push(id);
    favoritesStore.favoriteCategories.set(id, <FavoriteCategoryNode>{
        id: id,
        type: FolderForestNodeType.Category,
        treeType: 'favorites',
        dropViewState: createDropViewState(),
    });

    // Update user options service which is used by OWA
    updateFavoritesUserOption();
});
