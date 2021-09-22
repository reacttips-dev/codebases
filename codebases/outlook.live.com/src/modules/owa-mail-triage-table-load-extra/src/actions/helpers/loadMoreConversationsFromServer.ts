import type MailFolderTableQuery from 'owa-mail-list-store/lib/store/schema/MailFolderTableQuery';
import type TableView from 'owa-mail-list-store/lib/store/schema/TableView';
import {
    appendConversationWithSeekToConditionResponse,
    shouldTableSortByRenewTime,
} from 'owa-mail-list-response-processor';
import { onLoadMoreRowsSucceeded, onLoadMoreRowsFailed } from './onLoadMoreRowsCompleted';
import { getBaseServerFolderId } from 'owa-mail-list-store';
import { getMailboxInfoFromTableQuery } from 'owa-mail-mailboxinfo';
import { getConversationRows } from 'owa-mail-find-rows';
import type FolderId from 'owa-service/lib/contract/FolderId';
import { apolloErrorToResponseCode } from 'owa-apollo-errors/lib/apolloErrorToResponseCode';

/**
 * Load more conversations from the server
 * @param tableView to load
 */
export default function loadMoreConversationsFromServer(tableView: TableView, rowsToLoad: number) {
    const lastRowIndex = tableView.rowKeys.length - 1;
    const mailTableQuery = tableView.tableQuery as MailFolderTableQuery;
    const serverBaseFolderId = getBaseServerFolderId(
        tableView,
        true /* returnNullIfSameAsFolderId */
    );
    const serverFolderId = (serverBaseFolderId as FolderId)?.Id;

    // We always perform seek to condition request when we are loading more.
    // We use instancekey of the last item we have in the loaded rows in the table.
    // The seekToCondition ask server to get items from this instanceKey the response of which will also
    // include the last item who instanceKey we used.
    getConversationRows(
        mailTableQuery.folderId,
        rowsToLoad,
        mailTableQuery.viewFilter,
        mailTableQuery.sortBy,
        shouldTableSortByRenewTime(mailTableQuery),
        mailTableQuery.focusedViewFilter,
        mailTableQuery.requestShapeName,
        getMailboxInfoFromTableQuery(mailTableQuery),
        tableView.rowKeys[lastRowIndex], // lastInstanceKey
        mailTableQuery.categoryName,
        serverFolderId
    )
        .then(responseMessage => {
            let conversationTypes = [];

            if (responseMessage.edges) {
                conversationTypes = responseMessage.edges.map(edge => edge.node);
            }

            onLoadMoreRowsSucceeded(
                tableView,
                conversationTypes,
                responseMessage.totalConversationRowsInView,
                appendConversationWithSeekToConditionResponse
            );
        })
        .catch((error: any) => {
            const responseCode = apolloErrorToResponseCode(error);
            onLoadMoreRowsFailed(tableView, responseCode);
        });
}
