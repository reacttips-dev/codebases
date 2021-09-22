import { action } from 'satcheljs/lib/legacy';
import type ExpressionPickerViewState from '../store/schema/ExpressionPickerViewState';

export default action('resetNumSearchesToInsertEmoji')(function resetNumSearchesToInsertEmoji(
    viewState: ExpressionPickerViewState
) {
    viewState.numSearchesToInsertEmoji = 0;
});
