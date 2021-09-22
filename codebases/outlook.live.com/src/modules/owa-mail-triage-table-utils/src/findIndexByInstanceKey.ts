import type { TableView } from 'owa-mail-list-store';

/**
 * Finds the index of the row given its InstanceKey in the given table
 * @param instanceKey to find
 * @param tableview to find it in
 * @returns the index of the row in the table
 */
export default function findIndexByInstanceKey(instanceKey: string, tableView: TableView): number {
    return tableView.rowKeys.indexOf(instanceKey);
}
