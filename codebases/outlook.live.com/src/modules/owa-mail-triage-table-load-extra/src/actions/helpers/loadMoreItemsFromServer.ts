import { onLoadMoreRowsFailed, onLoadMoreRowsSucceeded } from './onLoadMoreRowsCompleted';
import { findItemWithSeekToInstanceKeyCondition } from '../../services/findItemWithSeekToInstanceKeyCondition';
import { apolloErrorToResponseCode } from 'owa-apollo-errors/lib/apolloErrorToResponseCode';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getItemRows } from 'owa-mail-find-rows';
import getMailItemSortByProperty from 'owa-mail-triage-table-utils/lib/getMailItemSortByProperty';
import {
    getMailboxRequestOptionsFromTableQuery,
    getMailboxInfoFromTableQuery,
} from 'owa-mail-mailboxinfo';
import {
    appendItemWithSeekToConditionResponse,
    shouldTableSortByRenewTime,
} from 'owa-mail-list-response-processor';
import {
    getBaseFolderId,
    getBaseServerFolderId,
    MailFolderTableQuery,
    TableView,
} from 'owa-mail-list-store';
import type { ItemRow } from 'owa-graph-schema';

/**
 * Load more items from the server
 * @param tableView to load
 */
export default function loadMoreItemsFromServer(tableView: TableView, rowsToLoad: number) {
    const lastItemIndex = tableView.rowKeys.length - 1;
    const mailTableQuery = tableView.tableQuery as MailFolderTableQuery;

    // We always perform seek to condition request when we are loading more.
    // We use instancekey of the last item we have in the loaded rows in the table.
    // The seekToCondition ask server to get items from this instanceKey the response of which will also
    // include the last item who instanceKey we used.
    if (isFeatureEnabled('mon-messageList-useGqlForFindItem')) {
        getItemRows(
            getBaseFolderId(mailTableQuery),
            rowsToLoad,
            mailTableQuery.viewFilter,
            mailTableQuery.sortBy,
            shouldTableSortByRenewTime(mailTableQuery),
            mailTableQuery.focusedViewFilter,
            mailTableQuery.requestShapeName,
            getMailboxInfoFromTableQuery(mailTableQuery),
            undefined,
            getMailboxRequestOptionsFromTableQuery(mailTableQuery),
            mailTableQuery.categoryName,
            getBaseServerFolderId(tableView, true /* returnNullIfSameAsFolderId */),
            tableView.rowKeys[lastItemIndex] // lastInstanceKey
        )
            .then(responseMessage => {
                let items = [];

                if (responseMessage.edges) {
                    items = responseMessage.edges.map(edge => edge.node);
                }

                onLoadMoreRowsSucceeded(
                    tableView,
                    items,
                    responseMessage.totalItemRowsInView,
                    appendItemWithSeekToConditionResponse
                );
            })
            .catch((error: any) => {
                const responseCode = apolloErrorToResponseCode(error);
                onLoadMoreRowsFailed(tableView, responseCode);
            });
    } else {
        findItemWithSeekToInstanceKeyCondition(
            getBaseFolderId(mailTableQuery),
            tableView.rowKeys[lastItemIndex],
            rowsToLoad,
            mailTableQuery.viewFilter,
            getMailItemSortByProperty(mailTableQuery),
            mailTableQuery.focusedViewFilter,
            mailTableQuery.requestShapeName,
            getMailboxRequestOptionsFromTableQuery(mailTableQuery),
            mailTableQuery.categoryName,
            getBaseServerFolderId(tableView, true /* returnNullIfSameAsFolderId */)
        ).then(
            responseMessage => {
                if (responseMessage.ResponseClass === 'Success') {
                    onLoadMoreRowsSucceeded(
                        tableView,
                        <ItemRow[]>responseMessage.RootFolder.Items,
                        responseMessage.RootFolder.TotalItemsInView,
                        appendItemWithSeekToConditionResponse
                    );
                } else {
                    onLoadMoreRowsFailed(tableView, responseMessage.ResponseCode);
                }
            },
            (error: any) => {
                onLoadMoreRowsFailed(tableView);
            }
        );
    }
}
