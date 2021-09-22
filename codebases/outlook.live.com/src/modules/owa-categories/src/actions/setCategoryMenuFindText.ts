import { action } from 'satcheljs/lib/legacy';
import categoryStore from '../store/store';

/**
 * Sets the move to find text in the categoryMenu store
 * @param findText the find text
 */
export default action('setCategoryMenuFindText')(function setCategoryMenuFindText(
    findText: string
) {
    categoryStore.categoryMenuViewState.findText = findText;
});
