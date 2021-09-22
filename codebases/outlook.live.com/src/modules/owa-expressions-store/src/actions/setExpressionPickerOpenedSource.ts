import type ExpressionPickerOpenedSource from '../store/schema/ExpressionPickerOpenedSource';
import type ExpressionPickerViewState from '../store/schema/ExpressionPickerViewState';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'setExpressionPickerOpenedSource',
    (viewState: ExpressionPickerViewState, source: ExpressionPickerOpenedSource) => {
        viewState.source = source;
    }
);
