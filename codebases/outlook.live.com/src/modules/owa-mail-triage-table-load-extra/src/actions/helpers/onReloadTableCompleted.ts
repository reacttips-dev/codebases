import { logUsage } from 'owa-analytics';
import { mergeRowResponseFromTop } from 'owa-mail-list-response-processor';
import type { MailListRowDataType, TableView } from 'owa-mail-list-store';
import { action } from 'satcheljs/lib/legacy';

/**
 * Called after reload table is successful
 * @param tableView to be reloaded
 * @param reloadedRows the rows that returned in the service response for reload
 * @param totalRowsInView the total rows in view that returned in the service response for reload
 */
export let onReloadTableSucceeded = action('onReloadTableSucceeded')(
    function onReloadTableSucceeded(
        tableView: TableView,
        reloadedRows: MailListRowDataType[],
        totalRowsInView: number
    ) {
        // Merge reloaded results from the top
        mergeRowResponseFromTop(
            reloadedRows,
            tableView,
            totalRowsInView,
            true /* removeRemainingRowsAfterMerge */,
            false /* shouldLogIsDatauptodate */,
            'MergeOnReload'
        );

        // Set the currentLoadedIndex to the min of tableRows length regardless of what it is as
        // this number is already optimized when we made the reload request
        tableView.currentLoadedIndex = tableView.rowKeys.length;
    }
);

/**
 * Called after reload table failed
 * @param responseCode the response code contained inside the reload response
 */
export let onReloadTableFailed = action('onReloadTableFailed')(function onReloadTableFailed(
    responseCode?: string
) {
    logUsage('TnS_ReloadError', [responseCode]);
});
