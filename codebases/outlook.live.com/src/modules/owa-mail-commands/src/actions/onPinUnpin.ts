import { listViewStore, MailRowDataPropertyGetter } from 'owa-mail-list-store';
import type { ActionSource } from 'owa-analytics-types';
import { lazyMarkRowsPinnedUnpinned } from 'owa-mail-triage-action';
import { lazyResetFocus } from 'owa-mail-focus-manager';

/**
 * Set item(s) to Pinned or Unpinned state based on current selected item(s)' pinned state.
 * This function supports multi-select in mail list.
 *
 * @param isPinnedToSet can be used to set item's pinned state, and can be undefined.
 * If undefined, this function will calculate the current pinned state given current selected items' pinned state.
 * This is to allow for "toggle" functionality, of wanting to toggle pinned state without parent caller needing
 * to know current item's pinned state.
 */
export default function onPinUnpin(actionSource: ActionSource, isPinnedToSet?: boolean) {
    const tableViewId = listViewStore.selectedTableViewId;
    const tableView = listViewStore.tableViews.get(tableViewId)!;
    const rowKeys = tableView.isInVirtualSelectAllMode
        ? tableView.rowKeys
        : [...tableView.selectedRowKeys.keys()];

    if (isPinnedToSet === undefined) {
        // The logic to decide whether to pin or unpin the mail item(s):
        // 1) If any of the item(s) are pinned, unpin all the items.
        // 2) Otherwise, pin all the items.
        isPinnedToSet = true;
        for (const rowKey of rowKeys) {
            if (MailRowDataPropertyGetter.getIsPinned(rowKey, tableView)) {
                isPinnedToSet = false;
                break;
            }
        }
    }

    lazyMarkRowsPinnedUnpinned.importAndExecute(rowKeys, tableViewId, isPinnedToSet, actionSource);

    lazyResetFocus.importAndExecute();
}
