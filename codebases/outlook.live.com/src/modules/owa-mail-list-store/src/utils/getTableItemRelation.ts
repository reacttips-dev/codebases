import type TableViewItemRelation from '../store/schema/TableViewItemRelation';
import getTableToRowRelationKey from './getTableToRowRelationKey';
import listViewStore from '../store/Store';

/**
 * Get the table view item relation based on the rowKey and tableView
 * @param itemRowKey the message/item rowKey
 * @param tableViewId id of the table view
 * @returns the table view item relation
 * Note that relation could return null, when we try to append conversations in seek to FindConversation response and user has already
 * deleted the first conversation in response
 */
export default function getTableItemRelation(
    itemRowKey: string,
    tableViewId: string
): TableViewItemRelation {
    const relationKey = getTableToRowRelationKey(itemRowKey, tableViewId);
    return listViewStore.tableViewItemRelations.get(relationKey);
}
