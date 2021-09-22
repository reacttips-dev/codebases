import getValidFolderPaneWidth from './getValidFolderPaneWidth';
import { setShowFolderPane } from '../actions/setShowFolderPane';
import logFolderPaneState from '../helpers/logFolderPaneState';
import { default as setFolderPaneWidth } from '../legacyActions/setFolderPaneWidth';
import initializeListViewColumnWidths from '../mutators/initializeListViewColumnWidths';
import { getIsBitSet, ListViewBitFlagsMasks } from 'owa-bit-flags/lib/utils/listViewBitFlagsUtil';
import { initializeDynamicLayout, LayoutChangeSource } from 'owa-layout';
import { areDisplayAdsEnabled } from 'owa-mail-ads-checker';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

export function initializeMailLayout() {
    /**
     * On init try to validate the folder pane width (NavigationBarWidth)
     */
    const storedFolderPaneWidth = getValidFolderPaneWidth(
        getUserConfiguration().UserOptions?.NavigationBarWidth,
        LayoutChangeSource.Init
    );

    // Set folder pane width
    setFolderPaneWidth(storedFolderPaneWidth);

    const showFolderPane = !getIsBitSet(ListViewBitFlagsMasks.FolderPaneCollapsed);
    setShowFolderPane(showFolderPane);
    logFolderPaneState(LayoutChangeSource.Init, showFolderPane, showFolderPane);

    initializeListViewColumnWidths();

    initializeDynamicLayout(areDisplayAdsEnabled());
}
