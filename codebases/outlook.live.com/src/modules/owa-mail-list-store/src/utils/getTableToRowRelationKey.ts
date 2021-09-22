/**
 * Gets the key for tableRelation map
 * @param rowKey rowKey of the row
 * @param tableViewId tableView id
 * @returns a key
 */
export default function getTableToRowRelationKey(rowKey: string, tableViewId: string): string {
    return tableViewId + rowKey;
}
