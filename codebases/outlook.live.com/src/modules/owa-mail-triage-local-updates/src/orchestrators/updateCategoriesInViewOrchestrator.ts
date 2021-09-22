import { createLazyOrchestrator } from 'owa-bundling';
import updateCategoriesInView from 'owa-categories-option/lib/actions/updateCategoriesInView';
import {
    MailRowDataPropertyGetter,
    getRowIdsFromRowKeys,
    getSelectedTableView,
    isConversationView,
} from 'owa-mail-list-store';
import conversationsCategoriesStoreUpdate from 'owa-mail-actions/lib/triage/conversationsCategoriesStoreUpdate';
import { default as itemsCategoriesStoreUpdate } from 'owa-mail-actions/lib/triage/itemsCategoriesStoreUpdate';
import tombstoneOperations, { TombstoneReasonType } from 'owa-mail-list-tombstone';
import { logUsage } from 'owa-analytics';

// Orchestrator for local updates for category rename and delete
export default createLazyOrchestrator(
    updateCategoriesInView,
    'clone_updateCategoriesInView',
    actionMessage => {
        // If there is no table view then we are not in mail module so no need for mail local update
        const tableView = getSelectedTableView();
        if (!tableView) {
            return;
        }

        const { modifiedCategoryName, newCategoryName } = actionMessage;

        const rowKeysToUpdate = [];
        for (const rowKey of tableView.rowKeys) {
            const categories = MailRowDataPropertyGetter.getCategories(rowKey, tableView);
            if (categories?.includes(modifiedCategoryName)) {
                rowKeysToUpdate.push(rowKey);
            }
        }
        logUsage('UpdateCategoriesInViewMail', [rowKeysToUpdate.length]);

        if (rowKeysToUpdate.length > 0) {
            const categoryToAdd = newCategoryName ? [newCategoryName] : null;
            if (isConversationView(tableView)) {
                // Local update the conversation categories in store
                conversationsCategoriesStoreUpdate(
                    rowKeysToUpdate,
                    tableView.id,
                    categoryToAdd,
                    [modifiedCategoryName],
                    false /* clearCategories */
                );
            } else {
                // Update the items categories in store
                itemsCategoriesStoreUpdate(
                    getRowIdsFromRowKeys(rowKeysToUpdate, tableView.id),
                    categoryToAdd,
                    [modifiedCategoryName],
                    false /* clearCategories */
                );
            }
            // Add category operation to tombstone
            // The local update operation should happen before adding category to tombstone
            // else we may not have correct set of categories when adding it to the tombstone
            tombstoneOperations.add(rowKeysToUpdate, tableView, TombstoneReasonType.Category);
        }
    }
);
