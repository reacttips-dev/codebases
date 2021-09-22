import { action } from 'satcheljs';

/**
 * Enum for the source of the try remove item call
 */
export const enum RemoveItemSource {
    // Action triggered from listview table cleanup
    ListViewTable,

    // Action triggered from conversation item part delete
    ConversationItemParts,

    // Action triggered from single item clean up for reading pane
    ItemCleanUp,
}

/**
 * Action to try delete an item from mailstore.items
 * Remark: This action should be used for all cases where we want to delete from the cache,
 * so that proper ref checking can be done before safely removing the item
 * @param itemIdToRemove - Id of item attempting to be removed
 */
export default action(
    'TRY_REMOVE_FROM_MAIL_STORE_ITEMS',
    (itemIdToRemove: string, removeItemSource: RemoveItemSource) => {
        return {
            itemIdToRemove,
            removeItemSource,
        };
    }
);
