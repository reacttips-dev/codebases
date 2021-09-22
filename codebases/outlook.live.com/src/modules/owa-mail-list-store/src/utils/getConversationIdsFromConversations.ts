import getTableConversationRelation from './getTableConversationRelation';

/**
 * Get all conversation ids in the conversations
 * @param rowKeys an array of conversation rowKeys
 * @param tableViewId the table view id
 * @return an array of all conversation id strings in the specified conversations
 */
export default function getConversationIdsFromConversations(
    rowKeys: string[],
    tableViewId: string
): string[] {
    // In case of multi-value sorts there can be two rows with same conversation
    // Hence we have to dedup the ids
    const allIds: { [id: string]: boolean } = {};
    rowKeys.forEach(rowKey => {
        const id = getTableConversationRelation(rowKey, tableViewId)?.id;
        if (id) {
            allIds[id] = true;
        }
    });

    return Object.keys(allIds);
}
