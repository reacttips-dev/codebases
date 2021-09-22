import tryPerformRowAutoMarkAsRead from '../../helpers/tryPerformRowAutoMarkAsRead';
import type TableView from 'owa-mail-list-store/lib/store/schema/TableView';
import { action } from 'satcheljs/lib/legacy';

/**
 * Called on navigate away via up/down buttons from command bar
 * @param rowKey the rowKey to be marked as read
 * @param tableView the table view
 */
export default action('onNavigateAwayViaUpDown')(function onNavigateAwayViaUpDown(
    rowKey: string,
    tableView: TableView
) {
    tryPerformRowAutoMarkAsRead(rowKey, tableView);
});
