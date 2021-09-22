import { listViewStore, isItemPartOperation } from 'owa-mail-list-store';
import { lazyResetFocus } from 'owa-mail-focus-manager';
import type { ActionSource } from 'owa-analytics-types';
import {
    lazyMarkItemsJunkNotJunkBasedOnNodeIds,
    lazyMarkRowsJunkNotJunk,
} from 'owa-mail-triage-action';

export default async function onJunkNotJunk(actionSource: ActionSource, isJunkValueToSet: boolean) {
    const tableViewId = listViewStore.selectedTableViewId;
    const tableView = listViewStore.tableViews.get(tableViewId)!;
    const rowKeys = [...tableView.selectedRowKeys.keys()];

    if (isItemPartOperation()) {
        const markItemsJunkNotJunkBasedOnNodeIds = await lazyMarkItemsJunkNotJunkBasedOnNodeIds.import();

        markItemsJunkNotJunkBasedOnNodeIds(
            listViewStore.expandedConversationViewState.selectedNodeIds,
            tableView.id,
            isJunkValueToSet,
            actionSource
        );
    } else {
        lazyMarkRowsJunkNotJunk.importAndExecute(
            rowKeys,
            tableView,
            isJunkValueToSet,
            actionSource
        );
    }
    lazyResetFocus.importAndExecute();
}
