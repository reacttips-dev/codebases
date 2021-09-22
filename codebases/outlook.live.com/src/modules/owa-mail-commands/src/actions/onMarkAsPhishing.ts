import { listViewStore } from 'owa-mail-list-store';
import type { ActionSource } from 'owa-analytics-types';
import { lazyMarkRowsAsPhishingFromTable } from 'owa-mail-triage-action';
import { lazyResetFocus } from 'owa-mail-focus-manager';

export default function onMarkAsPhishing(actionSource: ActionSource) {
    const tableViewId = listViewStore.selectedTableViewId;
    const tableView = listViewStore.tableViews.get(tableViewId)!;
    const rowKeys = [...tableView.selectedRowKeys.keys()];

    lazyMarkRowsAsPhishingFromTable.importAndExecute(rowKeys, tableView, actionSource);
    lazyResetFocus.importAndExecute();
}
