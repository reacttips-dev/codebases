import type { TableView } from '../index';

/**
 * Gets all the rowKeys for the given rowIds
 * @param rowIds Row ids
 * @param tableViewId for which to find the rowKey
 * @returns rowKeys for the given rowId
 */
export default function getRowKeysFromRowIds(rowIds: string[], tableView: TableView): string[] {
    const rowKeysToReturn: string[] = [];
    for (let i = 0; i < rowIds.length; i++) {
        const rowKeys: string[] = tableView.rowIdToRowKeyMap.get(rowIds[i]);
        if (rowKeys) {
            // Row may have been deleted due to notifications when local update code was trying to operate on the rowIds
            Array.prototype.push.apply(rowKeysToReturn, rowKeys);
        }
    }

    return rowKeysToReturn;
}
