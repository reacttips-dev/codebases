import onLoadInitialRowsSucceeded from '../onLoadInitialRowsSucceeded';
import {
    getBaseServerFolderId,
    TableView,
    MailFolderTableQuery,
    MailSortHelper,
} from 'owa-mail-list-store';
import { getMailboxInfoFromTableQuery } from 'owa-mail-mailboxinfo';
import { shouldTableSortByRenewTime } from 'owa-mail-list-response-processor';
import { INITIAL_LOAD_ROW_COUNT } from 'owa-mail-triage-table-utils';
import type { OnInitialTableLoadComplete } from 'owa-mail-loading-action-types';
import { getConversationRows } from 'owa-mail-find-rows';
import folderId from 'owa-service/lib/factory/folderId';
import type FolderId from 'owa-service/lib/contract/FolderId';
import { apolloErrorToResponseCode } from 'owa-apollo-errors/lib/apolloErrorToResponseCode';
import type { SessionData } from 'owa-service/lib/types/SessionData';
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';

/**
 * Load the initial conversations from the server
 * @param tableView to load conversations in
 * @param OnInitialTableLoadComplete is a callback that is called when we receive the response
 * The callback is handled by table loading
 * @param isTablePrefetched indicates if the table is prefetched
 * @return a promise that resolves when the load table from server has completed
 */
export default function loadInitialConversationsFromServer(
    tableView: TableView,
    isTablePrefetched: boolean,
    onInitialTableLoadComplete: OnInitialTableLoadComplete,
    initialSessionData?: SessionData,
    apolloClientPromise?: Promise<ApolloClient<NormalizedCacheObject>>
): Promise<void> {
    const mailTableQuery = tableView.tableQuery as MailFolderTableQuery;
    const serverBaseFolderId = getBaseServerFolderId(
        tableView,
        true /* returnNullIfSameAsFolderId */
    );
    const serverFolderId = (serverBaseFolderId as FolderId)?.Id;

    const isFilter = mailTableQuery.viewFilter && mailTableQuery.viewFilter !== 'All';
    const { sortColumn, sortDirection } = MailSortHelper.getDefaultSortBy();
    const isSort =
        mailTableQuery.sortBy &&
        (mailTableQuery.sortBy.sortColumn !== sortColumn ||
            mailTableQuery.sortBy.sortDirection !== sortDirection);

    return getConversationRows(
        mailTableQuery.folderId,
        INITIAL_LOAD_ROW_COUNT,
        mailTableQuery.viewFilter,
        mailTableQuery.sortBy,
        shouldTableSortByRenewTime(mailTableQuery),
        mailTableQuery.focusedViewFilter,
        mailTableQuery.requestShapeName,
        getMailboxInfoFromTableQuery(mailTableQuery),
        undefined, // lastInstanceKey, so load from start of folder
        mailTableQuery.categoryName,
        serverFolderId,
        {
            datapoint: {
                customData: {
                    scenarioType: mailTableQuery.scenarioType,
                    isPrefetch: isTablePrefetched,
                    isFilter: isFilter,
                    isSort: isSort,
                },
            },
        }, // requestOptions
        initialSessionData,
        isTablePrefetched,
        apolloClientPromise
    )
        .then(responseMessage => {
            let conversationTypes = [];
            if (responseMessage.edges) {
                conversationTypes = responseMessage.edges.map(edge => edge.node);
            }

            onLoadInitialRowsSucceeded(
                tableView,
                conversationTypes,
                responseMessage.totalConversationRowsInView,
                responseMessage.searchFolderId
                    ? folderId({ Id: responseMessage.searchFolderId })
                    : null,
                responseMessage.folderId ? folderId({ Id: responseMessage.folderId }) : null
            );

            onInitialTableLoadComplete(
                tableView,
                true, // isSuccessResponseClass
                '200',
                isTablePrefetched
            );
        })
        .catch((error: any) => {
            const responseCode = apolloErrorToResponseCode(error);
            onInitialTableLoadComplete(tableView, false, responseCode, isTablePrefetched);
            return Promise.reject(error);
        });
}
