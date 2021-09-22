import onSelectionChange from '../events/onSelectionChange';
import keyboardMultiSelectRowInternal from '../internal/keyboardMultiSelectRowInternal';
import { keyboardMultiSelectRow } from 'owa-mail-actions/lib/mailListSelectionActions';
import { orchestrator } from 'satcheljs';

/////////////////////////////////////// PLEASE READ ///////////////////////////////////////////////////////////
// This is a top level selection action, as such, it should never call other top-level selection
// actions in the same directory, but only call into internal subdirectories where the core logic is implemented.
// This prevents double logging for CTQs as well as prevents onSelectionChange from being fired multiple times
// for a single user action.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default orchestrator(keyboardMultiSelectRow, actionMessage => {
    const {
        tableView,
        mailListItemSelectionSource,
        selectionDirection,
        isCtrlOrCmdKeyDown,
    } = actionMessage;

    keyboardMultiSelectRowInternal(
        tableView,
        selectionDirection,
        mailListItemSelectionSource,
        isCtrlOrCmdKeyDown
    );

    // Propagate selection change event
    onSelectionChange(tableView, true /* isUserNavigation */, mailListItemSelectionSource);
});
