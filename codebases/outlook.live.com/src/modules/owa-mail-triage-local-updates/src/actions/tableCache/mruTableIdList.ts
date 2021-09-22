import { onAddTable, onRemoveTable } from './onUpdateTables';
import type { MailFolderTableQuery, SortBy, TableView } from 'owa-mail-list-store';
import getTableId from 'owa-mail-triage-table-utils/lib/actions/helpers/getTableId';
import { allowMultipleSortCaching } from './allowMultipleSortCaching';

/*
    We maintain a list of most recently used 5 tables by storing the table info in the MRU list.
    Whenever a new table is added to the MRU, we subscribe to the row notifications.
    Whenever a table id entry is removed from the MRU we unsubscribe to the row notifications.
    This means at any time only 5 tables are active\live.
    VSO-18425 - Use mruCache class from client-framework instead
*/
const capacity = 5;

interface TableInfo {
    tableViewId: string;
    key: string;
    sortBy: SortBy;
}
let tableList: TableInfo[] = [];

/**
 * Generate a key for the table. When we don't allow multiple sorts this will not include the
 * sort information, otherwise it will.
 */
export function getTableKey(tableView: TableView): string {
    return getTableId(tableView.tableQuery, !allowMultipleSortCaching());
}

function getTableInfo(tableView: TableView, tableKey: string, sortBy: SortBy) {
    return { tableViewId: tableView.id, key: tableKey, sortBy: sortBy };
}

function areSortsEqual(left: SortBy, right: SortBy): boolean {
    return left.sortDirection === right.sortDirection && left.sortColumn === right.sortColumn;
}

function indexOf(key: string): number {
    for (let index = 0; index < tableList.length; ++index) {
        if (tableList[index].key === key) {
            return index;
        }
    }

    return -1;
}

function addToFront(tableInfo: TableInfo, tableView: TableView) {
    tableList.unshift(tableInfo);
    onAddTable(tableView);
    invalidateOldEntries();
}

function addToEnd(tableInfo: TableInfo, tableView: TableView) {
    if (canAddToList()) {
        tableList.push(tableInfo);
        onAddTable(tableView);
    }
}

function bumpToFront(index: number, tableInfo: TableInfo) {
    tableList.splice(index, 1);
    tableList.unshift(tableInfo);
}

function invalidateOldEntries() {
    for (let index = capacity; index < tableList.length; index++) {
        onRemoveTable(tableList[index].tableViewId);
        tableList.splice(index, 1);
    }
}

export function update(tableView: TableView, shouldAddToFront: boolean = true): number {
    const mailTableQuery = tableView.tableQuery as MailFolderTableQuery;
    const tableKey = getTableKey(tableView);
    const sortBy = mailTableQuery.sortBy;
    const tableInfo = getTableInfo(tableView, tableKey, sortBy);

    const index = indexOf(tableKey);

    if (index == -1) {
        if (shouldAddToFront) {
            addToFront(tableInfo, tableView);
        } else {
            addToEnd(tableInfo, tableView);
        }
    } else {
        const oldTableInfo = tableList[index];
        bumpToFront(index, tableInfo);

        if (!allowMultipleSortCaching() && !areSortsEqual(tableInfo.sortBy, oldTableInfo.sortBy)) {
            onRemoveTable(oldTableInfo.tableViewId);
            onAddTable(tableView);
        }
    }

    return index;
}

export function remove(tableView: TableView) {
    const tableKey = getTableKey(tableView);
    const index = indexOf(tableKey);
    if (index == -1) {
        throw new Error('Table Key should be present in the mru list when remove is called');
    }

    onRemoveTable(tableView.id);
    tableList.splice(index, 1);
}

export function canAddToList(): boolean {
    return tableList.length < capacity;
}

export function getMRUTableKey(index: number = 0): string {
    return tableList[index].key;
}

export function getLength(): number {
    return tableList.length;
}

export function test_resetTableIdList() {
    tableList = [];
}
