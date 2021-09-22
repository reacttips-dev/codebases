import addOrUpdateRowData from './table-updates/addOrUpdateRowData';
import removeRowData from './table-updates/removeRowData';
import { action } from 'satcheljs/lib/legacy';
import {
    getRowKeyFromListViewType,
    MailRowDataPropertyGetter,
    MailListRowDataType,
    TableView,
} from 'owa-mail-list-store';
import * as trace from 'owa-trace';
import { OwaDate, userDate } from 'owa-datetime';

type TraceErrorObject = trace.TraceErrorObject;

/**
 * Table operations is responsible for 1) Add, 2) Update 3) Remove of
 * the rows from tableView and the list view conversations/items store.
 */

/**
 * Adds row in the listView store
 * @param addAtIndex index where the row needs to be moved
 * @param row to be added
 * @param tableView where row is getting added
 * @param source source of row add
 * @param doNotOverwriteData determines if updates should be written (default is false)
 */
export function addRow(
    addAtIndex: number,
    row: MailListRowDataType,
    tableView: TableView,
    source: string = '',
    doNotOverwriteData: boolean = false
) {
    // The order of operations is important as we have to add the row data that will add the associated model (conv/item) to the store
    // and then add the references for the rowKey and rowId as addToTableRowKeys operates on a rowKey
    // 1. Add or update row in the store
    addOrUpdateRowData(row, tableView, doNotOverwriteData);

    // 2. Add to table's rowKeys list
    return addToTableRowKeys(
        tableView,
        addAtIndex,
        getRowKeyFromListViewType(row, tableView.tableQuery.listViewType),
        source
    );
}

/**
 * Appends row to the end of the list in TableView
 * @param row to be added
 * @param tableView where row is getting added
 * @param source source of row append
 * @param doNotOverwriteData determines if updates should be written (default is false)
 */
export function appendRow(
    row: MailListRowDataType,
    tableView: TableView,
    source: string = '',
    doNotOverwriteData: boolean = false
) {
    // Append to the end of table's rowKeys list
    const appendIndex = tableView.rowKeys.length;
    return addRow(appendIndex, row, tableView, source, doNotOverwriteData);
}

/**
 * Removes row in listView store
 * @param rowKey that needs to be removed
 * @param tableView where row is getting removed
 * @param source source of row removal
 */
export const removeRow = action('tableOperations.removeRow')(function removeRow(
    rowKey: string,
    tableView: TableView,
    source: string = ''
) {
    // The order of operations is important as we have to remove the references for the rowKey and rowId first
    // and then remove row data which also takes care of removing the model data (conv/item) from the store
    // 1. Remove rowKey from rowKeys list
    removeFromTableRowKeys(tableView, rowKey, source);

    // 2. Remove row from list view store
    removeRowData(rowKey, tableView);
});

/**
 * Updates row index position in the table in list view store.
 * @param updateIndex index where the row needs to be moved
 * @param rowKey rowKey of the row to be updated
 * @param tableView where row is getting updated
 * @param source source of row update position
 */
export const updateRowPosition = action('tableOperations.updateRowPosition')(
    function updateRowPosition(
        targetIndex: number,
        rowKey: string,
        tableView: TableView,
        source: string = ''
    ) {
        const currentIndex = tableView.rowKeys.indexOf(rowKey);
        if (currentIndex < 0) {
            const error: TraceErrorObject = new Error(
                'updateRowPosition: Row not found in table, source: ' + source
            );
            error.diagnosticInfo =
                'tableLength: ' + tableView.rowKeys.length + ' rowKey: ' + rowKey;
            trace.errorThatWillCauseAlert(error);
            return;
        }

        if (currentIndex == targetIndex) {
            // No updates needed
            return;
        }

        // Remove from table's rowKeys list
        removeFromTableRowKeys(tableView, rowKey, source);

        // Add to table's rowKeys list
        addToTableRowKeys(tableView, targetIndex, rowKey, source);
    }
);

/**
 * Updates row's position and data in list view store.
 * @param targetIndex index where the row needs to be moved
 * @param row to be updated
 * @param tableView where row is getting updated
 * @param source source of row update
 */
