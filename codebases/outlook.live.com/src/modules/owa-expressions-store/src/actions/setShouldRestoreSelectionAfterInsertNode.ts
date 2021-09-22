import type ExpressionPickerViewState from '../store/schema/ExpressionPickerViewState';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'setShouldRestoreSelectionAfterInsertNode',
    (viewState: ExpressionPickerViewState, shouldRestoreSelectionAfterInsertNode: boolean) => {
        viewState.shouldRestoreSelectionAfterInsertNode = shouldRestoreSelectionAfterInsertNode;
    }
);
