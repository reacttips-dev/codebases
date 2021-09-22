import onSelectionChange from '../events/onSelectionChange';
import getNextRowIndexInternal from '../internal/getNextRowIndexInternal';
import singleSelectRowInternal from '../internal/singleSelectRowInternal';

import * as mailListSelectionActions from 'owa-mail-actions/lib/mailListSelectionActions';
import { orchestrator } from 'satcheljs';

/////////////////////////////////////// PLEASE READ ///////////////////////////////////////////////////////////
// This is a top level selection action, as such, it should never call other top-level selection
// actions in the same directory, but only call into internal subdirectories where the core logic is implemented.
// This prevents double logging for CTQs as well as prevents onSelectionChange from being fired multiple times
// for a single user action.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default orchestrator(mailListSelectionActions.selectRowInDirection, actionMessage => {
    const { tableView, selectionDirection, mailListItemSelectionSource } = actionMessage;

    const rowIndexToSelect = getNextRowIndexInternal(tableView, selectionDirection);

    // We should check if rowIndexToSelect is within valid range
    // when user delete/move messages from Junk Mail folder, the focus was set to maillist container,
    // which caused the rowIndexToSelect becoming invalid
    if (rowIndexToSelect !== null && rowIndexToSelect >= 0) {
        mailListSelectionActions.setExpansionForRow(
            tableView.rowKeys[rowIndexToSelect],
            mailListItemSelectionSource
        );

        singleSelectRowInternal(
            tableView,
            tableView.rowKeys[rowIndexToSelect],
            true /* isUserNavigation */,
            mailListItemSelectionSource
        );
    }

    // Propagate selection change event
    return onSelectionChange(
        tableView,
        true /* isUserNavigation */,
        mailListItemSelectionSource
    ).then(() => {
        if (rowIndexToSelect !== null && rowIndexToSelect >= 0) {
            mailListSelectionActions.onAfterSelectionChanged(
                tableView.rowKeys[rowIndexToSelect],
                tableView,
                mailListItemSelectionSource,
                tableView.tableQuery.listViewType,
                null // sxsId, pass if SxS is supported and can be supported with multiple views
            );
        }
    });
});
