import type { MailboxInfoInput, SessionDataWithGraphQL } from 'owa-graph-schema';
import { getApolloClient } from 'owa-apollo';
import {
    ConversationRowsDocument,
    ConversationRowsQuery,
} from './graphql/__generated__/ConversationRowsQuery.interface';
import type FocusedViewFilter from 'owa-service/lib/contract/FocusedViewFilter';
import type SortBy from 'owa-mail-list-store/lib/store/schema/SortBy';
import type ViewFilter from 'owa-service/lib/contract/ViewFilter';
import {
    getGqlSortColumnFromOwsSortColumn,
    getGqlViewFilterFromOwsViewFilter,
    getGqlFocusedViewFilterFromOwsFocusedViewFilter,
} from 'owa-mail-list-store';
import { getInboxPausedDateTimeAsString } from './utils/getInboxPausedDateTimeAsString';
import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';
import { mapFindConversationResponseMessageToGql } from 'owa-mail-conversation-row-gql-mappers';
import type { RequestOptions } from 'owa-service/lib/RequestOptions';
import type FindConversationResponseMessage from 'owa-service/lib/contract/FindConversationResponseMessage';
import { addBottleneck } from 'owa-performance';
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';

type ConversationRowConnection = ConversationRowsQuery['conversationRows'];

export async function getConversationRows(
    folderId: string,
    numberOfRowsToFetch: number,
    viewFilter: ViewFilter,
    sortBy: SortBy,
    canFolderSortByRenewTime: boolean,
    focusedViewFilter: FocusedViewFilter,
    shapeName: string,
    mailboxInfoInput: MailboxInfoInput,
    lastInstanceKey?: string,
    categoryName?: string,
    searchFolderId?: string,
    requestOptions?: RequestOptions,
    initialSessionData?: SessionDataWithGraphQL,
    isTablePrefetched?: boolean,
    apolloClientPromise?: Promise<ApolloClient<NormalizedCacheObject>>
): Promise<ConversationRowConnection> {
    // If this is a request for data at the start of the list,
    // and we've been asked to, try using the session data.
    if (initialSessionData) {
        // In native host, the gql stash is from hx so fall back to the legacy stash if
        // mon-conv-useHx is not set.
        if (
            initialSessionData.conversationRows &&
            initialSessionData.conversationRows.folderId == folderId
        ) {
            return initialSessionData.conversationRows;
        } else {
            const sessionDataFindConversationResponse = extractFindConversationResponse(
                initialSessionData,
                folderId
            );

            if (sessionDataFindConversationResponse) {
                // If available, return the session data response mapped to the GQL schema
                return mapFindConversationResponseMessageToGql(sessionDataFindConversationResponse);
            }
        }
    }

    const client = apolloClientPromise ? await apolloClientPromise : getApolloClient();
    const result = await client.query({
        query: ConversationRowsDocument,
        variables: {
            first: numberOfRowsToFetch,
            after: lastInstanceKey,
            folderId: folderId,
            searchFolderId: searchFolderId,
            viewFilter: getGqlViewFilterFromOwsViewFilter(viewFilter),
            focusedViewFilter: getGqlFocusedViewFilterFromOwsFocusedViewFilter(focusedViewFilter),
            sortBy: {
                sortColumn: getGqlSortColumnFromOwsSortColumn(sortBy.sortColumn),
                sortDirection: sortBy.sortDirection,
                canSortByRenewTime: canFolderSortByRenewTime,
            },
            category: categoryName,
            mailboxInfo: mailboxInfoInput,
            shapeName: shapeName,
            isScheduledFolder: folderIdToName(folderId) == 'scheduled',
            pausedInboxTime: getInboxPausedDateTimeAsString(folderId),
            isPrefetch: isTablePrefetched !== false /*default to prefetch if we are not sure*/,
        },
        context: {
            requestOptions: requestOptions,
            queueOperation: isTablePrefetched,
        },
    });

    return result.data.conversationRows;
}

function extractFindConversationResponse(
    initialSessionData: SessionDataWithGraphQL,
    folderId: string
): FindConversationResponseMessage | null {
    const bottleneck = 'fcr';
    const response = initialSessionData.findConversation?.Body;
    let bottleneckReason: string | undefined;
    if (!response) {
        bottleneckReason = 'njr';
    } else if (response.ResponseClass == 'Error') {
        bottleneckReason = 'e';
        addBottleneck(bottleneck + '_c', response.ResponseCode || 'un');
    } else if (folderId != response.FolderId?.Id) {
        bottleneckReason = 'wf';
    } else if (!response.Conversations) {
        bottleneckReason = 'ni';
    } else if (
        typeof response.IndexedOffset != 'number' ||
        0 !== response.Conversations.length - response.IndexedOffset
    ) {
        bottleneckReason = 'wi';
    }

    addBottleneck(bottleneck, bottleneckReason || 's');
    return bottleneckReason ? undefined : response;
}
