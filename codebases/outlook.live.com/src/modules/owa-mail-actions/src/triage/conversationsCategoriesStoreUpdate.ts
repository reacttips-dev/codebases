import { action } from 'satcheljs';

/**
 * Action to propagate the categorize conversations action to client stores
 * @param conversationRowKeys - the conversation row keys
 * @param tableViewId - the id of the table view
 * @param categoriesToAdd - the categories to add
 * @param categoriesToRemove - the categories to remove
 * @param clearCategories - whether to clear the categories of the conversations
 * @returns the conversation cateogires action message
 */
export default action(
    'CONVERSATION_CATEGORIES_STORE_UPDATE',
    (
        conversationRowKeys: string[],
        tableViewId: string,
        categoriesToAdd: string[],
        categoriesToRemove: string[],
        clearCategories: boolean
    ) => {
        return {
            conversationRowKeys,
            tableViewId,
            categoriesToAdd,
            categoriesToRemove,
            clearCategories,
        };
    }
);