export const updateRow = action('tableOperations.updateRow')(function updateRow(
    targetIndex: number,
    row: MailListRowDataType,
    tableView: TableView,
    source: string = '',
    doNotOverwriteData: boolean = false
) {
    // Update row's position index in table
    updateRowPosition(
        targetIndex,
        getRowKeyFromListViewType(row, tableView.tableQuery.listViewType),
        tableView,
        source
    );

    // Also update row data
    addOrUpdateRowData(row, tableView, doNotOverwriteData);
});

/**
 * Updates row data in list view store.
 * @param row to be updated
 * @param tableView where row is getting updated
 */
export const updateRowData = action('tableOperations.updateRowData')(function updateRowData(
    row: MailListRowDataType,
    tableView: TableView
) {
    // Update row data
    addOrUpdateRowData(row, tableView);
});

/**
 * Clears the table of all rows
 * @param tableView to clear
 * @param skipRowsNewerThanTime - timestamp which is used for skipping deleting new emails
 * @param rowKeysToExclude list of rows to exclude from delete operation
 * @param source source of table clear
 */
export const clear = action('tableOperations.clear')(function clear(
    tableView: TableView,
    skipRowsNewerThanTime: OwaDate = null,
    rowKeysToExclude: string[] = [],
    source: string = ''
) {
    for (let i = tableView.rowKeys.length - 1; i >= 0; i--) {
        const rowKey = tableView.rowKeys[i];

        // Remove all conversation data if no timeStamp is specified and if it is not in exclusion list.
        // Otherwise skip the rows that are newer than the timeStamp
        if (rowKeysToExclude.indexOf(rowKey) == -1) {
            if (!skipRowsNewerThanTime) {
                removeRow(rowKey, tableView, source);
            } else {
                const lastDeliveryTime = MailRowDataPropertyGetter.getLastDeliveryTimeStamp(
                    rowKey,
                    tableView
                );
                if (userDate(lastDeliveryTime) < skipRowsNewerThanTime) {
                    removeRow(rowKey, tableView, source);
                }
            }
        }
    }
});

/**
 * Returns flag indicating whether the given table already contains the row with the given key
 * @param tableView - Given tableView
 * @param rowKey - Given row key
 */
export function containsRowKey(tableView: TableView, rowKey: string): boolean {
    return tableView.rowKeys.indexOf(rowKey) >= 0;
}

/**
 * Add the given row Key to the given TableView's rowKeys list
 * @param tableView - The table to act on
 * @param addAtIndex - Index to add the rowKey at
 * @param rowKey - The rowKey to add
 * @param source - source of row add
 * @returns flag indicating whether the operation was successful
 */
function addToTableRowKeys(
    tableView: TableView,
    addAtIndex: number,
    rowKey: string,
    source: string = ''
): boolean {
    if (addAtIndex < 0 || addAtIndex > tableView.rowKeys.length) {
        traceError(
            'addToTableRowKeys: Invalid add index',
            source,
            getAddErrorDiagnosticInfo(tableView, addAtIndex)
        );
        return false;
    }

    if (containsRowKey(tableView, rowKey)) {
        traceError(
            'addToTableRowKeys: RowKey already exists',
            source,
            getAddErrorDiagnosticInfo(tableView, addAtIndex)
        );
        return false;
    }

    try {
        const rowId = MailRowDataPropertyGetter.getRowIdString(rowKey, tableView);
        addRowKeyToTableRowKeysAndMap(tableView, rowId, rowKey, addAtIndex);
        return true;
    } catch (e) {
        const diagnosticInfo =
            getAddErrorDiagnosticInfo(tableView, addAtIndex) + ' exp: ' + e?.message;
        traceError(
            'addToTableRowKeys: exception when adding row at valid index',
            source,
            diagnosticInfo
        );
        return false;
    }
}

/**
 * V2 Action to make the store changes, this is to avoid any store changes which consumers would do without
 * wrapping table operations api in V2 action or V3 mutator.
 */
