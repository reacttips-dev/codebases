import {
    isReadingPanePositionBottom,
    isReadingPanePositionOff,
    getGlobalReadingPanePositionReact,
} from './readingPanePosition';
import { ListViewLayout } from '../store/schema/MailLayoutStore';
import ReadingPanePosition from 'owa-session-store/lib/store/schema/ReadingPanePosition';
import { BrowserWidthBucket, getBrowserWidthBucket } from 'owa-layout';
import { shouldShowSingleLineViewWithRightReadingPane } from '../utils/shouldShowSingleLineViewWithRightReadingPane';

/**
 * Returns a flag indicating whether the list view should show items in a single line.
 * If the clientListViewLayout is set to a non null value we use it to determine the list view layout else
 *
 * This returns true if reading pane setting is hidden or off client side, but
 * the actual persisted setting is not RIGHT. If the actual setting is RIGHT and the client
 * side setting is OFF it means that we have overridden the RIGHT setting in which case we
 * still want to show list view items in 3 line and not single line
 */
export function isSingleLineListView(): boolean {
    const clientListViewLayout = getClientListViewLayout();
    if (clientListViewLayout !== null) {
        return clientListViewLayout == ListViewLayout.SingleLine;
    }

    return (
        ((isReadingPanePositionBottom() || isReadingPanePositionOff()) &&
            getGlobalReadingPanePositionReact() != ReadingPanePosition.Right) ||
        shouldShowSingleLineViewWithRightReadingPane()
    );
}

/**
 * Returns the listViewLayout as per clients current browser window bucket.
 * This layout will override the user's list view layout set for current configuration
 */
function getClientListViewLayout(): ListViewLayout | null {
    return getBrowserWidthBucket() <= BrowserWidthBucket.From686_To691
        ? ListViewLayout.ThreeLine
        : null;
}
