import { orchestrator } from 'satcheljs';
import addFavoriteCategoryV2 from '../actions/v2/addFavoriteCategoryV2';
import {
    addFavoriteToStore,
    addFavoriteCompleted,
    addFavoriteFailed,
} from '../actions/v2/addFavoriteActions';
import { isCategoryInFavorites } from '../selectors/isInFavorites';
import createOutlookFavoriteService from '../services/v2/createOutlookFavoriteService';
import { getMasterCategoryList, lazySubscribeToCategoryNotifications } from 'owa-categories';
import { getGuid } from 'owa-guid';
import { convertServiceResponseToFavoriteData } from '../utils/favoriteServiceDataUtils';
import isOutlookFavoritingInProgress from '../selectors/v2/isOutlookFavoritingInProgress';
import { createClientFavoriteCategoryData } from '../utils/createClientFavoriteData';
import { createOwsFavoriteCategoryData } from '../utils/createOwsFavoriteData';

/**
 * Add a favorite category from the favorite store
 * @param id of the category
 */
export default orchestrator(addFavoriteCategoryV2, async actionMessage => {
    const { categoryId } = actionMessage;

    const category = getMasterCategoryList().filter(category => category.Id === categoryId)[0];

    const temporaryGuid = getGuid();
    const favoriteCategoryData = createClientFavoriteCategoryData(
        temporaryGuid,
        category,
        false /* isMigration */
    );

    if (isOutlookFavoritingInProgress(categoryId)) {
        // No-op
        return;
    }

    try {
        // Check if category is already in favorites
        if (isCategoryInFavorites(categoryId)) {
            // This function should not be called when duplicate category is added to favorites
            return; //do nothing
        }

        // Local update to add Category to favorites store
        addFavoriteToStore(favoriteCategoryData);

        const owsFavoriteCategoryData = createOwsFavoriteCategoryData(
            category,
            false /* isMigration */
        );

        // Use Favorite Roaming API to create a new outlook favorite
        const response = await createOutlookFavoriteService(owsFavoriteCategoryData);

        const favoriteData = convertServiceResponseToFavoriteData(response, 'category');

        // Subscribe to category notification changes
        lazySubscribeToCategoryNotifications.importAndExecute();

        addFavoriteCompleted(favoriteCategoryData, favoriteData);
    } catch (e) {
        // In case of error (duplicate or network failure), fire an action that callers can listen to
        addFavoriteFailed(e, favoriteCategoryData);
    }
});
