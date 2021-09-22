import { resetSelection, singleSelectRow } from 'owa-mail-actions/lib/mailListSelectionActions';
import { initTableSelectionOnLoad } from 'owa-mail-actions/lib/initTableSelectionOnLoad';
import { MailRowDataPropertyGetter, TableView } from 'owa-mail-list-store';
import shouldFirstRowBeSelectedOnLoad from 'owa-mail-list-store/lib/selectors/shouldFirstRowBeSelectedOnLoad';
import MailListItemSelectionSource from 'owa-mail-store/lib/store/schema/MailListItemSelectionSource';
import { orchestrator } from 'satcheljs';
import setSelectionAnchorRowKey from '../internal/mutators/setSelectionAnchorRowKey';
import setMultiSelectionAnchorRowKey from '../internal/mutators/setMultiSelectionAnchorRowKey';
import setFocusedRowKey from '../internal/mutators/setFocusedRowKey';
import { doesRowBelongToNudgeSection } from 'owa-mail-nudge-store';

/**
 * Auto selects the first appropriate row in table
 * @param tableView in which to select the first row
 */
function autoSelectFirstRow(tableView: TableView) {
    const tableRowKeys = tableView.rowKeys;
    const tableRowsLength = tableRowKeys.length;

    if (tableRowsLength > 0) {
        let i = 0;
        let rowToSelect = tableRowKeys[i];

        // Auto select first row
        // which is not a nudge row AND
        // which is unread or else first unpinned row
        while (i < tableRowsLength) {
            const rowKey = tableRowKeys[i];

            if (
                doesRowBelongToNudgeSection(
                    rowKey,
                    tableView.id,
                    MailRowDataPropertyGetter.getLastDeliveryOrRenewTimeStamp(rowKey, tableView)
                )
            ) {
                i++;
                continue;
            }

            const isRowPinned = MailRowDataPropertyGetter.getIsPinned(rowKey, tableView);
            const unreadCount = MailRowDataPropertyGetter.getUnreadCount(rowKey, tableView);

            if (!isRowPinned || unreadCount > 0) {
                rowToSelect = rowKey;
                break;
            }

            i++;
        }

        // Select the row
        singleSelectRow(
            tableView,
            rowToSelect,
            false /* isUserNavigation */,
            MailListItemSelectionSource.Auto
        );
    }
}

/**
 * Initializes selection on table load based on user's settings
 * @param tableView the table view
 */
export default orchestrator(initTableSelectionOnLoad, actionMessage => {
    const tableView = actionMessage.tableView;

    // Select first row if we should select first row on initial table load
    // otherwise reset selection in table and set focus on first row
    if (shouldFirstRowBeSelectedOnLoad(tableView)) {
        autoSelectFirstRow(tableView);
    } else {
        resetSelection(tableView, MailListItemSelectionSource.Reset);

        if (tableView.rowKeys.length > 0) {
            setSelectionAnchorRowKey(tableView, tableView.rowKeys[0]);
            setMultiSelectionAnchorRowKey(tableView, tableView.rowKeys[0]);
            setFocusedRowKey(tableView, tableView.rowKeys[0]);
        }
    }
});
