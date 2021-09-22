import { mutatorAction } from 'satcheljs';
import type ExpressionPickerViewState from '../store/schema/ExpressionPickerViewState';

export default mutatorAction(
    'startSearch',
    (state: ExpressionPickerViewState, searchTerm: string) => {
        state.isSearching = true;
        state.searchTerm = searchTerm;
    }
);
