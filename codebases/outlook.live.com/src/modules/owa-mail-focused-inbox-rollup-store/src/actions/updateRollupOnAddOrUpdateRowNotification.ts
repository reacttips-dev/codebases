import { getFolderChangeDigestAction } from '../index';
import {
    TableView,
    getSelectedTableView,
    getFocusedFilterForTable,
    MailFolderTableQuery,
} from 'owa-mail-list-store';
import FocusedViewFilter from 'owa-service/lib/contract/FocusedViewFilter';
import { action } from 'satcheljs/lib/legacy';

/**
 * Get rollup data on add/update row notification
 * @param notificationTable for which row notification is received
 */
export default action('updateRollupOnAddOrUpdateRowNotification')(
    function updateRollupOnAddOrUpdateRowNotification(notificationTable: TableView) {
        const selectedTableView = getSelectedTableView();

        if (selectedTableView == null) {
            return;
        }

        const notificationFocusedViewFilter = getFocusedFilterForTable(notificationTable);
        const selectedTableFocusedViewFilter = getFocusedFilterForTable(selectedTableView);

        // Fetch new data for rollup on add/update row notification for Focused and current view is Other or
        // on new mail notification for Other and current filter is Focused
        if (
            (notificationFocusedViewFilter == FocusedViewFilter.Focused &&
                selectedTableFocusedViewFilter == FocusedViewFilter.Other) ||
            (notificationFocusedViewFilter == FocusedViewFilter.Other &&
                selectedTableFocusedViewFilter == FocusedViewFilter.Focused)
        ) {
            getFolderChangeDigestAction(notificationTable.tableQuery as MailFolderTableQuery);
        }
    }
);
