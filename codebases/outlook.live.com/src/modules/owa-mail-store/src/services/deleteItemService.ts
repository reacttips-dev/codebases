import type DeleteItemResponseMessage from 'owa-service/lib/contract/DeleteItemResponse';
import type DisposalType from 'owa-service/lib/contract/DisposalType';
import type ItemId from 'owa-service/lib/contract/ItemId';
import deleteItemRequest from 'owa-service/lib/factory/deleteItemRequest';
import itemId from 'owa-service/lib/factory/itemId';
import deleteItemOperation from 'owa-service/lib/operation/deleteItemOperation';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import type RequestOptions from 'owa-service/lib/RequestOptions';

function createItemIdForRequest(itemIdType: ItemId) {
    return itemId({
        Id: itemIdType.Id,
        ChangeKey: itemIdType.ChangeKey,
    });
}

function configureRequestBody(itemIds: ItemId[], disposalType: DisposalType) {
    return deleteItemRequest({
        ItemIds: itemIds.map(itemId => createItemIdForRequest(itemId)),
        DeleteType: disposalType,
        SuppressReadReceipts: true,
        ReturnMovedItemIds: true,
        SendMeetingCancellations: 'SendToNone',
        AffectedTaskOccurrences: 'AllOccurrences',
    });
}

export default function deleteItemService(
    itemIds: ItemId[],
    disposalType: DisposalType,
    requestInitOptions?: RequestOptions
): Promise<DeleteItemResponseMessage[]> {
    const requestBody = configureRequestBody(itemIds, disposalType);

    return deleteItemOperation(
        {
            Header: getJsonRequestHeader(),
            Body: requestBody,
        },
        requestInitOptions
    ).then(response => {
        return response.Body.ResponseMessages.Items;
    });
}