const addRowKeyToTableRowKeysAndMap = action('tableOperations.addRowKeyToTableRowKeysAndMap')(
    function addRowKeyToTableRowKeysAndMap(
        tableView: TableView,
        rowId: string,
        rowKey: string,
        addAtIndex: number
    ) {
        let rowKeys: string[] = tableView.rowIdToRowKeyMap.get(rowId);
        if (!rowKeys) {
            rowKeys = [];
        }

        if (rowKeys.indexOf(rowKey) == -1) {
            rowKeys.push(rowKey);
        }
        // Add rowKey to the rowIdToRowKeyMap
        tableView.rowIdToRowKeyMap.set(rowId, rowKeys);

        // Add rowKey to the rowKeys at the specified index
        tableView.rowKeys.splice(addAtIndex, 0, rowKey);
    }
);

/**
 * Remove the given rowKey from the given TableView's rowKeys list
 * @param tableView - The table to act on
 * @param rowKey - The rows key
 * @param source source of row removal
 */
function removeFromTableRowKeys(tableView: TableView, rowKey: string, source: string = '') {
    const removeAtIndex = tableView.rowKeys.indexOf(rowKey);
    if (removeAtIndex < 0) {
        traceError(
            'removeFromTableRowKeys: RowKey not found in tableView.rowKeys',
            source,
            getRemoveErrorDiagnosticInfo(tableView)
        );
        return;
    }

    const rowId = MailRowDataPropertyGetter.getRowIdString(rowKey, tableView);

    // 1. Remove the rowKey from the rowIdToRowKeyMap and remove the map entry if this is the last rowKey getting removed
    const rowKeysForRowId = tableView.rowIdToRowKeyMap.get(rowId);
    if (!rowKeysForRowId) {
        traceError(
            'removeFromTableRowKeys: invalid rowKeysForRowId',
            source,
            getRemoveErrorDiagnosticInfo(tableView, rowId)
        );
        return;
    }

    const indexOfRowKey = rowKeysForRowId.indexOf(rowKey);
    if (indexOfRowKey == -1) {
        traceError(
            'removeFromTableRowKeys: RowKey should be present in rowIdToRowKey map',
            source,
            getRemoveErrorDiagnosticInfo(tableView, rowId)
        );
        return;
    }

    if (rowKeysForRowId.length == 1) {
        // Remove the entry for this rowId from the rowIdToRowKeyMap
        tableView.rowIdToRowKeyMap.delete(rowId);
    } else {
        rowKeysForRowId.splice(indexOfRowKey, 1);
    }

    // 2. Remove row at the specified index from row keys
    tableView.rowKeys.splice(removeAtIndex, 1);
}

/**
 * Helper to log traces during add operation
 * @param tableView tableView where add is being performed
 * @param addAtIndex index where a row is being added
 */
function getAddErrorDiagnosticInfo(tableView: TableView, addAtIndex: number): string {
    return 'addAtIndex: ' + addAtIndex + getTablePropertiesToLog(tableView);
}

/**
 * Helper to log traces during remove operation
 * @param tableView tableView where remove is being performed
 * @param rowId rowId of the row being removed
 */
function getRemoveErrorDiagnosticInfo(tableView: TableView, rowId?: string): string {
    const rowIdString = rowId ? 'rowId: ' + rowId : '';
    return rowIdString + getTablePropertiesToLog(tableView);
}

function getTablePropertiesToLog(tableView: TableView) {
    return (
        ' tableLength: ' +
        tableView.rowKeys.length +
        ' tableType: ' +
        tableView.tableQuery.type +
        ' lvType: ' +
        tableView.tableQuery.listViewType
    );
}

/**
 * Helper to trace table operation errors
 * @param errorMessage error message to log
 * @param source source string that will be appended to error message
 * @param diagnosticInfo extra diagnostic info to be added to the log
 */
function traceError(errorMessage: string, source: string, diagnosticInfo: string) {
    const error: TraceErrorObject = new Error(errorMessage + ': source: ' + source);
    error.diagnosticInfo = diagnosticInfo;
    trace.errorThatWillCauseAlert(error);
}
