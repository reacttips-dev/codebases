import { mutatorAction } from 'satcheljs';
import type ExpressionPickerViewState from '../store/schema/ExpressionPickerViewState';
import type { BingGifValue } from '../services/getGifSearchResults';

export default mutatorAction(
    'updateGifResults',
    (state: ExpressionPickerViewState, results: BingGifValue[]) => {
        state.gifPickerViewState.gifResults = results;
    }
);
