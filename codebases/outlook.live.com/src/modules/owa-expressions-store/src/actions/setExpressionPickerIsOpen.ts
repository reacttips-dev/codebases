import type ExpressionPickerViewState from '../store/schema/ExpressionPickerViewState';
import { action } from 'satcheljs/lib/legacy';

export default action('setExpressionPickerIsOpen')(function setExpressionPickerIsOpen(
    viewState: ExpressionPickerViewState,
    isOpen: boolean
) {
    viewState.isOpen = isOpen;
});
