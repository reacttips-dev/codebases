import { listViewStore } from 'owa-mail-list-store';
import type { ActionSource } from 'owa-mail-store';
import { lazyTranslateFromTable } from 'owa-mail-triage-action';
import { lazyResetFocus } from 'owa-mail-focus-manager';

export default function onTranslate(actionSource: ActionSource) {
    const tableViewId = listViewStore.selectedTableViewId;
    const tableView = listViewStore.tableViews.get(tableViewId)!;
    const rowKeys = [...tableView.selectedRowKeys.keys()];

    lazyTranslateFromTable.importAndExecute(rowKeys, tableView, actionSource);

    lazyResetFocus.importAndExecute();
}
