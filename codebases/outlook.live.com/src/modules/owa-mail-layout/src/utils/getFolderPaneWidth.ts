import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { getStore } from '../store/Store';
import { shouldShowFolderPaneAsOverlay } from '../selectors/shouldShowFolderPaneAsOverlay';
import { DEFAULT_FOLDER_PANE_WIDTH } from '../internalConstants';

/**
 * Gets the current folder pane width. Note that this is returning the width of the
 * folder pane component, which is just one part of the full left nav component.
 * @returns the number of pixels
 */
export function getFolderPaneWidth(): number {
    return getStore().showFolderPane && !shouldShowFolderPaneAsOverlay()
        ? getUserConfiguration().UserOptions?.NavigationBarWidth || DEFAULT_FOLDER_PANE_WIDTH
        : 0;
}
