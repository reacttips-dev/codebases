import tryPerformRowAutoMarkAsRead from '../../helpers/tryPerformRowAutoMarkAsRead';
import { isReadingPanePositionOff } from 'owa-mail-layout';
import type TableView from 'owa-mail-list-store/lib/store/schema/TableView';
import * as trace from 'owa-trace';
import { action } from 'satcheljs/lib/legacy';

/**
 * Called after the reading pane is closed in single line view
 * @param conversationRowKey the key of row shown in reading pane before it's closed
 * @param tableView the tableView where the single selection changed
 * @param isUserNavigation whether the navigation is triggerred by the user
 */
export default action('onReadingPaneClosed')(function onReadingPaneClosed(
    rowKey: string,
    tableView: TableView
) {
    if (!isReadingPanePositionOff()) {
        trace.errorThatWillCauseAlert(
            'onReadingPaneClosed should only be called in single line view.'
        );
    }

    // this function can be called on a delay, and the user may have already moved on to open
    // another item in immersive reading pane, so reading pane may be opened or closed when
    // the code reaches here
    tryPerformRowAutoMarkAsRead(rowKey, tableView);
});
