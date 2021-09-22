import * as categoryStoreUpdateOperations from './categoryStoreUpdateOperations';
import getAllTableViewsContainingItemsForFolder from 'owa-mail-triage-table-utils/lib/getAllTableViewsContainingItemsForFolder';
import { default as itemsCategoriesStoreUpdate } from 'owa-mail-actions/lib/triage/itemsCategoriesStoreUpdate';
import {
    getRowKeysFromRowIds,
    getTableConversationRelation,
    isConversationView,
} from 'owa-mail-list-store';
import { selectMailStoreItemById } from 'owa-mail-store';
import { mutator } from 'satcheljs';
import type Item from 'owa-service/lib/contract/Item';

/**
 * Mutator which responds to the itemsCategoriesStoreUpdate action message
 */
export default mutator(itemsCategoriesStoreUpdate, actionMessage => {
    const { itemIds, categoriesToAdd, categoriesToRemove, clearCategories } = actionMessage;

    itemIds.forEach((itemId: string) => {
        const item = selectMailStoreItemById(itemId);
        if (categoriesToAdd) {
            item.Categories = categoryStoreUpdateOperations.addCategoriesToCollection(
                categoriesToAdd,
                item.Categories
            );

            // Unlike conversation level categories update, we only need to rollup the item categories change when it's an add operation.
            // For delete/remove, we skip rolling up on conversations, because we will have to check all other items under that conversation to
            // determine whether to remove/clear them, and that item might not be on the client.

            rollUpAddCategoriesOnConversation(item, categoriesToAdd);
        }

        // VSO 23910 - Optimistically item categories store update for remove and clear
        if (categoriesToRemove) {
            item.Categories = categoryStoreUpdateOperations.removeCategoriesFromCollection(
                categoriesToRemove,
                item.Categories
            );

            // newCategoriesCollection is undefined when all categories are removed from the collection
            if (!item.Categories) {
                item.Categories = [];
            }
        }

        if (clearCategories) {
            item.Categories = [];
        }
    });
});

/**
 * Roll up the add item category store update on conversations
 * @param item on which category operation is performed
 * @param categoriesToAdd categories to be added to the conversation
 */
function rollUpAddCategoriesOnConversation(item: Item, categoriesToAdd: string[]) {
    // Roll up category change on conversations which contain this item
    // Need to check all tables for the given folder
    const tableViewsForFolder = getAllTableViewsContainingItemsForFolder(
        item.ParentFolderId.Id,
        true /* shouldIncludeSearchTable */
    );

    for (const tableView of tableViewsForFolder) {
        if (isConversationView(tableView)) {
            const conversationId = item.ConversationId.Id;
            const conversationRowKeys = getRowKeysFromRowIds([conversationId], tableView);
            if (conversationRowKeys.length === 0) {
                // Skip in the case when the current table does not have any conversation that contains this item
                continue;
            }

            conversationRowKeys.forEach(conversationRowKey => {
                const tableViewConversationRelation = getTableConversationRelation(
                    conversationRowKey,
                    tableView.id
                );
                tableViewConversationRelation.categories = categoryStoreUpdateOperations.addCategoriesToCollection(
                    categoriesToAdd,
                    tableViewConversationRelation.categories
                );
            });
        }
    }
}
