import categoryStore from '../../store/store';
import { action } from 'satcheljs/lib/legacy';

/**
 * Sets the shouldShowColorPicker flag
 * @param shouldShow new flag to set
 */
export default action('setShouldShowColorPicker')(function setShouldShowColorPicker(
    shouldShow: boolean
) {
    categoryStore.categoryColorPickerViewState.shouldShowColorPicker = shouldShow;
});
