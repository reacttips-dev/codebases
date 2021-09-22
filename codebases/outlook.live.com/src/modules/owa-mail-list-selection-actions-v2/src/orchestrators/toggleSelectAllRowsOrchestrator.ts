import onSelectionChange from '../events/onSelectionChange';
import toggleSelectAllRowsInternal from '../internal/toggleSelectAllRowsInternal';
import { toggleSelectAllRows } from 'owa-mail-actions/lib/mailListSelectionActions';
import MailListItemSelectionSource from 'owa-mail-store/lib/store/schema/MailListItemSelectionSource';
import { orchestrator } from 'satcheljs';
import setSelectionAnchorRowKey from '../internal/mutators/setSelectionAnchorRowKey';
import setMultiSelectionAnchorRowKey from '../internal/mutators/setMultiSelectionAnchorRowKey';
import setFocusedRowKey from '../internal/mutators/setFocusedRowKey';

/////////////////////////////////////// PLEASE READ ///////////////////////////////////////////////////////////
// This is a top level selection action, as such, it should never call other top-level selection
// actions in the same directory, but only call into internal subdirectories where the core logic is implemented.
// This prevents double logging for CTQs as well as prevents onSelectionChange from being fired multiple times
// for a single user action.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Toggle between select all and clear selection on the table
 */
export default orchestrator(toggleSelectAllRows, actionMessage => {
    const { tableView } = actionMessage;
    const { isInVirtualSelectAllMode, rowKeys, selectedRowKeys, focusedRowKey } = tableView;
    const mailListItemSelectionSource = MailListItemSelectionSource.ToggleCheckAll;

    toggleSelectAllRowsInternal(tableView);

    // Only set these anchors when in a real (not virtual) select all
    if (!isInVirtualSelectAllMode) {
        if (selectedRowKeys.size > 0) {
            setSelectionAnchorRowKey(tableView, rowKeys[rowKeys.length - 1]);
            setMultiSelectionAnchorRowKey(tableView, rowKeys[0]);
        } else {
            // When we've reset selection, set both anchors to the key that's focused if it exists (won't exist if users toggles selection
            // on and off right after load when setting is to not select item), otherwise set anchors and focus to the first row.
            const anchorRowKey = focusedRowKey || rowKeys[0];
            setSelectionAnchorRowKey(tableView, anchorRowKey);
            setMultiSelectionAnchorRowKey(tableView, anchorRowKey);
            setFocusedRowKey(tableView, anchorRowKey);
        }
    }

    // Propagate selection change event
    onSelectionChange(tableView, true /* isUserNavigation */, mailListItemSelectionSource);
});
