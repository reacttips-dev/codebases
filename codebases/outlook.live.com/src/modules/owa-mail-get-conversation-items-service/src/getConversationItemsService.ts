import type BaseFolderId from 'owa-service/lib/contract/BaseFolderId';
import type ConversationNodeSortOrder from 'owa-service/lib/contract/ConversationNodeSortOrder';
import type ConversationRequestType from 'owa-service/lib/contract/ConversationRequestType';
import type ConversationSortOrder from 'owa-service/lib/contract/ConversationSortOrder';
import type GetConversationItemsAction from 'owa-service/lib/contract/GetConversationItemsAction';
import type GetConversationItemsResponseMessage from 'owa-service/lib/contract/GetConversationItemsResponseMessage';
import type GetConversationItemsRequest from 'owa-service/lib/contract/GetConversationItemsRequest';
import type ItemId from 'owa-service/lib/contract/ItemId';
import type ItemResponseShape from 'owa-service/lib/contract/ItemResponseShape';
import conversationRequestType from 'owa-service/lib/factory/conversationRequestType';
import getConversationItemsJsonRequest from 'owa-service/lib/factory/getConversationItemsJsonRequest';
import getConversationItemsRequest from 'owa-service/lib/factory/getConversationItemsRequest';
import itemId from 'owa-service/lib/factory/itemId';
import getConversationItemsOperation from 'owa-service/lib/operation/getConversationItemsOperation';
import type RequestOptions from 'owa-service/lib/RequestOptions';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';

function convertConversationSortOrder(
    conversationSortOrder: ConversationSortOrder
): ConversationNodeSortOrder {
    // Note: only date order ascending is treated specially, all other values are treated as date order descending (the default).
    return conversationSortOrder == 'ChronologicalNewestOnBottom'
        ? 'DateOrderAscending'
        : 'DateOrderDescending';
}

function configureRequestBody(
    conversationToLoad: ConversationRequestType,
    responseShape: ItemResponseShape,
    conversationSortOrder: ConversationSortOrder,
    maxItemsToReturn: number,
    action: GetConversationItemsAction,
    folderIdsToIgnore: BaseFolderId[],
    options?: RequestOptions
): GetConversationItemsRequest {
    return getConversationItemsRequest({
        Conversations: [conversationToLoad],
        ItemShape: responseShape,
        ShapeName:
            options?.datapoint?.customData?.actionSource == 'CreateConversationRelationMap'
                ? undefined
                : 'ItemPart',
        SortOrder: convertConversationSortOrder(conversationSortOrder),
        MaxItemsToReturn: maxItemsToReturn,
        Action: action,
        FoldersToIgnore: folderIdsToIgnore,
        ReturnSubmittedItems: true,
    });
}

export default function getConversationItemsService(
    conversationId: ItemId,
    responseShape: ItemResponseShape,
    syncState: string,
    maxItemsToReturn: number,
    conversationSortOrder: ConversationSortOrder,
    shouldUseEmptySyncState: boolean,
    action: GetConversationItemsAction = 'Default',
    folderIdsToIgnore: BaseFolderId[],
    options?: RequestOptions
): Promise<GetConversationItemsResponseMessage | undefined> {
    // The conversationId could be a ClientItemId, which contains the mailboxInfo.
    // So pass along just the Id of the conversationId.
    const conversation = conversationRequestType({
        ConversationId: itemId({
            Id: conversationId.Id,
        }),
    });
    conversation.SyncState = !shouldUseEmptySyncState ? syncState : '';

    const requestBody = configureRequestBody(
        conversation,
        responseShape,
        conversationSortOrder,
        maxItemsToReturn,
        action,
        folderIdsToIgnore,
        options
    );

    const jsonRequestHeader = getJsonRequestHeader();
    jsonRequestHeader.RequestServerVersion = 'V2017_08_18';

    return getConversationItemsOperation(
        getConversationItemsJsonRequest({
            Header: jsonRequestHeader,
            Body: requestBody,
        }),
        options
    ).then(response => {
        return response?.Body?.ResponseMessages?.Items?.[0] as
            | GetConversationItemsResponseMessage
            | undefined;
    });
}
