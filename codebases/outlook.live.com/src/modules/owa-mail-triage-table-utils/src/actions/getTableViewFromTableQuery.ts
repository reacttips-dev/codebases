import getTableId from './helpers/getTableId';
import { ObservableMap } from 'mobx';
import { getStore, LoadErrorStatus, TableQuery, TableView } from 'owa-mail-list-store';
import { mutatorAction } from 'satcheljs';

/**
 * Create empty table view based on the table query
 * @param id the table id
 * @param tableQuery the table query
 * @return the table view
 */
function createTableView(id: string, tableQuery: TableQuery): TableView {
    const tableView: TableView = {
        currentLoadedIndex: 0,
        loadErrorStatus: LoadErrorStatus.None,
        id: id,
        isInCheckedMode: false,
        isInVirtualSelectAllMode: false,
        isInitialLoadComplete: false,
        isLoading: true,
        rowKeys: [],
        rowIdToRowKeyMap: new ObservableMap<string, string[]>(),
        lastEmptiedTime: null,
        selectAllModeTimeStamp: null,
        selectedRowKeys: new ObservableMap<string, boolean>(),
        serverFolderId: tableQuery.folderId,
        tableQuery: tableQuery,
        totalRowsInView: 0,
        virtualSelectAllExclusionList: [],
        selectionAnchorRowKey: null,
        focusedRowKey: null,
        multiSelectionAnchorRowKey: null,
    };

    return tableView;
}

/**
 * VSO-18425 - Adding the table to the store should be managed by table Cache
 * Add the table view to store
 * @param tableView the table view
 * @param tableViews the table views collection in the store
 */
const addTableViewToStore = mutatorAction(
    'addTableViewToStore',
    (tableView: TableView, tableViews: ObservableMap<string, TableView>) => {
        tableViews.set(tableView.id, tableView);
    }
);

/**
 * Get the table view from the list view store based on the table query
 * @param tableQuery the table query
 * @param state which contains all the table views in list view store
 * @return tableView the tableView
 */
export default function getTableViewFromTableQuery(
    tableQuery: TableQuery,
    skipAddToStore?: boolean
): TableView {
    const tableViews = getStore().tableViews;

    const tableId = getTableId(tableQuery);
    let tableView = tableViews.get(tableId);

    // Create tableView if it doesn't exist yet
    if (!tableView) {
        tableView = createTableView(tableId, tableQuery);

        if (!skipAddToStore) {
            const id = tableView.id;
            addTableViewToStore(tableView, tableViews);
            tableView = tableViews.get(id);
        }
    }

    return tableView;
}
