import { default as isRowSortKeyEqual } from './helpers/isSortKeyEqual';
import shouldSkipProcessRow from './helpers/shouldSkipProcessRow';
import fetchRichContentForRows from './helpers/fetchRichContentForRows';
import { logVerboseUsage } from 'owa-analytics';
import { isFeatureEnabled } from 'owa-feature-flags';
import TableOperations from 'owa-mail-list-table-operations';
import { doesRowBelongToNudgeSection } from 'owa-mail-nudge-store';
import * as trace from 'owa-trace';
import { action } from 'satcheljs/lib/legacy';
import {
    getRowKeyFromListViewType,
    MailListRowDataType,
    MailRowDataPropertyGetter,
    TableView,
} from 'owa-mail-list-store';
import { onMergeRowResponseFromTopInTableComplete } from './onMergeRowResponseFromTopInTableComplete';

export default action('mergeRowResponseFromTop')(
    /**
     * Process FindConversation/FindItem response and merge them to the top of the given TableView
     * @param rows to be merged
     * @param tableView to merge results in
     * @param totalRowsInViewInResponse - total rows in the table returned from server
     * @param removeRemainingRowsAfterMerge - flag indicating whether to remove the remaining rows after the merge
     * @param shouldLoadIsdataUptodate - flag indicating whether to log the isDateUptodate datapoint
     */
    function mergeRowResponseFromTop(
        rows: MailListRowDataType[],
        tableView: TableView,
        totalRowsInViewInResponse: number,
        removeRemainingRowsAfterMerge: boolean,
        shouldLogIsDataUptodate: boolean,
        source: string
    ) {
        if (!rows) {
            // VSO 1790: We may have no rows if the server returns an error like:
            // "The mailbox database is temporarily unavailable". Do not throw. Just trace this.
            trace.errorThatWillCauseAlert('We need to have a valid list of rows');
            return;
        }

        if (shouldLogIsDataUptodate) {
            let isDataUptodate = true;

            // We only want to compare first 2 rows from the response to determine if the
            // the data we have is up-to-date. Even though this is not 100% correct
            // its a guesstimate that the data would probably be up-to-date if first 2 rows are.
            for (let i = 0; i < Math.min(tableView.rowKeys.length, 2, rows.length); i++) {
                if (
                    tableView.rowKeys[i] != rows[i].InstanceKey ||
                    !isRowSortKeyEqual(rows[i], tableView)
                ) {
                    isDataUptodate = false;
                    break;
                }
            }

            logVerboseUsage('TnS_MergeFindResponse', [isDataUptodate]);
        }

        let insertIndex = 0;
        let failedCount = 0;
        const listViewType = tableView.tableQuery.listViewType;
        for (const row of rows) {
            // Check if row should be processed
            if (shouldSkipProcessRow(row, tableView)) {
                continue;
            }

            const rowKey = getRowKeyFromListViewType(row, listViewType);
            let wasSuccessful = true;
            if (TableOperations.containsRowKey(tableView, rowKey)) {
                // If this is an existing row, merge it
                // 1. if tri-smartMergeFindResponse is enabled AND the lastModifiedTimeStamp changed, else only update the position OR
                // 2. if tri-smartMergeFindResponse is not enabled
                if (
                    isFeatureEnabled('tri-smartMergeFindResponse') &&
                    MailRowDataPropertyGetter.getLastModifiedTimeStamp(rowKey, tableView) ===
                        row.LastModifiedTime
                ) {
                    TableOperations.updateRowPosition(insertIndex, rowKey, tableView, source);
                } else {
                    TableOperations.updateRow(insertIndex, row, tableView, source);
                }
            } else {
                // Otherwise add new row to the table
                wasSuccessful = TableOperations.addRow(insertIndex, row, tableView, source);
            }

            // If handling the add failures, increment index if the operation was successful else
            // always increment.
            if (!isFeatureEnabled('tri-handleTableAddFailures') || wasSuccessful) {
                insertIndex++;
            } else {
                failedCount++;
            }
        }

        // VSO - 20814 - Add datapoint to log the freshness of cached table on switch mail folder
        // removeRemainingRowsAfterMerge would be true in case of ReloadTable.
        // For such scenario, it generally indicates that we're out of sync with server, so we need to invalidate
        // remaining items we had after merging the top items
        if (removeRemainingRowsAfterMerge) {
            const processedRowCount = insertIndex;
            const rowKeysLength = tableView.rowKeys.length;
            for (let i = rowKeysLength - 1; i >= processedRowCount; i--) {
                // Remove remaining rows from table except for nudged rows
                // We will keep them as reloads can happen any time as as its not due to user initiated actions
                // removing nudge row can cause nudge disappearing
                const rowKey = tableView.rowKeys[i];
                if (
                    !doesRowBelongToNudgeSection(
                        rowKey,
                        tableView.id,
                        MailRowDataPropertyGetter.getLastDeliveryOrRenewTimeStamp(rowKey, tableView)
                    )
                ) {
                    TableOperations.removeRow(rowKey, tableView, source + '_RemoveAfterMerge');
                }
            }
        }

        // raise merge row response complete
        onMergeRowResponseFromTopInTableComplete(tableView);

        // Always update totalRowsInView after making a find request, to allow us to calculate whether this table can load more
        tableView.totalRowsInView = totalRowsInViewInResponse - failedCount;

        // FetchRichContentForRows
        fetchRichContentForRows(tableView);
    }
);
