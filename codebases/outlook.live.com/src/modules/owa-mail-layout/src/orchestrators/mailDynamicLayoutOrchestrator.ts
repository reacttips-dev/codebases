import { orchestrator } from 'satcheljs';
import { setShowFolderPane } from '../actions/setShowFolderPane';
import { getIsBitSet, ListViewBitFlagsMasks } from 'owa-bit-flags/lib/utils/listViewBitFlagsUtil';
import logFolderPaneState from '../helpers/logFolderPaneState';
import {
    isReadingPanePositionRight,
    isRPHiddenOrBottomByDefault as isRPHiddenOrBottomByDefaultFunc,
} from '../selectors/readingPanePosition';
import setCurrentClientReadingPanePosition from '../mutators/setCurrentClientReadingPanePositionMutator';
import ReadingPanePosition from 'owa-session-store/lib/store/schema/ReadingPanePosition';
import { onClientReadingPanePositionChange } from '../actions/onClientReadingPanePositionChange';
import { getStore } from '../store/Store';
import { LayoutChangeSource, BrowserWidthBucket, onAvailableWidthBucketChanged } from 'owa-layout';

orchestrator(onAvailableWidthBucketChanged, actionMessage => {
    const { availableWidthBucket, source } = actionMessage;
    if (availableWidthBucket <= BrowserWidthBucket.From418_Below) {
        collapseFolderPane(source);
        setClientReadingPanePositionOff();
        return;
    }

    /**
     * When user has chosen reading pane setting to be hidden/bottom (also called as single line view),
     * we want to collapse the left nav as late as possible
     * as there are only two columns (LeftNav, LV/RP) to share the space. This is so as to continue offering
     * the default layout of the user as much as we can.
     */
    const isRPHiddenORBottomByDefault = isRPHiddenOrBottomByDefaultFunc();
    if (isRPHiddenORBottomByDefault && availableWidthBucket <= BrowserWidthBucket.From500_To541) {
        collapseFolderPane(source);
        setClientReadingPanePositionOff();
        return;
    }

    /**
     * When user has chosen reading pane setting to be right (also called as 3 column view)
     */
    if (!isRPHiddenORBottomByDefault) {
        if (availableWidthBucket <= BrowserWidthBucket.From692_To768) {
            collapseFolderPane(source);
            setClientReadingPanePositionOff();
            return;
        }

        /**
         * We want to collapse the left nav more aggressively
         * as there are three columns (LeftNav, LV and RP) to share the space
         */
        if (availableWidthBucket <= BrowserWidthBucket.From900_To918) {
            collapseFolderPane(source);
            resetClientReadingPanePosition();
            return;
        }
    }

    expandFolderPane(source);
    resetClientReadingPanePosition();
});

/**
 * Force hide folder pane as determined by the current browser width bucket
 * @param source the layout change source
 */
function collapseFolderPane(source: LayoutChangeSource) {
    if (getStore().showFolderPane) {
        setShowFolderPane(false);
        logFolderPaneState(
            source,
            false /* folderPaneNewShowState */,
            true /* folderPaneOldShowState */
        );
    }
}

/**
 * Try expand folder pane as determined by the current browser width bucket
 * @param source the layout change source
 */
function expandFolderPane(source: LayoutChangeSource) {
    const showFolderPane = !getIsBitSet(ListViewBitFlagsMasks.FolderPaneCollapsed);

    if (showFolderPane && !getStore().showFolderPane) {
        setShowFolderPane(true);
        logFolderPaneState(
            source,
            true /* folderPaneNewShowState */,
            false /* folderPaneOldShowState */
        );
    }
}

/**
 * Sets the client reading pane position best suited for the current browser layout
 */
function setClientReadingPanePositionOff() {
    // Change RP position to Off if it is Right
    const currentReadingPanePositionRight = isReadingPanePositionRight();
    if (!currentReadingPanePositionRight) {
        return;
    }

    setCurrentClientReadingPanePosition(ReadingPanePosition.Off);
    onClientReadingPanePositionChange();
}

/**
 * Resets the client reading pane position
 */
function resetClientReadingPanePosition() {
    setCurrentClientReadingPanePosition(null);
    onClientReadingPanePositionChange();
}
