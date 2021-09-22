import tryPerformRowAutoMarkAsRead from '../../helpers/tryPerformRowAutoMarkAsRead';
import { isReadingPanePositionOff } from 'owa-mail-layout';
import { getViewFilterForTable, TableView } from 'owa-mail-list-store';

/**
 * Function for marking current rows as read when the table view changes
 * Do not change this to orchestrator as this function needs to be called before a row isremoved from the store.
 * Currently this is called from the V2 code loadTableViewFromTableQuery and needs to be executed for e.g. before
 * search table is cleared upon exiting search
 * @param oldSelectedRowKeys seleted row keys from old table
 * @param oldTableView the previous table view
 * @param newTableView the new table view we are switching to
 */
export function markReadOnTableViewChange(
    oldSelectedRowKeys: string[],
    oldTableView: TableView,
    newTableView: TableView
) {
    /**
     * Do nothing when:
     * 1) In SLV
     * 2) More than one row is selected
     * 3) Moving to unread filter
     * */
    if (
        oldSelectedRowKeys.length == 0 ||
        isReadingPanePositionOff() ||
        oldSelectedRowKeys.length !== 1 ||
        getViewFilterForTable(newTableView) === 'Unread'
    ) {
        return;
    }

    tryPerformRowAutoMarkAsRead(oldSelectedRowKeys[0], oldTableView);
}
