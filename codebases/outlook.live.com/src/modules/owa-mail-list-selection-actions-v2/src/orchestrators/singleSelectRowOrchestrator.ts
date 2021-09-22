import onSelectionChange from '../events/onSelectionChange';
import singleSelectRowInternal from '../internal/singleSelectRowInternal';
import * as mailListSelectionActions from 'owa-mail-actions/lib/mailListSelectionActions';
import { orchestrator } from 'satcheljs';

/////////////////////////////////////// PLEASE READ ///////////////////////////////////////////////////////////
// This is a top level selection action, as such, it should never call other top-level selection
// actions in the same directory, but only call into internal subdirectories where the core logic is implemented.
// This prevents double logging for CTQs as well as prevents onSelectionChange from being fired multiple times
// for a single user action.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default orchestrator(mailListSelectionActions.singleSelectRow, actionMessage => {
    const { tableView, isUserNavigation, mailListItemSelectionSource } = actionMessage;

    singleSelectRowInternal(
        tableView,
        actionMessage.rowKey,
        isUserNavigation,
        mailListItemSelectionSource
    );

    // Propagate selection change event
    return onSelectionChange(tableView, isUserNavigation, mailListItemSelectionSource).then(() => {
        mailListSelectionActions.onAfterSelectionChanged(
            actionMessage.rowKey,
            tableView,
            mailListItemSelectionSource,
            tableView.tableQuery.listViewType,
            null // sxsId, pass if SxS is supported and can be supported with multiple views
        );
    });
});
