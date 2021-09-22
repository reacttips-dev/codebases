import onSelectionChange from '../events/onSelectionChange';
import toggleSelectRowInternal from '../internal/toggleSelectRowInternal';
import { orchestrator } from 'satcheljs';
import setSelectionAnchorRowKey from '../internal/mutators/setSelectionAnchorRowKey';
import setMultiSelectionAnchorRowKey from '../internal/mutators/setMultiSelectionAnchorRowKey';
import setFocusedRowKey from '../internal/mutators/setFocusedRowKey';
import * as mailListSelectionActions from 'owa-mail-actions/lib/mailListSelectionActions';

/////////////////////////////////////// PLEASE READ ///////////////////////////////////////////////////////////
// This is a top level selection action, as such, it should never call other top-level selection
// actions in the same directory, but only call into internal subdirectories where the core logic is implemented.
// This prevents double logging for CTQs as well as prevents onSelectionChange from being fired multiple times
// for a single user action.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default orchestrator(mailListSelectionActions.toggleSelectRow, actionMessage => {
    const { rowKey, tableView, isUserNavigation, mailListItemSelectionSource } = actionMessage;

    toggleSelectRowInternal(tableView, rowKey, mailListItemSelectionSource);

    setMultiSelectionAnchorRowKey(tableView, null);
    setSelectionAnchorRowKey(tableView, rowKey);
    setFocusedRowKey(tableView, rowKey);

    onSelectionChange(tableView, isUserNavigation, mailListItemSelectionSource).then(() => {
        const selectedRowKeys = [...tableView.selectedRowKeys.keys()];
        if (selectedRowKeys.length == 1 && selectedRowKeys[0] == rowKey) {
            mailListSelectionActions.onAfterSelectionChanged(
                rowKey,
                tableView,
                mailListItemSelectionSource,
                tableView.tableQuery.listViewType,
                null
            );
        }
    });
});
