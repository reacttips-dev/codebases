import getValidFolderPaneWidth from '../utils/getValidFolderPaneWidth';
import { leftPaneResized } from '../actions/leftPaneResized';
import logFolderPaneState from '../helpers/logFolderPaneState';
import setFolderPaneWidth from '../legacyActions/setFolderPaneWidth';
import { setShowFolderPane } from '../actions/setShowFolderPane';
import { LayoutChangeSource } from 'owa-layout';
import { getLeftRailWidth } from '../utils/getLeftRailWidth';
import { getStore } from '../store/Store';
import { orchestrator } from 'satcheljs';
import setFolderPaneCollapsedState from '../services/setFolderPaneCollapsedState';

export default orchestrator(leftPaneResized, actionMessage => {
    /**
     * actionMessage.leftPaneWidth is the width of the entire left pane that contains left rail
     */
    const folderPaneWidthAfterResize = actionMessage.leftPaneWidth - getLeftRailWidth();

    /**
     * Today upon left pane resize we are always showing the pane and never collapsing it.
     * So upon resize event we should make sure we set the width to a valid number
     */
    const newFolderPaneWidth = getValidFolderPaneWidth(
        folderPaneWidthAfterResize,
        LayoutChangeSource.LeftNavResizeExpand
    );

    const isFolderPaneBeingShown = getStore().showFolderPane;
    setFolderPaneWidth(newFolderPaneWidth);
    setShowFolderPane(true); // Always expand upon left nav resize event

    /**
     * Persist the folder pane expand/collapse state
     */
    setFolderPaneCollapsedState(false /* isCollapsed */);

    if (!isFolderPaneBeingShown) {
        // User expanded the folder from collapsed state through resize, log this
        logFolderPaneState(
            LayoutChangeSource.LeftNavResizeExpand,
            true /* folderPaneNewShowState */,
            false /* folderPaneOldShowState */
        );
    }
});
