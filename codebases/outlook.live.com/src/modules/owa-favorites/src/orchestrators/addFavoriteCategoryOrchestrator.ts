import addFavoriteCategory from '../actions/addFavoriteCategory';
import addFavoriteCategoryV1 from '../actions/v1/addFavoriteCategoryV1';
import addFavoriteCategoryV2 from '../actions/v2/addFavoriteCategoryV2';
import { onCategoryFavorited } from '../actions/favoriteCategoryActions';
import { isFeatureEnabled } from 'owa-feature-flags';
import { orchestrator } from 'satcheljs';

export default orchestrator(addFavoriteCategory, actionMessage => {
    const { categoryId } = actionMessage;

    if (isFeatureEnabled('tri-favorites-roaming')) {
        addFavoriteCategoryV2(categoryId);
    } else {
        addFavoriteCategoryV1(categoryId);
    }

    onCategoryFavorited(categoryId);
});
