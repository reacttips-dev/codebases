import { action } from 'satcheljs/lib/legacy';
import type ExpressionPickerViewState from '../store/schema/ExpressionPickerViewState';

export default action('setEmojiCategoryIndex')(function setEmojiCategoryIndex(
    viewState: ExpressionPickerViewState,
    index: number
) {
    viewState.emojiCategoryIndex = index;
});
