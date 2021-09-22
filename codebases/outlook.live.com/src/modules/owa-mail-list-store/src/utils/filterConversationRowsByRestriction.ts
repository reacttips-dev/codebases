import getTableConversationRelation from './getTableConversationRelation';

/**
 * Filters a collection of rowKeys from a given tableView and returns rowKeys for the ones that meet the given customRestriction.
 * @param rowKeys - the given conversation rowKeys
 * @param tableViewId - the table view id that these conversations belong to (or null if we don't care)
 * @param customRestriction - a callback that returns a boolean flag for filtering conversations (true- keep; false- throw away)
 * @param optionalArgs - optional args that used by customRestriction
 * @returns a filtered colllection of conversationIds
 */
export default function filterConversationRowsByRestriction(
    rowKeys: string[],
    tableViewId: string,
    customRestriction: (...args: any[]) => boolean,
    optionalArgs?: any
): string[] {
    const rowKeysToReturn: string[] = [];
    const rowIdsVisited = new Map();

    for (let i = 0; i < rowKeys.length; i++) {
        const rowKey: string = rowKeys[i];
        const tableConversationRelation = getTableConversationRelation(rowKey, tableViewId);

        // Check if the relation meets the custom restriction and
        // also de-dup the rows (multi-value sorted tables have rows with same rowIds)
        const rowId = tableConversationRelation.id;
        if (
            !rowIdsVisited.get(rowId) &&
            customRestriction(tableConversationRelation, optionalArgs)
        ) {
            rowKeysToReturn.push(rowKey);
            rowIdsVisited.set(rowId, true);
        }
    }

    return rowKeysToReturn;
}
