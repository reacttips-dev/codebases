import type { ActionSource as ActionSourceAnalyticsActions } from 'owa-analytics-actions';
import { lazyResetFocus } from 'owa-mail-focus-manager';
import { isItemPartOperation, listViewStore } from 'owa-mail-list-store';
import type { ActionSource as ActionSourceMailStore } from 'owa-mail-store';
import { lazyTryValidateDumpsterQuota } from 'owa-storage-store';
import {
    lazyEmptyTableView,
    lazyDeleteItemsBasedOnNodeOrThreadIds,
    lazyDeleteMailListRows,
} from 'owa-mail-triage-action';

export default async function onDelete(
    actionSourceMailStore: ActionSourceMailStore,
    actionSourceAnalyticsActions: ActionSourceAnalyticsActions,
    isExplicitSoftDelete?: boolean
) {
    const tableViewId = listViewStore.selectedTableViewId;
    const tableView = listViewStore.tableViews.get(tableViewId)!;
    const rowKeys = [...tableView.selectedRowKeys.keys()];

    const isDumpsterQuotaEnforced = async () => {
        const tryValidateDumpsterQuota = await lazyTryValidateDumpsterQuota.import();
        return tryValidateDumpsterQuota(tableView.tableQuery.folderId);
    };
    if (await isDumpsterQuotaEnforced()) {
        return;
    }

    if (tableView.isInVirtualSelectAllMode) {
        // When in virtual selection, i.e non search and select all mode,
        // delete all in the folder
        lazyEmptyTableView.importAndExecute(
            tableView,
            isExplicitSoftDelete,
            actionSourceMailStore,
            tableView.virtualSelectAllExclusionList
        );
    } else if (isItemPartOperation()) {
        // Conversation view
        const deleteItemsBasedOnNodeOrThreadIds = await lazyDeleteItemsBasedOnNodeOrThreadIds.import();
        deleteItemsBasedOnNodeOrThreadIds(
            listViewStore.expandedConversationViewState.selectedNodeIds,
            tableView.id,
            actionSourceAnalyticsActions
        );
    } else {
        // Mail List view
        lazyDeleteMailListRows.importAndExecute(
            rowKeys,
            tableView.id,
            isExplicitSoftDelete,
            actionSourceAnalyticsActions
        );
    }

    lazyResetFocus.importAndExecute();
}
