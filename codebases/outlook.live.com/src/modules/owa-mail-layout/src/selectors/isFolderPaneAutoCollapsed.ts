import { getIsBitSet, ListViewBitFlagsMasks } from 'owa-bit-flags/lib/utils/listViewBitFlagsUtil';
import { shouldShowFolderPane as shouldShowFolderPaneLocal } from './shouldShowFolderPane';

/**
 * Returns whether the pane was collapsed automatically for user
 */
export function isFolderPaneAutoCollapsed(): boolean {
    const showFolderPane = !getIsBitSet(ListViewBitFlagsMasks.FolderPaneCollapsed);
    const localShowFolderPane = shouldShowFolderPaneLocal();

    // If locally we are hiding folder pane return the actual persisted value of folder pane setting
    if (!localShowFolderPane) {
        return showFolderPane;
    }

    return false;
}
