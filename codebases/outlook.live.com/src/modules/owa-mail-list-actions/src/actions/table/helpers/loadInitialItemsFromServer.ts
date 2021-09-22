import onLoadInitialRowsSucceeded from '../onLoadInitialRowsSucceeded';
import { apolloErrorToResponseCode } from 'owa-apollo-errors/lib/apolloErrorToResponseCode';
import { isFeatureEnabled } from 'owa-feature-flags';
import { findItemWithStartIndex, getItemRows } from 'owa-mail-find-rows';
import { shouldTableSortByRenewTime } from 'owa-mail-list-response-processor';
import type { OnInitialTableLoadComplete } from 'owa-mail-loading-action-types';
import {
    getMailboxInfoFromTableQuery,
    getMailboxRequestOptionsFromTableQuery,
} from 'owa-mail-mailboxinfo';
import { INITIAL_LOAD_ROW_COUNT } from 'owa-mail-triage-table-utils';
import getMailItemSortByProperty from 'owa-mail-triage-table-utils/lib/getMailItemSortByProperty';
import type FindItemResponseMessage from 'owa-service/lib/contract/FindItemResponseMessage';
import folderId from 'owa-service/lib/factory/folderId';
import type { TraceErrorObject } from 'owa-trace';
import {
    getBaseFolderId,
    MailFolderTableQuery,
    TableView,
    getBaseServerFolderId,
} from 'owa-mail-list-store';
import type { ItemRow } from 'owa-graph-schema';
import type { SessionData } from 'owa-service/lib/types/SessionData';
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';

/**
 * Load the initial items from the server
 * @param tableView to load items in
 * @param OnInitialTableLoadComplete is a callback that is called when we receive the response
 * The callback is handled by table loading
 * @param isTablePrefetched indicates if the table is prefetched
 * @return a promise that resolves when the load table from server has completed
 */
export default function loadInitialItemsFromServer(
    tableView: TableView,
    isTablePrefetched: boolean,
    onInitialTableLoadComplete: OnInitialTableLoadComplete,
    initialSessionData?: SessionData,
    apolloClientPromise?: Promise<ApolloClient<NormalizedCacheObject>>
): Promise<void> {
    const mailTableQuery = tableView.tableQuery as MailFolderTableQuery;

    if (isFeatureEnabled('mon-messageList-useGqlForFindItem')) {
        return getItemRows(
            getBaseFolderId(mailTableQuery),
            INITIAL_LOAD_ROW_COUNT,
            mailTableQuery.viewFilter,
            mailTableQuery.sortBy,
            shouldTableSortByRenewTime(mailTableQuery),
            mailTableQuery.focusedViewFilter,
            mailTableQuery.requestShapeName,
            getMailboxInfoFromTableQuery(mailTableQuery),
            initialSessionData,
            getMailboxRequestOptionsFromTableQuery(mailTableQuery),
            mailTableQuery.categoryName,
            getBaseServerFolderId(tableView, true /* returnNullIfSameAsFolderId */),
            null, // lastInstanceKey
            isTablePrefetched,
            apolloClientPromise
        )
            .then(responseMessage => {
                let items = [];

                if (responseMessage.edges) {
                    items = responseMessage.edges.map(edge => edge.node);
                }
                onLoadInitialRowsSucceeded(
                    tableView,
                    items,
                    responseMessage.totalItemRowsInView,
                    responseMessage.searchFolderId
                        ? folderId({ Id: responseMessage.searchFolderId })
                        : null,
                    null /* FolderId used for groups scenario, we currently don't support message view in groups. */
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
    } else {
        return findItemWithStartIndex(
            getBaseFolderId(mailTableQuery),
            0 /* startIndex */,
            INITIAL_LOAD_ROW_COUNT,
            mailTableQuery.viewFilter,
            getMailItemSortByProperty(mailTableQuery),
            mailTableQuery.focusedViewFilter,
            mailTableQuery.requestShapeName,
            initialSessionData,
            getMailboxRequestOptionsFromTableQuery(mailTableQuery),
            mailTableQuery.categoryName,
            getBaseServerFolderId(tableView, true /* returnNullIfSameAsFolderId */)
        ).then(
            (responseMessage: FindItemResponseMessage) => {
                let returnedPromise = Promise.resolve();
                const isSuccessResponseClass = responseMessage.ResponseClass == 'Success';
                if (isSuccessResponseClass) {
                    onLoadInitialRowsSucceeded(
                        tableView,
                        responseMessage.RootFolder.Items?.map(a => a as ItemRow), // type cast all the items to ItemRow
                        responseMessage.RootFolder.TotalItemsInView,
                        responseMessage.SearchFolderId,
                        null /* FolderId used for groups scenario, we currently don't support message view in groups. */
                    );
                } else {
                    const error: TraceErrorObject = new Error(
                        `ResponseCode=${responseMessage.ResponseCode}, Stacktrace=${responseMessage.StackTrace}`
                    );
                    error.fetchErrorType = 'ServerFailure';
                    returnedPromise = Promise.reject(error);
                }

                onInitialTableLoadComplete(
                    tableView,
                    isSuccessResponseClass,
                    responseMessage.ResponseCode,
                    isTablePrefetched
                );

                return returnedPromise;
            },
            error => {
                // Server returned non-200 response
                const responseCode = error?.response?.status || '';
                onInitialTableLoadComplete(
                    tableView,
                    false /* isSuccessResponseClass */,
                    responseCode,
                    isTablePrefetched
                );

                return Promise.reject(error);
            }
        );
    }
}
