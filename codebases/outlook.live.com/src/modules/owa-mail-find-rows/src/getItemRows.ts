import { ItemRowsDocument, ItemRowsQuery } from './graphql/__generated__/ItemRowsQuery.interface';
import { getApolloClient } from 'owa-apollo';
import type { MailboxInfoInput } from 'owa-graph-schema';
import { mapFindItemResponseMessageToGql } from 'owa-mail-item-row-gql-mappers';
import {
    SortBy,
    getGqlSortColumnFromOwsSortColumn,
    getGqlViewFilterFromOwsViewFilter,
    getGqlFocusedViewFilterFromOwsFocusedViewFilter,
} from 'owa-mail-list-store';
import type BaseFolderId from 'owa-service/lib/contract/BaseFolderId';
import type FocusedViewFilter from 'owa-service/lib/contract/FocusedViewFilter';
import type FolderId from 'owa-service/lib/contract/FolderId';
import type ViewFilter from 'owa-service/lib/contract/ViewFilter';
import type RequestOptions from 'owa-service/lib/RequestOptions';
import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import type { SessionData } from 'owa-service/lib/types/SessionData';
import { extractFindMailFolderItemResponse } from './utils/extractFindMailFolderItemResponse';
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';

type ItemRowConnection = ItemRowsQuery['itemRows'];

/**
 * Loads item rows for list view when in Message view
 * @param baseFolderId the base folder id
 * @param startIndex the startIndex to load the table
 * @param paging the paging type
 * @param viewFilter the view filter
 * @param sortBy the sort by properties
 * @param canFolderSortByRenewTime can the folder be sorted by renew time
 * @param focusedViewFilter the focused view filter
 * @param findItemShapeName - the shape for the request
 * @param initialSessionData The initial session data which is only present during the initial bootstrap
 * @param options - optional parameters to be passed to request (method and/or headers)
 * @param categoryName - the category name
 * @param searchFolderId the search folder id
 * @returns a promise of type FindItemResponseMessage
 */
export async function getItemRows(
    baseFolderId: BaseFolderId,
    rowsToLoad: number,
    viewFilter: ViewFilter,
    sortBy: SortBy,
    canFolderSortByRenewTime: boolean,
    focusedViewFilter: FocusedViewFilter,
    findItemShapeName: string,
    mailboxInfoInput: MailboxInfoInput,
    initialSessionData: SessionData | undefined,
    options: RequestOptions,
    categoryName: string,
    searchFolderId?: BaseFolderId,
    lastInstanceKey?: string,
    isTablePrefetched?: boolean,
    apolloClientPromise?: Promise<ApolloClient<NormalizedCacheObject>>
): Promise<ItemRowConnection> {
    const folderIdString = (baseFolderId as FolderId).Id;
    if (initialSessionData && folderIdString == folderNameToId('inbox')) {
        const sessionDataFindMailFolderItemResponse = extractFindMailFolderItemResponse(
            initialSessionData
        );
        if (sessionDataFindMailFolderItemResponse) {
            // Return the session data response if available instead of going to the server
            return Promise.resolve(
                mapFindItemResponseMessageToGql(sessionDataFindMailFolderItemResponse)
            );
        }
    }

    const client = apolloClientPromise ? await apolloClientPromise : getApolloClient();
    const result = await client.query({
        query: ItemRowsDocument,
        variables: {
            first: rowsToLoad,
            after: lastInstanceKey,
            folderId: folderIdString,
            searchFolderId: searchFolderId ? (searchFolderId as FolderId).Id : undefined,
            viewFilter: getGqlViewFilterFromOwsViewFilter(viewFilter),
            focusedViewFilter: getGqlFocusedViewFilterFromOwsFocusedViewFilter(focusedViewFilter),
            sortBy: {
                sortColumn: getGqlSortColumnFromOwsSortColumn(sortBy.sortColumn),
                sortDirection: sortBy.sortDirection,
                canSortByRenewTime: canFolderSortByRenewTime,
                isDraftsFolder: folderIdToName(folderIdString) == 'drafts',
            },
            category: categoryName,
            mailboxInfo: mailboxInfoInput,
            shapeName: findItemShapeName,
            isScheduledFolder: folderIdToName(folderIdString) == 'scheduled',
            isPrefetch: isTablePrefetched !== false /*default to prefetch if we are not sure*/,
        },
        context: {
            requestOptions: options,
            queueOperation: isTablePrefetched,
        },
    });

    return result.data.itemRows;
}
