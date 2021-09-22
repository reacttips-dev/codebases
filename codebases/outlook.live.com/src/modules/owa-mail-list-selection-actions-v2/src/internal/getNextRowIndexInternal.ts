import { TableView, SelectionDirection } from 'owa-mail-list-store';

/**
 * Get the index of the next row index to take action on (focus or selection)
 * @param tableView where the operation is being performed
 * @param selectionDirection direction of the selection
 * @param mailListItemSelectionSource selection mode for the maillist item
 * @return the next index to take action on, or null if no operation should be taken
 */
export default function getNextRowIndexInternal(
    tableView: TableView,
    selectionDirection: SelectionDirection
): number {
    const selectedRowKeys = [...tableView.selectedRowKeys.keys()];
    const tableRowKeys = tableView.rowKeys;
    let selectedIndex = 0;

    // No op if operating on empty table
    if (tableRowKeys.length === 0) {
        return null;
    }

    // If there is a selection or focus, determine which row to take action on, otherwise choose the first item
    if (selectedRowKeys.length > 0 || tableView.focusedRowKey) {
        const rowKey = tableView.selectionAnchorRowKey || tableView.focusedRowKey;
        selectedIndex = tableRowKeys.indexOf(rowKey);

        // If user is at top of list view and chooses previous or at bottom of LV and chooses next,
        // we will designate the current row;
        const shouldSingleSelectCurrentRow =
            (selectedIndex === 0 && selectionDirection === SelectionDirection.Previous) ||
            (selectedIndex === tableRowKeys.length - 1 &&
                selectionDirection == SelectionDirection.Next);

        if (!shouldSingleSelectCurrentRow) {
            switch (selectionDirection) {
                case SelectionDirection.Next:
                    selectedIndex++;
                    break;
                case SelectionDirection.Previous:
                    selectedIndex--;
                    break;
            }
        }
    }
    return selectedIndex;
}
