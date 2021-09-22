import * as categoryStoreUpdateOperations from './categoryStoreUpdateOperations';
import conversationsCategoriesStoreUpdate from 'owa-mail-actions/lib/triage/conversationsCategoriesStoreUpdate';
import {
    getTableConversationRelation,
    getStore,
    MailRowDataPropertyGetter,
} from 'owa-mail-list-store';
import { selectMailStoreItemById } from 'owa-mail-store';
import { mutator } from 'satcheljs';

/**
 * Mutator which responds to the conversationsCategoriesStoreUpdate action message
 */
export default mutator(conversationsCategoriesStoreUpdate, actionMessage => {
    const {
        conversationRowKeys,
        tableViewId,
        categoriesToAdd,
        categoriesToRemove,
        clearCategories,
    } = actionMessage;

    conversationRowKeys.forEach(conversationRowKey => {
        if (categoriesToAdd) {
            addConversationCategories(conversationRowKey, tableViewId, categoriesToAdd);
        }

        if (categoriesToRemove) {
            removeConversationCategories(conversationRowKey, tableViewId, categoriesToRemove);
        }

        if (clearCategories) {
            clearConversationCategories(conversationRowKey, tableViewId);
        }
    });
});

/**
 * Remove the categories from the conversation
 * @param conversationRowKeys - the conversation row keys
 * @param tableViewId - the id of the table view
 * @param categoriesToRemove - the categories to remove
 */
function removeConversationCategories(
    conversationRowKey: string,
    tableViewId: string,
    categoriesToRemove: string[]
) {
    const tableViewConversationRelation = getTableConversationRelation(
        conversationRowKey,
        tableViewId
    );

    // Remove the categories from the conversation's categories
    tableViewConversationRelation.categories = categoryStoreUpdateOperations.removeCategoriesFromCollection(
        categoriesToRemove,
        tableViewConversationRelation.categories
    );

    // Remove the categories from each item of the conversation
    const tableView = getStore().tableViews.get(tableViewId);
    const itemIds = MailRowDataPropertyGetter.getItemIds(conversationRowKey, tableView);
    itemIds.forEach(itemId => {
        const item = selectMailStoreItemById(itemId);

        // Only remove categories for items which are in the cache.
        // Item might not exist in cache because we load a certain number of items in a conversation in the first attempt.
        if (item) {
            item.Categories = categoryStoreUpdateOperations.removeCategoriesFromCollection(
                categoriesToRemove,
                item.Categories
            );
        }
    });
}

/**
 * Add the categories to the conversation
 * @param conversationRowKeys - the conversation row keys
 * @param tableViewId - the id of the table view
 * @param categoriesToAdd - the categories to be added
 */
function addConversationCategories(
    conversationRowKey: string,
    tableViewId: string,
    categoriesToAdd: string[]
) {
    const tableViewConversationRelation = getTableConversationRelation(
        conversationRowKey,
        tableViewId
    );

    // Add the categories to the conversation's categories
    tableViewConversationRelation.categories = categoryStoreUpdateOperations.addCategoriesToCollection(
        categoriesToAdd,
        tableViewConversationRelation.categories
    );

    // Add categories to each item of the conversation
    const tableView = getStore().tableViews.get(tableViewId);
    const itemIds = MailRowDataPropertyGetter.getItemIds(conversationRowKey, tableView);
    itemIds.forEach(itemId => {
        const item = selectMailStoreItemById(itemId);

        // Only merge categories for items which are in the cache.
        // Item might not exist in cache because we load a certain number of items in a conversation in the first attemp.
        if (item) {
            item.Categories = categoryStoreUpdateOperations.addCategoriesToCollection(
                categoriesToAdd,
                item.Categories
            );
        }
    });
}

/**
 * Clear all categories of conversations
 * @param conversationRowKeys - the conversation row keys
 * @param tableViewId - the id of the table view
 */
function clearConversationCategories(conversationRowKey: string, tableViewId: string) {
    const tableViewConversationRelation = getTableConversationRelation(
        conversationRowKey,
        tableViewId
    );

    // Clear all categories of the conversation
    tableViewConversationRelation.categories = undefined;

    // Clear all categories of the items of the conversation
    const tableView = getStore().tableViews.get(tableViewId);
    const itemIds = MailRowDataPropertyGetter.getItemIds(conversationRowKey, tableView);
    itemIds.forEach(itemId => {
        const item = selectMailStoreItemById(itemId);

        // Only clear categories for items which are in the cache.
        // Item might not exist in cache because we load a certain number of items in a conversation in the first attempt.
        if (item) {
            item.Categories = undefined;
        }
    });
}
