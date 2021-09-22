import type { TableView } from 'owa-mail-list-store';
import { resetMessageAdListSelection } from 'owa-mail-messagead-list-store';
import tableExitVirtualSelectAllMode from './mutators/tableExitVirtualSelectAllMode';
import * as mailListSelectionActionsV2 from 'owa-mail-actions/lib/mailListSelectionActions';

export default function resetSelectionInternal(tableView: TableView) {
    if (!tableView) {
        throw new Error('resetSelection should not be called on null or undefined table.');
    }

    mailListSelectionActionsV2.resetSelectionOnTable(tableView);
    mailListSelectionActionsV2.resetListViewExpansionViewState();
    tableExitVirtualSelectAllMode(tableView);

    // Reset the message Ad list selection which potentially occupy the right pane
    resetMessageAdListSelection();
}
