import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { trace } from 'owa-trace';
import { DEFAULT_LIST_VIEW_WIDTH, DEFAULT_LIST_VIEW_HEIGHT } from '../mailLayoutConstants';
import {
    MIN_LIST_VIEW_WIDTH,
    MAX_LIST_VIEW_HEIGHT,
    MIN_LIST_VIEW_HEIGHT,
} from '../internalConstants';
import { getListViewMaxWidth } from '../utils/getMaxWidths';

/**
 * Gets the dimensions for the list view
 * @returns the listView dimensions
 */
export function getListViewDimensions(): { listViewWidth: number; listViewHeight: number } {
    let listViewWidth = DEFAULT_LIST_VIEW_WIDTH;
    let listViewHeight = DEFAULT_LIST_VIEW_HEIGHT;

    const globalFolderViewStateConfig = getUserConfiguration().ViewStateConfiguration
        ?.GlobalFolderViewState;

    /**
     * GlobalFolderViewState is undefined for user using Owa first time
     * If its defined try to get the list view dimensions from the user config
     */
    if (globalFolderViewStateConfig) {
        try {
            /**
             * Check if the dimensions are defined as they may be undefined if user has never changed LV dimensions
             */
            const globalFolderViewState = JSON.parse(globalFolderViewStateConfig);
            const storedWidth = globalFolderViewState.Width;
            const storedHeight = globalFolderViewState.Height;

            listViewWidth = storedWidth ? storedWidth : listViewWidth;
            listViewHeight = storedHeight ? storedHeight : listViewHeight;
        } catch (error) {
            trace.warn(
                'GetListViewDimensions: De-serialize globalFolderViewState failed: ' + error.Message
            );
        }
    }

    /**
     * Validate the dimensions are in bounds as currently the stored values and also the default values
     * can be out of bounds as we have max list view width values defined for different browser width buckets
     */
    listViewWidth = Math.min(getListViewMaxWidth(), Math.max(listViewWidth, MIN_LIST_VIEW_WIDTH));
    listViewHeight = Math.min(MAX_LIST_VIEW_HEIGHT, Math.max(listViewHeight, MIN_LIST_VIEW_HEIGHT));

    return { listViewWidth: listViewWidth, listViewHeight: listViewHeight };
}
