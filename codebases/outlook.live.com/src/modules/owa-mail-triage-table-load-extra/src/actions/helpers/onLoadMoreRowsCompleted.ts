import { logUsage } from 'owa-analytics';
import type { MailListRowDataType, TableView } from 'owa-mail-list-store';
import { action } from 'satcheljs/lib/legacy';

/**
 * Callback when load more rows request succeeds
 * @param tableView to load
 * @param newRows to be merged
 * @param newTotalRowsInView the number of new total rows
 * @param appendRowsWithSeekToConditionResponse the action to update rows in list view store
 */
export let onLoadMoreRowsSucceeded = action('onLoadMoreRowsSucceeded')(
    function onLoadMoreRowsSucceeded(
        tableView: TableView,
        newRows: MailListRowDataType[],
        newTotalRowsInView: number,
        appendRowsWithSeekToConditionResponse: (
            tableView: TableView,
            newRows: MailListRowDataType[],
            newTotalRowsInView: number
        ) => void
    ) {
        tableView.isLoading = false;

        // Update rows in listview store
        appendRowsWithSeekToConditionResponse(tableView, newRows, newTotalRowsInView);

        // Always update current loaded index to all items loaded since user triggered load more
        tableView.currentLoadedIndex = tableView.rowKeys.length;
    }
);

/**
 * Callback when load more rows request failed
 * @param tableView to load
 * @param responseCode which is contained in the load more response
 */
export let onLoadMoreRowsFailed = action('onLoadMoreRowsFailed')(function onLoadMoreRowsFailed(
    tableView: TableView,
    responseCode?: string
) {
    tableView.isLoading = false;

    // Log error received from server
    logUsage('TnS_LoadMoreRowsError', [tableView.tableQuery.listViewType, responseCode]);
});
