import { resetSelection, singleSelectRow } from 'owa-mail-actions/lib/mailListSelectionActions';
import MailListItemSelectionSource from 'owa-mail-store/lib/store/schema/MailListItemSelectionSource';
import type { TableView } from 'owa-mail-list-store';

/**
 * Function to try select the next row upon triage action such as pin/unpin,
 * marking nudge rows as complete/dismiss or replying nudge rows
 * @param rowKeys the row keys of the rows on which action was taken
 * @param originalTableView the original table view
 */
export function trySelectNextRowUponTriageAction(rowKeys: string[], originalTableView: TableView) {
    const keyOfLastRowToActUpon = rowKeys[rowKeys.length - 1];
    const indexOfLastRowToActUpon = originalTableView.rowKeys.indexOf(keyOfLastRowToActUpon);

    // Select the next row in table if the row being acted upon is selected and it's not the last row in table
    const shouldSelectNextRow = indexOfLastRowToActUpon < originalTableView.rowKeys.length - 1;
    if (shouldSelectNextRow) {
        singleSelectRow(
            originalTableView,
            originalTableView.rowKeys[indexOfLastRowToActUpon + 1],
            false /* isUserNavigation */,
            MailListItemSelectionSource.RowRemoval
        );
    } else {
        // Clear the selection if there is no next row to select, e.g last row in table is selected and being acted upon
        resetSelection(originalTableView, MailListItemSelectionSource.Reset);
    }
}
