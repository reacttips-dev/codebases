import { getStore } from '../store/Store';
import { action } from 'satcheljs/lib/legacy';
import { setShowFolderPane } from '../actions/setShowFolderPane';
import setFolderPaneCollapsedState from '../services/setFolderPaneCollapsedState';
import { LayoutChangeSource } from 'owa-layout';
import logFolderPaneState from '../helpers/logFolderPaneState';
import { shouldShowFolderPaneAsOverlay } from '../selectors/shouldShowFolderPaneAsOverlay';
import { lazyTriggerResizeEvent } from 'owa-resize-event';

/**
 * Toggle folder pane expansion collapse state on user click on hamburger button
 */
export default action('toggleFolderPaneExpansion')(function toggleFolderPaneExpansion() {
    const folderPaneShown = getStore().showFolderPane;

    // Toggle the state
    setShowFolderPane(!folderPaneShown /* showFolderPane */);

    /**
     * Only persist the folder pane expand/collapse state when user is not
     * in a smaller resolution where folder pane is shown as an overlay
     * If not shown as an overlay, also trigger a resize event.
     */
    if (!shouldShowFolderPaneAsOverlay()) {
        setFolderPaneCollapsedState(folderPaneShown /* isCollapsed */);
        lazyTriggerResizeEvent.importAndExecute();
    }

    // log show state change for folder pane
    logFolderPaneState(
        LayoutChangeSource.ToggleFolderPane,
        !folderPaneShown, // folderPaneNewShowState
        folderPaneShown // folderPaneOldShowState
    );
});
