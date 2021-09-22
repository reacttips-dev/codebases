import { initTableSelectionOnLoad } from 'owa-mail-actions/lib/initTableSelectionOnLoad';
import {
    getSelectedTableView,
    LoadErrorStatus,
    TableView,
    TableQueryType,
} from 'owa-mail-list-store';
import { onInitialTableLoadComplete as onInitialTableLoadCompleteAction } from 'owa-mail-triage-table-utils';
import { lazyPrefetchFirstN } from 'owa-mail-prefetch';
import { action } from 'satcheljs/lib/legacy';

const FIRST_N_ROW_PREFETCH_COUNT = 10;

/**
 * Callback for table load complete
 * @param tableView the table view
 * @param isSuccessResponseClass indicates if the response is success
 * @param isTablePrefetched indicates if the table is prefetched
 */
export default action('onInitialTableLoadComplete')(function onInitialTableLoadComplete(
    tableView: TableView,
    isSuccessResponseClass: boolean,
    responseStatusMessage: string,
    isTablePrefetched: boolean
) {
    // Set loading state to complete
    tableView.isLoading = false;
    tableView.isInitialLoadComplete = true;

    if (isTablePrefetched) {
        return;
    }

    // If the response class is success then prefetch and perform auto selection
    if (isSuccessResponseClass) {
        tableView.loadErrorStatus = LoadErrorStatus.None;
        const hasSelection = tableView.selectedRowKeys.size > 0;

        // do auto selection and prefetch first N rows for Folder and Group tables
        if (
            tableView.tableQuery.type == TableQueryType.Folder ||
            tableView.tableQuery.type == TableQueryType.Group
        ) {
            // Init table selection if selected table doesn't already have any selected rows
            if (!hasSelection && tableView == getSelectedTableView()) {
                initTableSelectionOnLoad(tableView);
            }

            lazyPrefetchFirstN.importAndExecute(tableView, FIRST_N_ROW_PREFETCH_COUNT);
        }

        onInitialTableLoadCompleteAction(tableView);
    } else {
        setTableViewErrorState(tableView, responseStatusMessage);
    }
});

/**
 * Callback for set tableview error state
 * @param tableView the table view
 * @param responseStatusMessage indicates the error response status
 */
export let setTableViewErrorState = action('setTableViewErrorState')(
    function setTableViewErrorState(tableView: TableView, responseStatusMessage: string) {
        switch (responseStatusMessage) {
            case 'ErrorAccessDenied':
                tableView.loadErrorStatus = LoadErrorStatus.AccessDenied;
                break;
            case 'UnexpectedClientError':
                tableView.loadErrorStatus = LoadErrorStatus.UnexpectedClientError;
                break;
            default:
                tableView.loadErrorStatus = LoadErrorStatus.Other;
        }
    }
);
