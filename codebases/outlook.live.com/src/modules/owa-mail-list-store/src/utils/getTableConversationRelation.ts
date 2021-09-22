import type TableViewConversationRelation from '../store/schema/TableViewConversationRelation';
import getTableToRowRelationKey from './getTableToRowRelationKey';
import listViewStore from '../store/Store';

/**
 * Get the table view conversation relation based on the conversationKey and tableView
 * @param conversationKey the conversation row key
 * @param tableViewId id of the table view
 * @returns the table view conversation relation
 * Note that relation could return null, when we try to append conversations in seek to FindConversation response and user has already
 * deleted the first conversation in response
 */
export default function getTableConversationRelation(
    conversationKey: string,
    tableViewId: string
): TableViewConversationRelation {
    const relationKey = getTableToRowRelationKey(conversationKey, tableViewId);
    return listViewStore.tableViewConversationRelations.get(relationKey);
}
