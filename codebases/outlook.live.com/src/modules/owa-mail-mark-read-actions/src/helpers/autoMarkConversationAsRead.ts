import markConversationsAsReadBasedOnConversationIds from '../helpers/markConversationsAsReadBasedOnConversationIds';
import markItemsAsReadBasedOnItemIds from '../helpers/markItemsAsReadBasedOnItemIds';
import * as suppressedItemIdsMapOperations from '../helpers/suppressedItemIdsMapOperations';
import { getRowKeysFromRowIds, doesTableSupportAutoMarkRead } from 'owa-mail-list-store';
import type TableView from 'owa-mail-list-store/lib/store/schema/TableView';
import getTableConversationRelation from 'owa-mail-list-store/lib/utils/getTableConversationRelation';
import mailStore from 'owa-mail-store/lib/store/Store';
import type { ObservableMap } from 'mobx';
import type Item from 'owa-service/lib/contract/Item';
import { action } from 'satcheljs/lib/legacy';
export interface AutoMarkConversationAsReadState {
    items: ObservableMap<string, Item>;
}

/**
 * Try to perform auto mark as read action
 * @param conversationId the conversationId to be marked as read
 * @param tableView the table view
 * @param state the AutoMarkConversationAsReadState which contains the items
 */
export default action('autoMarkConversationAsRead')(async function autoMarkConversationAsRead(
    conversationId: string,
    tableView: TableView,
    state: AutoMarkConversationAsReadState = { items: mailStore.items }
) {
    // the tableRelations for all the rowKeys for a given rowId would be same hence
    // we only work with one rowKey here.
    const rowKeys = getRowKeysFromRowIds([conversationId], tableView);
    const tableConversationRelation = getTableConversationRelation(rowKeys[0], tableView.id);
    // tableConversationRelation can be null because this is an async callback, and
    // the conversation could have been deleted by the time onMarkAsReadTimeout is called
    if (!tableConversationRelation) {
        return;
    }
    // No-op if tableView does not support auto mark as read
    if (!doesTableSupportAutoMarkRead(tableView)) {
        return;
    }
    const allItemIdsInConversation = tableConversationRelation.itemIds;
    // Do thing if all the items inside the conversation are suppressed, which means there is nothing to be marked as read.
    // Here we check if allItemIdsInConversation is a subset of suppressedItemIds instead of equal, because they
    // could be out of sync, e.g. rowNotification removed an item but its id is still in suppressed map
    if (suppressedItemIdsMapOperations.contains(allItemIdsInConversation)) {
        return;
    }
    // Mark the whole converation as read if there's nothing to suppress
    if (suppressedItemIdsMapOperations.isEmpty()) {
        await markConversationsAsReadBasedOnConversationIds(
            [conversationId],
            tableView,
            true /* isReadValue */,
            false /* isExplicit */,
            null /* actionSource */,
            [] /* instrumentationContexts */,
            rowKeys
        );
    } else {
        // Otherwise, mark each item as read if they are loaded in item cache, and skip the items in suppressed map
        // VSO 12718: batch itemIds for markItemReadUnread action
        for (const id of allItemIdsInConversation) {
            if (!suppressedItemIdsMapOperations.contains([id]) && state.items.get(id)) {
                await markItemsAsReadBasedOnItemIds(
                    tableView,
                    [id],
                    true /* isReadValueToSet */,
                    false /* isExplicit */,
                    null /* actionSource */,
                    [] /* instrumentationContexts */
                );
            }
        }
    }
    // Clear the suppressed itemIds map on navigation away
    suppressedItemIdsMapOperations.clear();
});
