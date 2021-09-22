import { listViewStore } from 'owa-mail-list-store';
import { lazyResetFocus } from 'owa-mail-focus-manager';
import { lazyGetIsSharedMailbox } from 'owa-shared-mailbox';
import { lazyShowSweepDialog } from 'owa-mail-sweep-view';

export default function onSweep() {
    const tableViewId = listViewStore.selectedTableViewId;
    const tableView = listViewStore.tableViews.get(tableViewId)!;
    const rowKeys = [...tableView.selectedRowKeys.keys()];

    lazyGetIsSharedMailbox.importAndExecute();
    lazyShowSweepDialog.importAndExecute(rowKeys, tableView);
    lazyResetFocus.importAndExecute();
}
