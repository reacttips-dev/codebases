import type ExpressionPickerViewState from '../store/schema/ExpressionPickerViewState';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'setWordToReplace',
    (viewState: ExpressionPickerViewState, wordToReplace: string) => {
        viewState.wordToReplace = wordToReplace;
    }
);
