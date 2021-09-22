import { mutatorAction } from 'satcheljs';
import type ExpressionPickerViewState from '../store/schema/ExpressionPickerViewState';

export default mutatorAction(
    'updateEmojiResults',
    (state: ExpressionPickerViewState, results: string[]) => {
        state.emojiPickerViewState.emojiResults = results;
    }
);
