import { LayoutChangeSource } from 'owa-layout';
import {
    DEFAULT_FOLDER_PANE_WIDTH,
    MAX_FOLDER_PANE_WIDTH,
    MIN_FOLDER_PANE_WIDTH,
} from '../internalConstants';

/**
 * Validate the given folder pane width and return back a valid value
 */
export default function getValidFolderPaneWidth(
    folderPaneWidth: number | undefined,
    layoutChangeSource: LayoutChangeSource
) {
    if (!folderPaneWidth) {
        return DEFAULT_FOLDER_PANE_WIDTH;
    }

    /* If given width is less than minimum width */
    if (folderPaneWidth < MIN_FOLDER_PANE_WIDTH) {
        /* If this is a scenario where user is resizing the left pane, then set the width to minimum allowed
        For other scenarios, set the width to the default width */
        return layoutChangeSource == LayoutChangeSource.LeftNavResizeExpand
            ? MIN_FOLDER_PANE_WIDTH
            : DEFAULT_FOLDER_PANE_WIDTH;
    }

    /* If given width is greater than maximum width */
    if (folderPaneWidth > MAX_FOLDER_PANE_WIDTH) {
        return MAX_FOLDER_PANE_WIDTH;
    }

    /* Given width is in bounds - use it */
    return folderPaneWidth;
}
