import { action } from 'satcheljs/lib/legacy';
import categoryStore from '../store/store';

/**
 * Sets the isFocusInSearchBox
 * @param isFocusInSearchBox indicates whether the focus is in search box or not
 */
export default action('setIsFocusInSearchBox')(function setIsFocusInSearchBox(
    isFocusInSearchBox: boolean
) {
    categoryStore.categoryMenuViewState.isFocusInSearchBox = isFocusInSearchBox;
});
