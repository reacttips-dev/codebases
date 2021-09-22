import { SelectionDirection, TableView } from 'owa-mail-list-store';
import type MailListItemSelectionSource from 'owa-mail-store/lib/store/schema/MailListItemSelectionSource';
import { setSelectionOnRow } from 'owa-mail-actions/lib/setSelectionOnRow';
import setFocusedRowKey from './mutators/setFocusedRowKey';
import setTableIsInCheckedMode from './mutators/setTableIsInCheckedMode';
import setSelectionAnchorRowKey from './mutators/setSelectionAnchorRowKey';
import setMultiSelectionAnchorRowKey from './mutators/setMultiSelectionAnchorRowKey';
import { action } from 'satcheljs/lib/legacy';
import singleSelectRowInternal from './singleSelectRowInternal';

/**
 * Select a row in keyboard multi-select mode (shift-up or shift-down) in the given direction
 * @param tableView where the operation is being performed
 * @param selectionDirection the direction in which the selection is happening
 * @param mailListItemSelectionSource selection mode for the maillist item
 * @param isCtrlOrCmdKeyDown whether user is also holding down ctrl key
 */
export default action('keyboardMultiSelectRowInternal')(function keyboardMultiSelectRowInternal(
    tableView: TableView,
    selectionDirection: SelectionDirection,
    mailListItemSelectionSource: MailListItemSelectionSource,
    isCtrlOrCmdKeyDown: boolean
) {
    const {
        selectedRowKeys,
        selectionAnchorRowKey,
        rowKeys,
        multiSelectionAnchorRowKey,
        focusedRowKey,
        isInVirtualSelectAllMode,
    } = tableView;

    // When in multi-select mode, table should be in checked mode
    setTableIsInCheckedMode(tableView, true);

    // If entering keyboard multi-select mode while ...
    // (1) in virtual select all mode OR
    // (2) in no selection mode,
    // then select row with focus or the first row if there is no row with focus
    // except when the folder is Junk Mail, in this case we do not auto select message
    if (isInVirtualSelectAllMode || selectedRowKeys.size === 0) {
        if (rowKeys.includes(focusedRowKey)) {
            singleSelectRowInternal(
                tableView,
                focusedRowKey ? focusedRowKey : rowKeys[0],
                true /* isUserNavigation */,
                mailListItemSelectionSource
            );
        }

        return;
    }

    // This is the anchor from which we compute the next row key to select
    const selectionAnchorIndex = rowKeys.indexOf(selectionAnchorRowKey);
    const rowKeyIndexToSelect =
        selectionDirection === SelectionDirection.Previous
            ? selectionAnchorIndex - 1
            : selectionAnchorIndex + 1;

    // This is the anchor from which we had started multi-selection, either via keyboard (shift-up or shift-down) or shift-click, if it doesn't exist use selectionAnchor
    const newMultiSelectionAnchorRowKey = multiSelectionAnchorRowKey
        ? multiSelectionAnchorRowKey
        : selectionAnchorRowKey;
    const multiSelectionAnchorIndex = rowKeys.indexOf(newMultiSelectionAnchorRowKey);

    setMultiSelectionAnchorRowKey(tableView, newMultiSelectionAnchorRowKey);

    // When there are already selected rows in the table, the user is in one of the following cases ...
    // (3) One row is selected and user has just done either shift-up or shift-down and is about to enter multi-select mode for the first time
    //     -- for example, 1st row is selected, then user does shift-down, now 1st and 2nd rows are selected
    // (4) User is already in multi-select mode, either via keyboard (shift-up or shift-down) or shift-click and is selecting the next unselected row via shift-up or shift down
    //     -- for example, shift-down-down-down-down-down, 5 rows will be selected
    //     -- for example, shift-click from 1st row to 4th row in list, then shift-down, 5 rows will be selected
    // (5) User is already in multi-select mode, either via keyboard (shift-up or shift-down) or shift-click or select all in a table where all of the row keys are already loaded in client,
    //     now when user multi-selects onto the last selected row via shift-up or shift down, that row will be unselected and the focus will go to the selected row before that
    //     -- for example, shift-down-down-down-down-up, 3 rows (the first 3 selected via shift-down) will be selected
    //     -- for example, shift-click from 1st row to 4th row in list, then shift up, 3 rows (the 1st through the 3rd) will be selected
    //     -- for example, select all rows in list (let's say 5 for this example), then shift up, 4 rows (the 1st through the 4th) will be selected
    // (6) User is already in multi-select mode and last action was a toggle of any row in list via checkbox or ctrl-click, now when user multi-selects, all previously selected rows will be
    //     unselected and we will select the current row user is on and the next row in the direction of the multi-selection
    //     -- for example, shift-click from 1st row to 5th row in list, then ctrl-click 3rd row to unselect it, then shift-down, 2 rows (the 3rd and the 4th) should be selected
    //     -- for example, shift-click from 1st row to 4th row in list, then ctrl-click 5th row to select it, then shift-down, 2 rows (the 4th and the 5th) should be selected
    // (7) User is already in multi-select mode and has ctrl key down, keep all already selected rows selected and simply select and place focus on the row key to select if it exists
    //     -- for example, user has 1st through 3rd rows selected and has ctrl-clicked on the 5th row, and is now doing a shift-ctrl-down, 5 rows (the 1st through 3rd rows and 5th and 6th rows) should be selected

    // Cases (3), (4), (5), and (6), if ctrl key is not down, then we need to deselect any rows that have already been selected but are not in the current selection path.
    if (!isCtrlOrCmdKeyDown) {
        deselectAllSelectedRowsOutsideOfCurrentSelectionPath(
            tableView,
            rowKeyIndexToSelect,
            multiSelectionAnchorIndex
        );

        // Check for case (4) here - whether user is trying to unselect a previously selected row. If not, place selection on selection anchor row key.
        const shouldSelectSelectionAnchor = !shouldDeselectSelectionAnchor(
            selectionDirection,
            multiSelectionAnchorIndex,
            rowKeyIndexToSelect
        );

        setSelectionOnRow(selectionAnchorRowKey, tableView.id, shouldSelectSelectionAnchor);
    }

    // Select the rowKeyToSelect only if it is in bounds of list view. It could be out of bounds if user is on the 0th row of the table and does shift-up or on the last row and does shift-down.
    if (isKeyInBounds(rowKeyIndexToSelect, 0, rowKeys.length - 1)) {
        const rowKeyToSelect = rowKeys[rowKeyIndexToSelect];
        setSelectionOnRow(rowKeyToSelect, tableView.id, true /* shouldSelect */);
        setSelectionAnchorRowKey(tableView, rowKeyToSelect);
        setFocusedRowKey(tableView, rowKeyToSelect);
    }
});

