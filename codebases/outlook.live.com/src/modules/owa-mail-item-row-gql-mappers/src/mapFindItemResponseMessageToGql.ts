import type FindItemResponseMessage from 'owa-service/lib/contract/FindItemResponseMessage';
import type { ItemRowConnection, ItemRowEdge } from 'owa-graph-schema';
import type Item from 'owa-service/lib/contract/Item';
import { mapOwsItemToGqlItemRow } from './mapOwsItemToGqlItemRow';

/**
 * This method converts an OWS FindItemResponseMessage into
 * a GraphQL ItemRowConnection type.
 * It's been moved out of the resolvers directory so that it can be
 * used to convert the OWS response in the session data stash.
 * @param response The response from an OWS FindItem call.
 */
export function mapFindItemResponseMessageToGql(
    response: FindItemResponseMessage
): ItemRowConnection {
    return {
        __typename: 'ItemRowConnection',
        edges: getEdges(response.RootFolder?.Items),
        pageInfo: {
            __typename: 'PageInfo',
            endCursor: getEndCursor(response.RootFolder?.Items),
            hasNextPage: hasNextPage(response),
            hasPreviousPage: hasPreviousPage(response),
            startCursor: getStartCursor(response.RootFolder?.Items),
        },
        searchFolderId: response.SearchFolderId?.Id ?? undefined,
        totalItemRowsInView: response.RootFolder?.TotalItemsInView ?? 0,
    };
}

function hasPreviousPage(response: FindItemResponseMessage): boolean {
    if (response.RootFolder?.IndexedPagingOffset === undefined || !response.RootFolder?.Items) {
        return false;
    }

    // IndexedPagingOffset is the index of the next item in the folder view
    // after the last item in the results.
    // So there is a previous page of data if IndexedPagingOffset > #Item in result
    return response.RootFolder?.IndexedPagingOffset > response.RootFolder?.Items?.length;
}

function hasNextPage(response: FindItemResponseMessage): boolean {
    if (
        response.RootFolder?.IndexedPagingOffset === undefined ||
        response.RootFolder?.TotalItemsInView == undefined
    ) {
        return false;
    }

    // IndexedPagingOffset is the index of the next item in the folder view
    // after the last item in the results.
    // So there is a next page of data if TotalItemsInView indicates that there are
    // more items than the IndexedPagingOffset.
    return response.RootFolder?.IndexedPagingOffset < response.RootFolder?.TotalItemsInView;
}

function getStartCursor(items?: Item[]): string {
    if (items && items.length > 0) {
        return items[0].InstanceKey ?? '';
    }

    return '';
}

function getEndCursor(items?: Item[]): string {
    if (items && items.length > 0) {
        return items[items.length - 1].InstanceKey ?? '';
    }

    return '';
}

function getEdges(items?: Item[]): ItemRowEdge[] {
    if (!items || items.length == 0) {
        return [];
    }

    return items.map(item => {
        return {
            __typename: 'ItemRowEdge',
            cursor: item.InstanceKey ?? '',
            node: mapOwsItemToGqlItemRow(item),
        };
    });
}
