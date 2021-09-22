import setAppPaneUnderlayVisibility from 'owa-application/lib/actions/setAppPaneUnderlayVisibility';
import { lazyHideFlexPane } from 'owa-flex-pane';
import { lazyTriggerResizeEvent } from 'owa-resize-event';
import type { AppPaneUnderlayViewState } from 'owa-application/lib/store/store';

export const ADDIN_TASK_PANE_KEY = 'addinTaskPane';

export function expandPaneUnderlay(underlayViewState?: AppPaneUnderlayViewState) {
    setAppPaneUnderlayVisibility(ADDIN_TASK_PANE_KEY, true, false, underlayViewState);
    lazyTriggerResizeEvent.importAndExecute();
    lazyHideFlexPane.importAndExecute();
}

export function collapsePaneUnderlay(underlayViewState?: AppPaneUnderlayViewState) {
    setAppPaneUnderlayVisibility(ADDIN_TASK_PANE_KEY, false, false, underlayViewState);
    lazyTriggerResizeEvent.importAndExecute();
}
