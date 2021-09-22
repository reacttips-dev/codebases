import { action } from 'satcheljs/lib/legacy';
import categoryStore from '../store/store';

/**
 * Sets the shouldShowAllCategories flag
 * @param shouldShow new flag to set
 */
export default action('setShouldShowAllCategories')(function setShouldShowAllCategories(
    shouldShow: boolean
) {
    categoryStore.categoryMenuViewState.shouldShowAllCategories = shouldShow;
});
