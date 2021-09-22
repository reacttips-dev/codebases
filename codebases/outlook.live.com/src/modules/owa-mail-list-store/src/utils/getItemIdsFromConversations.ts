import getTableConversationRelation from './getTableConversationRelation';

/**
 * Get all item ids in the conversations
 * @param conversationIds an array of conversation itemIds
 * @param tableViewId the table view id
 * @return an array of all item id strings in the specified conversations
 */
export default function getItemIdsFromConversations(
    rowKeys: string[],
    tableViewId: string
): string[] {
    const allItemIds: { [id: string]: boolean } = {};

    rowKeys.forEach(rowKey => {
        const itemIds = getTableConversationRelation(rowKey, tableViewId)?.itemIds;
        if (itemIds) {
            itemIds.forEach(id => {
                // In case of multi-value sorts there can be two rows with same conversation
                // Hence we have to dedup the ids
                if (!allItemIds[id]) {
                    allItemIds[id] = true;
                }
            });
        }
    });

    return Object.keys(allItemIds);
}
