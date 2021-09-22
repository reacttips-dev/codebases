import { listViewStore, isItemPartOperation, MailRowDataPropertyGetter } from 'owa-mail-list-store';
import { lazyResetFocus } from 'owa-mail-focus-manager';
import { getItemToShowFromNodeId } from 'owa-mail-store/lib/utils/conversationsUtils';
import type Message from 'owa-service/lib/contract/Message';
import {
    lazyMarkItemsAsReadBasedOnNodeIds,
    lazyMarkAsReadInTable,
} from 'owa-mail-mark-read-actions';
import type { ActionSource } from 'owa-analytics-types';

/**
 * Set item(s) to read or unread state based on current selected item(s)' read/unread state.
 * This function supports multi-select in mail list.
 *
 * @param isReadValueToSet used to set item's read/unread state, and can be undefined.
 * If undefined, this function will calculate the current read/unread state given current selected items' read/unread state.
 * This is to allow for "toggle" functionality, of wanting to toggle read/unread state without parent caller needing
 * to know current item's read/unread state.
 */
export default async function onMarkAsReadUnread(
    actionSource: ActionSource,
    isReadValueToSet?: boolean
) {
    const tableViewId = listViewStore.selectedTableViewId;
    const tableView = listViewStore.tableViews.get(tableViewId)!;
    const rowKeys = tableView.isInVirtualSelectAllMode
        ? tableView.rowKeys
        : [...tableView.selectedRowKeys.keys()];
    const isInVirtualSelectAllMode = tableView.isInVirtualSelectAllMode;

    // The logic to decide whether to mark the mail item(s) as read or unread is:
    // 1) If any of the item(s) are unread, mark the entire selection as read.
    // 2) Otherwise, mark the entire selection as unread.
    if (isReadValueToSet === undefined) {
        isReadValueToSet = false;
        if (isItemPartOperation()) {
            // Conversation view
            for (const itemId of listViewStore.expandedConversationViewState.selectedNodeIds) {
                const item: Message = getItemToShowFromNodeId(itemId);
                if (!item?.IsRead) {
                    isReadValueToSet = true;
                    break;
                }
            }
        } else {
            // Mail List view
            for (const rowKey of rowKeys) {
                if (MailRowDataPropertyGetter.getUnreadCount(rowKey, tableView) != 0) {
                    isReadValueToSet = true;
                    break;
                }
            }
        }
    }

    if (isItemPartOperation()) {
        const markItemsAsReadBasedOnNodeIds = await lazyMarkItemsAsReadBasedOnNodeIds.import();
        markItemsAsReadBasedOnNodeIds(
            listViewStore.expandedConversationViewState.selectedNodeIds,
            tableView.id,
            isReadValueToSet,
            true /* isExplicit */,
            actionSource
        );
    } else {
        const rowKeysToActOn = isInVirtualSelectAllMode ? [] : rowKeys;
        const exclusionList = isInVirtualSelectAllMode
            ? tableView.virtualSelectAllExclusionList
            : [];
        lazyMarkAsReadInTable.importAndExecute(
            actionSource,
            exclusionList,
            isInVirtualSelectAllMode /* isActingOnAllItemsInTable */,
            isReadValueToSet,
            rowKeysToActOn,
            tableView
        );
    }
    lazyResetFocus.importAndExecute();
}
