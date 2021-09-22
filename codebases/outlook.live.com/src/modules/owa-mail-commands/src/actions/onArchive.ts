import { listViewStore, isItemPartOperation } from 'owa-mail-list-store';
import { lazyMoveItemsBasedOnNodeIds, lazyArchiveMailListRows } from 'owa-mail-triage-action';
import { lazyResetFocus } from 'owa-mail-focus-manager';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import type { ActionSource } from 'owa-analytics-types';

export default async function onArchive(actionSource: ActionSource) {
    const tableViewId = listViewStore.selectedTableViewId;
    const tableView = listViewStore.tableViews.get(tableViewId)!;
    const rowKeys = [...tableView.selectedRowKeys.keys()];

    if (isItemPartOperation()) {
        const moveItemsBasedOnNodeIds = await lazyMoveItemsBasedOnNodeIds.import();

        moveItemsBasedOnNodeIds(
            listViewStore.expandedConversationViewState.selectedNodeIds,
            folderNameToId('archive'),
            tableView.id,
            actionSource
        );
    } else {
        lazyArchiveMailListRows.importAndExecute(rowKeys, tableView, actionSource);
    }
    lazyResetFocus.importAndExecute();
}
