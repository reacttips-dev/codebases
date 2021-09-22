import setTableIsInCheckedMode from './mutators/setTableIsInCheckedMode';
import type { TableView } from 'owa-mail-list-store';
import type MailListItemSelectionSource from 'owa-mail-store/lib/store/schema/MailListItemSelectionSource';
import { setSelectionOnRow } from 'owa-mail-actions/lib/setSelectionOnRow';
import setSelectionAnchorRowKey from './mutators/setSelectionAnchorRowKey';
import setMultiSelectionAnchorRowKey from './mutators/setMultiSelectionAnchorRowKey';
import setFocusedRowKey from './mutators/setFocusedRowKey';

export default function rangeSelectRowInternal(
    tableView: TableView,
    targetRowKey: string,
    mailListItemSelectionSource: MailListItemSelectionSource,
    isCtrlOrCmdKeyDown?: boolean
): void {
    const rangeSelectionAnchor = tableView.multiSelectionAnchorRowKey
        ? tableView.multiSelectionAnchorRowKey
        : tableView.selectionAnchorRowKey || tableView.rowKeys[0];

    // For the shift click scenario
    const rangeBoundaries = [rangeSelectionAnchor, targetRowKey];
    // Selection path is the collection of rows that should be selected after range select (if row is in the path it should be selected, otherwise it should not be)
    let inSelectionPath = false;
    // Boundary means a row is on a boundary of the selection path
    let isBoundary = false;

    for (const currentRowKey of tableView.rowKeys) {
        isBoundary = rangeBoundaries.includes(currentRowKey);

        // If row is not within bounds of the selection, deselect it if it is selected and the ctrl key isn't down
        if (!inSelectionPath && !isBoundary) {
            if (tableView.selectedRowKeys.has(currentRowKey) && !isCtrlOrCmdKeyDown) {
                setSelectionOnRow(currentRowKey, tableView.id, false /* shouldSelect */);
            }
        } else {
            // If we come across first boundary of selection, set the selection path to true so subsequent rows get selected
            // If we come across the second boundary of selection, set the selection path to false so subsequent rows don't get selected
            // If the boundary is one row (if user shift clicked on currently selected or focused row)
            inSelectionPath =
                isBoundary !== inSelectionPath &&
                !(
                    currentRowKey === rangeBoundaries[0] &&
                    rangeBoundaries[0] === rangeBoundaries[1]
                );
            setSelectionOnRow(currentRowKey, tableView.id, true /* shouldSelect */);
        }
    }

    setMultiSelectionAnchorRowKey(tableView, rangeSelectionAnchor);
    setSelectionAnchorRowKey(tableView, targetRowKey);
    setFocusedRowKey(tableView, targetRowKey);
    setTableIsInCheckedMode(tableView, true);
}
