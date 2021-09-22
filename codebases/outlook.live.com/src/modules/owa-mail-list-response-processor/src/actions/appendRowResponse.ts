import shouldSkipProcessRow from './helpers/shouldSkipProcessRow';
import fetchRichContentForRows from './helpers/fetchRichContentForRows';
import {
    getRowKeyFromListViewType,
    MailListRowDataType,
    TableView,
    MailRowDataPropertyGetter,
} from 'owa-mail-list-store';
import updateInstrumentationContext from 'owa-mail-list-store/lib/utils/updateInstrumentationContext';
import TableOperations from 'owa-mail-list-table-operations';
import { doesRowBelongToNudgeSection } from 'owa-mail-nudge-store';
import type { InstrumentationContext } from 'owa-search/lib/types/InstrumentationContext';
import { action } from 'satcheljs/lib/legacy';
import { isFeatureEnabled } from 'owa-feature-flags';

export default action('appendRowResponse')(
    /**
     * Process FindConversation/FindItem response and append them to the end of the given TableView
     * @param tableView to append results in
     * @param rows to be appended
     * @param totalRowsInViewInResponse - total rows in the table returned from server
     * @param source - source of append
     * @param searchResponseId - the search query id
     * @param doNotOverwriteData determines if updates should be written (default is false)
     */
    function appendRowResponse(
        tableView: TableView,
        rows: MailListRowDataType[],
        totalRowsInViewInResponse: number,
        source: string = '',
        searchResponseId?: string,
        searchLogicalId?: string,
        doNotOverwriteData: boolean = false
    ) {
        const rowList: MailListRowDataType[] = rows || [];
        let failedCount = 0;

        for (const row of rowList) {
            // Check if row should be processed
            if (shouldSkipProcessRow(row, tableView)) {
                continue;
            }

            let wasSuccessful = true;
            const rowKey = row.InstanceKey;

            // Append all rows to end of table
            if (
                TableOperations.containsRowKey(
                    tableView,
                    getRowKeyFromListViewType(row, tableView.tableQuery.listViewType)
                )
            ) {
                // Rows belonging to nudge section shall remain in same place
                const insertIndex = doesRowBelongToNudgeSection(
                    rowKey,
                    tableView.id,
                    MailRowDataPropertyGetter.getLastDeliveryOrRenewTimeStamp(rowKey, tableView)
                )
                    ? tableView.rowKeys.indexOf(rowKey)
                    : tableView.rowKeys.length - 1;

                // Move row to new position in table if it already exists. There could be some timing issue
                // where the row was moved down on the server. In this case we want to keep the server's latest order
                TableOperations.updateRow(insertIndex, row, tableView, source, doNotOverwriteData);
            } else {
                wasSuccessful = TableOperations.appendRow(
                    row,
                    tableView,
                    source,
                    doNotOverwriteData
                );
            }

            // Account for failures
            if (isFeatureEnabled('tri-handleTableAddFailures') && !wasSuccessful) {
                failedCount++;
            }

            if (searchResponseId) {
                const instrumentationContext = <InstrumentationContext>{
                    referenceKey: row.ReferenceKey,
                    index: tableView.rowKeys.length - 1,
                    traceId: searchResponseId,
                    logicalId: searchLogicalId,
                };

                updateInstrumentationContext(rowKey, tableView, instrumentationContext);
            }
        }

        // VSO 1285: optimize this number on empty folder
        tableView.totalRowsInView = totalRowsInViewInResponse - failedCount;

        // FetchRichContentForRows
        fetchRichContentForRows(tableView);
    }
);
