import setTableIsInCheckedMode from './mutators/setTableIsInCheckedMode';
import tableEnterVirtualSelectAllMode from './mutators/tableEnterVirtualSelectAllMode';
import resetSelectionInternal from './resetSelectionInternal';
import { getIsEverythingSelectedInTable, TableQueryType, TableView } from 'owa-mail-list-store';
import { setSelectionOnRow } from 'owa-mail-actions/lib/setSelectionOnRow';

/**
 * Toggle between select all and clear selection on the table
 * @param tableView where the operation is being performed
 */
export default function toggleSelectAllRowsInternal(tableView: TableView): void {
    // Reset the selection
    // We can enter this mode from
    // 1.Non-checked mode, where single row was selected
    // OR 2. from a checked mode where multiple rows were selected
    // OR 3. this can be a exiting on a select all mode were multiple rows were selected
    // In 1,2,3 cases, we want to deselect the rows that were selected and reset selection will do it
    // 4. this can be a entering in a select all mode were nothing was selected, in which case resetSelection will not change anything

    if (getIsEverythingSelectedInTable(tableView)) {
        resetSelectionInternal(tableView);
        return;
    }

    // VSO 17775: remove checking search table query after fixing 17775
    if (
        tableView.rowKeys.length == tableView.totalRowsInView ||
        tableView.tableQuery.type == TableQueryType.Search
    ) {
        // In case of client has all row keys or table is a search table, add all conversations to the real selection,
        // because we have all conversations in execute search response
        tableView.rowKeys.forEach(rowKey =>
            setSelectionOnRow(rowKey, tableView.id, true /* shouldSelect */)
        );
    } else {
        resetSelectionInternal(tableView);
        tableEnterVirtualSelectAllMode(tableView);
    }

    // Always set the checked mode to true when we enter the select all mode
    setTableIsInCheckedMode(tableView, true);
}
