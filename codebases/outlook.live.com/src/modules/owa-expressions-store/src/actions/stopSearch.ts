import { mutatorAction } from 'satcheljs';
import type ExpressionPickerViewState from '../store/schema/ExpressionPickerViewState';

export default mutatorAction('stopSearch', (state: ExpressionPickerViewState) => {
    state.isSearching = false;
});