// Deselect all selected rows outside of current selection path (rows that are not in between the multiSelectionAnchor and rowKeyToSelect)
function deselectAllSelectedRowsOutsideOfCurrentSelectionPath(
    tableView: TableView,
    rowKeyIndexToSelect: number,
    multiSelectionAnchorIndex: number
) {
    const selectedRowKeys = [...tableView.selectedRowKeys.keys()];
    for (const key of selectedRowKeys) {
        const selectedRowIndex = tableView.rowKeys.indexOf(key);
        if (
            !isKeyInBounds(
                selectedRowIndex,
                Math.min(rowKeyIndexToSelect, multiSelectionAnchorIndex),
                Math.max(rowKeyIndexToSelect, multiSelectionAnchorIndex)
            )
        ) {
            setSelectionOnRow(key, tableView.id, false /* shouldSelect */);
        }
    }
}

function isKeyInBounds(idx: number, start: number, end: number) {
    return idx >= start && idx <= end;
}

// This is a check for case (2). In this case user is unselecting previous row via keyboard multi-select. To test whether we need to deselect the row,
// we test whether user is going towards or away from the multi-selection anchor. If the user is doing shift-down-down-down... then the multiSelectionAnchorRowKey
// should always be above the rowKeyToSelect. So if the user's direction is SelectionDirection.Next (shift-down) and the rowKeyToSelect is below the
// multiSelectionAnchorRowKey in the list, then we keep the selection anchor row (last selected row) selected as user is moving away from the anchor. However, if
// the user's direction is SelectionDirection.Previous (shift-up) and the multiSelectionDirectionAnchorRowKey is above the rowKeyToSelect, that means the user is
// moving towards the anchor and we need to deselect the selection anchor row (last selected row). The same logic holds in the opposite direction.

// Example:
// User starts on the 0th row (already selected) and goes shift-down-down. Currently the multiSelectionAnchorRow is at index 0 and selectionAnchorRow is at index 2.
// Now if user does shift-down again, then rowKeyIndexToSelect is 3. Since selection direction is Next and 0 >= 3 is false, we should NOT deselect anything and simply
// the next row (at index 3) should be selected since the user is still going away from the anchor.
// But if user does shift-up instead, then rowKeyIndexToSelect is 1. Since selection direction is Previous and 0 <= 1 is true, we SHOULD deselect the selection anchor
// since the user is going back up towards the anchor.
function shouldDeselectSelectionAnchor(
    selectionDirection: SelectionDirection,
    multiSelectionAnchorIndex: number,
    rowKeyIndexToSelect: number
) {
    return (
        (selectionDirection === SelectionDirection.Previous &&
            multiSelectionAnchorIndex <= rowKeyIndexToSelect) ||
        (selectionDirection === SelectionDirection.Next &&
            multiSelectionAnchorIndex >= rowKeyIndexToSelect)
    );
}
