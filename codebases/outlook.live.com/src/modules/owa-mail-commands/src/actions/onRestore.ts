import { listViewStore } from 'owa-mail-list-store';
import { lazyRestoreMailListRowsAction } from 'owa-mail-triage-action';
import { lazyResetFocus } from 'owa-mail-focus-manager';

export default function onRestore() {
    const tableViewId = listViewStore.selectedTableViewId;
    const tableView = listViewStore.tableViews.get(tableViewId)!;
    const rowKeys = [...tableView.selectedRowKeys.keys()];

    lazyRestoreMailListRowsAction.importAndExecute(rowKeys, tableViewId);
    lazyResetFocus.importAndExecute();
}
