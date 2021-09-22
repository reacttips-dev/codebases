import tryPerformRowAutoMarkAsRead from '../../helpers/tryPerformRowAutoMarkAsRead';
import type TableView from 'owa-mail-list-store/lib/store/schema/TableView';
import { isReadingPanePositionOff } from 'owa-mail-layout';

/**
 * Called when the table has single selection, and user selects another single conversation
 * @param rowKey the rowKey to be marked as read
 * @param tableView the tableView where the single selection changed
 * @param isUserNavigation whether the navigation is triggerred by the user
 */
export default async function onSingleSelectionChanged(
    rowKey: string,
    tableView: TableView,
    isUserNavigation: boolean
) {
    // Do nothing when user changes single selection in single line view
    if (isReadingPanePositionOff()) {
        return;
    }

    if (isUserNavigation) {
        await tryPerformRowAutoMarkAsRead(rowKey, tableView);
    }
}
