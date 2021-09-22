import setCategoryMenuFindText from './setCategoryMenuFindText';
import setShouldShowAllCategories from './setShouldShowAllCategories';

/**
 * Called when the category menu is actually dismissed
 * We clean up the category store when menu dismisses
 */
export function onMenuDismissed() {
    setCategoryMenuFindText('');
    setShouldShowAllCategories(false);
}
