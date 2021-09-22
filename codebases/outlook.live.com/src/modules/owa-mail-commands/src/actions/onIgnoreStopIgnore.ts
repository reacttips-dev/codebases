import { listViewStore } from 'owa-mail-list-store';
import type { ActionSource } from 'owa-mail-store';
import { lazyResetFocus } from 'owa-mail-focus-manager';
import { lazyToggleIgnoreConversations } from 'owa-mail-triage-action';

export default async function onIgnoreStopIgnore(
    actionSource: ActionSource,
    shouldIgnore: boolean
) {
    const tableViewId = listViewStore.selectedTableViewId;
    const tableView = listViewStore.tableViews.get(tableViewId)!;
    const rowKeys = [...tableView.selectedRowKeys.keys()];

    const toggleIgnoreConversations = await lazyToggleIgnoreConversations.import();
    toggleIgnoreConversations(rowKeys, tableView, shouldIgnore, actionSource);
    lazyResetFocus.importAndExecute();
}
