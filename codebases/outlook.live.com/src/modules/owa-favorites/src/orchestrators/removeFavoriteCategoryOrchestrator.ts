import removeFavoriteCategory from '../actions/removeFavoriteCategory';
import removeFavoriteCategoryV1 from '../actions/v1/removeFavoriteCategoryV1';
import removeFavoriteCategoryV2 from '../actions/v2/removeFavoriteCategoryV2';
import { isFeatureEnabled } from 'owa-feature-flags';
import { onCategoryUnfavorited } from '../actions/favoriteCategoryActions';
import { orchestrator } from 'satcheljs';

export default orchestrator(removeFavoriteCategory, actionMessage => {
    const { categoryId } = actionMessage;

    if (isFeatureEnabled('tri-favorites-roaming')) {
        removeFavoriteCategoryV2(categoryId);
    } else {
        removeFavoriteCategoryV1(categoryId);
    }

    onCategoryUnfavorited(categoryId);
});
