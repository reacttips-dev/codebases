import type FindConversationResponseMessage from 'owa-service/lib/contract/FindConversationResponseMessage';
import type { ConversationRowConnection, ConversationRowEdge } from 'owa-graph-schema';
import type ConverationType from 'owa-service/lib/contract/ConversationType';
import { mapOwsConversationTypeToGql } from './mapOwsConversationTypeToGql';

/**
 * This method converts an OWS FindConversationResponseMessage into
 * a GraphQL ConversationRowConnection type.
 * It's been moved out of the resolvers directory so that it can be
 * used to convert the OWS response in the session data stash.
 * @param response The response from an OWS FindConversation call.
 */
export function mapFindConversationResponseMessageToGql(
    response: FindConversationResponseMessage
): ConversationRowConnection {
    return {
        __typename: 'ConversationRowConnection',
        edges: getEdges(response.Conversations),
        pageInfo: {
            __typename: 'PageInfo',
            endCursor: getEndCursor(response.Conversations),
            hasNextPage: hasNextPage(response),
            hasPreviousPage: hasPreviousPage(response),
            startCursor: getStartCursor(response.Conversations),
        },
        searchFolderId: response.SearchFolderId?.Id ?? undefined,
        folderId: response.FolderId?.Id ?? undefined,
        totalConversationRowsInView: response.TotalConversationsInView ?? 0,
    };
}

function hasPreviousPage(response: FindConversationResponseMessage): boolean {
    if (response.IndexedOffset === undefined || !response.Conversations) {
        return false;
    }

    // IndexedOffset is the index of the next conversation in the folder view
    // after the last conversation in the results.
    // So there is a previous page of data if IndexedOffset > #Conversation in result
    return response.IndexedOffset > response.Conversations.length;
}

function hasNextPage(response: FindConversationResponseMessage): boolean {
    if (response.IndexedOffset === undefined || response.TotalConversationsInView == undefined) {
        return false;
    }

    // IndexedOffset is the index of the next conversation in the folder view
    // after the last conversation in the results.
    // So there is a next page of data if TotalConversationsInView indicates that there are
    // more conversations than the IndexedOffset.
    return response.IndexedOffset < response.TotalConversationsInView;
}

function getStartCursor(conversations?: ConverationType[]): string {
    if (conversations && conversations.length > 0) {
        return conversations[0].InstanceKey ?? '';
    }

    return '';
}

function getEndCursor(conversations?: ConverationType[]): string {
    if (conversations && conversations.length > 0) {
        return conversations[conversations.length - 1].InstanceKey ?? '';
    }

    return '';
}

function getEdges(conversations?: ConverationType[]): ConversationRowEdge[] {
    if (!conversations || conversations.length == 0) {
        return [];
    }

    return conversations.map(conversation => {
        return {
            __typename: 'ConversationRowEdge',
            cursor: conversation.InstanceKey ?? '',
            node: mapOwsConversationTypeToGql(conversation),
        };
    });
}
