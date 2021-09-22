import resetExpressionPickerViewState from '../actions/resetExpressionPickerViewState';
import setExpressionPickerIsOpen from '../actions/setExpressionPickerIsOpen';
import toggleExpressionSidePane from '../actions/toggleExpressionSidePane';
import expressionStore from '../store/expressionStore';
import { lazyHideFlexPane } from 'owa-flex-pane';
import { isDeepLink } from 'owa-url';

export default function closeExpressionPane(expressionId?: string, targetWindow?: Window) {
    const expressionPickerViewState = expressionStore.expressionPickerViewStates.get(
        expressionId || expressionStore.primaryExpressionId
    );

    if (expressionPickerViewState?.isOpen) {
        setExpressionPickerIsOpen(expressionPickerViewState, false);
        resetExpressionPickerViewState(expressionPickerViewState);

        if (expressionStore.useFlexPane) {
            if (isDeepLink() || (targetWindow && targetWindow !== window)) {
                lazyHideFlexPane.importAndExecute(targetWindow);
            } else {
                (window as any).O365Shell.FlexPane.CloseFlexPaneForProvider('Expressions');
            }
        } else {
            toggleExpressionSidePane(false /* showExpressionPane */);
        }
    }
}
