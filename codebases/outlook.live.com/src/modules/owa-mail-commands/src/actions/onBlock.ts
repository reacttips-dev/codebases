import { listViewStore } from 'owa-mail-list-store';
import { lazyResetFocus } from 'owa-mail-focus-manager';
import type { ActionSource } from 'owa-mail-store';
import { lazyBlockLastSendersFromTable } from 'owa-mail-triage-action';

export default function onBlock(actionSource: ActionSource) {
    const tableViewId = listViewStore.selectedTableViewId;
    const tableView = listViewStore.tableViews.get(tableViewId)!;
    const rowKeys = [...tableView.selectedRowKeys.keys()];

    lazyBlockLastSendersFromTable.importAndExecute(rowKeys, tableView, actionSource);
    lazyResetFocus.importAndExecute();
}
