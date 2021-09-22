import getNextRowIndexInternal from '../internal/getNextRowIndexInternal';
import setFocusedRowKey from '../internal/mutators/setFocusedRowKey';
import setMultiSelectionAnchorRowKey from '../internal/mutators/setMultiSelectionAnchorRowKey';
import setSelectionAnchorRowKey from '../internal/mutators/setSelectionAnchorRowKey';

import * as mailListSelectionActions from 'owa-mail-actions/lib/mailListSelectionActions';
import focusRowInDirection from 'owa-mail-actions/lib/focusRowInDirection';
import { orchestrator } from 'satcheljs';

export default orchestrator(focusRowInDirection, actionMessage => {
    const { tableView, selectionDirection } = actionMessage;

    const rowIndexToFocus = getNextRowIndexInternal(tableView, selectionDirection);

    // If there is no next row to select (table view is null), then no-op
    if (rowIndexToFocus === null) {
        return;
    }

    // Set the focused row key
    const rowKey = tableView.rowKeys[rowIndexToFocus];
    setFocusedRowKey(tableView, rowKey);

    // Set the selection anchor for possible future range, keyboard, or multi selections
    setSelectionAnchorRowKey(tableView, rowKey);
    setMultiSelectionAnchorRowKey(tableView, null);

    // If only changing focus, still want to collapse expanded conversations
    mailListSelectionActions.resetListViewExpansionViewState();
});
