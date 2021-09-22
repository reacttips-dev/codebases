import categoryStore from '../../store/store';
import { action } from 'satcheljs/lib/legacy';

/**
 * Sets the color picker target
 * @param colorPickerTarget colorPicker target element
 */
export default action('setColorPickerTarget')(function setColorPickerTarget(
    colorPickerTarget: HTMLElement
) {
    categoryStore.categoryColorPickerViewState.colorPickerTarget = colorPickerTarget;
});
