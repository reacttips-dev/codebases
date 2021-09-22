import onSelectionChange from '../events/onSelectionChange';
import rangeSelectRowInternal from '../internal/rangeSelectRowInternal';
import * as mailListSelectionActions from 'owa-mail-actions/lib/mailListSelectionActions';
import type TableView from 'owa-mail-list-store/lib/store/schema/TableView';
import type MailListItemSelectionSource from 'owa-mail-store/lib/store/schema/MailListItemSelectionSource';
import { orchestrator } from 'satcheljs';

/////////////////////////////////////// PLEASE READ ///////////////////////////////////////////////////////////
// This is a top level selection action, as such, it should never call other top-level selection
// actions in the same directory, but only call into internal subdirectories where the core logic is implemented.
// This prevents double logging for CTQs as well as prevents onSelectionChange from being fired multiple times
// for a single user action.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Perform range selection from current selection to target row key
 * @param tableView where the selection took place
 * @param targetRowKey the rowKey of the item to extend range selection to
 * @param mailListItemSelectionSource The source of selection on mail item
 * @param isCtrlOrCmdKeyDown - whether the Control or Command key is down for this operation
 */
export default orchestrator(mailListSelectionActions.rangeSelectRow, actionMessage => {
    const tableView: TableView = actionMessage.tableView;
    const mailListItemSelectionSource: MailListItemSelectionSource =
        actionMessage.mailListItemSelectionSource;

    rangeSelectRowInternal(
        tableView,
        actionMessage.targetRowKey,
        mailListItemSelectionSource,
        actionMessage.isCtrlOrCmdKeyDown
    );

    // Propagate selection change event
    onSelectionChange(tableView, true /* isUserNavigation */, mailListItemSelectionSource);
});
