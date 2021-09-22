import onSelectionChange from '../events/onSelectionChange';
import setSelectionAnchorRowKey from '../internal/mutators/setSelectionAnchorRowKey';
import setMultiSelectionAnchorRowKey from '../internal/mutators/setMultiSelectionAnchorRowKey';
import resetSelectionInternal from '../internal/resetSelectionInternal';
import * as mailListSelectionActions from 'owa-mail-actions/lib/mailListSelectionActions';
import type { TableView } from 'owa-mail-list-store';
import type MailListItemSelectionSource from 'owa-mail-store/lib/store/schema/MailListItemSelectionSource';
import { orchestrator } from 'satcheljs';

/////////////////////////////////////// PLEASE READ ///////////////////////////////////////////////////////////
// This is a top level selection action, as such, it should never call other top-level selection
// actions in the same directory, but only call into internal subdirectories where the core logic is implemented.
// This prevents double logging for CTQs as well as prevents onSelectionChange from being fired multiple times
// for a single user action.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Resets selection in the given table
 * @param tableView where the reset is requested
 * @param mailListItemSelectionSource The source of selection on mail item
 */
export default orchestrator(mailListSelectionActions.resetSelection, actionMessage => {
    const tableView: TableView = actionMessage.tableView;
    const mailListItemSelectionSource: MailListItemSelectionSource =
        actionMessage.mailListItemSelectionSource;

    resetSelectionInternal(tableView);

    // Clear selection anchor on if user's doing a clear selection as a top level action
    setSelectionAnchorRowKey(tableView, tableView.focusedRowKey);
    setMultiSelectionAnchorRowKey(tableView, null);

    // Propagate selection change event
    onSelectionChange(tableView, false /* isUserNavigation */, mailListItemSelectionSource);
});
